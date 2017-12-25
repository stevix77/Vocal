using System;
using System.ServiceProcess;
using Vocal.Business.Backup;
using Vocal.Model.Context;

namespace Vocal.WindowsService
{
    public partial class Service1 : ServiceBase
    {
        private System.Threading.Thread t;

        public Service1()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            try
            {
                t = new System.Threading.Thread(new BackupBusiness(new DbContext()).ExportCollections);
                t.Start();
            }
            catch (Exception)
            {
                
            }
        }

        protected override void OnStop()
        {
            try
            {
                t.Abort();
            }
            catch (Exception)
            {
                
            }
        }
    }
}
