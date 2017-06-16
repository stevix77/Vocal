import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PasswordForgotPage } from '../passwordForgot/passwordForgot'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  goToPasswordForgot1() {
    this.navCtrl.push(PasswordForgotPage);
  }

  goToPasswordForgot2(email) {
    this.navCtrl.push(PasswordForgotPage, {email: email});
  }

}
