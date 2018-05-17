import { Injectable } from '@angular/core';
import { Config, AlertController, Platform } from 'ionic-angular';
import { Timer } from './timer';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { ExceptionService } from './exceptionService';
import { typeSourceSpan } from '@angular/compiler';

@Injectable()
export class AudioRecorder {
  timer: Timer;
  mediaObject: MediaObject;
  filename: string;
  isApp: boolean;
  effects: Array<Object> = new Array();
  tuna: any;
  context: any;
  isPlaying: boolean = false;
  constructor(
    public config:Config,
    public alertCtrl: AlertController,
    public plt: Platform,
    private media: Media, 
    private file: File,
    private exceptionService: ExceptionService) {
    this.filename = 'recording.' + this.getExtension();
    this.isApp = this.config.get('isApp');
  }

  applyEffect(filter) {
    console.log('apply effect')
    if (!this.isPlaying) {
      // Make a source node for the sample.
      let source = this.context.createBufferSource();
      let context = this.context;
      let file = this.file;
      let exceptionService = this.exceptionService;

      file.readAsArrayBuffer(this.getFilePath(), this.filename).then(arrayBuffer => {
        context.decodeAudioData(arrayBuffer, function(buffer){
          source.buffer = buffer;

          let convolver = context.createConvolver();
          file.listDir(file.applicationDirectory, 'www/assets/effects').then(response => {
            exceptionService.Add(response);
          }).catch(err => {
            exceptionService.Add(err);
          });
          /*
          file.readAsArrayBuffer('../assets/effects/', 'spring.wav').then(arrayBuffer => {
            context.decodeAudioData(arrayBuffer, function(buffer){
              convolver.buffer = buffer;
              source.connect(convolver);
              convolver.connect(context.destination);

              source.start();
            });
          }).catch(err => {
            exceptionService.Add(err);
          });*/
          //source.connect(context.destination);
          //source.start();
          // Si le son est coupé sur l'iPhone, l'audio ne se joue pas
        });
      }).catch(err => console.log('error readAsArrayBuffer : ' + err));
      //source.buffer = this.buffer;
      // // Make a convolver node for the impulse response.
      // var convolver = context.createConvolver();
      // convolver.buffer = this.impulseResponseBuffer;
      // // Connect the graph.
      // source.connect(convolver);
      // convolver.connect(context.destination);
      // // Save references to important nodes.
      // this.source = source;
      // this.convolver = convolver;
      // // Start playback.
      // this.source[this.source.start ? 'start': 'noteOn'](0);
    } else {
      console.log('else');
      //this.source[this.source.stop ? 'stop': 'noteOff'](0);
    }
    //this.isPlaying = !this.isPlaying;

    // let contexteAudio = this.contexteAudio;
    // var that = this;
    // //this.file.readAsArrayBuffer(this.file.dataDirectory, this.filename).then((compressedBuffer) => {
    // this.file.readAsArrayBuffer(this.getFilePath(), this.filename).then((compressedBuffer) => {
    //   contexteAudio.decodeAudioData(compressedBuffer, function(buffer){
    //     var source = contexteAudio.createBufferSource();
    //     source.buffer = buffer;

    //     //var effect = that.getEffectFromFilter(filter);
    //     var effect = new that.tuna.Phaser({
    //         rate: 1.2,                     //0.01 to 8 is a decent range, but higher values are possible
    //         depth: 0.3,                    //0 to 1
    //         feedback: 0.2,                 //0 to 1+
    //         stereoPhase: 30,               //0 to 180
    //         baseModulationFrequency: 700,  //500 to 1500
    //         bypass: 0
    //     });

    //     var output = contexteAudio.createGain();
    //     source.connect(effect);
    //     effect.connect(output);

    //     output.connect(contexteAudio.destination);
    //     source.start();
    //   }).catch(err => console.log(err));
    // }).catch(err => console.log(err));
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

  /*
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
  */

  release() {
    this.mediaObject.release();
  }

  createFile() {
    this.file = new File();
    this.file.createFile(this.getFilePath(), this.filename, true).then(() => {
      let path = this.getFilePath().replace(/^file:\/\//, '');
      this.mediaObject = this.media.create(path + this.filename);
      this.mediaObject.onStatusUpdate.subscribe(this.onMediaStatusUpdate);
      this.context = new (window["AudioContext"] || window["webkitAudioContext"])();
      this.mediaObject.startRecord();
    }).catch(err => {
        this.exceptionService.Add(err);
    });
  }

  onMediaStatusUpdate(status) {
    if(status == 2) this.isPlaying = true;
    if(status == 4) this.isPlaying = false;
    console.log('isPlaying : ' + this.isPlaying);
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