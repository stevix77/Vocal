import { Injectable } from '@angular/core';
import { StoreService } from '../services/store.service';
import { KeyStore } from '../models/enums';

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
}
