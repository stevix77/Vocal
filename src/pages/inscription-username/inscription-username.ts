import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InscriptionEmailPage } from '../inscription-email/inscription-email'
import {url} from '../../services/url';
import {HttpService} from '../../services/httpService';
import { params } from '../../services/params';
import { UserExistsRequest } from '../../models/request/userExistsRequest';
import { RegisterRequest } from '../../models/request/registerRequest';
import { Response } from '../../models/response';

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
  providers: [HttpService]
})
export class InscriptionUsernamePage {
  registerRequest: RegisterRequest;
  model = {
    Username: "",
    ErrorUsername: ""
  }
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpService) {
    
  }

  submit(){
    if(this.model.Username != "") {
      let obj = new UserExistsRequest();
      obj.Lang = params.Lang,
      obj.Value = this.model.Username;
      this.httpService.Post<UserExistsRequest>(url.IsExistsUsername(), obj).subscribe(
        resp => {
          let response = resp.json() as Response<boolean>;
          if(response.HasError && response.Data) {
            this.model.ErrorUsername = response.ErrorMessage;
          } else if(response.HasError && !response.Data) {

          } else {
            this.registerRequest = this.navParams.get('registerRequest');
            this.registerRequest.Username = this.model.Username;
            this.navCtrl.push(InscriptionEmailPage, {'registerRequest': this.registerRequest});
          }
        }
      )
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InscriptionUsernamePage');
  }

}
