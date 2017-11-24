using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Model.DB;
using Vocal.Business;
using Vocal.DAL;

namespace Vocal.Console
{
    class Program
    {
        private static string _userId = "1253e161-2663-4976-8ead-717305596de5";
        static void Main(string[] args)
        {
            var response = Business.Business.TalkBusiness.GetTalks(_userId, "fr");
        }
        
    }
}
