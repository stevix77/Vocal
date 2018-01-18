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

  public Talks: Array<TalkResponse> = new Array<TalkResponse>();
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

  DeleteTalk(talk: TalkResponse) {
    let tIndex = this.Talks.findIndex(x => x.Id == talk.Id);
    if(tIndex >= 0){
      this.Talks.splice(tIndex, 1);
      this.SaveList();
    } else {
      console.log('No talk to delete found');
    }
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

  GetMessages(talkId: string) : Array<MessageResponse> {
    let talk = this.Talks.find(x => x.Id == talkId);
    return talk != null && talk.Messages != null ? talk.Messages : new Array<MessageResponse>();
  }

  SaveMessages(talkId: string, messages: Array<MessageResponse>) {
    let talk = this.Talks.findIndex(x => x.Id == talkId);
    if(talk != -1)
    {
      this.Talks[talk].Messages = messages;
      this.storeService.Set(KeyStore[KeyStore.Talks], this.Talks)
    }  
    
  }

  Clear(){
    this.Talks = null;
    this.Messages = null;
  }
}
