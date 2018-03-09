using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using Vocal.Model.Business;
using Vocal.Model.Context;

namespace Vocal.Business.Tools
{
    public class Monitoring : BaseBusiness
    {
        public Monitoring(DbContext context) : base(context)
        {

        }

        public Response<X> Execute<X, A>(Func<A, Response<X>> myFunction, A aParameter)
        {
            Stopwatch watch = new Stopwatch();
            watch.Start();
            var result = myFunction(aParameter);
            watch.Stop();
            Task.Run(() =>
            {
                var duration = (int)watch.Elapsed.TotalMilliseconds;
                var lstParams = new List<object> { aParameter};
                var obj = new Model.DB.Monitoring { MethodName = myFunction.Method.Name, Duration = duration, Params = lstParams };
                _repository.AddMonitoring(obj);
            });
            return result;
        }

        public Response<X> Execute<X, A, B>(Func<A, B, Response<X>> myFunction, A aParameter, B bParameter)
        {
            Stopwatch watch = new Stopwatch();
            watch.Start();
            var result = myFunction(aParameter, bParameter);
            watch.Stop();
            Task.Run(() =>
            {
                var duration = (int)watch.Elapsed.TotalMilliseconds;
                var lstParams = new List<object> { aParameter, bParameter };
                var obj = new Model.DB.Monitoring { MethodName = myFunction.Method.Name, Duration = duration, Params = lstParams };
                _repository.AddMonitoring(obj);
            });
            return result;
        }

        public Response<X> Execute<X, A, B, C>(Func<A, B, C, Response<X>> myFunction, A aParameter, B bParameter, C cParameter)
        {
            Stopwatch watch = new Stopwatch();
            watch.Start();
            var result = myFunction(aParameter, bParameter, cParameter);
            watch.Stop();
            Task.Run(() =>
            {
                var duration = (int)watch.Elapsed.TotalMilliseconds;
                var lstParams = new List<object> { aParameter, bParameter, cParameter };
                var obj = new Model.DB.Monitoring { MethodName = myFunction.Method.Name, Duration = duration, Params = lstParams };
                _repository.AddMonitoring(obj);
            });
            return result;
        }

        public Response<X> Execute<X, A, B, C, D>(Func<A, B, C, D, Response<X>> myFunction, A aParameter, B bParameter, C cParameter, D dParameter)
        {
            Stopwatch watch = new Stopwatch();
            watch.Start();
            var result = myFunction(aParameter, bParameter, cParameter, dParameter);
            watch.Stop();
            Task.Run(() =>
            {
                var duration = (int)watch.Elapsed.TotalMilliseconds;
                var lstParams = new List<object> { aParameter, bParameter, cParameter, dParameter };
                var obj = new Model.DB.Monitoring { MethodName = myFunction.Method.Name, Duration = duration, Params = lstParams };
                _repository.AddMonitoring(obj);
            });
            return result;
        }

        public Response<X> Execute<X, A, B, C, D, E>(Func<A, B, C, D, E, Response<X>> myFunction, A aParameter, B bParameter, C cParameter, D dParameter, E eParameter)
        {
            Stopwatch watch = new Stopwatch();
            watch.Start();
            var result = myFunction(aParameter, bParameter, cParameter, dParameter, eParameter);
            watch.Stop();
            Task.Run(() =>
            {
                var duration = (int)watch.Elapsed.TotalMilliseconds;
                var lstParams = new List<object> { aParameter, bParameter, cParameter, dParameter, eParameter };
                var obj = new Model.DB.Monitoring { MethodName = myFunction.Method.Name, Duration = duration, Params = lstParams };
                _repository.AddMonitoring(obj);
            });
            return result;
        }

        public Response<X> Execute<X, A, B, C, D, E, F>(Func<A, B, C, D, E, F, Response<X>> myFunction, A aParameter, B bParameter, C cParameter, D dParameter, E eParameter, F fParameter)
        {
            Stopwatch watch = new Stopwatch();
            watch.Start();
            var result = myFunction(aParameter, bParameter, cParameter, dParameter, eParameter, fParameter);
            watch.Stop();
            Task.Run(() =>
            {
                var duration = (int)watch.Elapsed.TotalMilliseconds;
                var lstParams = new List<object> { aParameter, bParameter, cParameter, dParameter, eParameter, fParameter };
                var obj = new Model.DB.Monitoring { MethodName = myFunction.Method.Name, Duration = duration, Params = lstParams };
                _repository.AddMonitoring(obj);
            });
            return result;
        }

        public Response<X> Execute<X, A, B, C, D, E, F, G>(Func<A, B, C, D, E, F, G, Response<X>> myFunction, A aParameter, B bParameter, C cParameter, D dParameter, E eParameter, F fParameter, G gParameter)
        {
            Stopwatch watch = new Stopwatch();
            watch.Start();
            var result = myFunction(aParameter, bParameter, cParameter, dParameter, eParameter, fParameter, gParameter);
            watch.Stop();
            Task.Run(() =>
            {
                var duration = (int)watch.Elapsed.TotalMilliseconds;
                var lstParams = new List<object> { aParameter, bParameter, cParameter, dParameter, eParameter, fParameter, gParameter };
                var obj = new Model.DB.Monitoring { MethodName = myFunction.Method.Name, Duration = duration, Params = lstParams };
                _repository.AddMonitoring(obj);
            });
            return result;
        }
    }
}
