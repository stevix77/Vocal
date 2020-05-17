import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  storage: Storage = new Storage(null);
  constructor() { }
  get(key: string): Promise<any>{
      return this.storage.get(key);
  }

  set(key: string, obj: any) {
      this.storage.set(key, obj);
  }

  remove(key: string) {
      this.storage.remove(key);
  }

  removeAll() {
      this.storage.keys().then(keys => {
          keys.forEach(k => this.remove(k));
      })
  }

  clear(): Promise<void> {
      return this.storage.clear();
  }
}
