using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vocal.Model.DB;
using Vocal.Business;

namespace Vocal.Console
{
    class Program
    {
        private static string _userId = "1253e161-2663-4976-8ead-717305596de5";
        static void Main(string[] args)
        {
            //for (int i = 1; i <= 10; i++)
            //{
            //    var request = new Vocal.Model.Request.SendMessageRequest();
            //    request.Lang = "fr";
            //    request.Content = "test_" + i;
            //    request.MessageType = 2;
            //    request.IdSender = _userId;
            //    request.SentTime = DateTime.Now;
            //    request.IdsRecipient = new List<string> { "d3850234-045e-420b-a63e-fc3b63402046" };
            //    var response = Business.Business.TalkBusiness.SendMessage(request);
            //    System.Console.WriteLine(response);
            //}
            //var rep = Business.Business.TalkBusiness.GetTalks(_userId, "fr");
            var respmess = Business.Business.TalkBusiness.GetMessages("3085c56c-2195-4fe1-bd79-10da3ebf2959", null, _userId, "fr");
            if(respmess.HasError == false)
            {
                var resp = Business.Business.TalkBusiness.GetMessageById(respmess.Data[0].Id, _userId, "fr");
            }
            //var response = Business.Business.TalkBusiness.DeleteTalk(new Model.Request.UpdateTalkRequest { IdSender = _userId, IdTalk = "3085c56c-2195-4fe1-bd79-10da3ebf2959", Lang = "fr", SentTime = DateTime.Now });

        }
        
    }
}
