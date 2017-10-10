import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController, ActionSheetController, PopoverController } from 'ionic-angular';
import { SettingsPage } from '../../pages/settings/settings';
import { FriendsListPage } from '../../pages/friends-list/friends-list';
import { AddFriendPage } from '../../pages/add-friend/add-friend';
import { PopoverFriendsAddedMePage } from '../../pages/popover-friends-added-me/popover-friends-added-me';
import { AppUser } from '../../models/appUser';
import { params } from "../../services/params";
import { StoreService } from '../../services/storeService';
import { KeyStore, UpdateType } from "../../models/enums";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpService } from "../../services/httpService";
import { CookieService } from "../../services/cookieService";
import { url } from "../../services/url";
import { UpdateRequest } from "../../models/request/updateRequest";
import { Response } from '../../models/response';
import { ExceptionService } from "../../services/exceptionService";

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
  private options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
  }

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public popoverCtrl: PopoverController,
    private storeService: StoreService,
    private httpService: HttpService,
    private cookieService: CookieService,
    private toastCtrl: ToastController,
    private exceptionService: ExceptionService,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
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

  dismiss() {
    this.viewCtrl.dismiss();
  }

  goToProfilePic() {
    try
    {
      console.log('go to profile pic');
      this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        console.log(base64Image);
        this.UpdateUser(base64Image);
      }, (err) => {
        console.log(err);
        this.showToast(err);
        this.exceptionService.Add(err);
      });
    }
    catch(err) {
      this.showToast(err);
      this.exceptionService.Add(err);
    }
  }

  UpdateUser(picture: string) {
    let urlUpdate = url.UpdateUser();
    let obj: UpdateRequest = {
      Lang: params.Lang,
      UpdateType: UpdateType.Picture,
      Value: picture
    };
    let cookie = this.cookieService.GetAuthorizeCookie(urlUpdate, params.User)
    this.httpService.Post<UpdateRequest>(urlUpdate, obj, cookie).subscribe(
      resp => {
        let response = resp.json() as Response<Boolean>;
        if(response.HasError) {
          console.log(response.ErrorMessage);
          this.showToast(response.ErrorMessage);
        } else {
          this.User.Picture = params.User.Picture = picture;
          this.storeService.Set(KeyStore[KeyStore.User], params.User);
        }
      }
    )
  }

  goToAddFriend() {
    this.navCtrl.push(AddFriendPage);
  }

  goToFriendsList() {
    this.navCtrl.push(FriendsListPage);
  }

  showFriendsAddedMeList(evt) {
    let popover = this.popoverCtrl.create(PopoverFriendsAddedMePage, {friends:this.friendsAddedMe}, {cssClass: 'friends-added-me'});
    popover.present({
      ev: evt
    });
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

  showToast(message: string) :any {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    }).present();
  }

}
