namespace Vocal.Model.Response
{
    public class PeopleResponse : UserResponse
    {
        public bool IsFriend { get; set; }
        public bool IsBlocked { get; set; }
    }
}
