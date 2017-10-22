﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Business.Properties;
using Vocal.Business.Tools;
using Vocal.DAL;
using Vocal.Model.Business;
using Vocal.Model.DB;
using Vocal.Model.Response;

namespace Vocal.Business.Business
{
    public static class SearchBusiness
    {
        public static Response<List<PeopleResponse>> SearchPeople(string userId, string keyword, string lang)
        {
            var response = new Response<List<PeopleResponse>>();
            try
            {
                LogManager.LogDebug(userId, keyword, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                var listStart = new List<Vocal.Model.DBO.User>();
                var listEnd = new List<Vocal.Model.DBO.User>();
                var listContains = new List<Vocal.Model.DBO.User>();
                var user = Repository.Instance.GetUserById(userId);
                var list = Repository.Instance.SearchPeople(keyword);
                foreach(var item in list)
                {
                    if (item.Username.ToLower().StartsWith(keyword) || item.Firstname.ToLower().StartsWith(keyword) || item.Lastname.ToLower().StartsWith(keyword))
                        listStart.Add(item);
                    else if ((item.Username.ToLower().EndsWith(keyword) || item.Firstname.ToLower().EndsWith(keyword) || item.Lastname.ToLower().EndsWith(keyword)) && !listStart.Contains(item))
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
                    Repository.Instance.AddSearch(search);
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

        public static Response<List<PeopleResponse>> SearchPeopleByEmail(string userId, string keyword, string lang)
        {
            var response = new Response<List<PeopleResponse>>();
            try
            {
                LogManager.LogDebug(userId, keyword, lang);
                Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
                var listStart = new List<Vocal.Model.DBO.User>();
                var listEnd = new List<Vocal.Model.DBO.User>();
                var listContains = new List<Vocal.Model.DBO.User>();
                var user = Repository.Instance.GetUserById(userId);
                var list = Repository.Instance.SearchPeopleByEmail(keyword);
                foreach (var item in list)
                {
                    if (item.Username.ToLower().StartsWith(keyword) || item.Firstname.ToLower().StartsWith(keyword) || item.Lastname.ToLower().StartsWith(keyword))
                        listStart.Add(item);
                    else if ((item.Username.ToLower().EndsWith(keyword) || item.Firstname.ToLower().EndsWith(keyword) || item.Lastname.ToLower().EndsWith(keyword)) && !listStart.Contains(item))
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
                    Repository.Instance.AddSearch(search);
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
    }
}
