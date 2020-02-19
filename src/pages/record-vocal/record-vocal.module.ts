import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RecordVocalPage } from './record-vocal';

@NgModule({
  declarations: [
    RecordVocalPage,
  ],
  imports: [
    IonicPageModule.forChild(RecordVocalPage),
  ],
})
export class RecordVocalPageModule {}
