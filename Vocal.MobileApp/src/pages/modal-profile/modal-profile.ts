import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, PopoverController } from 'ionic-angular';
import { SettingsPage } from '../../pages/settings/settings';
import { FriendsListPage } from '../../pages/friends-list/friends-list';
import { AddFriendPage } from '../../pages/add-friend/add-friend';
import { PopoverFriendsAddedMePage } from '../../pages/popover-friends-added-me/popover-friends-added-me';
import { AppUser } from '../../models/appUser';
import { params } from "../../services/params";
import { StoreService } from '../../services/storeService';
import { KeyStore } from "../../models/enums";

/**
 * Generated class for the ModalProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modal-profile',
  templateUrl: 'modal-profile.html',
})
export class ModalProfilePage {

  private User: AppUser;
  private CountFriendsAddedMe: number = 0;
  private friendsAddedMe: Array<Object>;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public popoverCtrl: PopoverController,
    private storeService: StoreService
    ) {
    this.User = params.User;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalProfilePage');
    this.storeService.Get(KeyStore.FriendsAddedMe.toString()).then(
      friends => {
        if(friends != null) {
          this.friendsAddedMe = friends;
          this.CountFriendsAddedMe = friends.length;
        }
      }
    )
  }

  goToProfilePic() {
    console.log('go to profile pic');
  }

  goToAddFriend() {
    this.navCtrl.push(AddFriendPage);
  }

  goToFriendsList() {
    this.navCtrl.push(FriendsListPage);
  }

  showFriendsAddedMeList(evt) {
    console.log(this.friendsAddedMe);
    let popover = this.popoverCtrl.create(PopoverFriendsAddedMePage, {friends:this.friendsAddedMe}, {cssClass: 'friends-added-me'});
    popover.present({
      ev: evt
    });
  }

  goToSettings() {
    this.navCtrl.push(SettingsPage);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
