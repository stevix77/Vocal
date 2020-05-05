import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AudioRecorderComponent } from './audio-recorder';

@NgModule({
  declarations: [
    AudioRecorderComponent,
  ],
  imports: [
    IonicPageModule.forChild(AudioRecorderComponent),
  ],
  exports: [
    AudioRecorderComponent
  ]
})
export class AudioRecorderComponentModule {}
