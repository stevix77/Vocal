import { Component, OnInit } from "@angular/core";
import { NavParams } from 'ionic-angular';
import { AuthService } from '../../services/authService';
//import {MyApp} from '../../app/app.component';

@Component({
  selector: "app-passwordForgot",
  templateUrl: "./passwordForgot.html",
  providers: [AuthService]
})

export class PasswordForgotPage implements OnInit {
  
  Email: string;

  constructor(private navParams: NavParams, /*private myApp: MyApp,*/ private authService: AuthService) { 
    this.Email = this.navParams.get("email");
  }

  ngOnInit() {

  }

  submit() {
    var request = {
      //Lang: this.myApp.Lang,
      Email: this.Email
    };
    var response = this.authService.askPasswordForgot(request);
    response.subscribe(
      resp => {

      },
      error => console.log(error),
      () => {}
    )
  }
}
