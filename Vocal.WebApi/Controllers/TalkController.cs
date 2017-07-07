﻿using System;
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
    [RoutePrefix("api/talk"), CustomAuthorize]
    public class TalkController : ApiController
    {
        [Route("list")]
        public Response<List<TalkResponse>> GetTalks(TalkRequest request)
        {
            return TalkBusiness.GetTalks(request.UserId, request.Lang);
        }
    }
}