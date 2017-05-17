using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Business.Properties;
using Vocal.Business.Security;
using Vocal.Business.Tools;
using Vocal.DAL;
using Vocal.Model;
using Vocal.Model.Business;
using Vocal.Model.DB;

namespace Vocal.Business
{
    public static class AuthentificationBusiness
    {
        private static Repository _repo = new Repository();

        public static Response<User> Login(string login, string pwd, string lang)
        {
            Response<User> response = new Response<User>();
            try
            {
                string password = Hash.getHash(pwd);
                var user = _repo.Login(login, password);
                if (user != null)
                    response.Data = user;
                else
                    response.ErrorMessage = Resource.GetValue(lang, Settings.Default.UserinfoError);
            }
            catch (TimeoutException tex)
            {
                //_logManager.Log(ex, Newtonsoft.Json.JsonConvert.SerializeObject(new { login = login }));
                response.ErrorMessage = Resource.GetValue(lang, Settings.Default.TimeoutError);
            }
            catch (Exception ex)
            {
                //_logManager.Log(ex, Newtonsoft.Json.JsonConvert.SerializeObject(new { login = login }));
                response.ErrorMessage = Resource.GetValue(lang, Settings.Default.TechnicalError);
            }
            return response;
        }

        public static Response<User> Register(string email, string username, string password, string lang)
        {
            var response = new Response<User>();
            try
            {
                string id = Guid.NewGuid().ToString();
                string pwd = Hash.getHash(password);
                string token = Hash.getHash($"{id}_{Settings.Default.Salt}_{pwd}");
                var user = new User
                {
                    Id = id,
                    Email = email,
                    IsActive = true,
                    Password = pwd,
                    RegistrationDate = DateTime.Now,
                    Username = username,
                    Token = token
                };
                _repo.AddUser(user);
                response.Data = user;
            }
            catch (TimeoutException tex)
            {
                //_logManager.Log(ex, Newtonsoft.Json.JsonConvert.SerializeObject(new { login = login }));
                response.ErrorMessage = Resource.GetValue(lang, Settings.Default.TimeoutError);
            }
            catch (Exception ex)
            {
                //_logManager.Log(ex, Newtonsoft.Json.JsonConvert.SerializeObject(new { login = login }));
                response.ErrorMessage = Resource.GetValue(lang, Settings.Default.TechnicalError);
            }
            return response;
        }
    }
}
