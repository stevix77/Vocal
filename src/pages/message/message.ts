import { HubMethod, PictureType, MessageType } from '../../models/enums';
import { MessageResponse } from './../../models/response/messageResponse';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, Config, Content, AlertController } from 'ionic-angular';
import { params } from '../../services/params';
import { Response } from '../../models/response';
import { SendMessageResponse } from '../../models/response/sendMessageResponse';
import { TalkService } from "../../services/talkService";
import { HubService } from "../../services/hubService";
import { functions } from "../../services/functions";
import { Timer } from '../../services/timer';
import { Media, MediaObject } from '@ionic-native/media';
import { TalkResponse } from "../../models/response/talkResponse";
import { MessageService } from "../../services/messageService";
import { ExceptionService } from "../../services/exceptionService";
import { FriendsService } from "../../services/friendsService";
import { url } from "../../services/url";
import { ActionResponse } from "../../models/response/actionResponse";
import { DraftService } from "../../services/draftService";

/**
 * Generated class for the MessagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  @ViewChild(Content) content: Content
  model = { Message: "", talkId: null, userId: null }
  Picture: string = "";
  Messages: Array<MessageResponse> = new Array<MessageResponse>();
  Talk: TalkResponse = new TalkResponse();
  isApp: boolean;
  isRecording: boolean = false;
  isTiming: boolean = false;
  timer: Timer;
  time: string = '0:00';
  messUser: string;
  mediaObject: MediaObject;
  isDirectMessage: boolean = true;
  isWriting: boolean = false;
  uid: string = params.User.Id;
  hasScrolled = true;
  TalkDuration: any; 

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public config: Config,
              private toastCtrl: ToastController, 
              public alertCtrl: AlertController,
              private events: Events,
              private talkService: TalkService,
              private hubService: HubService,
              private messageService: MessageService,
              private friendService: FriendsService,
              private draftService: DraftService,
              private exceptionService: ExceptionService) {

    this.model.talkId = this.navParams.get("TalkId");
    this.model.userId = this.navParams.get("UserId");

    events.subscribe(HubMethod[HubMethod.Receive], (obj) => this.updateRoom(obj))
    events.subscribe(HubMethod[HubMethod.BeginTalk], (obj) => this.beginTalk(obj))
    events.subscribe(HubMethod[HubMethod.EndTalk], (obj) => this.endTalk(obj))
    this.isApp = this.config.get('isApp');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
    this.events.subscribe('record:start', () => {
      this.toggleRecording();
      this.toggleTiming();
    });
    this.events.subscribe('edit-vocal:open', () => this.toggleTiming());
    this.events.subscribe('edit-vocal:close', () => this.toggleRecording());
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter MessagePage');
    this.scrollToBottom();
    if(this.Talk.IsWriting)
      this.beginTalk(null);
  }

  ionViewWillEnter() {
    if(this.model.talkId != null) {
      this.loadMessages();
    } else {
      this.loadMessagesByUser(this.model.userId);
    }
    this.getMessages();
    this.getDraft();
  }

  ionViewWillLeave() {
    if(this.model.Message != "" && (this.model.talkId != null || this.model.userId != null)) {
      this.draftService.setDraft(this.model.talkId, this.model.userId, this.model.Message);
    } else {
      this.draftService.removeDraft(this.model.talkId, this.model.userId);
    }
  }

  getDraft() {
    let draft = this.draftService.getDraft(this.model.talkId, this.model.userId);
    if(draft != null) {
      this.model.Message = draft.Value;
    }
  }

  toggleRecording() {
    this.isRecording = !this.isRecording;
  }

  toggleTiming() {
    this.isTiming = !this.isTiming;
    if(this.isTiming) this.startTimer();
  }

  startTimer() {
    this.timer = new Timer(this.events);
    this.events.subscribe('update:timer', timeFromTimer => {
      this.time = timeFromTimer;
    });
    this.events.subscribe('record:stop', () => this.stopTimer());
  }

  stopTimer() {
    this.timer.stopTimer();
    this.time = '0:00';
  }

  scrollToBottom() {
    if(this.content != null) {
      this.content.scrollToBottom(0);
      this.hasScrolled = true;
    }
  }

  getDuration(duration:number) {
    var date = new Date(null);
    date.setSeconds(duration);
    return date.toISOString().substr(14, 5);
  }

  sendMessage(){
    try {
      this.messageService.sendMessage(this.model.talkId, MessageType.Text, this.model.talkId == null ? [this.model.userId] : [], 0, this.model.Message, '').subscribe(
        resp => {
          try {
            var response = resp.json() as Response<SendMessageResponse>;
            if(response.HasError) {
              this.events.publish("Error", response.ErrorMessage);
            } else {
              if(response.Data.IsSent){
                this.model.Message =  "";
                this.talkService.UpdateList(response.Data.Talk);
                if(this.model.talkId == null) {
                  this.model.talkId = response.Data.Talk.Id
                  this.loadMessages();
                }
              }
            }
          } catch(err) {
            this.events.publish("Error", err.message);
            this.exceptionService.Add(err);
          }
        },
        err => {
          this.events.publish("Error", err.message)
          this.exceptionService.Add(err);
        }
      );
    } catch(err) {
      this.events.publish("Error", err.message);
      this.exceptionService.Add(err);
    }
  }

  showConfirmDelete(idMessage, index) {
    let confirm = this.alertCtrl.create({
      title: 'Êtes-vous sûr de vouloir supprimer ce message ?',
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
          }
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.delete(idMessage, index);
          }
        }
      ]
    });
    confirm.present();
  }

  delete(idMessage, index) {
    try {
      this.messageService.deleteMessage([idMessage]).subscribe(
        resp => {
          let response = resp.json() as Response<ActionResponse>;
          if(!response.HasError && response.Data.IsDone) {
            this.Messages.splice(index, 1);
            this.talkService.SaveMessages(this.model.talkId, this.Messages);
          } else {
            this.events.publish("Error", response.ErrorMessage);
          }
        }
      );
    } catch(err) {
      this.events.publish("Error", err.message);
      this.exceptionService.Add(err);
    }
  }

  beginTalk(obj) {
    this.messUser = " se prépare à envoyer un message";
  }
    
  endTalk(obj) {
    this.messUser = null;
  }
  
  change(val) {
    if(this.model.Message.length > 0) {
      if(!this.isWriting) {
        this.isWriting = true;
        this.hubService.Invoke(HubMethod[HubMethod.BeginTalk], this.model.talkId, params.User.Username);
      }
    } else {
      if(this.isWriting) this.isWriting = false;
      this.hubService.Invoke(HubMethod[HubMethod.EndTalk], this.model.talkId);
    }
  }

  loadMessages() {
    this.Talk = this.talkService.getTalk(this.model.talkId);
    this.Messages = this.talkService.GetMessages(this.model.talkId);
    console.log(this.Messages);
    this.TalkDuration = this.getDuration(this.Talk.Duration);
  }

  loadMessagesByUser(userId) {
    let talk = this.talkService.Talks.find(talk => talk.Users.some(x => x.Id == userId) && talk.Users.length == 2);
    if(talk != null) {
      this.Talk = talk;
      this.model.talkId = talk.Id;
      this.Messages = this.talkService.GetMessages(talk.Id);
      this.TalkDuration = this.getDuration(this.Talk.Duration);
    } else {
      let friend = this.friendService.getFriendById(userId);
      let picture = friend.Pictures.find(x => x.Type == PictureType.Talk);
      this.Talk.Name = friend.Username;
      this.Talk.Picture = picture != null ? picture.Value : "assets/default-picture-80x80.jpg";
    }
  }

  getMessages() {
    try {
      let dt = this.Messages.length > 0 ? this.Messages[this.Messages.length -1].ArrivedTime : null;
      this.messageService.getMessages(this.model.talkId, dt).subscribe(
        resp => {
          try {
            let response = resp.json() as Response<Array<MessageResponse>>;
            if(!response.HasError) {
              if(response.Data.length>0) {
                response.Data.forEach(item => {
                  let mess = this.Messages.find(x => x.Id == item.Id);
                  item.IsPlaying = false;
                  if(mess == null)
                    this.Messages.push(item);
                });
                this.talkService.SaveMessages(this.model.talkId, this.Messages);
              }
            } else {
              this.events.publish("Error", response.ErrorMessage);
            }
          } catch(err) {
            this.events.publish("Error", err.message)
            this.exceptionService.Add(err);
          }
        }
      )
    } catch(err) {
      this.events.publish("Error", err.message)
      this.exceptionService.Add(err);
    }
  }

  ngAfterContentChecked() {
    if(!this.hasScrolled)
      this.scrollToBottom();
  }

  updateRoom(obj) {
    try {
      this.TalkDuration = this.getDuration(obj.Talk.Duration);
      this.Talk = obj.Talk;
      if(obj.Talk.Id == this.model.talkId) {
        this.hasScrolled = false;
      }
    } catch(err) {
      this.events.publish("Error", err.message)
      this.exceptionService.Add(err);
    }
  }

  playVocal(messId: string, index: number) {
    try {
      let message = this.Messages[index];
      this.Messages[index].IsPlaying = true;
      this.talkService.SaveMessages(this.model.talkId, this.Messages);

      console.log(message.ActiveFilter);
      
      let uniqId = functions.Crypt(message.Id + params.Salt);
      let my_media = new Media();
      this.mediaObject = my_media.create(`${url.BaseUri}/docs/vocal/${uniqId}.mp3`);
      
      this.mediaObject.play();
      this.mediaObject.onStatusUpdate.subscribe(status => {
        if(status == 2) { //PLAYING
          
        }
        if(status == 4) { //STOP
          this.Messages[index].IsPlaying = false;
          this.talkService.SaveMessages(this.model.talkId, this.Messages);
        }
      }); // fires when file status changes

    } catch (err) {
      this.events.publish("Error", err.message)
      this.exceptionService.Add(err);
    }
  }

  pauseVocal(messId: string, index: number) {
    this.mediaObject.pause();
    this.Messages[index].IsPlaying = false;
    this.talkService.SaveMessages(this.model.talkId, this.Messages);
  }

  showToast(message: string) :any {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    }).present();
  }

  trad(trad) {
    this.events.publish("alert", trad);
  }

  goToVocalList() {
    this.navCtrl.pop({'direction':'forward'});
  }
}