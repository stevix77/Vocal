import {UserResponse} from './UserResponse';

export class TalkResponse {
    Id: string;
    Name: string;
    HasNewMessage: boolean;
    DateLastMessage: Date;
    Users: Array<UserResponse>;
}