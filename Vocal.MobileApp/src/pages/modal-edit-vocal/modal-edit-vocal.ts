import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, Events } from 'ionic-angular';
import { AudioRecorder } from '../../services/audiorecorder';
import { SendVocalPage } from '../../pages/send-vocal/send-vocal';
import { AudioFiltersPage } from '../../pages/audio-filters/audio-filters';

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

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public audioRecorder: AudioRecorder,
    public alertCtrl: AlertController,
    public events: Events
    ) {
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
    if(!this.isSending) {
      this.isSending = true;
      let users = [];
      this.audioRecorder.getFile().then(fileValue => {
        console.log(fileValue);
        this.FileValue = fileValue;
        this.Friends.forEach(elt => {
        if(elt.Checked)
          users.push(elt.Id);
        });
        let date = new Date();
        let request: SendMessageRequest = {
          content: this.FileValue,
          duration: this.navParams.get('duration'),
          sentTime: date,
          idsRecipient: users,
          messageType: MessageType.Vocal,
          Lang: params.Lang,
          idSender: params.User.Id,
          IdTalk: null,
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
                this.navCtrl.remove(0,1).then(() => this.navCtrl.pop());
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
