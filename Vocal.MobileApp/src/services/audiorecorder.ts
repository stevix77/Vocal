import { Injectable } from '@angular/core';
import { Config, AlertController, Platform } from 'ionic-angular';
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
  effects: Array<Object> = new Array();
  tuna: any;
  contexteAudio: any;
  constructor(
    public config:Config,
    public alertCtrl: AlertController,
    public plt: Platform,
    private media: Media, 
    private file: File) {
    this.filename = 'recording.' + this.getExtension();
    this.isApp = this.config.get('isApp');
    //this.initEffects();
  }

  applyEffect(filter) {
    let contexteAudio = this.contexteAudio;
    var that = this;
    //this.file.readAsArrayBuffer(this.file.dataDirectory, this.filename).then((compressedBuffer) => {
    this.file.readAsArrayBuffer('../Library/NoCloud/', this.filename).then((compressedBuffer) => {
      contexteAudio.decodeAudioData(compressedBuffer, function(buffer){
        var source = contexteAudio.createBufferSource();
        source.buffer = buffer;

        //var effect = that.getEffectFromFilter(filter);
        var effect = new that.tuna.Phaser({
            rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
            depth: 0.3,                    //0 to 1
            feedback: 0.2,                 //0 to 1+
            stereoPhase: 30,               //0 to 180
            baseModulationFrequency: 700,  //500 to 1500
            bypass: 0
        });

        var output = contexteAudio.createGain();
        source.connect(effect);
        effect.connect(output);

        output.connect(contexteAudio.destination);
        source.start();
      }).catch(err => console.log(err));
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

  getFilePath() {
    let path = '';
    if(this.plt.is('ios')) path = '../Library/NoCloud/';
    if(this.plt.is('android')) path = this.file.externalDataDirectory;
    
    return path;
  }

  getExtension() {
    let extension = '';
    if(this.plt.is('ios')) extension = 'wav';
    if(this.plt.is('android')) extension = '3gp';
    
    return extension;
  }

  // Used in send-vocal.ts
  getFile() : Promise<string>{
    let path = '';
    if(this.plt.is('ios')) path = this.file.dataDirectory;
    if(this.plt.is('android')) path = this.file.externalDataDirectory;
    return this.file.readAsDataURL(path, this.filename);
  }

  getMediaDuration() : number {
    return this.mediaObject.getDuration();
  }

  getMedia() {
    if(this.mediaObject == null) {
      this.mediaObject = this.media.create(this.getFilePath() + this.filename);
    } else {
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

  release() {
    this.mediaObject.release();
  }

  createFile() {
    console.log('createFile');
    console.log(window);
  //   dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {

  //     writeFile(fileEntry, null, isAppend);

  // }, onErrorCreateFile);
  }

  startRecording() {
    console.log('AudioRecorder start recording');
    if(this.isApp) {
      this.createFile();
      //this.getMedia().startRecord();
    }
  }

  stopRecording() {
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