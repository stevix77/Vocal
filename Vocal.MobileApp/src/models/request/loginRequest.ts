import {Request} from './Request';

export class LoginRequest extends Request {
    Login: string;
    Password: string;

    constructor(login, pwd) {
        super();
        this.Login = login;
        this.Password = pwd;
    }
}