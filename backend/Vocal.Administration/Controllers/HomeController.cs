using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Vocal.Business.Admin;
using Vocal.Model.Context;

namespace Vocal.Administration.Controllers
{
    public class HomeController : Controller
    {
        readonly DbContext _dbContext;
        readonly HubContext _hubContext;

        public HomeController(IOptions<DbContext> dbContext, IOptions<HubContext> hubContext)
        {
            _dbContext = dbContext.Value;
            _hubContext = hubContext.Value;
        }

        public IActionResult Index()
        {
            var response = new UserManager(_dbContext).GetListUsers();
            if(response.HasError)
            {
                ViewBag.Error = response.ErrorMessage;
                return View("Error");
            }
            else
                return View(response.Data);
        }
    }
}
