using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vocal.Model.Response
{
    public class MessageResponse
    {
        public string Id { get; set; }
        public string Content { get; set; }
        public int ContentType { get; set; }
        public DateTime SentTime { get; set; }
        public DateTime ArrivedTime { get; set; }
        public UserResponse User { get; set; }
        public List<UserListenResponse> Users { get; set; }
        public boolean IsPlaying { get; set; }
        public number Duration { get; set; }
    }
}
