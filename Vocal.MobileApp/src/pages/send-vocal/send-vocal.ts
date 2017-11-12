import { UserResponse } from '../../models/response/userResponse';
import { TalkService } from './../../services/talkService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SelectFriendsComponent } from '../../components/select-friends/select-friends';
import { VocalListPage } from '../../pages/vocal-list/vocal-list';
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

/**
 * Generated class for the SendVocalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-send-vocal',
  templateUrl: 'send-vocal.html',
  entryComponents: [SelectFriendsComponent],
  providers: [StoreService, CookieService, HttpService, TalkService]
})
export class SendVocalPage {

  Friends: Array<any>;
  FileValue: string;
  Talks: Array<TalkResponse>;
  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private storeService: StoreService, 
              private audioRecorder: AudioRecorder, 
              private cookieService: CookieService, 
              private httpService: HttpService,
              private talkService: TalkService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendVocalPage');
    this.GetFriends();
  }

  sendVocal() {
    console.log('send vocal');
    let users = [];
    Promise.all([this.audioRecorder.getFile(), this.audioRecorder.getMediaDuration()]).then(values => {
      this.FileValue = values[0];
      this.Friends.forEach(elt => {
      if(elt.Checked)
        users.push(elt.Id);
      });
      let date = new Date();
      let request: SendMessageRequest = {
        content: this.FileValue,
        duration: values[1],
        sentTime: date,
        idsRecipient: users,
        messageType: MessageType.Vocal,
        Lang: params.Lang,
        idSender: params.User.Id,
        IdTalk: null
      }
      let urlSendVocal = url.SendMessage();
      let cookie = this.cookieService.GetAuthorizeCookie(urlSendVocal, params.User)
      this.httpService.Post(urlSendVocal, request, cookie).subscribe(
        resp => {
          let response = resp.json() as Response<SendMessageResponse>;
          if(!response.HasError && response.Data.IsSent) {
            this.talkService.LoadList().then(() => {
              this.talkService.UpdateList(response.Data.Talk);
              this.talkService.SaveList();
              this.navCtrl.push(VocalListPage);
            })
          }
          else 
            //TODO : Alert Message d'erreur  response.ErrorMessage
          this.navCtrl.push(VocalListPage);
        }
      )
    }).catch(err => {
      console.log(err);
    });
  }

  GetFriends() {
    this.storeService.Get(KeyStore.Friends.toString()).then(
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
          this.storeService.Set(KeyStore.Friends.toString(), this.Friends)
        } else {
          
        }
      }
    );
  }

  GetTalkList() {
    return this.storeService.Get(KeyStore.Talks.toString()).then(
      talks => {
        this.Talks = talks;
      }
    ).catch(error => {
      console.log(error);
      
    });
  }

  SaveTalks() {
    this.storeService.Set(KeyStore.Talks.toString(), this.Talks);
  }

}
