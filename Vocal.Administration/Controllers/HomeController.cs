using Microsoft.AspNetCore.Mvc;
using Vocal.Model;
using Vocal.Business;
using Vocal.Business.Business;
using MongoDB.Driver;
using Vocal.Model.DB;
using Vocal.Business.Admin;

namespace Vocal.Administration.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            var response = UserManager.GetListUsers();
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
