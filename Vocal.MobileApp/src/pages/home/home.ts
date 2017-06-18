import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import { PasswordForgotPage } from '../passwordForgot/passwordForgot'
import { Connexion } from '../connexion/connexion'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  goToConnexion() {
    this.navCtrl.push(Connexion);
  };

  // goToPasswordForgot1() {
  //   this.navCtrl.push(PasswordForgotPage);
  // }

  // goToPasswordForgot2(email) {
  //   this.navCtrl.push(PasswordForgotPage, {email: email});
  // }

}
