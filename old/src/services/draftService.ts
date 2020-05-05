import { Injectable } from "@angular/core";
import { StoreService } from "./storeService";
import { KeyValueResponse } from "../models/response/keyValueResponse";
import { KeyStore } from "../models/enums";

/**
 * @description
 * @class
 */
@Injectable()
export class DraftService {
  private lstDraft: Array<KeyValueResponse<string, string>> = new Array<KeyValueResponse<string, string>>();
  constructor(private storeService: StoreService) {
    
  }

  getDraft(talkId: string, userId: string) {
    return this.lstDraft.find(x => x.Key == talkId || x.Key == userId);
  }

  setDraft(talkId: string, userId: string, str: string) {
    let d = this.getDraft(talkId, userId);
    if(d == null) {
      let draft = new KeyValueResponse<string, string>();
      draft.Key = talkId != null ? talkId : userId;
      draft.Value = str;
      this.lstDraft.push(draft);
    } else {
      d.Value = str;
    }
    this.save();
  }

  removeDraft(talkId: string, userId: string) {
    let draft = this.getDraft(talkId, userId);
    if(draft != null) {
      let index = this.lstDraft.findIndex(x => x.Key == talkId || x.Key == userId);
      if(index != -1) {
        this.lstDraft.splice(index, 1);
        this.save();
      }
    }
  }

  private save() {
    this.storeService.Set(KeyStore[KeyStore.Draft], this.lstDraft);
  }
  
  init() {
    this.storeService.Get(KeyStore[KeyStore.Draft]).then(lst => {
      if(lst != null) {
        this.lstDraft = lst;
      }
    });
  }

}
