import { HubMethod } from '../../models/enums';
import { MessageResponse } from './../../models/response/messageResponse';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';
import { params } from '../../services/params';
import { Response } from '../../models/Response';
import { SendMessageRequest } from '../../models/request/sendMessageRequest';
import { SendMessageResponse } from '../../models/response/sendMessageResponse';
import { url } from '../../services/url';
import { HttpService } from '../../services/httpService';
import { CookieService } from '../../services/cookieService';
import { VocalListPage } from '../../pages/vocal-list/vocal-list';
import { TalkService } from "../../services/talkService";
import { HubService } from "../../services/hubService";

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
  providers: [HttpService, CookieService, TalkService, HubService]
})
export class MessagePage {
  
  model = { Message: "", talkId: null }
  Messages: Array<MessageResponse> = new Array<MessageResponse>();
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private httpService: HttpService, 
              private toastCtrl: ToastController, 
              private cookieService: CookieService,
              private events: Events,
              private talkService: TalkService,
              private hubService: HubService) {

    // this.events.subscribe()
    this.model.talkId = this.navParams.get("TalkId");
    this.events.subscribe(HubMethod[HubMethod.Receive], (obj) => this.updateRoom(obj.Message))
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
  }

  ionViewWillEnter() {
    this.loadMessages().then(() => {
      this.getMessages();
    });
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

  loadMessages() {
   return this.talkService.GetMessages(this.model.talkId).then(() => {
      if(this.talkService.Messages != null) {
        let mess = this.talkService.Messages.find(x => x.Key == this.model.talkId)
        if(mess != null)
          this.Messages = mess.Value;
      }
    }).catch((err) => {
      
    })
  }

  getMessages() {
    try {
      let urlMessages = url.GetMessages(this.model.talkId);
      let cookie = this.cookieService.GetAuthorizeCookie(urlMessages, params.User);
      let request = {Lang: params.Lang};
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
            this.loadMessages();
          }
        }
      )
    } catch(err) {
      this.loadMessages();
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

  showToast(message: string) :any {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    }).present();
  }

  goToVocalList() {
    this.navCtrl.push(VocalListPage);
  }
}
