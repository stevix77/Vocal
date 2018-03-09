import {Request} from './request';

export class ArchiveTalkRequest extends Request {

    SentTime: Date;
    IdTalk: string;
    IdSender : string;
    Lang: string;

    constructor(idSender, idTalk) {
        super();
        this.IdSender = idSender;
        this.IdTalk = idTalk;
        this.SentTime =new Date();
    }
}