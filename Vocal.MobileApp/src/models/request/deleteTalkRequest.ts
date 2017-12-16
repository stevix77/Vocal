import {Request} from './Request';

export class DeleteTalkRequest extends Request {

    SentTime: Date;
    IdTalk: string;
    IdSender : string;

    constructor(idSender, idTalk) {
        super();
        this.IdSender = idSender;
        this.IdTalk = idTalk;
        this.SentTime =new Date();
    }
}