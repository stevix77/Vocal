﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Resources;
using System.Text;
using System.Threading.Tasks;
using Vocal.Business.Properties;

namespace Vocal.Business.Tools
{
    public static class Resource
    {
        private static ResourceManager _manager = new ResourceManager("Vocal.Business.Properties.Resources.Language", typeof(Resource).Assembly);

        public static string GetValue(string lang, string key)
        {
            return _manager.GetString(key, new System.Globalization.CultureInfo(lang));
        }

        public const string MailExisting = "MailExisting";
        public const string TechnicalError = "TechnicalError";
        public const string TimeoutError = "TimeoutError";
        public const string UserinfoError = "UserinfoError";
        public const string Unauthorize = "Unauthorize";
        public const string AskPassword = "AskPassword";
        public const string AskPasswordSubject = "AskPasswordSubject";
        public const string MailNotExisting = "MailNotExisting";
    }
}
