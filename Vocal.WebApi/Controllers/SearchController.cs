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
    [RoutePrefix("api/search"), CustomAuthorize]
    public class SearchController : VocalApiController
    {
        [HttpPost, Route("people")]
        public Response<List<PeopleResponse>> SearchPeople(SearchRequest request)
        {
            return Business.Tools.Monitoring.Execute(SearchBusiness.SearchPeople, GetUserIdFromCookie(), request.Keyword, request.Lang);
        }

        [HttpPost, Route("people/mail")]
        public Response<List<PeopleResponse>> SearchPeopleByEmail(SearchRequest request)
        {
            return Business.Tools.Monitoring.Execute(SearchBusiness.SearchPeopleByEmail, GetUserIdFromCookie(), request.Keyword, request.Lang);
        }
        
        [HttpPost, Route("contact")]
        public Response<List<PeopleResponse>> SearchContacts(SearchFriendsRequest request)
        {
            return Business.Tools.Monitoring.Execute(SearchBusiness.SearchContacts, GetUserIdFromCookie(), request.Emails, request.Lang);
        }
    }
}
