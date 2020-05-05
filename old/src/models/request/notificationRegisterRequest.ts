import {Request} from './request';

export class NotificationRegisterRequest extends Request {

    Channel: string;
    Platform: string;
    UserId: string;
    Lang: string;
    constructor() {
        super();
    }
}