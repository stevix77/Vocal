import { Component } from '@angular/core';
import { NavController, ToastController, Events } from 'ionic-angular';
import {params} from '../../services/params';
import { Response } from '../../models/response';
import { UserResponse } from '../../models/response/userResponse';
import {functions} from '../../services/functions';
import { VocalListPage } from '../vocal-list/vocal-list';
import { PasswordForgotPage } from '../passwordForgot/passwordForgot';
import { ExceptionService } from "../../services/exceptionService";
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
              private initService: InitService,
              private toastCtrl: ToastController, 
              private exceptionService: ExceptionService,
              private events: Events) {

                this.events.subscribe("InitDone", () => this.goToVocalListPage())
    
  }

  submitConnexion() {
    try {
      if(this.model.Username !== "" && this.model.Password !== "") {
        let pwd = functions.Crypt(this.model.Password);
        this.initService.connexion(this.model.Username, pwd).subscribe(
          resp => {
            try {
              var response = resp.json() as Response<UserResponse>;
              if(response.HasError) {
                this.events.publish("Error", response.ErrorMessage);
              } else {
                var appUser = this.initService.getAppUser(response.Data, this.model.Password); 
                params.User = appUser;
                //this.events.publish("Init");
              }
            } catch(err) {
              this.events.publish("Error", err.message);
              this.exceptionService.Add(err);
            }
          },
          error => {
            this.events.publish("Error", error.message);
            this.exceptionService.Add(error);
          }
        )
      } else {
        this.model.ErrorUsername = this.model.Username == "" ? params.Resources.find(x => x.Key == "UsernameEmpty").Value : "";
        this.model.ErrorPassword = this.model.Password == "" ? params.Resources.find(x => x.Key == "PasswordEmpty").Value : "";
      }
    } catch(err) {
      this.events.publish("Error", err.message);
      this.exceptionService.Add(err);
    }
  }

  goToVocalListPage() {
    this.navCtrl.push(VocalListPage);    
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
