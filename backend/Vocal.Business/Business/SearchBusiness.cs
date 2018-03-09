using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vocal.Business.Properties;
using Vocal.Business.Tools;
using Vocal.DAL;
using Vocal.Model.Business;
using Vocal.Model.Context;
using Vocal.Model.DB;
using Vocal.Model.Response;

namespace Vocal.Business.Business
{
    public class SearchBusiness : BaseBusiness
    {
        public SearchBusiness(DbContext context) : base(context)
        {

        }

        internal SearchBusiness(Repository repository) : base(repository)
        {

        }

        public Response<List<PeopleResponse>> SearchPeople(string userId, string keyword, string lang)
        {
            var response = new Response<List<PeopleResponse>>();
            try
            {
                LogManager.LogDebug(userId, keyword, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                var listStart = new List<User>();
                var listEnd = new List<User>();
                var listContains = new List<User>();
                var user = _repository.GetUserById(userId);
                var list = _repository.SearchPeople(userId, keyword);
                foreach(var item in list)
                {
                    if ((item.Username.ToLower().StartsWith(keyword) || item.Firstname.ToLower().StartsWith(keyword) || item.Lastname.ToLower().StartsWith(keyword)) && !user.Friends.Exists(x => x.Id == item.Id))
                        listStart.Add(item);
                    else if ((item.Username.ToLower().EndsWith(keyword) || item.Firstname.ToLower().EndsWith(keyword) || item.Lastname.ToLower().EndsWith(keyword)) && !user.Friends.Exists(x => x.Id == item.Id) && !listStart.Contains(item))
                        listEnd.Add(item);
                    else if (!listStart.Contains(item) && !listEnd.Contains(item) && !user.Friends.Exists(x => x.Id == item.Id))
                        listContains.Add(item);
                }
                listStart.AddRange(listContains);
                listStart.AddRange(listEnd);
                response.Data = Binder.Bind.Bind_SearchPeople(user, listStart);
                Task.Run(() =>
                {
                    var search = new Search
                    {
                        Keyword = keyword,
                        SearchDate = DateTime.Now
                    };
                    _repository.AddSearch(search);
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

        public Response<List<PeopleResponse>> SearchPeopleByEmail(string userId, string keyword, string lang)
        {
            var response = new Response<List<PeopleResponse>>();
            try
            {
                LogManager.LogDebug(userId, keyword, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                var listStart = new List<User>();
                var listEnd = new List<User>();
                var listContains = new List<User>();
                var user = _repository.GetUserById(userId);
                var list = _repository.SearchPeopleByEmail(keyword);
                foreach (var item in list)
                {
                    if (item.Email.ToLower().StartsWith(keyword))
                        listStart.Add(item);
                    else if (item.Email.ToLower().EndsWith(keyword) && !listStart.Contains(item))
                        listEnd.Add(item);
                    else if (!listStart.Contains(item) && !listEnd.Contains(item))
                        listContains.Add(item);
                }
                listStart.AddRange(listContains);
                listStart.AddRange(listEnd);
                response.Data = Binder.Bind.Bind_SearchPeople(user, listStart);
                Task.Run(() =>
                {
                    var search = new Search
                    {
                        Keyword = keyword,
                        SearchDate = DateTime.Now
                    };
                    _repository.AddSearch(search);
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

        public Response<List<PeopleResponse>> SearchContacts(string userId, List<string> emails, string lang)
        {
            var response = new Response<List<PeopleResponse>>();
            try
            {
                LogManager.LogDebug(userId, emails, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                var user = _repository.GetUserById(userId);
                var list = _repository.SearchFriendsByEmails(emails);
                list.RemoveAll(x => user.Friends.Any(y => y.Id == x.Id) || x.Id == user.Id);
                response.Data = Binder.Bind.Bind_SearchPeople(user, list);
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
