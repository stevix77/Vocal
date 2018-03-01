﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Http.Cors;
using Vocal.Business.Business;
using Vocal.Model.Business;
using Vocal.Model.Response;

namespace Vocal.WebApi.Controllers
{
    [EnableCors("*", "*", "*")]
    [RoutePrefix("api/resource")]
    public class ResourceController : ApiController
    {
        [HttpPost, Route("list/{lang}")]
        public Response<List<ResourceResponse>> List(string lang)
        {
            return ResourceBusiness.GetAllResources(lang);
        }
    }
}