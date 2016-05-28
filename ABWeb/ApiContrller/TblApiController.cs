using ABWeb.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace ABWeb.ApiContrller
{
    public class rp
    {
        public int total { get; set; }

        public List<TableData> datas { get; set; }
    }

    public class TblApiController : ApiController
    {
        // GET api/<controller>
        public List<TableData> Get()
        {
            List<TableData> datas = new List<TableData>();
            TableData tdata = null;
            for (int i = 1; i < 100; i++)
            {
                string id = i.ToString();
                tdata = new TableData() {id=i, installationAt = "Philadelphia, PA" + id, adminEmail = "ksm@pobox.com" + id, poweredBy = "Cofax" + id, poweredByIcon = "/images/cofax.gif" + id };
                datas.Add(tdata);
            };
            return datas;
        }

        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}