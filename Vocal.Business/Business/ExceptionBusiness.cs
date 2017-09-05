using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Business.Tools;
using Vocal.DAL;

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
