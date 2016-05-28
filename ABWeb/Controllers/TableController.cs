using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ABWeb.Controllers
{
    public class TableController : Controller
    {
        //
        // GET: /Table/

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetTableData()
        {
            List<TableData> datas = new List<TableData>() {
               new TableData(){ installationAt="Philadelphia, PA1", adminEmail ="ksm@pobox.com2", poweredBy ="Cofax3", poweredByIcon ="/images/cofax.gif4"}
            };
            return Json(datas, JsonRequestBehavior.AllowGet);
        }

    }

    public class TableData
    {
        public string installationAt { get; set; }

        public string adminEmail { get; set; }

        public string poweredBy { get; set; }

        public string poweredByIcon { get; set; }

        public int id { get; set; }
    }
}
