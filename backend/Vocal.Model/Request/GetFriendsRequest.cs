
namespace Vocal.Model.Request
{
    public class GetFriendsRequest : Request
    {
        public string UserId { get; set; }

        public int PageSize { get; set; }

        public int PageNumber { get; set; }
    }
}
