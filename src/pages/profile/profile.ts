import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppUser } from '../../models/appUser';
import { PictureType } from '../../models/enums';
import { params } from "../../services/params";

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  private User: AppUser;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    this.User = params.User;
    debugger;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  getPicture() {
    let picture = this.User.Pictures.find(x => x.Type == PictureType.Profil);
    return picture != null ? picture.Value : "";
  }

}
