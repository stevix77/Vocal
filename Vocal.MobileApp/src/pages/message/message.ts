import { MessageRequest } from './../../models/request/messageRequest';
import { HubMethod, PictureType, MessageType } from '../../models/enums';
import { MessageResponse } from './../../models/response/messageResponse';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, Config } from 'ionic-angular';
import { params } from '../../services/params';
import { functions } from '../../services/functions';
import { Response } from '../../models/Response';
import { SendMessageRequest } from '../../models/request/sendMessageRequest';
import { SendMessageResponse } from '../../models/response/sendMessageResponse';
import { url } from '../../services/url';
import { HttpService } from '../../services/httpService';
import { CookieService } from '../../services/cookieService';
import { TalkService } from "../../services/talkService";
import { HubService } from "../../services/hubService";
import { Timer } from '../../services/timer';
import { GetMessagesRequest } from "../../models/request/getMessagesRequest";
import { Media, MediaObject } from '@ionic-native/media';

/**
 * Generated class for the MessagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html'
})
export class MessagePage {
  
  model = { Message: "", talkId: null, userId: null }
  VocalName: string = "";
  Picture: string = "";
  Messages: Array<MessageResponse> = new Array<MessageResponse>();
  isApp: boolean;
  isRecording: boolean = false;
  isTiming: boolean = false;
  timer: Timer;
  time: String = '0:00';
  messUser: string;
  file: MediaObject;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public config: Config,
              private httpService: HttpService, 
              private toastCtrl: ToastController, 
              private cookieService: CookieService,
              private events: Events,
              private talkService: TalkService,
              private hubService: HubService) {

    this.model.talkId = this.navParams.get("TalkId");
    this.model.userId = this.navParams.get("UserId");
    this.events.subscribe(HubMethod[HubMethod.Receive], (obj) => this.updateRoom(obj.Message))
    events.subscribe(HubMethod[HubMethod.BeginTalk], (obj) => this.beginTalk(obj))
    events.subscribe(HubMethod[HubMethod.EndTalk], (obj) => this.endTalk())

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
    this.talkService.SaveMessages(this.model.talkId, this.Messages);
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
            document.getElementById("message-room").innerHTML += "<ion-col class='col' col-6></ion-col><ion-col class='col' col-6><div class='msg msg-current-user'>" + this.model.Message + "</div></ion-col>";
            this.model.Message =  "";
            this.Messages.push(response.Data.Message);
            this.talkService.UpdateList(response.Data.Talk);
          }else{
             //Must be set in a template.html but sorry guys I don't know how to do that yet
            document.getElementById("message-room").innerHTML += "<ion-col class='col' col-6></ion-col><ion-col class='col' col-6><div class='msg msg-current-user-not-sent'>" + this.model.Message + "</div></ion-col>";
            this.model.Message = "";
          }
        }
      }
    );
  }

  beginTalk(username) {
    this.messUser = username + " est en train d'écrire";
  }
    
  endTalk() {
    this.messUser = null;
  }
  
  change() {
    this.hubService.Invoke(HubMethod[HubMethod.BeginTalk], this.model.talkId, params.User.Username);
  }

  loadMessages() {
    this.Messages = this.talkService.GetMessages(this.model.talkId)
    this.talkService.Talks.find(x => x.Id == this.model.talkId).Users.forEach(x => {
      if(x.Id != params.User.Id){
        this.VocalName += x.Username + " ";
        let pict = x.Pictures.find(x => x.Type == PictureType.Talk);
        if(pict != null)
          this.Picture = pict.Value;
      }
    });
  }

  loadMessagesByUser(userId) {
    let talk = this.talkService.Talks.find(talk => talk.Users.some(x => x.Id == userId) && talk.Users.length == 2);
    if(talk != null) {
      this.Messages = talk.Messages != null ? talk.Messages : new Array<MessageResponse>()
      this.model.talkId = talk.Id;
    }
  }

  getMessages() {
    try {
      let urlMessages = url.GetMessages();
      let cookie = this.cookieService.GetAuthorizeCookie(urlMessages, params.User);
      let dt = this.Messages.length > 0 ? this.Messages[this.Messages.length -1].ArrivedTime : null;
      let request: GetMessagesRequest = {Lang: params.Lang, LastMessage: dt, TalkId: this.model.talkId};
      this.httpService.Post(urlMessages, request, cookie).subscribe(
        resp => {
          let response = resp.json() as Response<Array<MessageResponse>>;
          if(!response.HasError) {
            response.Data.forEach(item => {
              let mess = this.Messages.find(x => x.Id == item.Id);
              if(mess == null)
                this.Messages.push(item);
            });
            this.talkService.SaveMessages(this.model.talkId, this.Messages);
          } else {
            this.showToast(response.ErrorMessage);
            //this.loadMessages();
          }
        }
      )
    } catch(err) {
      console.log(err);
      // this.loadMessages();
    }
  }

  sortMessages(messages: Array<MessageResponse>) {
    let index = 0;
    messages.forEach(element => {
      let mess = this.Messages.find(x => x.Id == element.Id);
      if(mess == null) {
        this.Messages.splice(index, 0, element);
      }
    });
  }

  updateRoom(message) {
    this.Messages.push(message);
    //this.hubService.Invoke(HubMethod[HubMethod.UpdateListenUser], this.model.talkId)
  }

  getMessage(messId: string) {
    let urlMessage = url.GetMessageById();
    let cookie = this.cookieService.GetAuthorizeCookie(urlMessage, params.User);
    let request = new MessageRequest(this.model.talkId, messId, params.Lang);
    this.httpService.Post<MessageRequest>(urlMessage, request, cookie).subscribe(
      resp => {
        let response = resp.json() as Response<string>;
        if(response.HasError)
          this.showToast(response.ErrorMessage);
        else {
          this.Messages.find(x => x.Id == messId).Content = response.Data;
          this.talkService.SaveMessages(this.model.talkId, this.Messages);          
        }
      }
    )
    // this.Messages.find(x => x.Id == messId).Content = mess;
  }

  playVocal(messId: string, index: number) {
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
