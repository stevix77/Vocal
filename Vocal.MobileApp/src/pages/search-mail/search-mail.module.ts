import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchMailPage } from './search-mail';

@NgModule({
  declarations: [
    SearchMailPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchMailPage),
  ],
  exports: [
    SearchMailPage
  ]
})
export class SearchMailPageModule {}
