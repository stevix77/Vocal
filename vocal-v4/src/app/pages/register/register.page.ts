import { Component, OnInit } from '@angular/core';
import { RegisterRequest } from 'src/app/models/request/registerRequest';
import { CryptService } from 'src/app/services/crypt.service';
import { HttpService } from 'src/app/services/http.service';
import { url } from 'src/app/services/url';
import { params } from 'src/app/services/params';

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
    private cryptService: CryptService,
    private httpService: HttpService
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
      next: response => {
        console.log(response);
      },
      error: err => {
        console.error(err);
      }
    });
  }

}
