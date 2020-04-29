import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  isLoggedIn = false;
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;
  }

}
