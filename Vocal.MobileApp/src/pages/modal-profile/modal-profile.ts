import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SettingsPage } from '../../pages/settings/settings';
import { FriendsListPage } from '../../pages/friends-list/friends-list';
import { AppUser } from '../../models/appUser';
import { params } from "../../services/params";
import { StoreService } from '../../services/storeService';
import { KeyStore } from "../../models/enums";
import { Camera, CameraOptions } from '@ionic-native/camera';

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
    private storeService: StoreService,
    private camera: Camera
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
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true
    }
    this.camera.getPicture(options).then((imageData) => {
    // imageData is either a base64 encoded string or a file URI
    // If it's base64:
    let base64Image = 'data:image/jpeg;base64,' + imageData;
    console.log(base64Image);
    }, (err) => {
    console.log(err);
    });
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
