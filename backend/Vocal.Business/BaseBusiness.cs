using Vocal.Model.Context;
using Vocal.DAL;
using Vocal.Business.Properties;

namespace Vocal.Business
{
    public abstract class BaseBusiness
    {
        protected Repository _repository; 
        protected NotificationHub _notificationHub;
        protected CognitiveService _cognitiveService;

        public BaseBusiness(DbContext dbContext)
        {
            _repository = Repository.Init(dbContext);
        }

        public BaseBusiness(DbContext dbContext, HubContext hubContext)
        {   
            _repository = Repository.Init(dbContext);
            _notificationHub = NotificationHub.Init(hubContext);
            _cognitiveService = CognitiveService.Init(Settings.Default.CognitiveServiceKey, Settings.Default.CognitiveServiceUrlLongAudio, _repository);
        }

        internal BaseBusiness(Repository repository)
        {
            _repository = repository;
        }

        internal BaseBusiness(Repository repository, NotificationHub notificationHub)
        {
            _repository = repository;
            _notificationHub = notificationHub;
        }

    }
}
