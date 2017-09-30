import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SettingsPage } from '../../pages/settings/settings';
import { FriendsListPage } from '../../pages/friends-list/friends-list';
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
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private storeService: StoreService
    ) {
    this.User = params.User;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalProfilePage');
    this.storeService.Get(KeyStore.FriendsAddedMe.toString()).then(
      friends => {
        if(friends != null)
          this.CountFriendsAddedMe = friends.length;
      }
    )
  }

  goToProfilePic() {
    console.log('go to profile pic');
  }

  goToFriendsList() {
    this.navCtrl.push(FriendsListPage);
  }

  goToFriendsAddedMeList() {

  }

  goToSettings() {
    this.navCtrl.push(SettingsPage);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
