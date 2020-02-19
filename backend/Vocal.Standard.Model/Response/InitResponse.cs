using System.Collections.Generic;

namespace Vocal.Model.Response
{
    public class InitResponse
    {
        public SettingsResponse Settings { get; set; }
        public List<UserResponse> Friends { get; set; }
        public List<TalkResponse> Talks { get; set; }
        public List<KeyValueResponse<string, string>> Errors { get; set; } = new List<KeyValueResponse<string, string>>();
    }
}
