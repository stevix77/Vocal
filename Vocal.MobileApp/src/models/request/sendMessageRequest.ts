import {Request} from './Request';

export class SendMessageRequest extends Request {

    content : string;
    SentTime: Date;
    TalkId: string;
    
    constructor() {
        super();
    }
}