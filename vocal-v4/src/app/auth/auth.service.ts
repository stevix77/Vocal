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
import { UserApiService } from '../api/user-api.service';
import { SigninResponse } from '../models/response/signinResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  redirectUrl: string;

  constructor(
    private http: HttpService,
    private store: StoreService,
    private userApi: UserApiService
  ) {}
  
  login(login: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const params = {
        login,
        password
      }
      this.http.post(url.Signin(), params).subscribe(
      async (response: SigninResponse) => {
        this.isLoggedIn = true;
        await this.store.set(KeyStore[KeyStore.Token], response.token);
        try {
          await this.userApi.getUser(response.id, response.token);
          resolve(true);
        } catch(err) {
          reject(err);
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
    return this.store.clear();
  }
}
