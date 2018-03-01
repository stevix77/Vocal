export
var url = {

    // BaseUri: "http://192.168.1.14:8017",
    BaseUri: "http://vocal.westeurope.cloudapp.azure.com",
    //BaseUri: "http://wsvocal.azurewebsites.net",
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
    SearchContact() : string {
        return this.BaseUri + "/api/search/contact";
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
    SearchPeopleByMail() : string {
        return this.BaseUri + "/api/search/people/mail";
    },
    GetMessages() : string {
        return this.BaseUri + "/api/talk/messages";
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
    },
    BlockPeople() : string {
        return this.BaseUri + "/api/user/block";
    },
    UnblockPeople() : string {
        return this.BaseUri + "/api/user/unblock";
    },
    GetMessageById() : string {
        return this.BaseUri + "/api/talk/message";
    },
    DeleteTalk() : string {
        return this.BaseUri + "/api/talk/deleteTalk";
    },
    ArchiveTalk() : string {
        return this.BaseUri + "/api/talk/ArchiveTalk";
    },
    UnarchiveTalk() : string {
        return this.BaseUri + "/api/talk/unarchiveTalk";
    },
    GetProfil() : string {
        return this.BaseUri + "/api/user/profil";
    },
    GetContactAddedMe() : string {
        return this.BaseUri + "/api/friend/addedMe";
    },
    GetBlockedList() : string {
        return this.BaseUri + "/api/user/block/list";
    }
}