import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppUser } from '../../models/appUser';
import { PictureType } from '../../models/enums';
import { params } from "../../services/params";
import { SettingsPage } from '../settings/settings';

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
  settingsPage: any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams
  ) {
    this.User = params.User;
    this.settingsPage = SettingsPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  getDuration(duration:number) {
    var date = new Date(null);
    date.setSeconds(duration);
    //return date.toISOString().substr(14, 5);
    return date;
  }

  getPicture() {
    let picture = this.User.Pictures.find(x => x.Type == PictureType.Profil);
    return picture != null ? picture.Value : "";
  }

}
