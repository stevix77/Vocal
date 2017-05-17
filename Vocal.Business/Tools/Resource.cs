using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Resources;
using System.Text;
using System.Threading.Tasks;

namespace Vocal.Business.Tools
{
    public static class Resource
    {
        private static ResourceManager _manager = new ResourceManager("Resources.Language", Assembly.GetAssembly(typeof(Resource)));

        public static string GetValue(string lang, string key)
        {
            return _manager.GetString(key, new System.Globalization.CultureInfo(lang));
        }
    }
}
