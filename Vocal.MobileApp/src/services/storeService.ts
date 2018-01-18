import { Storage } from '@ionic/storage';
import { Injectable } from "@angular/core";

@Injectable()
export class StoreService {
    storage: Storage = new Storage(null);
    constructor() {
    }
    Get(key: string){
        return this.storage.get(key);
    }

    Set(key: string, obj: any) {
        this.storage.set(key, obj);
    }

    Remove(key: string) {
        this.storage.remove(key);
    }

    RemoveAll() {
        this.storage.keys().then(keys => {
            keys.forEach(k => this.Remove(k));
        })
    }

    Clear() {
        this.storage.clear();
    }
}