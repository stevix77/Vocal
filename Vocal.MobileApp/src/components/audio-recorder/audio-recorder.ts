import { Component, Input } from '@angular/core';
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
  templateUrl: 'audio-recorder.html',
  inputs: ['isDirectMessage', 'recipients']
})
export class AudioRecorderComponent {

  @Input('isDirectMessage') dmName: boolean;
  @Input('recipients') recipientsName: boolean;

  isApp: boolean;
  time: number;
  timer: number;
  isDM: boolean;
  recipients: boolean;

  constructor(public events: Events,
    public audioRecorder: AudioRecorder,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public config: Config,
    public viewCtrl: ViewController
    ) {
  }

  ngOnInit(e) {
    console.log('ngOnInit AudioRecorderComponent');
    this.isApp = this.config.get('isApp');
  }

  presentEditVocalModal() {
    let editVocalModal = this.modalCtrl.create(ModalEditVocalPage, {duration: this.time, isDM:this.dmName, recipients: this.recipientsName});
    editVocalModal.present();
  }

  startRecording() {
    this.events.publish('record:start');
    this.time = 0;
    this.timer = setInterval(() => {
      this.time++;
    }, 1000);
    try {
      this.audioRecorder.startRecording();
    }
    catch (e) {
      this.showAlert('Could not start recording.');
    }
  }

  stopRecording() {
    this.events.publish('record:stop');
    clearInterval(this.timer);
    this.presentEditVocalModal();
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
