using Vocal.Model.DBO;

namespace Vocal.Model.Helpers
{
    public static class Mapper
    {
        public static People ToPeople(this User user)
        {
            return new People
            {
                Email = user.Email,
                Firstname = user.Firstname,
                Id = user.Id,
                Lastname = user.Lastname,
                Picture = user.Picture,
                Username = user.Username
            };
        }
    }
}
