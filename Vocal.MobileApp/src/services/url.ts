export
var url = {
    BaseUri: "http://192.168.1.14:8017",
    // BaseUri: "http://wsvocal.azurewebsites.net",

    Login() : string {
        return this.BaseUri + "/api/auth/login";
    },
    Register() : string {
        return this.BaseUri + "/api/auth/register"
    },
    AskPwd() : string {
        return this.BaseUri + "/api/auth/askpassword"
    },
    GetListResources(lang: string) : string {
        return this.BaseUri + "/api/resource/list/" + lang;
    },
    IsExistsUsername() : string {
        return this.BaseUri + "/api/user/IsExistsUsername";
    },
    IsExistsEmail() : string {
        return this.BaseUri + "/api/user/IsExistsEmail";
    },
    SearchFriends() : string {
        return this.BaseUri + "/api/friend/search";
    },
    AddFriends() : string {
        return this.BaseUri + "/api/friend/add";
    },
    NotificationRegister() : string {
        return this.BaseUri + "/api/notification/register"
    }
}