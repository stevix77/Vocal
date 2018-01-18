import { StoreService } from './storeService';
import { Injectable } from "@angular/core";
import { KeyStore } from "../models/enums";
import { SettingsResponse } from "../models/response/settingsResponse";

/**
 * @description
 * @class
 */
@Injectable()
export class SettingsService {

  public settings: SettingsResponse;
  
  constructor(private storeService: StoreService) {
    this.load();
  }

  save() {
    this.storeService.Set(KeyStore[KeyStore.Settings], this.settings);
  }

  load() {
    return this.storeService.Get(KeyStore[KeyStore.Settings]).then(
      sett => {
        if(sett != null)
          this.settings = sett;
      }
    ).catch(error => {
      console.log(error);
      
    });
  }

  remove() {
    this.storeService.Remove(KeyStore[KeyStore.Settings]);
    this.settings = null;
  }

  

  clear(){
    this.settings = null;
  }
}
