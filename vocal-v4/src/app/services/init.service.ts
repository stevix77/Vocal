import { Injectable } from '@angular/core';
import { LoginRequest } from '../models/request/loginRequest';
import { params } from './params';
import { url } from './url';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  constructor(
    private httpService: HttpService
  ) {}
  connexion(username: string, password: string) {
    var obj = new LoginRequest(username, password);
    obj.Lang = params.Lang;
    let urlConnect = url.Signin();
    return this.httpService.post<LoginRequest>(urlConnect, obj);
  }
}
