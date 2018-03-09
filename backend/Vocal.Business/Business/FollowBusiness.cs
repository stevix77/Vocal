using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Vocal.Business.Properties;
using Vocal.Business.Tools;
using Vocal.DAL;
using Vocal.Model.Context;
using Vocal.Model.Business;
using Vocal.Model.Response;

namespace Vocal.Business.Business
{
    public class FollowBusiness : BaseBusiness
    {
        readonly NotificationBusiness _notificationBusiness;

        public FollowBusiness(DbContext dbContext, HubContext hubContext) : base(dbContext, hubContext)
        {
            _notificationBusiness = new NotificationBusiness(_repository, _notificationHub);
        }

        internal FollowBusiness(Repository repository, NotificationHub notificationHub) : base(repository, notificationHub)
        {
            _notificationBusiness = new NotificationBusiness(_repository, _notificationHub);
        }

        public Response<List<UserResponse>> GetFollowers(string userId, int pageNumber, int pageSize, string lang)
        {
            var response = new Response<List<UserResponse>>();
            LogManager.LogDebug(userId, lang);
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            try
            {
                var list = _repository.GetFollowers(userId, pageSize, pageNumber);
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

        public Response<List<UserResponse>> GetFollowing(string userId, int pageNumber, int pageSize, string lang)
        {
            var response = new Response<List<UserResponse>>();
            LogManager.LogDebug(userId, lang);
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            try
            {
                var list = _repository.GetFollowing(userId, pageSize, pageNumber);
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

        public Response<bool> Follow(string userId, List<string> ids, string lang)
        {
            var response = new Response<bool>();
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            LogManager.LogDebug(userId, ids, lang);
            try
            {
                response.Data = _repository.Follow(userId, ids);
                Task.Run(async () =>
                {
                    var user = _repository.GetUserById(userId);
                    if(user != null)
                    {
                        await _notificationBusiness.SendNotification(ids, (int)NotifType.Follow, user.Username);
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

        public Response<bool> Unfollow(string userId, List<string> ids, string lang)
        {
            var response = new Response<bool>();
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            LogManager.LogDebug(userId, ids, lang);
            try
            {
                response.Data = _repository.Unfollow(userId, ids);
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
