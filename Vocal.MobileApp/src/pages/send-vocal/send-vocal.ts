import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SelectFriendsComponent } from '../../components/select-friends/select-friends';
import { VocalListPage } from '../../pages/vocal-list/vocal-list';
import { StoreService } from "../../services/storeService";
import { KeyStore } from '../../models/enums';
import { AudioRecorder } from '../../services/audiorecorder';
import { MessageType } from '../../models/enums';
import { SendMessageRequest } from '../../models/request/sendMessageRequest';
import { params } from "../../services/params";
import { url } from "../../services/url";
import { HttpService } from "../../services/httpService";
import { CookieService } from "../../services/cookieService";
import { Response } from '../../models/response';
import { TalkResponse } from '../../models/response/talkResponse';
import { SendMessageResponse } from '../../models/response/sendMessageResponse'
import { MessageResponse } from '../../models/response/messageResponse';

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
  providers: [StoreService, AudioRecorder, CookieService, HttpService]
})
export class SendVocalPage {

  Friends: Array<any>;
  FileValue: string;
  Talks: Array<TalkResponse>;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storeService: StoreService, private audioRecorder: AudioRecorder, private cookieService: CookieService, private httpService: HttpService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendVocalPage');
    this.GetFriends();
  }

  goToVocalList() {
    let users = [];
    this.audioRecorder.getFile().then(value => {
      this.FileValue = value;
      this.Friends.forEach(elt => {
        if(elt.Checked)
          users.push(elt.Id);
        });
    let date = new Date();
    let request: SendMessageRequest = {
      content: this.FileValue,
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
          this.GetTalkList().then(() => {
            let talk = this.Talks.find(x => x.Id == response.Data.Talk.Id);
            if(talk == null) {
              talk = response.Data.Talk;
              talk.Messages = new Array<MessageResponse>();
              talk.Messages.push(response.Data.Message);
              this.Talks.push(talk);
            } else {
              let index = this.Talks.indexOf(talk);
              talk.Messages.push(response.Data.Message);
              this.Talks[index] = talk;
            }
            this.SaveTalks();
            this.navCtrl.push(VocalListPage);
          })
        }
        else 
          //TODO : Alert Message d'erreur  response.ErrorMessage
        this.navCtrl.push(VocalListPage);
      }
    )
    }).catch(err => {
      
    });
  }

  GetFriends() {
    this.storeService.Get(KeyStore.Friends.toString()).then(
      friends => {
        this.Friends = friends;
      }
    ).catch(error => {
      console.log(error);
      
    });
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
