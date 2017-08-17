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
        public Response<List<UserResponse>> SearchPeople(SearchRequest request)
        {
            return SearchBusiness.SearchPeople(request.Keyword, request.Lang);
        }
    }
}
