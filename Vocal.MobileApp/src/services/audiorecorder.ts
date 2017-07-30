import { MediaPlugin } from 'ionic-native';
import { Injectable } from '@angular/core';
import { Timer } from './timer';

@Injectable()
export class AudioRecorder {
  mediaPlugin: MediaPlugin = null;
  
  get MediaPlugin(): MediaPlugin {
    if (this.mediaPlugin == null) {
      this.mediaPlugin = new MediaPlugin('../Library/NoCloud/recording.wav');
    }

    return this.mediaPlugin;
  }

  startRecording() {
    let timer = new Timer();
    timer.startTimer();
    //this.MediaPlugin.startRecord();
  }

  stopRecording() {
    this.MediaPlugin.stopRecord();
  }

  startPlayback() {
    this.MediaPlugin.play();
  }

  stopPlayback() {
    this.MediaPlugin.stop();
  }

}