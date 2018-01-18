namespace Vocal.Model.Signalr
{
    public class Message<T>
    {
        public string Text { get; set; }
        public T Data { get; set; }
    }

    public class Message
    {
        public string Text { get; set; }
    }
}
