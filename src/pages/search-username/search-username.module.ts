import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchUsernamePage } from './search-username';

@NgModule({
  declarations: [
    SearchUsernamePage,
  ],
  imports: [
    IonicPageModule.forChild(SearchUsernamePage),
  ],
  exports: [
    SearchUsernamePage
  ]
})
export class SearchUsernamePageModule {}
