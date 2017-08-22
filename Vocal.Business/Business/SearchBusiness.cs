using System;
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
        public static Response<List<UserResponse>> SearchPeople(string keyword, string lang)
        {
            var response = new Response<List<UserResponse>>();
            LogManager.LogDebug(keyword, lang);
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            try
            {
                var listStart = new List<User>();
                var listEnd = new List<User>();
                var listContains = new List<User>();
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
                response.Data = Binder.Bind.Bind_Users(listStart);
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
