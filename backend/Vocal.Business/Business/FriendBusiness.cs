using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Vocal.Business.Properties;
using Vocal.Business.Signalr;
using Vocal.Business.Tools;
using Vocal.DAL;
using Vocal.Model.Business;
using Vocal.Model.Context;
using Vocal.Model.Response;

namespace Vocal.Business.Business
{
    public class FriendBusiness : BaseBusiness
    {
        readonly NotificationBusiness _notificationBusiness;

        public FriendBusiness(DbContext dbContext, HubContext hubContext) : base(dbContext, hubContext)
        {
            _notificationBusiness = new NotificationBusiness(_repository, _notificationHub);
        }

        internal FriendBusiness(Repository repository, NotificationHub notificationHub): base(repository, notificationHub)
        {
            _notificationBusiness = new NotificationBusiness(_repository, notificationHub);
        }

        public Response<List<UserResponse>> GetFriends(string userId, int pageNumber, int pageSize, string lang)
        {
            var response = new Response<List<UserResponse>>();
            try
            {
                LogManager.LogDebug(userId, pageNumber, pageSize, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                response.Data = CacheManager.GetCache<List<UserResponse>>(CacheManager.GetKey(Settings.Default.CacheKeyFriend, userId));
                if (response.Data != null)
                    return response;
                var list = _repository.GetFriends(userId, pageSize, pageNumber);
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

        public Response<bool> AddFriends(string userId, List<string> ids, string lang)
        {
            var response = new Response<bool>();
            try
            {
                LogManager.LogDebug(userId, ids, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                response.Data = _repository.AddFriends(userId, ids);
                if (response.Data)
                    Task.Run(async () =>
                    {
                        CacheManager.RemoveCache(CacheManager.GetKey(Settings.Default.CacheKeyFriend, userId));
                        var user = _repository.GetUserById(userId);
                        if(user != null)
                        {
                            _notificationBusiness.SendNotification(ids, (int)NotifType.AddFriend, user.Username, user.Id);
                            HubService.Instance.AddFriends(ids, user.Username);
                        }
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

        public Response<bool> RemoveFriends(string userId, List<string> ids, string lang)
        {
            var response = new Response<bool>();
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            LogManager.LogDebug(userId, ids, lang);
            try
            {
                response.Data = _repository.RemoveFriends(userId, ids);
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

        public Response<List<PeopleResponse>> GetFriendsAddedMe(string userId, string lang)
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
                Parallel.Invoke(() => user = _repository.GetUserById(userId),
                                () => list = _repository.GetFriendsAddedMe(userId));
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
