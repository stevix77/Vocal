import { Injectable } from '@angular/core';
import { Config, AlertController } from 'ionic-angular';
import { Timer } from './timer';
import { params } from './params';
import { Store } from '../models/enums';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';


@Injectable()
export class AudioRecorder {
  timer: Timer;
  mediaObject: MediaObject;
  filename: string;
  isApp: boolean;
  constructor(
    public config:Config,
    private media: Media, 
    public alertCtrl: AlertController,
    private file: File) {
    this.filename = 'recording.' + this.getExtension();
    this.isApp = this.config.get('isApp');
  }

  getExtension() {
    switch (params.Platform) {
      case Store[Store.apns]:
        return 'wav'
      case Store[Store.gcm]:
        return '3gp'
      case Store[Store.wns]:
        return 'm4a';
    }
  }

  getFile() : Promise<string>{
    return this.file.readAsDataURL(this.file.tempDirectory, this.filename);
  }

  getMedia() {
    if(this.mediaObject == null) {
      //this.mediaObject = this.media.create(this.file.tempDirectory.replace(/^file:\/\//, '') + this.filename)
      this.mediaObject = this.media.create('../Library/NoCloud/recording.wav');
    }
    return this.mediaObject;
  }

  startRecording() {
    this.timer = new Timer();
    this.timer.startTimer();
    if(this.isApp) {
      this.getMedia().startRecord();
    }
  }

  stopRecording() {
    this.timer.stopTimer();
    if(this.isApp) this.getMedia().stopRecord();
  }

  startPlayback() {
    if(this.isApp) this.getMedia().play();
  }

  stopPlayback() {
    if(this.isApp) this.getMedia().stop();
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