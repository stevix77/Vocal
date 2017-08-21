import { Injectable } from '@angular/core';
import { Timer } from './timer';
import { params } from './params';
import { Store } from '../models/enums';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';


@Injectable()
export class AudioRecorder {
  timer: Timer;
  isApp: boolean = !document.URL.startsWith('http');
  mediaObject: MediaObject;
  filename: string;
  constructor(private media: Media, private file: File) {
    this.filename = 'recording.' + this.getExtension();
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
      this.mediaObject = this.media.create(this.file.tempDirectory.replace(/^file:\/\//, '') + this.filename)
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

}