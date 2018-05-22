using Newtonsoft.Json;
using System;
using System.IO;
using System.Threading;
using Vocal.Business.Business;
using Vocal.Business.Properties;
using Vocal.DAL;
using Vocal.Model.Context;

namespace Vocal.Business.Backup
{
    public class BackupBusiness : BaseBusiness
    {
        public BackupBusiness(DbContext context) : base(context)
        {

        }


        public void ExportCollections()
        {
            try
            {
                while (true)
                {
                    var collections = _repository.GetAllCollections();
                    foreach (var item in collections)
                    {
                        var name = item.GetElement("name").Value.ToString();
                        //if (!name.ToLower().Equals("monitoring"))
                        //{
                        //    var docs = _repository.GetDocuments(name);
                        //    if (docs.Count > 0)
                        //    {
                        //        var json = JsonConvert.SerializeObject(docs);
                        //        if (!Directory.Exists($"{Settings.Default.BackupPath}/export"))
                        //            Directory.CreateDirectory($"{Settings.Default.BackupPath}/export");
                        //        File.WriteAllText($"{Settings.Default.BackupPath}/export/{name}.json", json);
                        //    }
                        //}
                        var docs = _repository.GetDocuments(name);
                        if (docs.Count > 0)
                        {
                            var json = JsonConvert.SerializeObject(docs);
                            if (!Directory.Exists($"{Settings.Default.BackupPath}/export"))
                                Directory.CreateDirectory($"{Settings.Default.BackupPath}/export");
                            File.WriteAllText($"{Settings.Default.BackupPath}/export/{name}.json", json);
                        }
                    }
                    Thread.Sleep(1000 * 3600 * 6);
                }
            }
            catch (Exception ex)
            {

            }
        }
    }
}