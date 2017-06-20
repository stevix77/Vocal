import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InscriptionEmailPage } from '../inscription-email/inscription-email'
import { StoreService } from '../../services/storeService';
import { UserService } from '../../services/userService';
import { params } from '../../services/params';
import { RegisterRequest } from '../../models/request/registerRequest';
import { Request } from '../../models/request/request';
import { ResourceResponse } from '../../models/response/resourceResponse';
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
  providers: [UserService]
})
export class InscriptionUsernamePage {
  registerRequest: RegisterRequest;
  resources: Array<ResourceResponse>;
  model = {
    Username: "",
    ErrorUsername: ""
  }
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private storeService: StoreService, private userService: UserService) {
    this.storeService.Get('resource').then(
      r => {
        if(r != null) {
          this.resources = r;
        }
      }
    )
  }

  submit(){
    if(this.model.Username != "") {
      let obj: Request = {
        Lang: params.Lang
      };
      this.userService.IsExistsUsername(this.model.Username, obj).subscribe(
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
