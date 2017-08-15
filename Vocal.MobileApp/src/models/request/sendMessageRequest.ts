import {Request} from './Request';

export class SendMessageRequest extends Request {

    content : string;
    sentTime: Date;
    talkId: string;
    messageType : number;
    idSender : string;
    idsRecipient : Array<string> = [];

    constructor(idSender, content, messageType, idsRecipient) {
        super();
        this.idSender = idSender;
        this.content = content,
        this.messageType = messageType;
        this.idsRecipient = idsRecipient;
        this.sentTime =new Date();
    }
}