import {Request} from './request';

export class MessageRequest extends Request {
    TalkId: string;
    MessageId: string;
    Lang:string;

    constructor(talkId: string, messageId : string, lang: string) {
        super();
        this.TalkId = talkId;
        this.MessageId = messageId;
        this.Lang = lang;
    }
}