import {Request} from './request';

export class RegisterRequest extends Request {
    Email: string;
    Password: string;
    Username: string;
    Firstname: string;
    Lastname: string;
    BirthdayDate: Date;
    Lang: string;

    constructor() {
        super();
    }
}