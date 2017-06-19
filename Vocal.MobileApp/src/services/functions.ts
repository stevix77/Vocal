import {params} from './params';
import CryptoJS from 'crypto-js';

export var functions = {

    GenerateToken(username, pwd) : string {
        let token = username + "@" + pwd + "@" + params.Salt;
        token = this.Crypt(token);
        return token;
    },

    Crypt(str: string) : string {
        return CryptoJS.HmacSHA256(str, str).toString();
    }
}