import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SelectFriendsComponent } from '../../components/select-friends/select-friends';
import { VocalListPage } from '../../pages/vocal-list/vocal-list';

/**
 * Generated class for the SendVocalPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-send-vocal',
  templateUrl: 'send-vocal.html',
  entryComponents: [SelectFriendsComponent]
})
export class SendVocalPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendVocalPage');
  }

  goToVocalList() {
    this.navCtrl.push(VocalListPage);
  }

}
