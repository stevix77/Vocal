import { Component, OnInit } from '@angular/core';
import { CryptService } from 'src/app/services/crypt.service';
import { InitService } from 'src/app/services/init.service';

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
    private cryptService: CryptService,
    private initService: InitService
  ) {}
  ngOnInit() {
  }

  submitConnexion() {
    if(this.model.Username !== "" && this.model.Password !== "") {
      let pwd = this.cryptService.crypt(this.model.Password);
      this.initService.connexion(this.model.Username, pwd).subscribe({
        next: response => {
          console.log(response);
        },
        error: err => {
          console.error(err);
        }
      })
    }
  }

}
