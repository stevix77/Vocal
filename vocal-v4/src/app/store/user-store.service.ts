import { Injectable } from '@angular/core';
import { StoreService } from '../services/store.service';
import { KeyStore } from '../models/enums';
import { UserResponse } from '../models/response/userResponse';

@Injectable({
  providedIn: 'root'
})
export class UserStoreService {
  constructor(
    public storeService: StoreService
  ) { }

  getUser(): Promise<any> {
    return this.storeService.storage.get(KeyStore[KeyStore.User])
  }

  setUser(user: UserResponse): Promise<any> {
    return this.storeService.storage.set(KeyStore[KeyStore.User], user);
  }

  async updateUser(field, value): Promise<any> {
    const user = await this.getUser();
    user[field] = value;
    return this.setUser(user);
  }
}
