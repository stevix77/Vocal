import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Connexion } from '../connexion/connexion';

/**
 * Generated class for the PasswordForgotValidationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-password-forgot-validation',
  templateUrl: 'password-forgot-validation.html',
})
export class PasswordForgotValidationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goToConnexion() {
    this.navCtrl.push(Connexion);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordForgotValidationPage');
  }

}
