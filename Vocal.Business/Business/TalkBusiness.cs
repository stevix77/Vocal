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

        public static Response<List<MessageResponse>> GetMessages(string talkId, string userId, string lang)
        {
            var response = new Response<List<MessageResponse>>();
            try
            {
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                LogManager.LogDebug(talkId, userId, lang);
                var list = Repository.Instance.GetMessages(talkId, userId);
                response.Data = Bind.Bind_Messages(list);
                if(list.Count > 0)
                    Task.Run(() => UpdateListenUser(list, userId, talkId));
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

        public static void UpdateListenUser(List<Message> list, string userId, string talkId)
        {
            var talk = Repository.Instance.GetTalk(talkId, userId);
            DateTime dt = DateTime.Now;
            if(list == null)
                list = Repository.Instance.GetMessages(talkId, userId);
            foreach (var item in list)
            {
                var user = item.Users.SingleOrDefault(x => x.UserId == userId);
                if(user != null)
                {
                    user.ListenDate = dt;
                    var index = talk.Messages.FindIndex(x => x.Id == item.Id);
                    talk.Messages[index] = item;
                }
            }
            Repository.Instance.UpdateTalk(talk);
            HubService.Instance.UpdateTalk(talkId, Bind.Bind_Messages(list));
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
                        if((MessageType)request.MessageType == MessageType.Vocal)
                        {
                            var file = Converter.ConvertToWav(request.Content);
                            if (file == null)
                                throw new Exception();
                            request.Content = Convert.ToBase64String(file);
                        }
                        Talk talk = null;
                        var user = Repository.Instance.GetUserById(request.IdSender);

                        if(string.IsNullOrEmpty(request.IdTalk))
                        {
                            var AllUser = Repository.Instance.GetUsersById(request.IdsRecipient);
                            AllUser.Add(user);

                            talk = new Talk
                            {
                                Messages = new List<Message>(),
                                Users = AllUser
                            };
                        }
                        else
                        {
                            talk = Repository.Instance.GetTalk(request.IdTalk, request.IdSender);
                            request.IdsRecipient = talk.Users.Select(x => x.Id).ToList();
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
                                Users = request.IdsRecipient.Select(x => new UserListen() { UserId = x/*, ListenDate = x == user.Id ? DateTime.Now : new DateTime?()*/ }).ToList()
                            };
                            talk.Messages.Add(m);
                            talk = Repository.Instance.UptOrCreateTalk(talk);
                            response.Data.Talk = Bind.Bind_Talks(talk, request.IdSender);
                            response.Data.Message = Bind.Bind_Message(m);
                            response.Data.IsSent = true;
                            Task.Run(async() =>
                            {
                                await HubService.Instance.SendMessage(response.Data, request.IdsRecipient);
                                var users = talk.Users.Where(x => x.Id != request.IdSender);
                                var titleNotif = GenerateTitleNotif(m, talk.VocalName);
                                var messNotif = GenerateMessageNotif(m);
                                await NotificationBusiness.SendNotification(users.Select(x => x.Id).ToList(), NotifType.Talk, messNotif, titleNotif, talk.Id);
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
                message = m.Content.Length > 20 ? m.Content.Substring(0, 20) : m.Content;
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
