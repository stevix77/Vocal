import { Component } from '@angular/core';
import { Events, AlertController, ModalController, Config, ViewController } from 'ionic-angular';
import { AudioRecorder } from '../../services/audiorecorder';
import { ModalEditVocalPage } from '../../pages/modal-edit-vocal/modal-edit-vocal';

/**
 * Generated class for the AudioRecorderComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'audio-recorder',
  templateUrl: 'audio-recorder.html'
})
export class AudioRecorderComponent {

  isApp: boolean;

  constructor(public events: Events,
    public audioRecorder: AudioRecorder,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public config: Config,
    public viewCtrl: ViewController
    ) {

  }

  ngOnInit() {
    console.log('ngOnInit AudioRecorderComponent');
    this.isApp = this.config.get('isApp');
  }

  presentEditVocalModal() {
    let editVocalModal = this.modalCtrl.create(ModalEditVocalPage);
    editVocalModal.present();
  }

  startRecording() {
    console.log('start recording');
    this.events.publish('record:start');

    try {
      this.audioRecorder.startRecording();
    }
    catch (e) {
      this.showAlert('Could not start recording.');
    }
  }

  stopRecording() {
    console.log('stop recording');
    this.events.publish('record:stop');
    this.presentEditVocalModal();
    //document.querySelector('.ion-page ion-content .wrapper-record').remove();
    try {
      this.audioRecorder.stopRecording();
    }
    catch (e) {
      this.showAlert('Could not stop recording.');
    }
  }

  startPlayback() {
    try {
      this.audioRecorder.startPlayback();
    }
    catch (e) {
      this.showAlert('Could not play recording.');
    }
  }

  stopPlayback() {
    try {
      this.audioRecorder.stopPlayback();
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
