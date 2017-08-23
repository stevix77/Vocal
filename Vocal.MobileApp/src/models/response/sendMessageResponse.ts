import {TalkResponse} from './talkResponse';
import {MessageResponse} from './messageResponse';
export class SendMessageResponse {

    IsSent: Boolean;
    Talk: TalkResponse;
    Message: MessageResponse;

    constructor(IsSent, talk, mess) {
        this.IsSent = IsSent;
        this.Message = mess;
        this.Talk = talk;
    }
}