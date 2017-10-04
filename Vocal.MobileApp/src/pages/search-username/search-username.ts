import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SearchUsernamePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-search-username',
  templateUrl: 'search-username.html',
})
export class SearchUsernamePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  viewUsersByName(val) {
    console.log(val);
    this.searchFriends();
  }

  searchFriends() {
    console.log('search');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchUsernamePage');
  }

}
