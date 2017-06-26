using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Vocal.Business;
using Vocal.WebApi.Models;

namespace Vocal.WebApi.Controllers
{
    public class AccountController : Controller
    {
        // GET: Account
        public ActionResult ResetPassword(string id, string token, string lang)
        {
            var response = AuthentificationBusiness.IsTokenValid(id, token, lang);
            if (response.Data)
            {
                ViewBag.Lang = lang;
                return View();
            }
            else
            {
                ViewBag.Error = response.ErrorMessage;
                return View("Error");
            }
        }

        [ValidateAntiForgeryToken]
        [HttpPost]
        public ActionResult ResetPassword(PasswordReset model, string lang)
        {
            if(ModelState.IsValid)
            {
                var response = AuthentificationBusiness.ResetPassword(model.Password, model.Username, model.Token, lang);
                if (response.Data)
                    return View("ResetPasswordSuccess");
                else
                {
                    ViewBag.Error = response.ErrorMessage;
                    return View("Error");
                }
            }
            else
            {
                ViewBag.Lang = lang;
                return View(model);
            }
        }
    }
}