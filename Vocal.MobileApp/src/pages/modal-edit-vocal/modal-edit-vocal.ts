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
    this.navCtrl.push(SendVocalPage, {duration:this.navParams.get('duration')});
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
