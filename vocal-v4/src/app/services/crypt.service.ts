import { Injectable } from '@angular/core';
import * as crypto from 'crypto-js';
import { params } from './params';

@Injectable({
  providedIn: 'root'
})
export class CryptService {

  constructor() { }

  generateToken(username, pwd) : string {
    let token = username + "@" + this.crypt(pwd) + "@" + params.Salt;
    token = this.crypt(token);
    return token;
  }

  crypt(str: string) : string {
      return crypto.HmacSHA256(str, str).toString();
  }
}
