import { TalkService } from './../../services/talkService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, ViewController, ModalController, Config } from 'ionic-angular';
import { HttpService } from "../../services/httpService";
import { CookieService } from "../../services/cookieService";
import { StoreService } from "../../services/storeService";
import { TalkResponse } from '../../models/response/talkResponse';
import { ModalProfilePage } from '../../pages/modal-profile/modal-profile';
import {KeyStore} from '../../models/enums';
import {HubMethod} from '../../models/enums';
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
  providers: [HttpService, CookieService, StoreService, TalkService],
  entryComponents: [AudioRecorderComponent]
})
export class VocalListPage {
  notificationHub : any;
  messagePage = MessagePage;
  vocalList: Array<TalkResponse> = new Array<TalkResponse>();
  isApp: boolean;
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController, 
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public events: Events,
    public config: Config,
    private httpService: HttpService, 
    private cookieService: CookieService, 
    private storeService: StoreService,
    private talkService: TalkService) {

    events.subscribe('record:start', () => this.toggleContent());
    events.subscribe('edit-vocal:close', () => this.toggleContent());
    events.subscribe(HubMethod[HubMethod.Receive], () => this.initialize())

    this.isApp = this.config.get('isApp');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VocalListPage');

  }

  ionViewDidEnter() {
    document.querySelector('[data-record]').addEventListener('touchstart', oEvt => this.events.publish('record:start'));
    if(this.isApp) document.querySelector('[data-record]').addEventListener('touchend', oEvt => this.events.publish('record:stop'));
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
    this.talkService.LoadList().then(() => {
      this.vocalList = this.talkService.Talks;
    })
  }

  goToMessage(id) {
    this.navCtrl.push(MessagePage, {TalkId: id}, {'direction':'back'});
  }
  
}