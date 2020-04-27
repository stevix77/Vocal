import { Component, OnInit } from '@angular/core';
import { InitService } from 'src/app/services/init.service';
import { ToastController } from '@ionic/angular';
import { ExceptionService } from 'src/app/services/exception.service';
import { CryptService } from 'src/app/services/crypt.service';
import { params } from 'src/app/services/params';
import { Response } from 'src/app/models/response';
import { UserResponse } from 'src/app/models/response/userResponse';
import { InitResponse } from 'src/app/models/response/InitResponse';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.page.html',
  styleUrls: ['./connexion.page.scss'],
})
export class ConnexionPage implements OnInit {

  model = {
    Username: "",
    Password: "",
    ErrorUsername: "",
    ErrorPassword: ""
  };

  constructor(
    private initService: InitService,
    private toastCtrl: ToastController, 
    private exceptionService: ExceptionService,
    private cryptService: CryptService
  ) { }

  ngOnInit() {
  }

  submitConnexion() {
    
    try {
      if(this.model.Username !== "" && this.model.Password !== "") {
        let pwd = this.cryptService.crypt(this.model.Password);
        this.initService.connexion(this.model.Username, pwd).subscribe(
          resp => {
            try {
              var response = resp.json() as Response<UserResponse>;
              if(response.HasError) {
                this.events.publish("Error", response.ErrorMessage);
              } else {
                var appUser = this.initService.getAppUser(response.Data, this.model.Password); 
                params.User = appUser;
                this.initService.init().subscribe(
                  resp => {
                    let response = resp.json() as Response<InitResponse>;
                    this.initService.manageData(response);
                    this.events.publish("subscribeHub");
                    this.navCtrl.push(FeedPage);
                  },
                  error => {
                    this.events.publish("ErrorInit", error);
                    this.exceptionService.Add(error);
                  }
                ); 
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

}
