using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Business.Properties;
using Vocal.Business.Security;
using Vocal.Business.Tools;
using Vocal.DAL;
using Vocal.Model.Business;
using Vocal.Model.DB;
using Vocal.Model.Response;

namespace Vocal.Business.Business
{
    public static class UserBusiness
    {
        public static Response<bool> IsExistsUsername(string username, string lang)
        {
            var response = new Response<bool>();
            LogManager.LogDebug(username, lang);
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            try
            {
                username = username.ToLower();
                var user = Repository.Instance.GetUserByUsername(username);
                if (user != null)
                {
                    response.Data = true;
                    throw new CustomException(Resources_Language.UsernameExisting);
                }
            }
            catch (TimeoutException tex)
            {
                LogManager.LogError(tex);
                response.ErrorMessage = Resources_Language.TimeoutError;
            }
            catch (CustomException cex)
            {
                LogManager.LogError(cex);
                response.ErrorMessage = cex.Message;
            }
            catch (Exception ex)
            {
                LogManager.LogError(ex);
                response.ErrorMessage = Resources_Language.TechnicalError;
            }
            return response;
        }

        public static Response<bool> UpdateUser(string userId, object value, int updateType, string lang)
        {
            var response = new Response<bool>();
            LogManager.LogDebug(userId, value, updateType, lang);
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            try
            {
                var user = Repository.Instance.GetUserById(userId);
                var type = (Update)Enum.ToObject(typeof(Update), updateType);
                switch(type)
                {
                    case Update.Gender:
                        user.Settings.Gender = (Gender)Enum.ToObject(typeof(Gender), int.Parse(value.ToString()));
                        break;
                    case Update.Contact:
                        user.Settings.Contact = (Contacted)Enum.ToObject(typeof(Contacted), int.Parse(value.ToString()));
                        break;
                    case Update.Notification:
                        user.Settings.IsNotifiable = Convert.ToBoolean(value);
                        break;
                    case Update.Email:
                        user.Email = value.ToString();
                        break;
                    case Update.Password:
                        var password = value.ToString();
                        var pwd = Hash.getHash(password);
                        var newToken = Hash.getHash(string.Format(Properties.Settings.Default.FormatToken, user.Username, password, Properties.Settings.Default.Salt));
                        user.Token = newToken;
                        user.Password = pwd;
                        break;
                    case Update.BirthdayDate:
                        DateTime dt;
                        if (DateTime.TryParse(value.ToString(), out dt))
                            user.BirthdayDate = dt;
                        break;
                    case Update.Blocked:
                        BlockedUser(user, value.ToString());
                        break;
                    default:
                        break;
                }
                Repository.Instance.UpdateUser(user);
                response.Data = true;
            }
            catch (TimeoutException tex)
            {
                LogManager.LogError(tex);
                response.ErrorMessage = Resources_Language.TimeoutError;
            }
            catch (CustomException cex)
            {
                LogManager.LogError(cex);
                response.ErrorMessage = cex.Message;
            }
            catch (Exception ex)
            {
                LogManager.LogError(ex);
                response.ErrorMessage = Resources_Language.TechnicalError;
            }
            return response;
        }

        private static void BlockedUser(User user, string userId)
        {
            var index = user.Settings.Blocked.FindIndex(x => x.Id == userId);
            if (index >= 0)
                user.Settings.Blocked.RemoveAt(index);
            else
            {
                var userToBlock = Repository.Instance.GetUserById(userId);
                if (userToBlock != null)
                    user.Settings.Blocked.Add(new People
                    {
                        Email = userToBlock.Email,
                        Firstname = userToBlock.Firstname,
                        Id = userToBlock.Id,
                        Lastname = userToBlock.Lastname,
                        Picture = userToBlock.Picture,
                        Username = userToBlock.Username
                    });
            }

        }

        public static Response<SettingsResponse> GetSettings(string userId, string lang)
        {
            var response = new Response<SettingsResponse>();
            LogManager.LogDebug(userId, lang);
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            try
            {
                var user = Repository.Instance.GetUserById(userId);
                response.Data = Binder.Bind.Bind_UserSettings(user);
            }
            catch (TimeoutException tex)
            {
                LogManager.LogError(tex);
                response.ErrorMessage = Resources_Language.TimeoutError;
            }
            catch (CustomException cex)
            {
                LogManager.LogError(cex);
                response.ErrorMessage = cex.Message;
            }
            catch (Exception ex)
            {
                LogManager.LogError(ex);
                response.ErrorMessage = Resources_Language.TechnicalError;
            }
            return response;
        }

        public static Response<bool> IsExistsEmail(string email, string lang)
        {
            var response = new Response<bool>();
            LogManager.LogDebug(email, lang);
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            try
            {
                email = email.ToLower();
                var user = Repository.Instance.GetUserByEmail(email);
                if (user != null)
                {
                    response.Data = true;
                    throw new CustomException(Resources_Language.MailExisting);
                }
            }
            catch (TimeoutException tex)
            {
                LogManager.LogError(tex);
                response.ErrorMessage = Resources_Language.TimeoutError;
            }
            catch (CustomException cex)
            {
                LogManager.LogError(cex);
                response.ErrorMessage = cex.Message;
            }
            catch (Exception ex)
            {
                LogManager.LogError(ex);
                response.ErrorMessage = Resources_Language.TechnicalError;
            }
            return response;
        }
    }
}
