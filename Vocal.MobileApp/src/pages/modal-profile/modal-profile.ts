import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController } from 'ionic-angular';
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
    public actionSheetCtrl: ActionSheetController,
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

  dismiss() {
    this.viewCtrl.dismiss();
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

  presentActionSheetProfile() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modifier sa photo',
      buttons: [
        {
          text: 'Prendre une photo',
          handler: () => {
            console.log('Camera');
          }
        },{
          text: 'Importer une photo',
          handler: () => {
            console.log('Parcourir ses dossiers');
          }
        },{
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}
