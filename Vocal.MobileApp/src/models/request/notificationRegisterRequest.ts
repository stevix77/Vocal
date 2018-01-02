import {Request} from './Request';

export class NotificationRegisterRequest extends Request {

    Channel: string;
    Platform: string;
    UserId: string;
    constructor() {
        super();
    }
}