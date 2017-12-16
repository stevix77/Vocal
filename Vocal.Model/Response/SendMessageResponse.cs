
namespace Vocal.Model.Response
{
    public class SendMessageResponse
    {
        public bool IsSent { get; set; }
        public TalkResponse Talk { get; set; }
        public MessageResponse Message { get; set; }
    }
}
