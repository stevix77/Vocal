import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';

@Injectable()
export class AudioPlayer {

  context: any;
  constructor(){

  }

  playWithFilter(filter: string, _file:File, filePath: string, filename:string){
    this.context = new (window["AudioContext"] || window["webkitAudioContext"])();
    let source = this.context.createBufferSource();
    let context = this.context;
    let file = _file;

    let playbackRate = 1;
    if( filter == 'alien' ) playbackRate = 1.5;
    if( filter == 'giant' ) playbackRate = 0.75;
    file.readAsArrayBuffer(filePath, filename).then(arrayBuffer => {
      context.decodeAudioData(arrayBuffer, function(buffer){
          source.buffer = buffer;
          source.playbackRate.value = playbackRate;
          source.connect(context.destination);

          source.start(0);
      });
    });
  }
}