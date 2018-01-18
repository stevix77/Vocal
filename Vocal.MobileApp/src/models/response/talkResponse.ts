import {UserResponse} from './userResponse';
import {MessageResponse} from './messageResponse'
export class TalkResponse {
    Id: string;
    Name: string;
    HasNewMessage: boolean;
    DateLastMessage: Date;
    Users: Array<UserResponse>;
    Messages: Array<MessageResponse>;
}