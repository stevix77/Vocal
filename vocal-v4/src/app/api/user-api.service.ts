import { Injectable } from '@angular/core';
import { HttpService } from '../services/http.service';
import { url } from '../services/url';
import { StoreService } from '../services/store.service';
import { KeyStore } from '../models/enums';
import { UserResponse } from '../models/response/userResponse';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(
    private http: HttpService,
    private store: StoreService
  ) { }

  getUser(userId: string, token: string): Promise<UserResponse> {
    return new Promise((resolve, reject) => {
      this.http.get(url.GetProfil(userId), token).subscribe({
        next: async (user: UserResponse) => {
          await this.store.set(KeyStore[KeyStore.User], user);
          resolve(user);
        },
        error: err => {
          reject(err);
        }
      })
    })
  }

 async updateUserField(type: number, value): Promise<boolean> {
    const token = await this.store.get(KeyStore[KeyStore.Token]);
    const user = await this.store.get(KeyStore[KeyStore.User]);
    return new Promise((resolve, reject) => {
      this.http.post(url.UpdateUser(), { updateType: type, value }, token)
        .subscribe({
          next: async () => {
            await this.getUser(user.id, token);
            resolve(true);
          },
          error: err => {
            reject(err);
          }
        })
    })
  }
}
