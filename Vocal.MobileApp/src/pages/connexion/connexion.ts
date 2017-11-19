import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { StoreService } from '../../services/storeService';
import {params} from '../../services/params';
import { Response } from '../../models/Response';
import { UserResponse } from '../../models/response/UserResponse';
import { LoginRequest } from '../../models/request/LoginRequest';
import { AppUser } from '../../models/appUser';
import {functions} from '../../services/functions';
import {url} from '../../services/url';
import {HttpService} from '../../services/httpService';

import { VocalListPage } from '../vocal-list/vocal-list';
import { PasswordForgotPage } from '../passwordForgot/passwordForgot';
import { ExceptionService } from "../../services/exceptionService";
import { KeyStore } from "../../models/enums";
import { InitService } from "../../services/initService";

@Component({
  selector: 'page-connexion',
  templateUrl: 'connexion.html'
})

export class Connexion {

  model = {
    Username: "",
    Password: "",
    ErrorUsername: "",
    ErrorPassword: ""
  };

  constructor(public navCtrl: NavController, 
              private httpService: HttpService, 
              private storeService: StoreService,
              private initService: InitService,
              private toastCtrl: ToastController, 
              private exceptionService: ExceptionService) {
    
  }

  submitConnexion() {
    if(this.model.Username !== "" && this.model.Password !== "") {
      let pwd = functions.Crypt(this.model.Password);
      var obj = new LoginRequest(this.model.Username, pwd);
      obj.Lang = params.Lang;
      let urlConnect = url.Login();
      this.httpService.Post<LoginRequest>(urlConnect, obj).subscribe(
        resp => {
          var response = resp.json() as Response<UserResponse>;
          if(response.HasError) {
            this.showToast(response.ErrorMessage);
          } else {
            var appUser = new AppUser();
            appUser.Email = response.Data.Email;
            appUser.Id = response.Data.Id;
            appUser.Firstname = response.Data.Firstname;
            appUser.Lastname = response.Data.Lastname;
            appUser.Username = response.Data.Username;
            appUser.Picture = response.Data.Picture;
            appUser.Token = functions.GenerateToken(response.Data.Username, this.model.Password);
            this.storeService.Set(KeyStore[KeyStore.User], appUser);
            params.User = appUser;
            this.initService.init();
            this.navCtrl.push(VocalListPage);
          }
        },
        error => {
          console.log(error);
          this.showToast(error);
          this.exceptionService.Add(error);
        }
      )
    } else {
      this.model.ErrorUsername = this.model.Username == "" ? params.Resources.find(x => x.Key == "UsernameEmpty").Value : "";
      this.model.ErrorPassword = this.model.Password == "" ? params.Resources.find(x => x.Key == "PasswordEmpty").Value : "";
    }
  }

  goToForgotPassword() {
    this.navCtrl.push(PasswordForgotPage);
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
