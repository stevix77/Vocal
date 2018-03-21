import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Events } from 'ionic-angular';
import { AudioRecorder } from '../../services/audiorecorder';
import { SendVocalPage } from '../../pages/send-vocal/send-vocal';
import { AudioFiltersPage } from '../../pages/audio-filters/audio-filters';
import { SendMessageRequest } from '../../models/request/sendMessageRequest';
import { MessageType } from '../../models/enums';
import { params } from "../../services/params";
import { url } from "../../services/url";
import { CookieService } from "../../services/cookieService";
import { HttpService } from "../../services/httpService";
import { TalkService } from "../../services/talkService";
import { ExceptionService } from "../../services/exceptionService";
import { SendMessageResponse } from '../../models/response/sendMessageResponse';
import { Response } from '../../models/response';

/**
 * Generated class for the ModalEditVocalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modal-edit-vocal',
  templateUrl: 'modal-edit-vocal.html'
})
export class ModalEditVocalPage {

  tab1Filters = AudioFiltersPage;
  isSending: Boolean = false;
  FileValue: string;
  Friends: Array<any>;
  talkId: string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public audioRecorder: AudioRecorder,
    public alertCtrl: AlertController,
    public events: Events,
    private cookieService: CookieService,
    private httpService: HttpService,
    private talkService: TalkService,
    private exceptionService: ExceptionService
    ) {
      this.talkId = this.navParams.get("talkId");
    this.viewCtrl.onDidDismiss( () => this.events.publish('edit-vocal:close') );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalEditVocalPage');
    this.events.publish('edit-vocal:open');

  }

  ionViewDidEnter() {
  }

  editVocalWithFilter(filter) {
    this.audioRecorder.editPlayback(filter);
  }

  startPlayback() {
    try {
      this.audioRecorder.startPlayback();
    }
    catch (e) {
      this.showAlert('Could not play recording.');
    }
  }

  dismiss(){
    try {
      this.audioRecorder.release();
    }
    catch (e) {
      this.showAlert('Could not release audio.');
    }
    this.viewCtrl.dismiss();
  }

  goToSendVocal() {
    if(this.navParams.get('isDM')) {
      this.sendVocal();
    } else {
      this.navCtrl.push(SendVocalPage, {duration:this.navParams.get('duration')});
    }
  }

  sendVocal() {
    console.log('send vocal');
    if(!this.isSending) {
      this.isSending = true;
      //console.table(this.navParams.get('recipients'));
      let users = [];
      this.audioRecorder.getFile().then(fileValue => {
        this.FileValue = fileValue;
        // this.navParams.get('recipients').forEach(elt => {
        //   users.push(elt.Id);
        // });
        this.talkService.Talks.find(x => x.Id == this.talkId).Users.forEach(elt => {
          users.push(elt.Id);
        })
        let date = new Date();
        let request: SendMessageRequest = {
          content: this.FileValue,
          duration: this.navParams.get('duration'),
          sentTime: date,
          idsRecipient: users,
          messageType: MessageType.Vocal,
          Lang: params.Lang,
          idSender: params.User.Id,
          IdTalk: this.talkId,
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
                this.navCtrl.pop()
                //this.navCtrl.remove(0,1).then(() => this.navCtrl.pop());
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

  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

}
