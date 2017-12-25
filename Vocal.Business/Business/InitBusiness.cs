using System;
using System.Threading.Tasks;
using Vocal.Business.Properties;
using Vocal.Business.Tools;
using Vocal.Model.Business;
using Vocal.Model.Context;
using Vocal.Model.Response;
using Vocal.DAL;

namespace Vocal.Business.Business
{
    public class InitBusiness : BaseBusiness
    {
        readonly UserBusiness _userBusiness; 
        readonly TalkBusiness _talkBusiness;
        readonly FriendBusiness _friendBusiness;

        public InitBusiness(DbContext dbContext, HubContext hubContext) : base(dbContext, hubContext)
        {
            _userBusiness = new UserBusiness(_repository);
            _talkBusiness = new TalkBusiness(_repository, _notificationHub);
            _friendBusiness = new FriendBusiness(_repository, _notificationHub);
        }

        internal InitBusiness(Repository repository, NotificationHub notificationHub) : base(repository, notificationHub)
        {
            _userBusiness = new UserBusiness(_repository);
            _talkBusiness = new TalkBusiness(_repository, _notificationHub);
            _friendBusiness = new FriendBusiness(_repository, _notificationHub);
        }

        public Response<InitResponse> Initialize(string userId, string lang)
        {
            var response = new Response<InitResponse>();
            try
            {
                LogManager.LogDebug(userId, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                response.Data = new InitResponse();
                var actionSettings = new Action(() =>
                {
                    var resp = _userBusiness.GetSettings(userId, lang);
                    if (!resp.HasError)
                        response.Data.Settings = resp.Data;
                    else
                        response.Data.Errors.Add(new KeyValueResponse<string, string>(KeyStore.Settings.ToString(), resp.ErrorMessage));
                });
                var actionTalks = new Action(() =>
                {
                    var resp = _talkBusiness.GetTalks(userId, lang);
                    if (!resp.HasError)
                        response.Data.Talks = resp.Data;
                    else
                        response.Data.Errors.Add(new KeyValueResponse<string, string>(KeyStore.Talks.ToString(), resp.ErrorMessage));
                });
                var actionFriends = new Action(() =>
                {
                    var resp = _friendBusiness.GetFriends(userId, 0, 0, lang);
                    if (!resp.HasError)
                        response.Data.Friends = resp.Data;
                    else
                        response.Data.Errors.Add(new KeyValueResponse<string, string>(KeyStore.Friends.ToString(), resp.ErrorMessage));
                });
                Parallel.Invoke(actionFriends, actionSettings, actionTalks);
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
