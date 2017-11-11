import {Request} from './Request';

export class MessageRequest extends Request {
    TalkId: string;
    MessageId: string

    constructor(talkId: string, messageId : string) {
        super();
        this.TalkId = talkId;
        this.MessageId = messageId;
    }
}