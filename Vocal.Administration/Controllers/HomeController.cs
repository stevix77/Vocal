using Microsoft.AspNetCore.Mvc;

namespace Vocal.Administration.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
