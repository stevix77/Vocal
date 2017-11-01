import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InscriptionFindFriendsPage } from '../inscription-find-friends/inscription-find-friends';
import { StoreService } from '../../services/storeService';
import {url} from '../../services/url';
import {HttpService} from '../../services/httpService';
import { RegisterRequest } from '../../models/request/registerRequest';
import { UserResponse } from '../../models/response/userResponse';
import { Response } from '../../models/response';
import { AppUser } from '../../models/appUser';
import {functions} from '../../services/functions';
import { params } from "../../services/params";

/**
 * Generated class for the InscriptionPasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-inscription-password',
  templateUrl: 'inscription-password.html',
  providers: [HttpService]
})
export class InscriptionPasswordPage {

  registerRequest: RegisterRequest;
  
  model = {
    Password: "",
    ErrorPassword: ""
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, private storeService: StoreService, private httpService: HttpService) {
    
  }

  submit(){
    if(this.model.Password.length >= 8) {
      let pwd = functions.Crypt(this.model.Password);
       this.registerRequest = this.navParams.get('registerRequest');
       this.registerRequest.Password = pwd;
       this.httpService.Post<RegisterRequest>(url.Register(), this.registerRequest).subscribe(
         resp => {
           let response = resp.json() as Response<UserResponse>;
           if(response.HasError) {

           } else {
            var appUser = new AppUser();
            appUser.Email = response.Data.Email;
            appUser.Id = response.Data.Id;
            appUser.Firstname = response.Data.Firstname;
            appUser.Lastname = response.Data.Lastname;
            appUser.Username = response.Data.Username;
            appUser.Token = functions.GenerateToken(response.Data.Username, this.model.Password);
            this.storeService.Set("user", appUser);
            params.User = appUser;
            this.navCtrl.push(InscriptionFindFriendsPage);
           }
         }
       )
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InscriptionPasswordPage');
  }

}
