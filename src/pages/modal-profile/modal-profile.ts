import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController, PopoverController, Events } from 'ionic-angular';
import { SettingsPage } from '../../pages/settings/settings';
import { FriendsListPage } from '../../pages/friends-list/friends-list';
import { AddFriendPage } from '../../pages/add-friend/add-friend';
import { PopoverFriendsAddedMePage } from '../../pages/popover-friends-added-me/popover-friends-added-me';
import { AppUser } from '../../models/appUser';
import { params } from "../../services/params";
import { StoreService } from '../../services/storeService';
import { KeyStore, UpdateType, PictureType } from "../../models/enums";
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpService } from "../../services/httpService";
import { CookieService } from "../../services/cookieService";
import { url } from "../../services/url";
import { UpdateRequest } from "../../models/request/updateRequest";
import { Response } from '../../models/response';
import { ExceptionService } from "../../services/exceptionService";
import { PeopleResponse } from "../../models/response/peopleResponse";
import { FriendsService } from "../../services/friendsService";

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
  private totalDuration: number = 0;
  private options: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.PNG,
    mediaType: this.camera.MediaType.PICTURE,
    allowEdit: true,
    targetHeight: 800,
    targetWidth: 600
  }

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public events: Events,
    public popoverCtrl: PopoverController,
    private storeService: StoreService,
    private httpService: HttpService,
    private cookieService: CookieService,
    private exceptionService: ExceptionService,
    private friendsService: FriendsService,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    ) {
    this.User = params.User;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalProfilePage');
    this.storeService.Get(KeyStore[KeyStore.Settings]).then(settings => {
        if(settings.TotalDuration) this.totalDuration = settings.TotalDuration;
    });
  }

  ionViewWillEnter() {
    this.getContactAddedMe();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getPicture() {
    let picture = this.User.Pictures.find(x => x.Type == PictureType.Profil);
    return picture != null ? picture.Value : "";
  }

  getContactAddedMe() {
    try {
      this.friendsService.getContactAddedMe().subscribe(
        resp => {
          try {
            let response = resp.json() as Response<Array<PeopleResponse>>;
            if(response.HasError) {
              this.events.publish("Error", response.ErrorMessage);
            } else {
              this.friendsAddedMe = response.Data;
              this.CountFriendsAddedMe = this.friendsAddedMe.length;
            }
          } catch(err) {
            this.events.publish("Error", err.message);
            this.exceptionService.Add(err);
          }
        }
      );
    } catch(err) {
      this.events.publish("Error", err.message);
      this.exceptionService.Add(err);
    }
  }

  takePic(srcType) {
    this.options.sourceType = ('camera' == srcType) ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY;
    try
    {
      console.log('go to profile pic');
      this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
        let base64Image = 'data:image/png;base64,' + imageData;
        this.UpdateUser(base64Image);
      }, (err) => {
        console.log(err);
        this.events.publish("Error", err.message);
        this.exceptionService.Add(err);
      });
    }
    catch(err) {
      this.events.publish("Error", err.message);
      this.exceptionService.Add(err);
    }
  }

  UpdateUser(picture: string) {
    try {
      let urlUpdate = url.UpdateUser();
      let obj: UpdateRequest = {
        Lang: params.Lang,
        UpdateType: UpdateType.Picture,
        Value: picture
      };
      let cookie = this.cookieService.GetAuthorizeCookie(urlUpdate, params.User)
      this.httpService.Post<UpdateRequest>(urlUpdate, obj, cookie).subscribe(
        resp => {
          try {
            let response = resp.json() as Response<Boolean>;
            if(response.HasError) {
              console.log(response.ErrorMessage);
              this.events.publish("Error", response.ErrorMessage);
            } else {
              this.User.Pictures.find(x => x.Type == PictureType.Profil).Value = params.User.Pictures.find(x => x.Type == PictureType.Profil).Value = picture;
              this.storeService.Set(KeyStore[KeyStore.User], params.User);
            }
          } catch(err) {
            this.events.publish("Error", err.message);
            this.exceptionService.Add(err);
          }
        }
      )
    } catch(err) {
      this.events.publish("Error", err.message);
      this.exceptionService.Add(err);
    }
  }

  goToAddFriend() {
    this.navCtrl.push(AddFriendPage);
  }

  goToFriendsList() {
    this.navCtrl.push(FriendsListPage);
  }

  showFriendsAddedMeList(evt) {
    if(this.CountFriendsAddedMe > 0) {
      let popover = this.popoverCtrl.create(PopoverFriendsAddedMePage, {friends:this.friendsAddedMe}, {cssClass: 'friends-added-me'});
      popover.present({
        ev: evt
      });
    }
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
            this.takePic('camera');
          }
        },{
          text: 'Importer une photo',
          handler: () => {
            this.takePic('library');
          }
        },{
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }
}
