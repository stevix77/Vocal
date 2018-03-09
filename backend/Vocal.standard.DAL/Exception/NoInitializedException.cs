namespace Vocal.DAL.Exception
{
    public class NoInitializedException : System.Exception
    {
        public NoInitializedException() : base("The object has not yet been initialized. Ensure you have called Init method before use it")
        {

        }
    }
}
