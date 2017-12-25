using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Cors;
using Vocal.Business.Business;
using Vocal.Model.Business;
using Vocal.Model.Request;
using Vocal.Model.Response;

namespace Vocal.WebApi.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/talk")]
    public class TalkController : VocalApiController
    {
        readonly TalkBusiness _talkBusiness;

        public TalkController()
        {
            _talkBusiness = new TalkBusiness(_dbContext, _hubContext);
        }

        [Route("list"), HttpPost]
        public Response<List<TalkResponse>> GetTalks(TalkRequest request)
        {
            return _monitoring.Execute(_talkBusiness.GetTalks, request.UserId, request.Lang);
        }

        [Route("messages"), HttpPost]
        public Response<List<MessageResponse>> GetMessages(GetMessagesRequest request)
        {
            return _monitoring.Execute(_talkBusiness.GetMessages, request.TalkId, request.LastMessage, GetUserIdFromCookie(), request.Lang);
        }

        [Route("IsSendable"), HttpPost]
        public Response<bool> IsSendable(IsSendableRequest request)
        {
            var obj = Helpers.Helper.GetAuthorizeCookie(ActionContext);
            return _monitoring.Execute(_talkBusiness.IsSendable, obj.UserId, request.Users, request.Lang);
        }

        [Route("SendMessage"), HttpPost]
        public Response<SendMessageResponse> SendMessage(SendMessageRequest request)
        {
            return _monitoring.Execute(_talkBusiness.SendMessage, request);
        }

        [Route("message"), HttpPost]
        public Response<string> GetMessageById(MessageRequest request)
        {
            return _monitoring.Execute(_talkBusiness.GetMessageById, request.MessageId, GetUserIdFromCookie(), request.Lang);
        }

        [Route("ArchiveTalk"), HttpPost]
        public Response<ActionResponse> ArchiveTalk(UpdateTalkRequest request)
        {
            return _monitoring.Execute(_talkBusiness.ArchiveTalk, request);
        }

        [Route("UnarchiveTalk"), HttpPost]
        public Response<ActionResponse> UnarchiveTalk(UpdateTalkRequest request)
        {
            return _monitoring.Execute(_talkBusiness.UnarchiveTalk, request);
        }

        [Route("DeleteMessage"), HttpPost]
        public Response<ActionResponse> DeleteMessage(DeleteMessageRequest request)
        {
            return _monitoring.Execute(_talkBusiness.DeleteMessage, request);
        }

        [Route("DeleteTalk"), HttpPost]
        public Response<ActionResponse> DeleteTalk(UpdateTalkRequest request)
        {
            return _monitoring.Execute(_talkBusiness.DeleteTalk, request);
        }
    }
}
