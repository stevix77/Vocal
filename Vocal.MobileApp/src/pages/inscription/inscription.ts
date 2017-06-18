import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InscriptionBirthdayPage } from '../inscription-birthday/inscription-birthday'


@Component({
  selector: 'page-inscription',
  templateUrl: 'inscription.html'
})
export class Inscription {

  constructor(public navCtrl: NavController) {

  }

  submit() {
    this.navCtrl.push(InscriptionBirthdayPage);
  }

}
