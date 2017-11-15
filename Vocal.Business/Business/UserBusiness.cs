using System;
using System.Collections.Generic;
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
                var updatelist = new List<UpdateModel>();
                switch(type)
                {
                    case Update.Gender:
                        updatelist.Add(new UpdateModel { UpdateType = UpdateType.Field, Field = "Settings.Gender", Obj = (Gender)Enum.ToObject(typeof(Gender), int.Parse(value.ToString())), Type = typeof(Gender) });
                        break;
                    case Update.Contact:;
                        updatelist.Add(new UpdateModel { UpdateType = UpdateType.Field, Field = "Settings.Contact", Obj = (Contacted)Enum.ToObject(typeof(Contacted), int.Parse(value.ToString())), Type = typeof(Contacted) });
                        break;
                    case Update.Notification:
                        updatelist.Add(new UpdateModel { UpdateType = UpdateType.Field, Field = "Settings.IsNotifiable", Obj = Convert.ToBoolean(value), Type = typeof(bool) });
                        break;
                    case Update.Email:
                        updatelist.Add(new UpdateModel { UpdateType = UpdateType.Field, Field = "Email", Obj = value.ToString(), Type = typeof(string) });
                        break;
                    case Update.Password:
                        var password = value.ToString();
                        var pwd = Hash.getHash(password);
                        var newToken = Hash.getHash(string.Format(Properties.Settings.Default.FormatToken, user.Username, password, Properties.Settings.Default.Salt));
                        updatelist.Add(new UpdateModel { UpdateType = UpdateType.Field, Field = "Token", Obj = newToken, Type = typeof(string) });
                        updatelist.Add(new UpdateModel { UpdateType = UpdateType.Field, Field = "Password", Obj = pwd, Type = typeof(string) });
                        break;
                    case Update.BirthdayDate:
                        DateTime dt;
                        if (DateTime.TryParse(value.ToString(), out dt))
                            updatelist.Add(new UpdateModel { UpdateType = UpdateType.Field, Field = "BirthdayDate", Obj = dt, Type = typeof(DateTime) });
                        break;
                    case Update.Blocked:
                        BlockedUser(user, value.ToString(), updatelist);
                        break;
                    case Update.Picture:
                        var filename = $"{user.Id}.jpeg";
                        var filepath = $"{Properties.Settings.Default.PicturePath}\\{filename}";
                        var bs64 = value.ToString().Split(',').GetValue(1).ToString();
                        Converter.ConvertToImageAndSave(bs64, filepath);
                        updatelist.Add(new UpdateModel { UpdateType = UpdateType.Field, Field = "Picture", Obj = $"{Properties.Settings.Default.PictureUrl}/{filename}", Type = typeof(string) });
                        break;
                    default:
                        break;
                }
                Repository.Instance.Update(user, updatelist);
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

        private static void BlockedUser(Vocal.Model.DB.User user, string userId, List<UpdateModel> updatelist)
        {
            var index = user.Settings.Blocked.FindIndex(x => x.Id == userId);
            if (index >= 0)
                updatelist.Add(new UpdateModel { UpdateType = UpdateType.ArrayRemove, Field = "Settings.Blocked", Obj = user.Settings.Blocked[index], Type = typeof(People) });
            else
            {
                var userToBlock = Repository.Instance.GetUserById(userId);
                if (userToBlock != null)
                {
                    var people = new People
                    {
                        Email = userToBlock.Email,
                        Firstname = userToBlock.Firstname,
                        Id = userToBlock.Id,
                        Lastname = userToBlock.Lastname,
                        Picture = userToBlock.Picture,
                        Username = userToBlock.Username
                    };
                    updatelist.Add(new UpdateModel { UpdateType = UpdateType.ArrayAdd, Field = "Settings.Blocked", Obj = people, Type = typeof(People) });
                }
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
