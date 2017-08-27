﻿using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Cors;
using Vocal.Business.Business;
using Vocal.Model.Business;
using Vocal.Model.Request;
using Vocal.Model.Response;
using Vocal.WebApi.Attribute;

namespace Vocal.WebApi.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/friend")]
    public class FriendController : ApiController
    {
        [HttpPost, CustomAuthorize, Route("search")]
        public Response<List<UserResponse>> SearchFriends(SearchFriendsRequest request)
        {
            return Business.Tools.Monitoring.Execute(FriendBusiness.SearchFriends, request.Emails, request.Lang);
        }

        [HttpPost, CustomAuthorize, Route("getFriends")]
        public Response<List<UserResponse>> GetFriends(GetFriendsRequest request)
        {
            return Business.Tools.Monitoring.Execute(FriendBusiness.GetFriends, request.UserId, request.PageNumber, request.PageSize, request.Lang);
        }

        [HttpPost, CustomAuthorize, Route("add")]
        public Response<bool> AddFriends(AddFriendsRequest request)
        {
            return Business.Tools.Monitoring.Execute(FriendBusiness.AddFriends, request.UserId, request.Ids, request.Lang);
        }
    }
}
