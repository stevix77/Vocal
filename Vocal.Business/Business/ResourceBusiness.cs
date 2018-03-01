using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Business.Properties;
using Vocal.Business.Tools;
using Vocal.Model.Business;
using Vocal.Model.Response;

namespace Vocal.Business.Business
{
    public static class ResourceBusiness
    {
        public static Response<List<ResourceResponse>> GetAllResources(string lang)
        {
            Resources_Language.Culture = new System.Globalization.CultureInfo(lang);
            var response = new Response<List<ResourceResponse>>();
            try
            {
                var resource = Resources_Language.ResourceManager.GetResourceSet(new System.Globalization.CultureInfo(lang), true, true);
                var list = new List<ResourceResponse>();
                foreach (DictionaryEntry item in resource)
                {
                    list.Add(new ResourceResponse
                    {
                        Key = item.Key.ToString(),
                        Value = item.Value.ToString()
                    });
                }
                response.Data = list;
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
