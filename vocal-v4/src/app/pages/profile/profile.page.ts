import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { UserService } from 'src/app/store/user.service';
import { UserResponse } from 'src/app/models/response/userResponse';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  isLoggedIn = false;
  user: UserResponse
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getUser()
      .then(user => {user})
  }
  
  ionViewWillEnter() {
    this.isLoggedIn = this.authService.isLoggedIn;
  }

}
