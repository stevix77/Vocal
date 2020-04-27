import {Request} from './request';

export class DeleteMessageRequest extends Request {

    SentTime: Date;
    IdTalk: string;
    IdSender : string;
    IdMessages: Array<string>;

    constructor(idSender, idTalk, idMessages) {
        super();
        this.IdSender = idSender;
        this.IdTalk = idTalk;
        this.IdMessages = idMessages;
        this.SentTime =new Date();
    }
}