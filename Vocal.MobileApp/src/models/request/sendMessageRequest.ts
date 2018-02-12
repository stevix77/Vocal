import {Request} from './Request';

export class SendMessageRequest extends Request {

    content : string;
    sentTime: Date;
    duration: number;
    platform: number;
    IdTalk: string;
    messageType : number;
    idSender : string;
    idsRecipient : Array<string> = [];

    constructor(idSender, IdTalk, content, messageType, idsRecipient) {
        super();
        this.idSender = idSender;
        this.content = content;
        this.IdTalk = IdTalk;
        this.messageType = messageType;
        this.idsRecipient = idsRecipient;
        this.sentTime =new Date();
    }
}