import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { UserResponse } from 'src/app/models/response/userResponse';
import { UserStoreService } from 'src/app/store/user-store.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  isLoggedIn = false;
  user: UserResponse;

  constructor(
    private authService: AuthService,
    private userStoreService: UserStoreService
  ) { }

  ngOnInit() {
    this.userStoreService.getUser()
      .then(user => {user})
  }
  
  ionViewWillEnter() {
    this.isLoggedIn = this.authService.isLoggedIn;
  }

}
