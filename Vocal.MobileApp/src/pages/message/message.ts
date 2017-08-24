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
import { MessageResponse } from "../../models/response/messageResponse";
import { TalkService } from "../../services/talkService";

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
  providers: [HttpService, CookieService, TalkService]
})
export class MessagePage {

  model = { Message: "", talkId: null }
  Messages: Array<MessageResponse>;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private httpService: HttpService, 
              private toastCtrl: ToastController, 
              private cookieService: CookieService,
              private events: Events,
              private talkService: TalkService) {

    // this.events.subscribe()
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
  }

  sendMessage(){
    var obj = new SendMessageRequest(params.User.Id, this.model.talkId, this.model.Message, 2, []);
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
            this.model.talkId = response.Data.Talk.Id;
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
    this.talkService.
  }

  updateRoom(message) {

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
