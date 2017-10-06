using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
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
    public class SearchController : ApiController
    {
        [HttpPost, Route("people")]
        public Response<List<PeopleResponse>> SearchPeople(SearchRequest request)
        {
            var obj = Helpers.Helper.GetAuthorizeCookie(ActionContext);
            return Business.Tools.Monitoring.Execute(SearchBusiness.SearchPeople, obj.UserId, request.Keyword, request.Lang);
        }

        [HttpPost, Route("people/mail")]
        public Response<List<PeopleResponse>> SearchPeopleByEmail(SearchRequest request)
        {
            var obj = Helpers.Helper.GetAuthorizeCookie(ActionContext);
            return Business.Tools.Monitoring.Execute(SearchBusiness.SearchPeopleByEmail, obj.UserId, request.Keyword, request.Lang);
        }
    }
}
