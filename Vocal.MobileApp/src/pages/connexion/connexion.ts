import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { AuthService } from '../../services/authService';
import { StoreService } from '../../services/storeService';
import {params} from '../../services/params';
import { Response } from '../../models/Response';
import { UserResponse } from '../../models/response/UserResponse';
import { LoginRequest } from '../../models/request/LoginRequest';
import { AppUser } from '../../models/AppUser';
import {functions} from '../../services/functions';
import { ResourceResponse } from '../../models/response/ResourceResponse';

@Component({
  selector: 'page-connexion',
  templateUrl: 'connexion.html',
  providers: [AuthService, StoreService]
})

export class Connexion {

  model = {
    Username: "",
    Password: "",
    ErrorUsername: "",
    ErrorPassword: ""
  };

  resources: Array<ResourceResponse>;

  constructor(public navCtrl: NavController, private authService: AuthService, private storeService: StoreService, private toastCtrl: ToastController) {
    this.storeService.Get('resource').then(
      r => {
        if(r != null) {
          this.resources = r;
        }
      }
    )
  }

  submitConnexion() {
    if(this.model.Username !== "" && this.model.Password !== "") {
      let pwd = functions.Crypt(this.model.Password);
      var obj = new LoginRequest(this.model.Username, pwd);
      obj.Lang = params.Lang;
      this.authService.Connect(obj).subscribe(
        resp => {
          var response = resp.json() as Response<UserResponse>;
          if(response.HasError) {
            this.showToast(response.ErrorMessage);
          } else {
            var appUser = new AppUser();
            appUser.Email = response.Data.Email;
            appUser.Id = response.Data.Id;
            appUser.FirstName = response.Data.Firstname;
            appUser.LastName = response.Data.Lastname;
            appUser.Username = response.Data.Username;
            appUser.Token = functions.GenerateToken(response.Data.Username, this.model.Password);
            this.storeService.Set("user", appUser);
            // this.navCtrl.push()
          }
        }
      )
    } else {
      this.model.ErrorUsername = this.model.Username == "" ? this.resources.find(x => x.Key == "UsernameEmpty").Value : "";
      this.model.ErrorPassword = this.model.Password == "" ? this.resources.find(x => x.Key == "PasswordEmpty").Value : "";
    }
  }

  // showToast(message: string, duration: number, position: string) {

  // }

  showToast(message: string) :any {
    this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    }).present();
  }
}
