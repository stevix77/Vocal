namespace Vocal.Model.Response
{
    public class KeyValueResponse<T, K>
    {
        public T Key { get; set; }
        public K Value { get; set; }

        public KeyValueResponse(T key, K value)
        {
            Key = key;
            Value = value;
        }
    }
}
