import { MessageRequest } from './../../models/request/messageRequest';
import { HubMethod, PictureType, MessageType } from '../../models/enums';
import { MessageResponse } from './../../models/response/messageResponse';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, Config, Content } from 'ionic-angular';
import { params } from '../../services/params';
import { Response } from '../../models/response';
import { SendMessageRequest } from '../../models/request/sendMessageRequest';
import { SendMessageResponse } from '../../models/response/sendMessageResponse';
import { url } from '../../services/url';
import { HttpService } from '../../services/httpService';
import { CookieService } from '../../services/cookieService';
import { TalkService } from "../../services/talkService";
import { HubService } from "../../services/hubService";
import { functions } from "../../services/functions";
import { Timer } from '../../services/timer';
import { GetMessagesRequest } from "../../models/request/getMessagesRequest";
import { Media, MediaObject } from '@ionic-native/media';
import { TalkResponse } from "../../models/response/talkResponse";
import { MessageService } from "../../services/messageService";
import { ExceptionService } from "../../services/exceptionService";

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
  file: MediaObject;
  isDirectMessage: boolean = true;
  isWriting: boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public config: Config,
              private httpService: HttpService, 
              private toastCtrl: ToastController, 
              private cookieService: CookieService,
              private events: Events,
              private talkService: TalkService,
              private hubService: HubService,
              private messageService: MessageService,
              private exceptionService: ExceptionService) {

    this.model.talkId = this.navParams.get("TalkId");
    this.model.userId = this.navParams.get("UserId");

    this.events.subscribe(HubMethod[HubMethod.Receive], (obj) => this.updateRoom(obj.Message))
    this.events.subscribe(HubMethod[HubMethod.BeginTalk], (obj) => this.beginTalk(obj))
    this.events.subscribe(HubMethod[HubMethod.EndTalk], (obj) => this.endTalk())

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

  ionViewDidEnter() {
    console.log('ionViewDidEnter MessagePage');
    this.scrollToBottom();
  }

  ionViewWillEnter() {
    if(this.model.talkId != null) {
      this.loadMessages();
    } else {
      this.loadMessagesByUser(this.model.userId);
    }
    this.getMessages();
  }

  ionViewWillLeave() {
    // this.talkService.SaveMessages(this.model.talkId, this.Messages);
  }

  scrollToBottom() {
    if(this.content != null)
      this.content.scrollToBottom(0);
  }

  getDuration(duration:number) {
    var date = new Date(null);
    date.setSeconds(duration);
    return date.toISOString().substr(14, 5);
  }

  sendMessage(){
    var obj = new SendMessageRequest(params.User.Id, this.model.talkId, this.model.Message, MessageType.Text, this.model.talkId == null ? [this.model.userId] : []);
    obj.Lang = params.Lang;
    let urlSearch = url.SendMessage();
    let cookie = this.cookieService.GetAuthorizeCookie(urlSearch, params.User)
    this.httpService.Post<SendMessageRequest>(url.SendMessage(), obj, cookie).subscribe(
      resp => {
        var response = resp.json() as Response<SendMessageResponse>;
        if(response.HasError) {
          this.showToast(response.ErrorMessage);
        } else {
          if(response.Data.IsSent){
            //Must be set in a template.html but sorry guys I don't know how to do that yet
            //document.getElementById("message-room").innerHTML += "<ion-col class='col' col-6></ion-col><ion-col class='col' col-6><div class='msg msg-current-user'>" + this.model.Message + "</div></ion-col>";
            this.model.Message =  "";
            //this.Messages.push(response.Data.Message);
            //this.scrollToBottom();
            this.talkService.UpdateList(response.Data.Talk);
            //this.events.publish("scrollBottom");
          }else{
             //Must be set in a template.html but sorry guys I don't know how to do that yet
            //document.getElementById("message-room").innerHTML += "<ion-col class='col' col-6></ion-col><ion-col class='col' col-6><div class='msg msg-current-user-not-sent'>" + this.model.Message + "</div></ion-col>";
            this.model.Message = "";
          }
        }
      },
      err => this.events.publish("Error", err),
      () => {
        
      }
    );
  }

  beginTalk(username) {
    this.messUser = username + " est en train d'écrire";
    this.showToast(this.messUser);
  }
    
  endTalk() {
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
  }

  loadMessagesByUser(userId) {
    let talk = this.talkService.Talks.find(talk => talk.Users.some(x => x.Id == userId) && talk.Users.length == 2);
    if(talk != null) {
      this.Talk = talk;
      this.model.talkId = talk.Id;
      this.Messages = this.talkService.GetMessages(talk.Id);
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

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  updateRoom(message) {
    try {
      if(!this.Messages.some(x => x.Id == message.Id)) {
        this.Messages.push(message);
        this.hubService.Invoke(HubMethod[HubMethod.UpdateListenUser], this.model.talkId, [message])
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
      
      let uniqId = functions.Crypt(message.Id + params.Salt);
      let my_media = new Media();
      this.file = my_media.create(`http://vocal.westeurope.cloudapp.azure.com/docs/vocal/${uniqId}.mp3`);
      this.file.play();
      this.file.onStatusUpdate.subscribe(status => {
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
    this.file.pause();
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

  goToVocalList() {
    this.navCtrl.pop({'direction':'forward'});
  }
}