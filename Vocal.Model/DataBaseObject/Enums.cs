using Vocal.Tools;

namespace Vocal.Model.DataBaseObject
{
    public enum Contacted
    {
        [StringValue("Everybody")]
        Everybody = 2,
        [StringValue("Friends")]
        Friends = 1,
        [StringValue("Nobody")]
        Nobody = 0
    }

    public enum Gender
    {
        [StringValue("Male")]
        Male = 1,
        [StringValue("Female")]
        Female = 2
    }

    public enum Update
    {
        Gender = 0,
        Password = 1,
        Email = 2,
        Contact = 3,
        Notification = 4,
        BirthdayDate = 5,
        Blocked = 6,
        Picture = 7
    }

    public enum MessageType
    {
        Vocal = 1,
        Text = 2
    }
}
