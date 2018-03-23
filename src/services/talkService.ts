import { TalkResponse } from './../models/response/talkResponse';
import { StoreService } from './storeService';
import { Injectable } from "@angular/core";
import { KeyStore } from "../models/enums";
import { KeyValueResponse } from "../models/response/keyValueResponse";
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
    this.loadListMessages();
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

  loadListMessages() {
    this.storeService.Get(KeyStore[KeyStore.Messages]).then(
      mess => {
        if(mess != null)
          this.Messages = mess;
      }
    ).catch(error => {
      console.log(error);
    });
  }

  DeleteTalk(talkId: string) {
    let tIndex = this.Talks.findIndex(x => x.Id == talkId);
    if(tIndex >= 0){
      this.Talks.splice(tIndex, 1);
      this.SaveList();
    } else {
      console.log('No talk to delete found');
    }
  }

  DeleteMessages(talkId) {
    let index = this.Messages.findIndex(x => x.Key == talkId);
    if(index >= 0) {
      this.Messages.splice(index, 1);
      this.saveMessages();
    }
  }

  UpdateList(talk: TalkResponse) {
    let index = this.Talks.findIndex(x => x.Id == talk.Id);
    if(index == -1) {
      this.Talks.unshift(talk);
    } else {
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
    let obj = this.Messages.find(x => x.Key == talkId);
    if(obj != null)
      return obj.Value;
    else
      return new Array<MessageResponse>();
  }

  SaveMessages(talkId: string, messages: Array<MessageResponse>) {
    let talk = this.Talks.findIndex(x => x.Id == talkId);
    if(talk != -1)
    {
      let obj = this.Messages.find(x => x.Key == talkId);
      if(obj == null) {
        obj = new KeyValueResponse<string, Array<MessageResponse>>();
        obj.Key = talkId;
        obj.Value = messages;
        this.Messages.push(obj);
      } else {
        obj.Value = messages;
        this.Messages.find(x => x.Key == talkId).Value = messages;
      }
      this.storeService.Set(KeyStore[KeyStore.Messages], this.Messages)
    }  
    
  }

  saveMessages() {
    this.storeService.Set(KeyStore[KeyStore.Talks], this.Messages);
  }

  getTalk(talkId: string) {
    return this.Talks.find(x => x.Id == talkId);
  }

  insertTalk(talk: TalkResponse) {
    this.Talks.unshift(talk);
    this.SaveList();
  }

  updateTalk(talk: TalkResponse) {
    let index = this.Talks.findIndex(x => x.Id == talk.Id);
    this.Talks[index] = talk;
    this.Talks = this.SortTalks();
    this.SaveList();
  }
  
  insertMessage(talkId: string, message: MessageResponse){
    if(this.Messages.some(x => x.Key == talkId)) {
      let m = this.Messages.find(x => x.Key == talkId);
      m.Value.push(message);
    } else {
      let m = new KeyValueResponse<string, Array<MessageResponse>>();
      m.Key = talkId;
      m.Value = new Array<MessageResponse>();
      m.Value.push(message);
      this.Messages.push(m);
    }
    this.saveMessages();
  }

  Clear(){
    this.Talks = null;
    this.Messages = null;
  }
}
