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
  effects: Array<Object> = new Array();
  tuna: any;
  contexteAudio: any;
  constructor(
    public config:Config,
    public alertCtrl: AlertController,
    private media: Media, 
    private file: File) {
    this.filename = 'recording.' + this.getExtension();
    this.isApp = this.config.get('isApp');
    this.initEffects();
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

  // Used in send-vocal.ts
  getFile() : Promise<string>{
    return this.file.readAsDataURL(this.file.dataDirectory, this.filename);
  }

  getMediaDuration() : number {
    return this.mediaObject.getDuration();
  }

  getMedia() {
    console.log(this.file.dataDirectory);
    if(this.mediaObject == null) {
      //this.mediaObject = this.media.create(this.file.dataDirectory + this.filename);
      this.mediaObject = this.media.create('../Library/NoCloud/' + this.filename);
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

  startRecording() {
    //this.timer = new Timer();
    //this.timer.startTimer();
    if(this.isApp) {
      console.log('start recording');
      this.getMedia().startRecord();
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