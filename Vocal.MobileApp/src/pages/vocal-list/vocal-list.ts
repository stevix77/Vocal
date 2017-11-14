import { TalkService } from './../../services/talkService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, ViewController, ModalController, Config } from 'ionic-angular';
import { HttpService } from "../../services/httpService";
import { CookieService } from "../../services/cookieService";
import { StoreService } from "../../services/storeService";
import { TalkResponse } from '../../models/response/talkResponse';
import { ModalProfilePage } from '../../pages/modal-profile/modal-profile';
import {HubMethod} from '../../models/enums';
import { MessagePage } from '../message/message';
import {params} from '../../services/params';
import { Response } from '../../models/Response';
import {url} from '../../services/url';



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
  providers: [HttpService, CookieService, StoreService]
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

  getVocalList() {
    let request = {Lang: params.Lang, UserId: params.User.Id}
    let urlTalks = url.GetTalkList();
    let cookie = this.cookieService.GetAuthorizeCookie(urlTalks, params.User);
    this.httpService.Post(urlTalks, request, cookie).subscribe(
      resp => {
        let response = resp.json() as Response<Array<TalkResponse>>;
        if(response.HasError)
          this.showAlert(response.ErrorMessage)
        else {
          if(response.Data.length > 0) {
            this.vocalList = this.talkService.Talks = response.Data;
            this.formatDateMessage(this.vocalList);
            this.talkService.SaveList();
          }
        }
      }
    );
  }

  formatDateMessage(items){
    items.forEach(item => {
      if(item.DateLastMessage) {
        item.DateLastMessage = this.getFormattedDateLastMessage(item.DateLastMessage);
      }
    });
  }

  getFormattedDateLastMessage(msgTime) {
    let msgDate = new Date(msgTime);
    let now = new Date();
    let isToday = false;
    let isYesterday = false;
    let isWeek = false;

    // If today, we display HH:ss
    if(msgDate.getDate() == now.getDate()) {
      isToday = true;
    }
    // If yesterday, we display "Yesterday"
    if(msgDate.getDate() != now.getDate() && msgDate < now) {
      var tmp = msgDate;
      tmp.setDate(tmp.getDate() + 1);
      if(tmp.getDate() == now.getDate()) {
        isYesterday = true;
      }
    }

    return {isToday: isToday, isYesterday: isYesterday, isWeek: isWeek, date:msgTime};
  }

  initialize() {
    this.talkService.LoadList().then(() => {
      if(this.talkService.Talks != null) {
        this.vocalList = this.talkService.Talks;
        if(this.vocalList.length > 0) this.formatDateMessage(this.vocalList);
      }
      else {  
        this.getVocalList();
      }
    })
  }

  deleteMessage(id){
    console.log('delete : ' + id);
  }

  archiveMessage(id){
    console.log('archive : ' + id);
  }

  goToMessage(id) {
    this.navCtrl.push(MessagePage, {TalkId: id}, {'direction':'back'});
  }
  
}