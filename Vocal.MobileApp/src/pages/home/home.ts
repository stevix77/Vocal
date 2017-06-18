import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Connexion } from '../connexion/connexion'
import { Inscription } from '../inscription/inscription'

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

  goToInscription() {
    this.navCtrl.push(Inscription);
  }

}
