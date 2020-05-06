import { Component, OnInit } from '@angular/core';
import { RegisterRequest } from 'src/app/models/request/registerRequest';
import { CryptService } from 'src/app/services/crypt.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  model = {
    BirthdayDate: new Date(),
    BirthdayDateString: "",
    ErrorBirthdayDate: "",
    Email: "",
    ErrorEmail: "",
    Password: "",
    ErrorPassword: ""
  }
  registerRequest: RegisterRequest;
  constructor(private cryptService: CryptService) { }

  ngOnInit() {
  }

  submit() {
    this.model.BirthdayDate = new Date(this.model.BirthdayDateString)
    this.registerRequest.BirthdayDate = this.model.BirthdayDate;
    this.registerRequest.Email = this.model.Email;
    const pwd = this.cryptService.crypt(this.model.Password);
    this.registerRequest.Password = pwd;
  }

}
