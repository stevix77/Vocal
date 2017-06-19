import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InscriptionFindFriendsPage } from '../inscription-find-friends/inscription-find-friends';

/**
 * Generated class for the InscriptionPasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inscription-password',
  templateUrl: 'inscription-password.html',
})
export class InscriptionPasswordPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  submit(){
    this.navCtrl.push(InscriptionFindFriendsPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InscriptionPasswordPage');
  }

}
