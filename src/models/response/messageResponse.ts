import {UserResponse} from './userResponse';
import {MessageType} from '../enums';

export class MessageResponse {
    Id: string;
    Content: string;
    ContentType: MessageType;
    SentTime: Date;
    ArrivedTime: Date;
    User: UserResponse;
    Users: Array<any>;
    IsPlaying: boolean = false;
    Duration?: number;
    Translation: string = "";
    ActiveFilter: string = "";
}