import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverRecordPage } from './popover-record';

@NgModule({
  declarations: [
    PopoverRecordPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverRecordPage),
  ],
  exports: [
    PopoverRecordPage
  ]
})
export class PopoverRecordPageModule {}
