import { Injectable } from '@angular/core';
import { Timer } from './timer';
import { params } from './params';
import { Store } from '../models/enums';
import { Media, MediaObject } from '@ionic-native/media';


@Injectable()
export class AudioRecorder {
  timer: Timer;
  isApp: boolean = !document.URL.startsWith('http');
  file: MediaObject;

  constructor(private media: Media) {
  }

  getExtension() {
    switch (params.Platform) {
      case Store[Store.apns]:
        return 'wav'
      case Store[Store.gcm]:
        return '3gp'
      case Store[Store.wns]:
        return 'mp3';
    }
  }

  startRecording() {
    this.timer = new Timer();
    this.timer.startTimer();
    if(this.isApp) {
      this.file = this.media.create('../Library/NoCloud/vocal.mp3');
      this.file.startRecord();
    }
  }

  stopRecording() {
    this.timer.stopTimer();
    if(this.isApp) this.file.stopRecord();;
  }

  startPlayback() {
    if(this.isApp) this.file.play();
  }

  stopPlayback() {
    if(this.isApp) this.file.stop();
  }

}