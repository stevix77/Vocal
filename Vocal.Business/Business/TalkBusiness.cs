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
using Vocal.Business.Signalr;

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

        public static Response<List<MessageResponse>> GetMessages(string talkId, string lang)
        {
            var response = new Response<List<MessageResponse>>();
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            LogManager.LogDebug(talkId, lang);
            try
            {
                var list = Repository.Instance.GetMessages(talkId);
                response.Data = Bind.Bind_Messages(list);
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

        public static Response<SendMessageResponse> SendMessage(SendMessageRequest request)
        {
            var response = new Response<SendMessageResponse> { Data = new SendMessageResponse { IsSent = false } };
            try
            {
                Resources_Language.Culture = new System.Globalization.CultureInfo(request.Lang);
                if (request != null)
                {
                    LogManager.LogDebug(request);
                    if (/*Repository.Instance.CheckIfAllUsersExist(request.IdsRecipient)*/ true)
                    {
                        Talk talk = null;
                        var user = Repository.Instance.GetUserById(request.IdSender);

                        if(string.IsNullOrEmpty(request.IdTalk))
                        {
                            var AllUser = Repository.Instance.GetUsersById(request.IdsRecipient);
                            AllUser.Add(user);

                            talk = new Talk
                            {
                                Id = Guid.NewGuid().ToString(),
                                Messages = new List<Message>(),
                                VocalName = string.Join(", ", AllUser.Where(x => x.Id != request.IdSender).Select(x => x.Username)),
                                Users = AllUser
                            };
                            //Task.Run(async () => await RegisterNotificationToTalk(AllUser, talk.Id));
                        }
                        else
                        {
                           talk = Repository.Instance.GetTalk(request.IdTalk, request.IdSender);
                        }

                        if (talk != null)
                        {
                            var m = new Message
                            {
                                Id = Guid.NewGuid(),
                                SentTime = request.SentTime,
                                ArrivedTime = DateTime.Now,
                                Content = request.Content,
                                ContentType = (MessageType)request.MessageType,
                                User = user,
                                Users = request.IdsRecipient.Select(x => new UserListen() { UserId = x }).ToList()
                            };
                            talk.Messages.Add(m);
                            talk = Repository.Instance.UptOrCreateTalk(talk);
                            response.Data.Talk = Bind.Bind_Talks(talk, request.IdSender);
                            response.Data.Message = Bind.Bind_Message(m);
                            response.Data.IsSent = true;
                            Task.Run(async () => {
                                await HubService.Instance.SendMessage(response.Data, request.IdsRecipient);
                                var users = talk.Users.Where(x => x.Id != request.IdSender);
                                var titleNotif = GenerateTitleNotif(m, talk.VocalName);
                                var messNotif = GenerateMessageNotif(m);
                                foreach (var item in users)
                                    await NotificationHub.Instance.SendNotification(item.Devices.Select(x => x.Platform).ToList(), $"{Properties.Settings.Default.TagUser}:{item.Id}", titleNotif, messNotif, talk.Id);
                            });
                        }
                        else
                        {
                            LogManager.LogError(new Exception("The talk was null. May be, the id talk doesn't exist or the user doesn't have the right on it"));
                            response.ErrorMessage = Resources_Language.TechnicalError;
                        }
                    }
                    else
                    {
                        LogManager.LogError(new Exception("Weird. Some friend of this dude don't exist "));
                        response.ErrorMessage = Resources_Language.TechnicalError;
                    }
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

        private static string GenerateTitleNotif(Message m, string vocalName)
        {
            var title = string.Empty;
            if (m.ContentType == MessageType.Vocal)
                title = $"{m.User.Username} @{vocalName} a envoyé un vocal";
            else
                title = $"{m.User.Username} @{vocalName} a envoyé un message texte";
            return title;
        }

        private static string GenerateMessageNotif(Message m)
        {
            var message = string.Empty;
            if (m.ContentType == MessageType.Text)
                message = m.Content.Substring(0, 20);
            return message;
        }

        //private static async Task RegisterNotificationToTalk(List<User> allUser, string talkId)
        //{
        //    foreach(var item in allUser)
        //    {
        //        foreach(var device in item.Devices)
        //        {
        //            await NotificationHub.Instance.RegistrationUser(device.RegistrationId, device.Channel, device.Platform, string.Format(Properties.Settings.Default.TagTalk, talkId))
        //        }
        //    }
        //}
    }
}
