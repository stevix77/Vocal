import { TalkService } from './../../services/talkService';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, ViewController, ModalController, Config } from 'ionic-angular';
import { TalkResponse } from '../../models/response/talkResponse';
import { ActionResponse } from '../../models/response/actionResponse';
import { ModalProfilePage } from '../../pages/modal-profile/modal-profile';
import { HubMethod, PictureType } from '../../models/enums';
import { MessagePage } from '../message/message';
import { params } from '../../services/params';
import { Response } from '../../models/response';
import { Timer } from '../../services/timer';
import { MessageService } from "../../services/messageService";
import { ExceptionService } from "../../services/exceptionService";


/**
 * Generated class for the VocalListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-vocal-list',
  templateUrl: 'vocal-list.html'
})
export class VocalListPage {
  notificationHub : any;
  messagePage = MessagePage;
  isApp: boolean;
  isRecording: boolean = false;
  isTiming: boolean = false;
  timer: Timer;
  time: String = '';
  isDirectMessage: boolean = false;
  talkId: string = "";
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public alertCtrl: AlertController, 
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public events: Events,
    public config: Config,
    private talkService: TalkService,
    private messageService: MessageService,
    private exceptionService: ExceptionService) {

    events.subscribe(HubMethod[HubMethod.Receive], () => this.initialize())
    this.events.subscribe(HubMethod[HubMethod.BeginTalk], (obj) => this.beginTalk(obj))
    this.events.subscribe(HubMethod[HubMethod.EndTalk], (obj) => this.endTalk(obj))
    this.isApp = this.config.get('isApp');
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VocalListPage');
    // if(this.navCtrl.length() > 1) {
    //   this.navCtrl.remove(0, this.navCtrl.length() - 1).then(() => {
    //     this.navCtrl.setRoot(VocalListPage);
    //   });
    // } 

    this.events.subscribe('record:start', () => {
      this.toggleRecording();
      this.toggleTiming();
    });
    this.events.subscribe('edit-vocal:open', () => this.toggleTiming());
    this.events.subscribe('edit-vocal:close', () => this.toggleRecording());

  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter VocalListPage');
  }

  ionViewWillEnter() {
    // this.talkService.init();
    if(this.talkService.Talks.length == 0)
      this.talkService.LoadList().then(() => {
        this.events.publish("SubscribeHub");
        this.initialize();
      });
    else
      this.initialize();
  }

  toggleRecording() {
    this.isRecording = !this.isRecording;
    if(!this.isRecording) this.initialize();
  }
  
  toggleTiming() {
    this.isTiming = !this.isTiming;
    if(this.isTiming) this.startTimer();
  }

  startTimer() {
    this.time = '0:00';
    this.timer = new Timer(this.events);
    this.events.subscribe('update:timer', timeFromTimer => {
      this.time = timeFromTimer;
    });
    this.events.subscribe('record:stop', () => this.stopTimer());
  }

  stopTimer() {
    this.timer.stopTimer();
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
    this.messageService.getTalkList().subscribe(
      resp => {
        let response = resp.json() as Response<Array<TalkResponse>>;
        if(response.HasError)
          this.showAlert(response.ErrorMessage)
        else {
          if(response.Data.length > 0) {
            this.talkService.Talks = response.Data;
            this.formatDateMessage(this.talkService.Talks);
            this.talkService.SaveList();
          }
        }
      }
    );
  }

  formatDateMessage(items){
    items.forEach(item => {
      if(item.DateLastMessage && typeof(item.DateLastMessage) != 'object') {
        item.FormatedDateLastMessage = this.getFormattedDateLastMessage(item.DateLastMessage);
        console.log(item.FormatedDateLastMessage);
      }
      // if(item.Users.length == 2) {
      //   item.Users.forEach(user => {
      //     if(user.Id != params.User.Id) item.Picture = user.Picture;
      //   });
      // }
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
      let tmp = new Date(msgDate);
      tmp.setDate(tmp.getDate() + 1);
      if(tmp.getDate() == now.getDate()) {
        isYesterday = true;
      }
    }
    // If less than a week, we display the day, like "Monday"
    if(msgDate.getDate() != now.getDate() && msgDate < now) {
      for(let i = 2; i < 7; i++) {
        let tmp = new Date(msgDate);
        tmp.setDate(tmp.getDate() + i);
        if(tmp.getDate() == now.getDate()) {
          isWeek = true;
        }
      }
    }

    return {isToday: isToday, isYesterday: isYesterday, isWeek: isWeek, date:msgTime};
  }

  initialize() {
    if(this.talkService.Talks.length > 0) {
      this.formatDateMessage(this.talkService.Talks);
    }
    else {  
      this.getVocalList();
    }
  }

  deleteMessage(id, index){
    try {
      this.messageService.deleteTalk(id).subscribe(
        resp => {
          try {
            let response = resp.json() as Response<ActionResponse>;
            if(!response.HasError && response.Data.IsDone){
              this.talkService.DeleteTalk(id);
              this.talkService.DeleteMessages(id);
            }
            else {
              this.events.publish("Error", response.ErrorMessage);
            }
          } catch(err) {
            this.events.publish("Error", err.message);
            this.exceptionService.Add(err);
          }
        }
      );
    } catch(err) {
      this.events.publish("Error", err.message);
      this.exceptionService.Add(err);
    }
  }

  archiveMessage(id, index){
    this.messageService.archiveTalk(id).subscribe(
      resp => {
        let response = resp.json() as Response<ActionResponse>;
        if(!response.HasError && response.Data.IsDone){
          this.talkService.DeleteTalk(id);
        }
        else {
          this.showAlert(response.ErrorMessage);
        }
      }
    );
  }

  showConfirm(type, idTalk, index) {
    let confirm = this.alertCtrl.create({
      title: `Êtes-vous sûr de vouloir ${type == 0 ? 'supprimer' : 'archiver'} cet conversation ?`,
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
          }
        },
        {
          text: `${type == 0 ? 'Supprimer' : 'Archiver'}`,
          handler: () => {
            if(type == 0)
              this.deleteMessage(idTalk, index);
            else if(type == 1)
              this.archiveMessage(idTalk, index);
          }
        }
      ]
    });
    confirm.present();
  }

  goToMessage(id) {
    this.navCtrl.push(MessagePage, {TalkId: id}, {'direction':'back'});
  }

  getPicture(talk) {
    let picture = 'assets/default-picture-80x80.jpg';
    if(talk.Users.length == 2) {
      let user = talk.Users.find(x => x.Id != params.User.Id)
      let pict = user.Pictures.find(x => x.Type == PictureType.Talk)
      picture = pict != null ? pict.Value : picture;
    } else {
      picture = talk.Picture != null && talk.Picture > 0 ? talk.Picture : picture;
    }
    return picture;
  }
  
  beginTalk(obj) {
    let talk = this.talkService.getTalk(obj.TalkId);
    if(talk != null){
      talk.IsWriting = true;
      talk.TextWriting = obj.Username + " se prépare à envoyer un message";
    }
  }

  endTalk(obj) {
    let talk = this.talkService.getTalk(obj.TalkId);
    if(talk != null)
      talk.IsWriting = false;
  }
}