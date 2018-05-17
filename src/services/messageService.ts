import { Injectable } from "@angular/core";
import { CookieService } from "./cookieService";
import { HttpService } from "./httpService";
import { params } from "../services/params";
import { url } from "../services/url";
import { SendMessageRequest } from "../models/request/sendMessageRequest";
import { GetMessagesRequest } from "../models/request/getMessagesRequest";
import { DeleteTalkRequest } from "../models/request/deleteTalkRequest";
import { ArchiveTalkRequest } from "../models/request/archiveTalkRequest";
import { DeleteMessageRequest } from "../models/request/deleteMessageRequest";

/**
 * @description
 * @class
 */
@Injectable()
export class MessageService {

  constructor(private httpService: HttpService,
              private cookieService: CookieService) {
  }

  getTalkList() {
    let request = {Lang: params.Lang, UserId: params.User.Id}
    let urlTalks = url.GetTalkList();
    let cookie = this.cookieService.GetAuthorizeCookie(urlTalks, params.User);
    return this.httpService.Post(urlTalks, request, cookie);
  }

  sendMessage(idTalk: string, messageType: number, recipients: Array<string>, duration: number, content: string) {
    let date = new Date();
    let request: SendMessageRequest = {
      content: content,
      duration: duration,
      sentTime: date,
      idsRecipient: recipients,
      messageType: messageType,
      Lang: params.Lang,
      idSender: params.User.Id,
      IdTalk: idTalk,
      platform: params.Platform
    };
    let urlSendVocal = url.SendMessage();
    let cookie = this.cookieService.GetAuthorizeCookie(urlSendVocal, params.User)
    return this.httpService.Post(urlSendVocal, request, cookie);
  }

  getMessages(talkId: string, dt) {
    let urlMessages = url.GetMessages();
    let cookie = this.cookieService.GetAuthorizeCookie(urlMessages, params.User);
    let request: GetMessagesRequest = {Lang: params.Lang, LastMessage: dt, TalkId: talkId};
    return this.httpService.Post(urlMessages, request, cookie);
  }

  deleteTalk(talkId: string) {
    let request: DeleteTalkRequest = {
      Lang: params.Lang,
      IdSender: params.User.Id,
      IdTalk: talkId,
      SentTime: new Date()
    };
    let urlDelete = url.DeleteTalk();
    let cookie = this.cookieService.GetAuthorizeCookie(urlDelete, params.User);
    return this.httpService.Post<DeleteTalkRequest>(urlDelete, request, cookie);
  }

  archiveTalk(id) {
    let request: ArchiveTalkRequest = {
      Lang: params.Lang,
      IdSender: params.User.Id,
      IdTalk: id,
      SentTime: new Date()
    };
    let urlArchive = url.ArchiveTalk();
    let cookie = this.cookieService.GetAuthorizeCookie(urlArchive, params.User);
    return this.httpService.Post<DeleteTalkRequest>(urlArchive, request, cookie);
  }

  deleteMessage(idMessages: Array<string>) {
    let request: DeleteMessageRequest = {
      Lang: params.Lang,
      IdSender: params.User.Id,
      IdTalk: "",
      IdMessages: idMessages,
      SentTime: new Date()
    };
    let urlDelete = url.DeleteMessage();
    let cookie = this.cookieService.GetAuthorizeCookie(urlDelete, params.User);
    return this.httpService.Post<DeleteTalkRequest>(urlDelete, request, cookie);
  }
}
