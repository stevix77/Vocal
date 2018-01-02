import {Request} from './Request';

export class GetFriendsRequest extends Request {
    UserId: string;
    PageSize: number;
    PageNumber: number;
    
    constructor() {
        super();
    }
}