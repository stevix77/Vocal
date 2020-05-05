using System.Threading.Tasks;
using Vocal.Business;
using Vocal.Business.Tools;

namespace Vocal.Console
{
    class Program
    {
        private static string _userId = "9247d518-0019-4bb6-b7aa-196b84158b28";
        static void Main(string[] args)
        {
            //BackupBusiness.ExportCollections();
            //Task.Run(async () => await Translator.Translate("fr", @"D:\\Projects\\Vocal\\backend\\Vocal.WebApi\\docs\\vocal\\HQ\\3d14f7dbefd91c30a48a4eab925a747bfe0960a34284f0e392790b8ef2503b63.wav", null, null));
            Translator.Translate("fr-FR", @"D:\\Projects\\Vocal\\backend\\Vocal.WebApi\\docs\\vocal\\HQ\\3d14f7dbefd91c30a48a4eab925a747bfe0960a34284f0e392790b8ef2503b63.wav", null, null).Wait();
        }
        
    }
}
