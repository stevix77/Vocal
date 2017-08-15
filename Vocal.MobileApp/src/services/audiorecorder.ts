import { MediaPlugin } from 'ionic-native';
import { Injectable } from '@angular/core';
import { Timer } from './timer';

@Injectable()
export class AudioRecorder {
  mediaPlugin: MediaPlugin = null;
  timer: Timer;
  isApp: boolean = !document.URL.startsWith('http');
  
  get MediaPlugin(): MediaPlugin {
    if (this.mediaPlugin == null) {
      this.mediaPlugin = new MediaPlugin('../Library/NoCloud/recording.wav');
    }

    return this.mediaPlugin;
  }

  startRecording() {
    this.timer = new Timer();
    this.timer.startTimer();
    if(this.isApp) this.MediaPlugin.startRecord();
  }

  stopRecording() {
    this.timer.stopTimer();
    if(this.isApp) this.MediaPlugin.stopRecord();
  }

  startPlayback() {
    if(this.isApp) this.MediaPlugin.play();
  }

  stopPlayback() {
    if(this.isApp) this.MediaPlugin.stop();
  }

}