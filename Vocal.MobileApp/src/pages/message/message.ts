import { MessageRequest } from './../../models/request/messageRequest';
import { HubMethod } from '../../models/enums';
import { MessageResponse } from './../../models/response/messageResponse';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events, Config } from 'ionic-angular';
import { params } from '../../services/params';
import { Response } from '../../models/Response';
import { SendMessageRequest } from '../../models/request/sendMessageRequest';
import { SendMessageResponse } from '../../models/response/sendMessageResponse';
import { url } from '../../services/url';
import { HttpService } from '../../services/httpService';
import { CookieService } from '../../services/cookieService';
import { TalkService } from "../../services/talkService";
import { HubService } from "../../services/hubService";
import {DomSanitizer} from '@angular/platform-browser';
import { Timer } from '../../services/timer';
import { GetMessagesRequest } from "../../models/request/getMessagesRequest";

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public config: Config,
              private httpService: HttpService, 
              private toastCtrl: ToastController, 
              private cookieService: CookieService,
              private events: Events,
              private talkService: TalkService,
              private hubService: HubService,
              private domSanitizer: DomSanitizer) {

    this.model.talkId = this.navParams.get("TalkId");
    this.model.userId = this.navParams.get("UserId");
    this.events.subscribe(HubMethod[HubMethod.Receive], (obj) => this.updateRoom(obj.Message))
    events.subscribe(HubMethod[HubMethod.BeginTalk], (obj) => this.BeginTalk(obj))
    events.subscribe(HubMethod[HubMethod.EndTalking], (obj) => this.EndTalk(obj))

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
    var obj = new SendMessageRequest(params.User.Id, this.model.talkId, this.model.Message, 2, []);
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

  BeginTalk(talkId) {
    
  }
    
  EndTalk(talkId) {
    
  }

  loadMessages() {
    this.Messages = this.talkService.GetMessages(this.model.talkId)
    this.talkService.Talks.find(x => x.Id == this.model.talkId).Users.forEach(x => {
      if(x.Id != params.User.Id){
        this.VocalName += x.Username + " ";
        this.Picture = x.Picture;
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
            //this.sortMessages(response.Data);
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
    this.hubService.Invoke(HubMethod[HubMethod.UpdateListenUser], this.model.talkId)
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
