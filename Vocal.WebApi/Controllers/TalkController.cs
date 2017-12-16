using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Cors;
using Vocal.Business.Business;
using Vocal.Business.Tools;
using Vocal.Model.Business;
using Vocal.Model.Request;
using Vocal.Model.Response;

namespace Vocal.WebApi.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/talk")]
    public class TalkController : VocalApiController
    {
        [Route("list"), HttpPost]
        public Response<List<TalkResponse>> GetTalks(TalkRequest request)
        {
            return Monitoring.Execute(TalkBusiness.GetTalks, request.UserId, request.Lang);
        }

        [Route("messages"), HttpPost]
        public Response<List<MessageResponse>> GetMessages(GetMessagesRequest request)
        {
            return Monitoring.Execute(TalkBusiness.GetMessages, request.TalkId, request.LastMessage, GetUserIdFromCookie(), request.Lang);
        }

        [Route("IsSendable"), HttpPost]
        public Response<bool> IsSendable(IsSendableRequest request)
        {
            var obj = Helpers.Helper.GetAuthorizeCookie(ActionContext);
            return Monitoring.Execute(TalkBusiness.IsSendable, obj.UserId, request.Users, request.Lang);
        }

        [Route("SendMessage"), HttpPost]
        public Response<SendMessageResponse> SendMessage(SendMessageRequest request)
        {
            return Monitoring.Execute(TalkBusiness.SendMessage, request);
        }

        [Route("message"), HttpPost]
        public Response<string> GetMessageById(MessageRequest request)
        {
            return Monitoring.Execute(TalkBusiness.GetMessageById, request.MessageId, GetUserIdFromCookie(), request.Lang);
        }

        [Route("ArchiveTalk"), HttpPost]
        public Response<ActionResponse> ArchiveTalk(UpdateTalkRequest request)
        {
            return Monitoring.Execute(TalkBusiness.ArchiveTalk, request);
        }

        [Route("UnarchiveTalk"), HttpPost]
        public Response<ActionResponse> UnarchiveTalk(UpdateTalkRequest request)
        {
            return Monitoring.Execute(TalkBusiness.UnarchiveTalk, request);
        }

        [Route("DeleteMessage"), HttpPost]
        public Response<ActionResponse> DeleteMessage(DeleteMessageRequest request)
        {
            return Monitoring.Execute(TalkBusiness.DeleteMessage, request);
        }

        [Route("DeleteTalk"), HttpPost]
        public Response<ActionResponse> DeleteTalk(UpdateTalkRequest request)
        {
            return Monitoring.Execute(TalkBusiness.DeleteTalk, request);
        }
    }
}
