import { TalkResponse } from './../models/response/talkResponse';
import { StoreService } from './storeService';
import { Injectable } from "@angular/core";
import { KeyStore } from "../models/enums";

/**
 * @description
 * @class
 */
@Injectable()
export class TalkService {

  public Talks: Array<TalkResponse>;

  constructor(private storeService: StoreService) {
    
  }

  SaveList() {
    this.storeService.Set(KeyStore.Talks.toString(), this.Talks);
  }

  LoadList() {
    return this.storeService.Get(KeyStore.Talks.toString()).then(
      talks => {
        this.Talks = talks;
      }
    ).catch(error => {
      console.log(error);
      
    });
  }

  UpdateList(talk: TalkResponse) {
    let t = this.Talks.find(x => x.Id == talk.Id);
    if(t == null) {
      this.Talks.unshift(talk);
    } else {
      let index = this.Talks.indexOf(t);
      t.Messages.push(talk.Messages[0]);
      this.Talks[index] = t;
    }
  }

}
