import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PopoverFriendsAddedMePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-popover-friends-added-me',
  templateUrl: 'popover-friends-added-me.html',
})
export class PopoverFriendsAddedMePage {
  public friends: Array<Object>;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams) {
    this.friends = navParams.data.friends;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverFriendsAddedMePage');
  }

}
