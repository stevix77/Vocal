using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Vocal.Model.Response
{
    public class SettingsResponse
    {
        public string Name { get; set; }
        public DateTime BirthdayDate { get; set; }
        public string Email { get; set; }
        public List<ChoiceResponse> Genders { get; set; }
        public List<UserResponse> Blocked { get; set; }
        public List<ChoiceResponse> Notifs { get; set; }
        public List<ChoiceResponse> Contacts { get; set; }
    }
}
