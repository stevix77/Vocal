import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

/**
 * Generated class for the FriendsListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-friends-list',
  templateUrl: 'friends-list.html',
})
export class FriendsListPage {

  constructor(public navCtrl: NavController, 
    public alertCtrl: AlertController,
    public navParams: NavParams) {
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Supprimer un contact',
      message: 'Êtes-vous sûr de vouloir supprimer ce contact ?',
      buttons: [
        {
          text: 'Non',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Oui',
          handler: () => {
            this.deleteContact();
          }
        }
      ]
    });
    confirm.present();
  }

  deleteContact() {
    console.log('delete');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsListPage');
  }

}
