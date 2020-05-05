import { Injectable } from '@angular/core';
import { Config, AlertController, Platform } from 'ionic-angular';
import { Timer } from './timer';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { ExceptionService } from './exceptionService';
import { AudioPlayer } from './audioplayer';

@Injectable()
export class AudioRecorder {
  timer: Timer;
  mediaObject: MediaObject;
  filename: string;
  isApp: boolean;
  context: any;
  isPlaying: boolean = false;
  constructor(
    public config:Config,
    public alertCtrl: AlertController,
    public plt: Platform,
    public audioplayer: AudioPlayer,
    private media: Media, 
    private file: File,
    private exceptionService: ExceptionService) {
    this.filename = 'recording.' + this.getExtension();
    this.isApp = this.config.get('isApp');
  }

  applyEffect(filter) {
    if (!this.isPlaying) {
      this.audioplayer.playWithFilter(filter, this.file, this.getFilePath(), this.filename);
    }
  }

  editPlayback(filter) {
    if(this.isApp) {
      this.applyEffect(filter);
    }
  }

  getFilePath() {
    let path = '';
    if(this.plt.is('ios')) path = this.file.tempDirectory;
    if(this.plt.is('android')) path = this.file.externalCacheDirectory;

    return path;
  }

  getExtension() {
    let extension = '';
    if(this.plt.is('ios')) extension = 'm4a';
    if(this.plt.is('android')) extension = 'aac';
    
    return extension;
  }

  // Used in send-vocal.ts
  getFile() : Promise<string>{
    return this.file.readAsDataURL(this.getFilePath(), this.filename);
  }

  release() {
    this.mediaObject.release();
  }

  createFile() {
    this.file = new File();
    this.file.createFile(this.getFilePath(), this.filename, true).then(() => {
      let path = this.getFilePath().replace(/^file:\/\//, '');
      this.mediaObject = this.media.create(path + this.filename);
      this.mediaObject.onStatusUpdate.subscribe(this.onMediaStatusUpdate);
      this.mediaObject.startRecord();
    }).catch(err => {
        this.exceptionService.Add(err);
    });
  }

  onMediaStatusUpdate(status) {
    if(status == 2) this.isPlaying = true;
    if(status == 4) this.isPlaying = false;
  }

  startRecording() {
    console.log('AudioRecorder start recording');
    if(this.isApp) {
      this.createFile();
    }
  }

  stopRecording() {
    if(this.isApp) this.mediaObject.stopRecord();
  }

  startPlayback() {
    if(this.isApp) {
      this.mediaObject.play();
    }
  }

  stopPlayback() {
    if(this.isApp) {
      this.mediaObject.stop();
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