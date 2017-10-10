import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FriendsService } from '../../services/friendsService';

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
  providers: [FriendsService]
})
export class PopoverFriendsAddedMePage {

  public friends: Array<Object>;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public friendsService: FriendsService
    ) {
    this.friends = navParams.data.friends;
    console.log(this.friends);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverFriendsAddedMePage');
  }

  addFriend(id){
    let friends = [id];
    this.friendsService.add(friends);
  }

}
