using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Model.Response;
using Vocal.Model.Business;
using Vocal.Model.DB;
using Vocal.Business.Tools;
using Vocal.Business.Properties;
using Vocal.DAL;

namespace Vocal.Business.Business
{
    public static class NotificationBusiness
    {
        public static async Task<Response<string>> GetRegistrationId(string channel, string userId, string platform, string lang)
        {
            var response = new Response<string>();
            LogManager.LogDebug(channel, userId, platform, lang);
            try
            {
                var user = Repository.Instance.GetUserById(userId);
                if(user != null)
                {
                    var registrationId = await NotificationHub.Instance.GetRegistrationId(channel);
                    var tag = $"{Settings.Default.TagUser}:{userId}";
                    user.Devices.Add(new Device
                    {
                        RegistrationId = registrationId,
                        Platform = platform,
                        Channel = channel,
                        Tags = new List<string>() { tag }
                    });
                    Repository.Instance.UpdateUser(user);
                    await NotificationHub.Instance.RegistrationUser(channel, platform, tag);
                    response.Data = registrationId;
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

        public static async Task<Response<bool>> SendNotification(List<string> userIds, string tag, string message)
        {
            var response = new Response<bool>();
            LogManager.LogDebug(userIds, message);
            try
            {
                var users = Repository.Instance.GetUsersById(userIds);
                var devices = users.SelectMany(x => x.Devices).ToList();
                await NotificationHub.Instance.SendNotification(devices, tag, message);
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
