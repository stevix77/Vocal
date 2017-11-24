using System;
using System.Collections.Generic;
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
            if(updateType != (int)Update.Picture)
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
                    case Update.Picture:
                        var filename = $"{user.Id}.jpeg";
                        var filepath = $"{Properties.Settings.Default.PicturePath}\\{filename}";
                        var bs64 = value.ToString().Split(',').GetValue(1).ToString();
                        Converter.ConvertToImageAndSave(bs64, filepath);
                        user.Picture = $"{Properties.Settings.Default.PictureUrl}/{filename}";
                        break;
                    default:
                        break;
                }
                Repository.Instance.UpdateUser(user);
                response.Data = true;
                Task.Run(() =>
                {
                    if (response.Data)
                        CacheManager.RemoveCache(CacheManager.GetKey(Properties.Settings.Default.CacheSettings, userId));
                });
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

        public static Response<bool> BlockUsers(string userId, List<string> ids, string lang)
        {
            var response = new Response<bool>();
            try
            {
                LogManager.LogDebug(userId, ids, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                var success = Repository.Instance.BlockUsers(userId, ids);
                response.Data = success;
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

        public static Response<bool> UnblockUsers(string userId, List<string> ids, string lang)
        {
            var response = new Response<bool>();
            try
            {
                LogManager.LogDebug(userId, ids, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                var success = Repository.Instance.UnblockUsers(userId, ids);
                response.Data = success;
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

        public static Response<List<UserResponse>> GetListUsers(string lang)
        {
            var response = new Response<List<UserResponse>>();
            try
            {
                LogManager.LogDebug(lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                var list = Repository.Instance.GetAllUsers();
                response.Data = Binder.Bind.Bind_Users(list);
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

        private static void BlockedUser(Vocal.Model.DB.User user, string userId)
        {
            var index = user.Settings.Blocked.FindIndex(x => x.Id == userId);
            if (index >= 0)
                user.Settings.Blocked.RemoveAt(index);
            else
            {
                var userToBlock = Repository.Instance.GetUserById(userId);
                if (userToBlock != null)
                    user.Settings.Blocked.Add(new Vocal.Model.DB.People
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
                response.Data = CacheManager.GetCache<SettingsResponse>(CacheManager.GetKey(Properties.Settings.Default.CacheSettings, userId));
                if (response.Data != null)
                    return response;
                var user = Repository.Instance.GetUserById(userId);
                response.Data = Binder.Bind.Bind_UserSettings(user);
                Task.Run(() =>
                {
                    if (response.Data != null)
                        CacheManager.SetCache(CacheManager.GetKey(Properties.Settings.Default.CacheSettings, userId), response.Data);
                });
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

        public static Response<UserResponse> GetUserById(string requestUserId, string userId, string lang)
        {
            var response = new Response<UserResponse>();
            try
            {
                LogManager.LogDebug(userId, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                var user = Repository.Instance.GetUserById(userId);
                if (user != null)
                    response.Data = Binder.Bind.Bind_User(user);
                else
                    throw new CustomException(Resources_Language.UserNotExisting);
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
