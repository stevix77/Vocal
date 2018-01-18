import {Request} from './Request';

export class RegisterRequest extends Request {
    Email: string;
    Password: string;
    Username: string;
    Firstname: string;
    Lastname: string;
    BirthdayDate: Date;

    constructor() {
        super();
    }
}