import { Injectable } from '@angular/core';
import { StoreService } from '../services/store.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    public storeService: StoreService
  ) { }

  getUser(): Promise<any> {
    return this.storeService.storage.get('User')
  }
}
