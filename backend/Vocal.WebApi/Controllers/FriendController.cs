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
    public class FriendController : VocalApiController
    {
        readonly FriendBusiness _friendBusiness;

        public FriendController()
        {
            _friendBusiness = new FriendBusiness(_dbContext, _hubContext);
        }

        [HttpPost, CustomAuthorize, Route("getFriends")]
        public Response<List<UserResponse>> GetFriends(GetFriendsRequest request)
        {
            return _monitoring.Execute(_friendBusiness.GetFriends, request.UserId, request.PageNumber, request.PageSize, request.Lang);
        }

        [HttpPost, CustomAuthorize, Route("addedMe")]
        public Response<List<PeopleResponse>> GetContactsAddMe(Request request)
        {
            return _monitoring.Execute(_friendBusiness.GetFriendsAddedMe, GetUserIdFromCookie(), request.Lang);
        }

        [HttpPost, CustomAuthorize, Route("add")]
        public Response<bool> AddFriends(ManageFriendsRequest request)
        {
            return _monitoring.Execute(_friendBusiness.AddFriends, request.UserId, request.Ids, request.Lang);
        }

        [HttpPost, CustomAuthorize, Route("Remove")]
        public Response<bool> RemoveFriends(ManageFriendsRequest request)
        {
            return _monitoring.Execute(_friendBusiness.RemoveFriends, request.UserId, request.Ids, request.Lang);
        }
    }
}
