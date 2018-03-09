import {Request} from './request';

export class SearchFriendsRequest extends Request {
    Emails: Array<string> = [];
    Lang: string;
    constructor() {
        super();
    }
}