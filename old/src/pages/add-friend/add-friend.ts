import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SearchUsernamePage } from '../search-username/search-username';
import { ScanContactsPage } from '../scan-contacts/scan-contacts';
import { SearchMailPage } from '../search-mail/search-mail';

/**
 * Generated class for the AddFriendPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-add-friend',
  templateUrl: 'add-friend.html',
})
export class AddFriendPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goToSearchByUsername() {
    this.navCtrl.push(SearchUsernamePage);
  }

  goToScanContacts() {
    this.navCtrl.push(ScanContactsPage);
  }

  goToSearchByMail() {
    this.navCtrl.push(SearchMailPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddFriendPage');
  }

}
