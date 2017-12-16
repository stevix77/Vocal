using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration.Install;
using System.Linq;
using System.Threading.Tasks;
using Vocal.WindowsService.Properties;

namespace Vocal.WindowsService
{
    [RunInstaller(true)]
    public partial class ProjectInstaller : System.Configuration.Install.Installer
    {
        public ProjectInstaller()
        {
            InitializeComponent();
            serviceInstaller1.DisplayName = Settings.Default.ServiceDisplayName;
            serviceInstaller1.ServiceName = Settings.Default.ServiceName;
        }

        public override void Install(IDictionary stateSaver)
        {
            serviceInstaller1.DisplayName = Settings.Default.ServiceDisplayName;
            serviceInstaller1.ServiceName = Settings.Default.ServiceName;
            base.Install(stateSaver);
        }

        protected override void OnBeforeInstall(IDictionary savedState)
        {
            serviceInstaller1.DisplayName = Settings.Default.ServiceDisplayName;
            serviceInstaller1.ServiceName = Settings.Default.ServiceName;
            base.OnBeforeInstall(savedState);
        }
    }
}
