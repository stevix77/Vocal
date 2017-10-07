import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import { SettingsPage } from '../../pages/settings/settings';
import { FriendsListPage } from '../../pages/friends-list/friends-list';
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
    private storeService: StoreService,
    private httpService: HttpService,
    private cookieService: CookieService,
    private toastCtrl: ToastController,
    private exceptionService: ExceptionService,
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

  showToast(message: string) :any {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    }).present();
  }

}
