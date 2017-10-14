import { TalkResponse } from './../models/response/talkResponse';
import { StoreService } from './storeService';
import { Injectable } from "@angular/core";
import { KeyStore } from "../models/enums";
import { KeyValueResponse } from "../models/response/KeyValueResponse";
import { MessageResponse } from "../models/response/messageResponse";
  
/**
 * @description
 * @class
 */
@Injectable()
export class TalkService {

  public Talks: Array<TalkResponse> = null;
  // public Messages: Array<MessageResponse>;
  public Messages: Array<KeyValueResponse<string, Array<MessageResponse>>> = new Array<KeyValueResponse<string, Array<MessageResponse>>>();

  constructor(private storeService: StoreService) {
    this.LoadList();
  }

  SaveList() {
    this.storeService.Set(KeyStore[KeyStore.Talks], this.Talks);
  }

  LoadList() {
    return this.storeService.Get(KeyStore[KeyStore.Talks]).then(
      talks => {
        if(talks != null)
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
      this.Talks[index] = talk;
      this.Talks = this.SortTalks();
    }
    this.SaveList();
  }

  SortTalks() {
    let lst = this.Talks.sort(function(a,b) {
      return new Date(b.DateLastMessage).getTime() - new Date(a.DateLastMessage).getTime()
    });
    return lst;
  }

  GetMessages(talkId) {
    return this.storeService.Get(KeyStore[KeyStore.Messages]).then(
      obj => {
        if(obj != null) {
          this.Messages = obj;
        }
      }
    ).catch(error => {
      console.log(error);
      
    });
  }

  SaveMessages(talkId: string, messages: Array<MessageResponse>) {
    let talkMessage = this.Messages.find(x => x.Key == talkId);
    if(talkMessage != null)
      talkMessage.Value = messages;
    else {
      let mess = new KeyValueResponse<string, Array<MessageResponse>>();
      mess.Key = talkId;
      mess.Value = messages;
      this.Messages.push(mess);
    }
    this.storeService.Set(KeyStore[KeyStore.Messages], this.Messages)
  }
}
