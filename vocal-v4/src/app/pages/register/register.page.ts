import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
  }

}
