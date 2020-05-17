import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';
import { HttpService } from '../services/http.service';
import { LoginRequest } from '../models/request/loginRequest';
import { params } from '../services/params';
import { url } from '../services/url';
import { resolve } from 'url';
import { UserResponse } from '../models/response/userResponse';
import { StoreService } from '../services/store.service';
import { KeyStore } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  redirectUrl: string;

  constructor(
    private httpService: HttpService,
    private storeService: StoreService
  ) {}
  
  login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const obj = new LoginRequest(username, password);
      obj.Lang = params.Lang;
      let urlConnect = url.Signin();
      this.httpService.post<LoginRequest>(urlConnect, obj).subscribe(
      (user: UserResponse) => {
        if(user.token) {
          this.isLoggedIn = true;
          this.storeService.set(KeyStore[KeyStore.User], user);
          resolve(true);
        } else {
          resolve(false);
        }
      },
      (err) => {
        reject(err);
      })
    })
  }

  logout(): Promise<void> {
    this.isLoggedIn = false;
    params.User = null;
    return this.storeService.clear();
  }
}
