import { Component, OnInit } from '@angular/core';
import { RegisterRequest } from 'src/app/models/request/registerRequest';
import { CryptService } from 'src/app/services/crypt.service';
import { HttpService } from 'src/app/services/http.service';
import { url } from 'src/app/services/url';
import { params } from 'src/app/services/params';
import { UserResponse } from 'src/app/models/response/userResponse';
import { Response } from 'src/app/models/response';
import { AppUser } from 'src/app/models/appUser';
import { StoreService } from 'src/app/services/store.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  model = {
    BirthdayDate: undefined,
    BirthdayDateString: "",
    ErrorBirthdayDate: "",
    Email: "",
    ErrorEmail: "",
    Password: "",
    ErrorPassword: ""
  }
  registerRequest: RegisterRequest = new RegisterRequest();
  constructor(
    private authService: AuthService,
    private cryptService: CryptService,
    private httpService: HttpService,
    private storeService: StoreService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  submit() {
    this.model.BirthdayDate = new Date(this.model.BirthdayDateString)
    this.registerRequest.BirthdayDate = this.model.BirthdayDate;
    this.registerRequest.Email = this.model.Email;
    const pwd = this.cryptService.crypt(this.model.Password);
    this.registerRequest.Password = pwd;
    this.registerRequest.Lang = params.Lang;

    this.httpService.post<RegisterRequest>(url.Register(), this.registerRequest).subscribe({
      next: (response:UserResponse) => {
        let appUser = new AppUser();
        appUser.email = response.email;
        appUser.id = response.id;
        appUser.firstname = response.firstname;
        appUser.lastname = response.lastname;
        appUser.username = response.username;
        appUser.token = response.token;
        this.storeService.set("user", appUser);
        params.User = appUser;
        this.authService.isLoggedIn = true;
        this.router.navigateByUrl('/profile');
      },
      error: err => {
        console.error(err);
      }
    });
  }

}
