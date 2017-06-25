import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InscriptionUsernamePage } from '../inscription-username/inscription-username'
import { StoreService } from '../../services/storeService';
import { RegisterRequest } from '../../models/request/registerRequest';
import { ResourceResponse } from '../../models/response/ResourceResponse';

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
  resources: Array<ResourceResponse>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storeService: StoreService) {
    this.storeService.Get('resource').then(
      r => {
        if(r != null) {
          this.resources = r;
        }
      }
    )
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
