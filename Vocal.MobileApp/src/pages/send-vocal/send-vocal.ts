import { UserResponse } from '../../models/response/userResponse';
import { TalkService } from './../../services/talkService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { StoreService } from "../../services/storeService";
import { KeyStore } from '../../models/enums';
import { MessageType } from '../../models/enums';
import { SendMessageRequest } from '../../models/request/sendMessageRequest';
import { GetFriendsRequest } from '../../models/request/getFriendsRequest';
import { params } from "../../services/params";
import { url } from "../../services/url";
import { HttpService } from "../../services/httpService";
import { CookieService } from "../../services/cookieService";
import { Response } from '../../models/response';
import { TalkResponse } from '../../models/response/talkResponse';
import { SendMessageResponse } from '../../models/response/sendMessageResponse';
import { AudioRecorder } from '../../services/audiorecorder';
import { ExceptionService } from "../../services/exceptionService";

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
              private storeService: StoreService, 
              private audioRecorder: AudioRecorder, 
              private cookieService: CookieService, 
              private httpService: HttpService,
              private talkService: TalkService,
              private exceptionService: ExceptionService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendVocalPage');
    this.GetFriends();
  }

  sendVocal() {
    if(!this.isSending) {
      this.isSending = true;
      let users = [];
      this.audioRecorder.getFile().then(fileValue => {
        this.FileValue = fileValue;
        this.Friends.forEach(elt => {
        if(elt.Checked)
          users.push(elt.Id);
        });
        let date = new Date();
        let request: SendMessageRequest = {
          content: this.FileValue,
          duration: this.navParams.get('duration'),
          sentTime: date,
          idsRecipient: users,
          messageType: MessageType.Vocal,
          Lang: params.Lang,
          idSender: params.User.Id,
          IdTalk: null
        };
        let urlSendVocal = url.SendMessage();
        let cookie = this.cookieService.GetAuthorizeCookie(urlSendVocal, params.User)
        this.httpService.Post(urlSendVocal, request, cookie).subscribe(
          resp => {
            let response = resp.json() as Response<SendMessageResponse>;
            if(!response.HasError && response.Data.IsSent) {
              this.talkService.LoadList().then(() => {
                this.talkService.UpdateList(response.Data.Talk);
                this.talkService.SaveList();
                this.navCtrl.remove(0,1).then(() => this.navCtrl.pop());
              })
            }
            else {
              console.log(response);
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
    this.storeService.Get(KeyStore[KeyStore.Friends]).then(
      friends => {
        if(friends != null)
          this.Friends = friends;
        else
          this.loadFriends();
      }
    ).catch(error => {
      console.log(error);
    });
  }

  loadFriends() {
    var request = new GetFriendsRequest();
    request.Lang = params.Lang;
    request.UserId = params.User.Id;
    request.PageSize = 0;
    request.PageNumber = 0;
    let urlFriends = url.GetFriends();
    let cookie = this.cookieService.GetAuthorizeCookie(urlFriends, params.User)
    this.httpService.Post<GetFriendsRequest>(urlFriends, request, cookie).subscribe(
      resp => { 
        let response = resp.json() as Response<Array<UserResponse>>;
        if(!response.HasError) {
          this.Friends = response.Data;
          this.storeService.Set(KeyStore[KeyStore.Friends], this.Friends)
        } else {
          
        }
      }
    );
  }

  GetTalkList() {
    return this.storeService.Get(KeyStore[KeyStore.Talks]).then(
      talks => {
        this.Talks = talks;
      }
    ).catch(error => {
      console.log(error);
      
    });
  }

  SaveTalks() {
    this.storeService.Set(KeyStore[KeyStore.Talks], this.Talks);
  }

}
