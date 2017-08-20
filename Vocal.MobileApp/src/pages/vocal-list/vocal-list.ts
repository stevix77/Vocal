import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, ViewController, ModalController } from 'ionic-angular';
import { params } from "../../services/params";
import { url } from "../../services/url";
import { HttpService } from "../../services/httpService";
import { CookieService } from "../../services/cookieService";
import { StoreService } from "../../services/storeService";
import { Request } from "../../models/request/Request";
import { InitResponse } from '../../models/response/InitResponse';
import { Response } from '../../models/response';
import { ModalProfilePage } from '../../pages/modal-profile/modal-profile';
import {KeyStore} from '../../models/enums';
import {KeyValueResponse} from '../../models/response/keyValueResponse';
import { AudioRecorderComponent } from '../../components/audio-recorder/audio-recorder';
import { MessagePage } from '../message/message';


declare var WindowsAzure: any;

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
  providers: [HttpService, CookieService, StoreService],
  entryComponents: [AudioRecorderComponent]
})
export class VocalListPage {
  notificationHub : any;
  isApp: boolean = !document.URL.startsWith('http');
  messagePage = MessagePage;
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController, 
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public events: Events,
    private httpService: HttpService, 
    private cookieService: CookieService, 
    private storeService: StoreService) {

    events.subscribe('record:start', () => this.toggleContent());
    events.subscribe('edit-vocal:close', () => this.toggleContent());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VocalListPage');

    document.querySelector('[data-record]').addEventListener('touchstart', oEvt => this.events.publish('record:start'));
    if(this.isApp) document.querySelector('[data-record]').addEventListener('touchend', oEvt => this.events.publish('record:stop'));
  }

  ionViewWillEnter() {
    this.initialize();
  }

  toggleContent() {
    document.querySelector('.ion-page ion-content .vocal-list').classList.toggle('hide'); 
    this.toggleHeader();
  }

  toggleHeader() {
    document.querySelector('.ion-page ion-header').classList.toggle('anime-hide');
  }

  showProfile() {
    let profileModal = this.modalCtrl.create(ModalProfilePage);
    profileModal.present();
  }

  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  initialize() {
    let request = new Request();
    request.Lang = params.Lang;
    let urlInit = url.Init();
    let cookie = this.cookieService.GetAuthorizeCookie(urlInit, params.User)
    this.httpService.Post(urlInit, request, cookie).subscribe(
      resp => {
        let response = resp.json() as Response<InitResponse>;
        if(response.HasError)
          this.showAlert(response.ErrorMessage)
        else {
          let errorSettings = response.Data.Errors.find(x => x.Key == KeyStore.Settings.toString());
          let errorFriends = response.Data.Errors.find(x => x.Key == KeyStore.Friends.toString());
          let errorTalks = response.Data.Errors.find(x => x.Key == KeyStore.Talks.toString());
          this.SaveData(response.Data.Friends, errorFriends, KeyStore.Friends);
          this.SaveData(response.Data.Talks, errorTalks, KeyStore.Talks);
          this.SaveData(response.Data.Settings, errorSettings, KeyStore.Settings);
        }
      },
      error => this.showAlert(error)
    )
  }

  SaveData(data: any, error: KeyValueResponse<string, string>, key: KeyStore) {
    if(error == null)
      this.storeService.Set(key.toString(), data);
    else
      this.showAlert(error.Value);
  }
  
}