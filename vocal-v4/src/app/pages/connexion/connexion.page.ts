import { Component, OnInit } from '@angular/core';
import { CryptService } from 'src/app/services/crypt.service';
import { AuthService } from 'src/app/auth/auth.service';
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
    private cryptService: CryptService,
    private authService: AuthService,
    private router: Router
  ) {}
  ngOnInit() {
  }

  async submitConnexion() {
    if(this.model.Username !== "" && this.model.Password !== "") {
      let pwd = this.cryptService.crypt(this.model.Password);
      try {
        const isLogged = await this.authService.login(this.model.Username, pwd);
        if(!isLogged) {
          console.error('afficher les erreurs de login');
        } else {
          this.router.navigate(['/feed']);
        }
      } catch(e){
        console.error(e);
      }
    }
  }

}
