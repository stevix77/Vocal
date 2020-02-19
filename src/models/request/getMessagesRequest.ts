import {Request} from './request'

export class GetMessagesRequest extends Request {
    TalkId: string;
    LastMessage: Date;
    
    constructor() {
        super();
    }
}