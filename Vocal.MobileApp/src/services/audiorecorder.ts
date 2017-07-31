import { MediaPlugin } from 'ionic-native';
import { Injectable } from '@angular/core';
import { Timer } from './timer';

@Injectable()
export class AudioRecorder {
  mediaPlugin: MediaPlugin = null;
  timer: Timer;
  
  get MediaPlugin(): MediaPlugin {
    if (this.mediaPlugin == null) {
      this.mediaPlugin = new MediaPlugin('../Library/NoCloud/recording.wav');
    }

    return this.mediaPlugin;
  }

  startRecording() {
    this.timer = new Timer();
    this.timer.startTimer();
    //this.MediaPlugin.startRecord();
  }

  stopRecording() {
    this.timer.stopTimer();
    //this.MediaPlugin.stopRecord();
  }

  startPlayback() {
    this.MediaPlugin.play();
  }

  stopPlayback() {
    this.MediaPlugin.stop();
  }

}