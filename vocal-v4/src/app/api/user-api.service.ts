import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { url } from '../services/url';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(
    private http: HttpService
  ) { }

  getUser(userId: string, token: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(url.GetProfil(userId), token).subscribe({
        next: response => {
          resolve(response);
        },
        error: err => {
          reject(err);
        }
      })
    })
  }
}
