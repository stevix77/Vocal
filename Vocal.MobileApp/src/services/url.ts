export
var url = {

    // BaseUri: "http://192.168.1.14:8017",
    BaseUri: "http://vocal.westeurope.cloudapp.azure.com",
    // BaseUri: "http://wsvocal.azurewebsites.net",
    //BaseUri: "http://localhost/Vocal.WebApi/api/",
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
    RemoveFriends() : string {
        return this.BaseUri + "/api/friend/remove";
    },
    NotificationRegister() : string {
        return this.BaseUri + "/api/notification/register"
    },
    GetSettings() : string {
        return this.BaseUri + "/api/user/me";
    },
    UpdateUser() : string {
        return this.BaseUri + "/api/user/me/update"
    },
    SendMessage() : string {
        return this.BaseUri + "/api/talk/SendMessage";
    },
    Init() : string {
        return this.BaseUri + "/api/home/init";
    },
    SearchPeople() : string {
        return this.BaseUri + "/api/search/people";
    },
    GetMessages(talkId) : string {
        return this.BaseUri + "/api/talk/messages/" + talkId;
    },
    AddException() : string {
        return this.BaseUri + "/api/error/add";
    },
    GetTalkList() : string {
        return this.BaseUri + "/api/talk/list";
    },
    GetFriends() : string {
        return this.BaseUri + "/api/friend/getFriends";
    },
    GetAllUsers() : string {
        return this.BaseUri + "/api/user/list";
    }
}