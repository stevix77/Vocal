﻿using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Cors;
using Vocal.Business.Business;
using Vocal.Business.Tools;
using Vocal.Model.Business;
using Vocal.Model.Request;
using Vocal.Model.Response;
using Vocal.WebApi.Attribute;

namespace Vocal.WebApi.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/talk")]
    public class TalkController : ApiController
    {
        [Route("list"), HttpPost]
        public Response<List<TalkResponse>> GetTalks(TalkRequest request)
        {
            return Monitoring.Execute(TalkBusiness.GetTalks, request.UserId, request.Lang);
        }

        [Route("messages"), HttpPost]
        public Response<List<MessageResponse>> GetMessages(GetMessagesRequest request)
        {
            var obj = Helpers.Helper.GetAuthorizeCookie(ActionContext);
            return Monitoring.Execute(TalkBusiness.GetMessages, request.TalkId, request.LastMessage, obj.UserId, request.Lang);
        }

        [Route("SendMessage"), HttpPost]
        public Response<SendMessageResponse> SendMessage(SendMessageRequest request)
        {
            return Monitoring.Execute(TalkBusiness.SendMessage, request);
        }

        [Route("message"), HttpPost]
        public Response<string> GetMessageById(MessageRequest request)
        {
            var obj = Helpers.Helper.GetAuthorizeCookie(ActionContext);
            return Monitoring.Execute(TalkBusiness.GetMessageById, request.TalkId, request.MessageId, obj.UserId, request.Lang);
        }
    }
}
