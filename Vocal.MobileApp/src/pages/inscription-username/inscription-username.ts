import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InscriptionEmailPage } from '../inscription-email/inscription-email'

/**
 * Generated class for the InscriptionUsernamePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inscription-username',
  templateUrl: 'inscription-username.html',
})
export class InscriptionUsernamePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  submit(){
    this.navCtrl.push(InscriptionEmailPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InscriptionUsernamePage');
  }

}
