import { Component, OnInit } from "@angular/core";
import { NavController } from 'ionic-angular';
import {url} from '../../services/url';
import {HttpService} from '../../services/httpService';
import {params} from '../../services/params';
import { Response } from '../../models/response';
import { PasswordRequest } from '../../models/request/passwordRequest';
import { PasswordForgotValidationPage } from '../password-forgot-validation/password-forgot-validation';
import { ToastController } from 'ionic-angular';

@Component({
  selector: "app-passwordForgot",
  templateUrl: "./passwordForgot.html",
  providers: [HttpService]
})

export class PasswordForgotPage implements OnInit {
  
  model = {
    Email: "",
    ErrorEmail: ""
  }

  constructor(private navCtrl: NavController, private httpService: HttpService, private toastCtrl: ToastController) { 
  }

  ngOnInit() {

  }

  Submit() {
    var request: PasswordRequest = {
      Lang: params.Lang,
      Email: this.model.Email
    };
    var response = this.httpService.Post<PasswordRequest>(url.AskPwd(), request);
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
