import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-inscription',
  templateUrl: 'inscription.html'
})
export class Inscription {

  constructor(public navCtrl: NavController) {

  }

  submit() {
    console.log('submit');
  }

}
