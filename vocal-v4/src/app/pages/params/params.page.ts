import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { async } from '@angular/core/testing';
import { Router } from '@angular/router';

@Component({
  selector: 'app-params',
  templateUrl: './params.page.html',
  styleUrls: ['./params.page.scss'],
})
export class ParamsPage implements OnInit {

  constructor(
    public alertController: AlertController,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async showConfirmLogout(){
    const alert = await this.alertController.create({
      header: 'Êtes-vous sûr de vouloir déconnecter ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Déconnexion',
          handler: async () => {
            await this.authService.logout();
            this.router.navigateByUrl('feed');
          }
        }
      ]
    });

    await alert.present();
  }

}
