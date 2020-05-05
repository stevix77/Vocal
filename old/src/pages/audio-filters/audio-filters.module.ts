import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AudioFiltersPage } from './audio-filters';

@NgModule({
  declarations: [
    AudioFiltersPage,
  ],
  imports: [
    IonicPageModule.forChild(AudioFiltersPage),
  ],
  exports: [
    AudioFiltersPage
  ]
})
export class AudioFiltersPageModule {}
