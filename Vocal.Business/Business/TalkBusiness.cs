using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vocal.Business.Binder;
using Vocal.Business.Properties;
using Vocal.Business.Signalr;
using Vocal.Business.Tools;
using Vocal.DAL;
using Vocal.Model.Business;
using Vocal.Model.DB;
using Vocal.Model.Helpers;
using Vocal.Model.Request;
using Vocal.Model.Response;

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

        public static Response<string> GetMessageById(string talkId, string messageId, string userId, string lang)
        {
            var response = new Response<string>();
            try
            {
                LogManager.LogDebug(talkId, messageId, userId, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                var user = Repository.Instance.GetUserById(userId);
                if (user == null)
                    throw new CustomException(Resources_Language.UserNotExisting);
                var talk = user.Talks.SingleOrDefault(x => x.Id == talkId);
                if (talk == null)
                    throw new CustomException(Resources_Language.Unauthorize);
                var mess = talk.Messages.SingleOrDefault(x => x.Id == new Guid(messageId));
                if (mess == null)
                    throw new CustomException(Resources_Language.Unauthorize);
                response.Data = mess.Content;
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

        public static Response<List<MessageResponse>> GetMessages(string talkId, DateTime? lastMessage, string userId, string lang)
        {
            var response = new Response<List<MessageResponse>>();
            try
            {
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                LogManager.LogDebug(talkId, lastMessage, userId, lang);
                var messages = Repository.Instance.GetMessages(talkId, lastMessage, userId);
                if (messages == null)
                    throw new CustomException(Resources_Language.TalkNotExisting);
                response.Data = Bind.Bind_Messages(messages);

                if(messages.Count > 0) Task.Run(() => UpdateListenUser(userId, talkId, messages));
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

        public static void UpdateListenUser(string userId, string talkId, List<Message> messages)
        {
            Repository.Instance.SetIsRead(userId, talkId, messages);
            HubService.Instance.UpdateTalk(talkId, Bind.Bind_Messages(messages));
        }

        //public static Response<SendMessageResponse> SendMessage(SendMessageRequest request)
        //{
        //    var response = new Response<SendMessageResponse> { Data = new SendMessageResponse { IsSent = false } };
        //    try
        //    {
        //        Resources_Language.Culture = new System.Globalization.CultureInfo(request.Lang);
        //        if (request != null)
        //        {
        //            LogManager.LogDebug(request);
        //            if (/*Repository.Instance.CheckIfAllUsersExist(request.IdsRecipient)*/ true)
        //            {
        //                if((MessageType)request.MessageType == MessageType.Vocal)
        //                {
        //                    var bs64 = request.Content.Split(',').LastOrDefault();
        //                    var file = Converter.ConvertToWav(bs64);
        //                    if (file == null)
        //                        throw new Exception();
        //                    request.Content = "data:audio/wav;base64," + Convert.ToBase64String(file);
        //                }

        //                if (string.IsNullOrEmpty(request.IdTalk))
        //                {
        //                    //create an talk for each user and add the new message into
        //                    CreateNewTalk(request, response);
        //                }
        //                else
        //                {
        //                    //retrieve all talks of the users in add the new message into
        //                    AddMessageToTalk(request, response);
        //                }
        //            }
        //            else
        //            {
        //                LogManager.LogError(new Exception("Weird. Some friend of this dude don't exist "));
        //                response.ErrorMessage = Resources_Language.TechnicalError;
        //            }
        //        }
        //        else
        //        {
        //            LogManager.LogError(new Exception("No Data"));
        //            response.ErrorMessage = Resources_Language.NoDataMessage;
        //        }
        //    }
        //    catch (TimeoutException tex)
        //    {
        //        LogManager.LogError(tex);
        //        response.ErrorMessage = Resources_Language.TimeoutError;
        //    }
        //    catch (CustomException cex)
        //    {
        //        LogManager.LogError(cex);
        //        response.ErrorMessage = cex.Message;
        //    }
        //    catch (Exception ex)
        //    {
        //        LogManager.LogError(ex);
        //        response.ErrorMessage = Resources_Language.TechnicalError;
        //    }
        //    return response;
        //}


        public static Response<SendMessageResponse> SendMessage(SendMessageRequest request)
        {
            var response = new Response<SendMessageResponse> { Data = new SendMessageResponse { IsSent = false } };
            try
            {
                LogManager.LogDebug(request);
                Resources_Language.Culture = new System.Globalization.CultureInfo(request.Lang);
                var user = Repository.Instance.GetUserById(request.IdSender);
                if (user != null)
                {
                    if ((MessageType)request.MessageType == MessageType.Vocal)  // si mess vocal alors convertir
                    {
                        var bs64 = request.Content.Split(',').LastOrDefault();
                        var file = Converter.ConvertToWav(bs64);
                        if (file == null)
                            throw new Exception();
                        request.Content = "data:audio/wav;base64," + Convert.ToBase64String(file);
                    }
                    if (string.IsNullOrEmpty(request.IdTalk)) // IdTalk null si envoi message par SendVocal ou par Message mais aucun message dans la page
                    {
                        var talk = user.Talks.SingleOrDefault(x => x.Recipients.Where(y => y.Id != request.IdSender).Select(y => y.Id).OrderBy(y => y).ToList().SequenceEqual(request.IdsRecipient.OrderBy(y => y))); // vérifier si une convers existe (-1 car request.IdsRecipient ne contient pas le current user 
                        if (talk == null) // la conversation n'existe pas
                        {
                            if (Repository.Instance.CheckIfAllUsersExist(request.IdsRecipient)) // vérifier si les ids existent en base
                                CreateNewTalk(request, response, user);
                            else
                                throw new Exception("AllUsers not exist");
                        }
                        else // conversation existe, ajouter message à la convers
                        {
                            request.IdTalk = talk.Id;
                            AddMessageToTalk(request, response, talk, user);
                        }
                    }
                    else // envoi du message à partir d'une conversation existante
                    {
                        var talk = user.Talks.SingleOrDefault(x => x.Id == request.IdTalk);
                        AddMessageToTalk(request, response, talk, user);
                    }
                }
                else
                    throw new Exception($"User {request.IdSender} doesn't exist");
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

        private static void CreateNewTalk(SendMessageRequest request, Response<SendMessageResponse> response, User sender)
        {
            var allUsers = Repository.Instance.GetUsersById(request.IdsRecipient);
            allUsers.Add(sender);
            var m = new Message
            {
                Id = Guid.NewGuid(),
                SentTime = request.SentTime,
                ArrivedTime = DateTime.Now,
                Content = request.Content,
                ContentType = (MessageType)request.MessageType,
                Sender = sender.ToPeople(),
                Users = allUsers.Where(x => x.Id != sender.Id).Select(x => new UserListen() { Recipient = x.ToPeople()/*, ListenDate = x == user.Id ? DateTime.Now : new DateTime?()*/ }).ToList(),
                Duration = request.Duration
            };
            var talk = new Talk() { Id = Guid.NewGuid().ToString(), Recipients = allUsers.Select(x => x.ToPeople()).ToList(), TotalDuration = request.Duration.HasValue ? request.Duration.Value : 0 };
            talk.Messages.Add(m);
            talk.DateLastMessage = m.ArrivedTime;

            Repository.Instance.AddTalk(talk, allUsers);

            response.Data.Talk = Bind.Bind_Talk(talk, request.IdSender);
            response.Data.Message = Bind.Bind_Message(m);
            response.Data.IsSent = true;
            Task.Run(async () => {
                await HubService.Instance.SendMessage(response.Data, request.IdsRecipient); // envoi message via signalr
                var users = allUsers.Where(x => x.Id != request.IdSender);
                var titleNotif = GenerateTitleNotif(m, string.Join(",", users.Select(x => x.Username)));
                var messNotif = GenerateMessageNotif(m);
                await NotificationBusiness.SendNotification(users.Select(x => x.Id).ToList(), NotifType.Talk, messNotif, titleNotif, talk.Id);
            });
        }

        private static void AddMessageToTalk(SendMessageRequest request, Response<SendMessageResponse> response, Talk talk, User sender)
        {
            var m = new Message
            {
                Id = Guid.NewGuid(),
                SentTime = request.SentTime,
                ArrivedTime = DateTime.Now,
                Content = request.Content,
                ContentType = (MessageType)request.MessageType,
                Sender = sender.ToPeople(),
                Users = talk.Recipients.Where(x => x.Id != request.IdSender).Select(x => new UserListen { Recipient = x }).ToList(),
                Duration = request.Duration
            };
            talk.Messages.Add(m);
            var recipients = Repository.Instance.GetUsersById(talk.Recipients.Select(x => x.Id).ToList());
            foreach (var item in recipients)
            {
                var t = item.Talks.SingleOrDefault(x => x.Id == talk.Id);
                if(t != null)
                {
                    t.TotalDuration = m.Duration.HasValue ? m.Duration.Value : 0;
                    t.Messages.Add(m);
                    t.DateLastMessage = m.SentTime;
                    Repository.Instance.UpdateUser(item);
                }
            }
            response.Data.Talk = Bind.Bind_Talk(talk, request.IdSender);
            response.Data.Message = Bind.Bind_Message(m);
            response.Data.IsSent = true;
            Task.Run(async () => {
                await HubService.Instance.SendMessage(response.Data, request.IdsRecipient); // envoi message via signalr
                var users = recipients.Where(x => x.Id != request.IdSender);
                var titleNotif = GenerateTitleNotif(m, string.Join(",", users.Select(x => x.Username)));
                var messNotif = GenerateMessageNotif(m);
                await NotificationBusiness.SendNotification(users.Select(x => x.Id).ToList(), NotifType.Talk, messNotif, titleNotif, talk.Id);
            });
        }

        private static string GenerateTitleNotif(Message m, string vocalName)
        {
           return (m.ContentType == MessageType.Vocal) ?
                 $"{m.Sender.Username} @{vocalName} a envoyé un vocal" :
                 $"{m.Sender.Username} @{vocalName} a envoyé un message texte";
        }

        private static string GenerateMessageNotif(Message m)
        {
            return (m.ContentType == MessageType.Text) ?
                 m.Content.Length > 20
                    ? m.Content.Substring(0, 20)
                    : m.Content
                : string.Empty;
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
