export
var url = {

    //  BaseUri: "http://192.168.1.14:8017",
    //BaseUri: "http://vocal.westeurope.cloudapp.azure.com",
    BaseUri: "https://wsvocal.azurewebsites.net",
    //BaseUri: "http://localhost/Vocal.WebApi/api/",
    Login() : string {
        return this.BaseUri + "/auth/login";
    },
    Register() : string {
        return this.BaseUri + "/auth/register"
    },
    AskPwd() : string {
        return this.BaseUri + "/auth/askpassword"
    },
    GetListResources(lang: string) : string {
        return this.BaseUri + "/resource/list/" + lang;
    },
    IsExistsUsername() : string {
        return this.BaseUri + "/user/IsExistsUsername";
    },
    IsExistsEmail() : string {
        return this.BaseUri + "/user/IsExistsEmail";
    },
    SearchContact() : string {
        return this.BaseUri + "/search/contact";
    },
    AddFriends() : string {
        return this.BaseUri + "/friend/add";
    },
    RemoveFriends() : string {
        return this.BaseUri + "/friend/remove";
    },
    NotificationRegister() : string {
        return this.BaseUri + "/notification/register"
    },
    GetSettings() : string {
        return this.BaseUri + "/user/me";
    },
    UpdateUser() : string {
        return this.BaseUri + "/user/me/update"
    },
    SendMessage() : string {
        return this.BaseUri + "/talk/SendMessage";
    },
    Init() : string {
        return this.BaseUri + "/home/init";
    },
    SearchPeople() : string {
        return this.BaseUri + "/search/people";
    },
    SearchPeopleByMail() : string {
        return this.BaseUri + "/search/people/mail";
    },
    GetMessages() : string {
        return this.BaseUri + "/talk/messages";
    },
    AddException() : string {
        return this.BaseUri + "/error/add";
    },
    GetTalkList() : string {
        return this.BaseUri + "/talk/list";
    },
    GetFriends() : string {
        return this.BaseUri + "/friend/getFriends";
    },
    GetAllUsers() : string {
        return this.BaseUri + "/user/list";
    },
    BlockPeople() : string {
        return this.BaseUri + "/user/block";
    },
    UnblockPeople() : string {
        return this.BaseUri + "/user/unblock";
    },
    GetMessageById() : string {
        return this.BaseUri + "/talk/message";
    },
    DeleteTalk() : string {
        return this.BaseUri + "/talk/deleteTalk";
    },
    ArchiveTalk() : string {
        return this.BaseUri + "/talk/ArchiveTalk";
    },
    UnarchiveTalk() : string {
        return this.BaseUri + "/talk/unarchiveTalk";
    },
    DeleteMessage() {
        return this.BaseUri + "/talk/DeleteMessage";
    },
    GetProfil() : string {
        return this.BaseUri + "/user/profil";
    },
    GetContactAddedMe() : string {
        return this.BaseUri + "/friend/addedMe";
    },
    GetBlockedList() : string {
        return this.BaseUri + "/user/block/list";
    }
}