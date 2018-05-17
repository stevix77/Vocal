import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Events } from 'ionic-angular';
import { AudioRecorder } from '../../services/audiorecorder';
import { SendVocalPage } from '../../pages/send-vocal/send-vocal';
import { AudioFiltersPage } from '../../pages/audio-filters/audio-filters';
import { MessageType } from '../../models/enums';
import { TalkService } from "../../services/talkService";
import { ExceptionService } from "../../services/exceptionService";
import { SendMessageResponse } from '../../models/response/sendMessageResponse';
import { Response } from '../../models/response';
import { MessageService } from "../../services/messageService";

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
  talkId: string;
  activeFilter: string = '';

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public audioRecorder: AudioRecorder,
    public alertCtrl: AlertController,
    public events: Events,
    private talkService: TalkService,
    private messageService: MessageService,
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
    this.activeFilter = filter;
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
      this.navCtrl.push(SendVocalPage, {duration:this.navParams.get('duration'), activeFilter: this.activeFilter});
    }
  }

  sendVocal() {
    try {
      if(!this.isSending) {
        this.isSending = true;
        this.audioRecorder.getFile().then(fileValue => {
          this.FileValue = fileValue;
          let duration = this.navParams.get('duration');
          this.messageService.sendMessage(this.talkId, MessageType.Vocal, null, duration, this.FileValue).subscribe(
            resp => {
              try {
                let response = resp.json() as Response<SendMessageResponse>;
                if(!response.HasError && response.Data.IsSent) {
                  console.log(response);
                  this.talkService.LoadList().then(() => {
                    this.talkService.UpdateList(response.Data.Talk);
                    this.talkService.SaveList();
                    this.navCtrl.remove(0,1).then(() => this.navCtrl.pop());
                  })
                }
                else {
                  console.log(response);
                  this.events.publish("Error", response.ErrorMessage);
                }
              } catch(err) {
                this.events.publish("Error", err.message);
                this.exceptionService.Add(err);
              }
              this.isSending = false;
            }
          )
        }).catch(err => {
          console.log(err);
          this.isSending = false;
          this.events.publish("Error", err.message);
          this.exceptionService.Add(err);
        });
      }
    } catch(err) {
      this.events.publish("Error", err.message);
      this.exceptionService.Add(err);
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
