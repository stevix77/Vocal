import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InscriptionUsernamePage } from '../inscription-username/inscription-username'
import { RegisterRequest } from '../../models/request/registerRequest';

/**
 * Generated class for the InscriptionBirthdayPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inscription-birthday',
  templateUrl: 'inscription-birthday.html'
})
export class InscriptionBirthdayPage {

  model = {
    BirthdayDate: new Date(),
    BirthdayDateString: "",
    ErrorBirthdayDate: ""
  }
  registerRequest: RegisterRequest;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  submit(){
    this.model.BirthdayDate = new Date(this.model.BirthdayDateString)
    this.registerRequest = this.navParams.get('registerRequest');
    this.registerRequest.BirthdayDate = this.model.BirthdayDate;
    this.navCtrl.push(InscriptionUsernamePage, {'registerRequest': this.registerRequest});
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad InscriptionBirthdayPage');
  }

}
