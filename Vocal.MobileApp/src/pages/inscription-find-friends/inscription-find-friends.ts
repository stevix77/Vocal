import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VocalListPage } from '../vocal-list/vocal-list';

/**
 * Generated class for the InscriptionFindFriendsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inscription-find-friends',
  templateUrl: 'inscription-find-friends.html',
})
export class InscriptionFindFriendsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  getAccess(){
    console.log('popin autorisation accès contacts');
    this.navCtrl.push(VocalListPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InscriptionFindFriendsPage');
  }

}
