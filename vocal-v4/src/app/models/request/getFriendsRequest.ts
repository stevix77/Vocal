import {Request} from './request';

export class GetFriendsRequest extends Request {
    UserId: string;
    PageSize: number;
    PageNumber: number;
    Lang: string;
    
    constructor() {
        super();
    }
}