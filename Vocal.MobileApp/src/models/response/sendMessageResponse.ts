export class SendMessageResponse {

    IsSent: Date;
    IdTalk: string;

    constructor(IsSent, IdTalk) {
        this.IsSent = IsSent;
        this.IdTalk = IdTalk;
    }
}