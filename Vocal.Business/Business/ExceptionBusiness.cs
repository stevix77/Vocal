using System;
using Vocal.Business.Tools;

namespace Vocal.Business.Business
{
    public static class ExceptionBusiness
    {
        public static void Add(string ex)
        {
            LogManager.LogError(new Exception(ex));
        }
    }
}
