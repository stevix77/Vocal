import { Injectable } from '@angular/core';
import { Config, AlertController } from 'ionic-angular';
import { Timer } from './timer';
import { params } from './params';
import { Store } from '../models/enums';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Base64 } from '@ionic-native/base64';


@Injectable()
export class AudioRecorder {
  timer: Timer;
  mediaObject: MediaObject;
  filename: string;
  isApp: boolean;
  effects: Array<Object> = new Array();
  tuna: any;
  contexteAudio: any;
  constructor(
    public config:Config,
    public alertCtrl: AlertController,
    private media: Media, 
    private file: File,
    private base64: Base64) {
    this.filename = 'recording.' + this.getExtension();
    this.isApp = this.config.get('isApp');
    this.initEffects();
  }

  applyEffect(filter) {
    let contexteAudio = this.contexteAudio;
    this.file.readAsArrayBuffer(this.file.dataDirectory, 'recording.m4a').then((compressedBuffer) => {
      contexteAudio.decodeAudioData(compressedBuffer, function(buffer){
        var source = contexteAudio.createBufferSource();
        source.buffer = buffer;

        var effect = this.getEffectFromFilter(filter);

        var output = contexteAudio.createGain();
        source.connect(effect);
        effect.connect(output);

        output.connect(contexteAudio.destination);
        source.start();
      }).bind(this);
    }).catch(err => console.log(err));
  }

  editPlayback(filter) {
    if(this.isApp) {
      this.applyEffect(filter);
    } else {
      console.log('apply effect ' + filter);
    }
  }

  getEffectFromFilter(filter){

    return this.effects[filter];
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
    //return this.file.readAsDataURL(this.file.tempDirectory, this.filename);
    //return this.file.readAsDataURL('../Library/NoCloud/', 'recording.m4a');
    return this.file.readAsDataURL(this.file.dataDirectory, 'recording.m4a');
  }

  getMedia() {
    if(this.mediaObject == null) {
      //this.file.createFile(this.file.dataDirectory.replace(/^file:\/\//, ''), 'recording.m4a');
      //this.mediaObject = this.media.create(this.file.tempDirectory.replace(/^file:\/\//, '') + this.filename)
      // this.file.createFile('../Library/NoCloud/', 'recording.m4a', true).then(() => {
        this.mediaObject = this.media.create(this.file.dataDirectory.replace(/^file:\/\//, '') + 'recording.m4a');
        console.log(this.mediaObject);
      // }, (err) => {
      //   console.log(err);
      // });
    }
    return this.mediaObject;
  }

  initEffects(){
    this.contexteAudio = new (window["AudioContext"] || window["webkitAudioContext"])();
    this.tuna = new window["Tuna"](this.contexteAudio);
    this.effects['chaton'] = new this.tuna.Phaser({
        rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
        depth: 0.3,                    //0 to 1
        feedback: 0.2,                 //0 to 1+
        stereoPhase: 30,               //0 to 180
        baseModulationFrequency: 700,  //500 to 1500
        bypass: 0
    });
    this.effects['alien'] = new this.tuna.Chorus({
        rate: 1.5,
        feedback: 0.2,
        delay: 0.0045,
        bypass: 0
    });
    this.effects['robot'] = new this.tuna.Chorus({
        rate: 1.5,
        feedback: 0.2,
        delay: 0.0045,
        bypass: 0
    });
    this.effects['thug'] = new this.tuna.Chorus({
        rate: 1.5,
        feedback: 0.2,
        delay: 0.0045,
        bypass: 0
    });
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