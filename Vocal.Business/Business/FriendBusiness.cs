using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Business.Properties;
using Vocal.Business.Tools;
using Vocal.DAL;
using Vocal.Model.Business;
using Vocal.Model.Response;

namespace Vocal.Business.Business
{
    public static class FriendBusiness
    {
        public static Response<List<UserResponse>> GetFriends(string userId, int pageNumber, int pageSize, string lang)
        {
            var response = new Response<List<UserResponse>>();
            try
            {
                LogManager.LogDebug(userId, pageNumber, pageSize, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                response.Data = CacheManager.GetCache<List<UserResponse>>(CacheManager.GetKey(Settings.Default.CacheKeyFriend, userId));
                if (response.Data != null)
                    return response;
                var list = Repository.Instance.GetFriends(userId, pageSize, pageNumber);
                response.Data = Binder.Bind.Bind_Users(list);
                Task.Run(() =>
                {
                    if (response.Data.Count > 0)
                        CacheManager.SetCache(CacheManager.GetKey(Settings.Default.CacheKeyFriend, userId), response.Data);
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

        public static Response<bool> AddFriends(string userId, List<string> ids, string lang)
        {
            var response = new Response<bool>();
            try
            {
                LogManager.LogDebug(userId, ids, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                response.Data = Repository.Instance.AddFriends(userId, ids);
                if (response.Data)
                    Task.Run(async () =>
                    {
                        CacheManager.RemoveCache(CacheManager.GetKey(Settings.Default.CacheKeyFriend, userId));
                        var user = Repository.Instance.GetUserById(userId);
                        if(user != null)
                            await NotificationBusiness.SendNotification(ids, NotifType.AddFriend, user.Username);
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

        public static Response<bool> RemoveFriends(string userId, List<string> ids, string lang)
        {
            var response = new Response<bool>();
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            LogManager.LogDebug(userId, ids, lang);
            try
            {
                response.Data = Repository.Instance.RemoveFriends(userId, ids);
                Task.Run(() =>
                {
                    if (response.Data)
                        CacheManager.RemoveCache(CacheManager.GetKey(Settings.Default.CacheKeyFriend, userId));
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

        public static Response<List<PeopleResponse>> GetFriendsAddedMe(string userId, string lang)
        {
            var response = new Response<List<PeopleResponse>>();
            try
            {
                LogManager.LogDebug(userId, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                //response.Data = CacheManager.GetCache<List<PeopleResponse>>(GetKey(Settings.Default.CacheKeyContactAddedMe, userId));
                //if (response.Data != null)
                //    return response;
                Model.DB.User user = null;
                List<Model.DB.User> list = null;
                Parallel.Invoke(() => user = Repository.Instance.GetUserById(userId),
                                () => list = Repository.Instance.GetFriendsAddedMe(userId));
                if(user != null && list != null)
                    response.Data = Binder.Bind.Bind_People(user, list);
                //Task.Run(() =>
                //{
                //    if (response.Data.Count > 0)
                //        CacheManager.SetCache(GetKey(Settings.Default.CacheKeyContactAddedMe, userId), response.Data);
                //});
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
