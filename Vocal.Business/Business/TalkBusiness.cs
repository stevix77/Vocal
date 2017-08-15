using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Business.Binder;
using Vocal.Business.Properties;
using Vocal.Business.Tools;
using Vocal.DAL;
using Vocal.Model.Business;
using Vocal.Model.Request;
using Vocal.Model.Response;
using Vocal.Model.DB;


namespace Vocal.Business.Business
{
    public static class TalkBusiness
    {
        public static Response<List<TalkResponse>> GetTalks(string userId, string lang)
        {
            var response = new Response<List<TalkResponse>>();
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            LogManager.LogDebug(userId, lang);
            try
            {
                var list = Repository.Instance.GetListTalk(userId);
                response.Data = Bind.Bind_Talks(list, userId);
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

        public static Response<bool> SendMessage(SendMessageRequest request)
        {
            var response = new Response<bool> { Data = false };
            try
            {
                if (request != null)
                {
                    LogManager.LogDebug(request);
                    var user = Repository.Instance.GetUserById(request.IdSender);
                    var msg = new Message
                    {
                        Id = Guid.NewGuid(),
                        SentTime = request.SentTime,
                        ArrivedTime = DateTime.Now,
                        Content = request.Content,
                        ContentType = (MessageType)request.MessageType,
                        User = user,
                        Users = request.IdsRecipient.Select(x => new UserListen() { UserId = x }).ToList()
                    };

                    Repository.Instance.AddToDb(msg);
                    response.Data = true;
                }
                else
                {
                    LogManager.LogError(new Exception("No Data"));
                    response.ErrorMessage = Resources_Language.NoDataMessage;
                }
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
