import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InscriptionPasswordPage } from '../inscription-password/inscription-password'

/**
 * Generated class for the InscriptionEmailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inscription-email',
  templateUrl: 'inscription-email.html',
})
export class InscriptionEmailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  submit(){
    this.navCtrl.push(InscriptionPasswordPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InscriptionEmailPage');
  }

}
