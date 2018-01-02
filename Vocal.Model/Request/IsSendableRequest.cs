using System.Collections.Generic;

namespace Vocal.Model.Request
{
    public class IsSendableRequest : Request
    {
        public List<string> Users { get; set; }
    }
}