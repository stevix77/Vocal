import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InscriptionPasswordPage } from '../inscription-password/inscription-password'
import {url} from '../../services/url';
import {HttpService} from '../../services/httpService';
import { params } from '../../services/params';
import { RegisterRequest } from '../../models/request/registerRequest';
import { UserExistsRequest } from '../../models/request/UserExistsRequest';
import { Response } from '../../models/response';

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
  providers: [HttpService]
})
export class InscriptionEmailPage {

  registerRequest: RegisterRequest;
  model = {
    Email: "",
    ErrorEmail: ""
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpService) {
  }

  submit(){
    if(this.model.Email != "") {
      let obj: UserExistsRequest = {
        Lang: params.Lang,
        Value: this.model.Email
      };
      this.httpService.Post<UserExistsRequest>(url.IsExistsEmail(), obj).subscribe(
        resp => {
          let response = resp.json() as Response<boolean>;
          if(response.HasError && response.Data) {
            this.model.ErrorEmail = response.ErrorMessage;
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          } else if(response.HasError && !response.Data) {

          } else {
            this.registerRequest = this.navParams.get('registerRequest');
            this.registerRequest.Email = this.model.Email;
            this.navCtrl.push(InscriptionPasswordPage, {'registerRequest': this.registerRequest});
          }
        }
      )
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InscriptionEmailPage');
  }

}
