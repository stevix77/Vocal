import {UserResponse} from './userResponse';
export class TalkResponse {
    Id: string;
    Name: string;
    HasNewMessage: boolean;
    DateLastMessage: Date;
    Users: Array<UserResponse>;
    Duration: number;
    Picture: string;
    IsWriting: boolean;
    TextWriting: string;
}