import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { SearchFriendsRequest } from "../../models/request/searchFriendsRequest";
import { params } from "../../services/params";
import { url } from "../../services/url";
import { AppUser } from "../../models/appUser";
import { HttpService } from "../../services/httpService";
import { CookieService } from "../../services/cookieService";
import { StoreService } from "../../services/storeService";
import { AddFriendsRequest } from "../../models/request/addFriendsRequest";
import { UserResponse } from '../../models/response/userResponse';
import { Response } from '../../models/response';
import { MediaPlugin } from 'ionic-native';



/**
 * Generated class for the VocalListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-vocal-list',
  templateUrl: 'vocal-list.html',
  providers: [HttpService, CookieService]
})
export class VocalListPage {
  media: MediaPlugin = new MediaPlugin('../Library/NoCloud/recording.wav');

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private httpService: HttpService, private cookieService: CookieService, private storeService: StoreService) {
    //this.searchFriends(['s.valentin77@gmail.com', 'tik@tik.fr']);
    //this.addFriends(["000000-f1e6-4c976-9a55-7525496145s", "599fc814-8733-4284-a606-de34c9845348"]);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VocalListPage');

    document.getElementById('record-vocal').addEventListener('touchstart', oEvt => this.startRecording());
    document.getElementById('record-vocal').addEventListener('touchend', oEvt => this.stopRecording());
  }

  startRecording() {
    try {
      this.media.startRecord();
    }
    catch (e) {
      this.showAlert('Could not start recording.');
    }
  }

  stopRecording() {
    try {
      this.media.stopRecord();
    }
    catch (e) {
      this.showAlert('Could not stop recording.');
    }
  }

  startPlayback() {
    try {
      this.media.play();
    }
    catch (e) {
      this.showAlert('Could not play recording.');
    }
  }

  stopPlayback() {
    try {
      this.media.stop();
    }
    catch (e) {
      this.showAlert('Could not stop playing recording.');
    }
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  
}
