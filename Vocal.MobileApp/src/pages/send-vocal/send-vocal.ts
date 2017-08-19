import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SelectFriendsComponent } from '../../components/select-friends/select-friends';
import { VocalListPage } from '../../pages/vocal-list/vocal-list';
import { StoreService } from "../../services/storeService";
import { KeyStore } from '../../models/enums';
import { AudioRecorder } from '../../services/audiorecorder';
import { MessageType } from '../../models/enums';
import { params } from "../../services/params";
import { HttpService } from "../../services/httpService";
import { CookieService } from "../../services/cookieService";
import { Response } from '../../models/response';

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
    let request = {
      Content: this.FileValue,
      SentTime: date,
      IdsRecipient: users,
      MessageType: MessageType.Vocal,
      Lang: params.Lang
    }
    let urlSendVocal = "";
    let cookie = this.cookieService.GetAuthorizeCookie(urlSendVocal, params.User)
    this.httpService.Post(urlSendVocal, request, cookie).subscribe(
      resp => {
        let response = resp.json() as Response<boolean>;
        if(!response.HasError)
          this.navCtrl.push(VocalListPage);
        else 
          //TODO : Alert Message d'erreur  response.ErrorMessage
        this.navCtrl.push(VocalListPage);
      }
    )
    }).catch(err => {
      
    });
    this.navCtrl.push(VocalListPage);
  }

  GetBase64File(){
    this.audioRecorder.getFile().then(value => {
      this.FileValue = value;
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

}
