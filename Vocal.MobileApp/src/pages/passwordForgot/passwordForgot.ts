import { Component, OnInit } from "@angular/core";
import { NavParams, NavController } from 'ionic-angular';
import { AuthService } from '../../services/authService';
import {params} from '../../services/params';
import { Response } from '../../models/Response';
import { PasswordForgotValidationPage } from '../password-forgot-validation/password-forgot-validation';
import { ToastController } from 'ionic-angular';

@Component({
  selector: "app-passwordForgot",
  templateUrl: "./passwordForgot.html",
  providers: [AuthService]
})

export class PasswordForgotPage implements OnInit {
  
  model = {
    Email: "",
    ErrorEmail: ""
  }

  constructor(private navCtrl: NavController, private navParams: NavParams, private authService: AuthService, private toastCtrl: ToastController) { 
  }

  ngOnInit() {

  }

  Submit() {
    var request = {
      Lang: params.Lang,
      Email: this.model.Email
    };
    var response = this.authService.askPasswordForgot(request);
    response.subscribe(
      resp => {
          var data = resp.json() as Response<any>;
          if(data.HasError || (!data.HasError && !data.Data)) {
            this.toastCtrl.create({
              message: data.ErrorMessage,
              duration: 3000,
              position: 'top'
            }).present();
          }else if(data.Data) {
            this.navCtrl.push(PasswordForgotValidationPage);
          }
      },
      error => console.log(error),
      () => {}
    )
  }
}
