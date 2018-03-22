import { TalkService } from './../../services/talkService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { MessageType } from '../../models/enums';
import { SendMessageRequest } from '../../models/request/sendMessageRequest';
import { params } from "../../services/params";
import { url } from "../../services/url";
import { HttpService } from "../../services/httpService";
import { CookieService } from "../../services/cookieService";
import { Response } from '../../models/response';
import { TalkResponse } from '../../models/response/talkResponse';
import { SendMessageResponse } from '../../models/response/sendMessageResponse';
import { AudioRecorder } from '../../services/audiorecorder';
import { ExceptionService } from "../../services/exceptionService";
import { FriendsService } from "../../services/friendsService";

/**
 * Generated class for the SendVocalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-send-vocal',
  templateUrl: 'send-vocal.html'
})
export class SendVocalPage {

  Friends: Array<any>;
  FileValue: string;
  Talks: Array<TalkResponse>;
  isSending: Boolean = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public viewCtrl: ViewController,
              public events: Events, 
              private audioRecorder: AudioRecorder, 
              private cookieService: CookieService, 
              private httpService: HttpService,
              private talkService: TalkService,
              private friendsService: FriendsService,
              private exceptionService: ExceptionService) {
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad SendVocalPage');
    this.GetFriends();
  }

  getCheckedUsers() {
    return this.Friends.map(x => { 
        if(x.Checked)
          return x.Id;
        else
          return;
      });
  }

  sendVocal() {
    if(!this.isSending) {
      this.isSending = true;
      this.audioRecorder.getFile().then(fileValue => {
        this.FileValue = fileValue;
        let users = this.getCheckedUsers();
        let date = new Date();
        let request: SendMessageRequest = {
          content: this.FileValue,
          duration: this.navParams.get('duration'),
          sentTime: date,
          idsRecipient: users,
          messageType: MessageType.Vocal,
          Lang: params.Lang,
          idSender: params.User.Id,
          IdTalk: null,
          platform: params.Platform
        };
        let urlSendVocal = url.SendMessage();
        let cookie = this.cookieService.GetAuthorizeCookie(urlSendVocal, params.User)
        this.httpService.Post(urlSendVocal, request, cookie).subscribe(
          resp => {
            let response = resp.json() as Response<SendMessageResponse>;
            if(!response.HasError && response.Data.IsSent) {
              console.log(response);
              this.talkService.LoadList().then(() => {
                this.talkService.UpdateList(response.Data.Talk);
                this.talkService.SaveList();
                this.navCtrl.remove(0,1).then(() => this.navCtrl.pop());
              })
            }
            else {
              console.log(response);
              this.isSending = false;
            }
          }
        );
      }).catch(err => {
        console.log(err);
        this.exceptionService.Add(err);
      });
    }
  }

  GetFriends() {
    this.Friends = this.friendsService.Friends;
  }
}
