export
var url = {
    BaseUri: "http://192.168.1.14:8017/api/",
    // BaseUri: "http://wsvocal.azurewebsites.net/api/",

    Login() : string {
        return this.BaseUri + "auth/login";
    },
    Register() : string {
        return this.BaseUri + "auth/register"
    },
    AskPwd() : string {
        return this.BaseUri + "auth/askpassword"
    },
    GetListResources(lang: string) : string {
        return this.BaseUri + "resource/list/" + lang;
    },
    IsExistsUsername() : string {
        return this.BaseUri + "user/IsExistsUsername";
    },
    IsExistsEmail() : string {
        return this.BaseUri + "user/IsExistsEmail";
    },
    SearchFriends() : string {
        return this.BaseUri + "friend/search";
    },
    AddFriends() : string {
        return this.BaseUri + "friend/add";
    }
}