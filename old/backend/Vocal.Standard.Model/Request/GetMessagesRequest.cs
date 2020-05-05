using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vocal.Model.Request
{
    public class GetMessagesRequest : Request
    {
        public DateTime? LastMessage { get; set; }
        public string TalkId { get; set; }
    }
}
