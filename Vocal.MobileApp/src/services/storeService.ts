import { Storage } from '@ionic/storage';

export class StoreService {
    constructor(private storage: Storage) {
    }
    Get<T>(key: string){
        return this.storage.get(key);
    }

    Set(key: string, obj: any) {
        this.storage.set(key, obj);
    }

    Remove(key: string) {
        this.storage.remove(key);
    }
}