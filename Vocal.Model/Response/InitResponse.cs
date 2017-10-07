using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vocal.Model.Response
{
    public class InitResponse
    {
        public SettingsResponse Settings { get; set; }
        public List<UserResponse> Friends { get; set; }
        public List<PeopleResponse> FriendsAddedMe { get; set; }
        public List<TalkResponse> Talks { get; set; }
        public List<KeyValueResponse<string, string>> Errors { get; set; } = new List<KeyValueResponse<string, string>>();
    }
}
