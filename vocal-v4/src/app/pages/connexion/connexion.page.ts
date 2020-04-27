import { Component, OnInit } from '@angular/core';
import { InitService } from 'src/app/services/init.service';
import { ToastController } from '@ionic/angular';
import { ExceptionService } from 'src/app/services/exception.service';
import { CryptService } from 'src/app/services/crypt.service';
import { params } from 'src/app/services/params';
import { Response } from 'src/app/models/response';
import { UserResponse } from 'src/app/models/response/userResponse';
import { InitResponse } from 'src/app/models/response/InitResponse';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

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
    // private router: Router
  ) { }

  ngOnInit() {
  }

}
