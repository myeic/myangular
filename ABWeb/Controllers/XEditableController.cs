using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ABWeb.Controllers
{
    public class XEditableController : Controller
    {
        //
        // GET: /XEditable/

        public ActionResult Index()
        {
            return View();
        }

        public JsonResult GetGroup()
        {
            List<SelectItem> items = new List<SelectItem>() {
                   new SelectItem (){ id="1", text ="ylei"},
                   new SelectItem (){ id="2", text ="wxq"},
                   new SelectItem (){ id="3", text ="zwm"},
                   new SelectItem (){ id="4", text ="lwl"},
                   new SelectItem (){ id="5", text ="sxh"},
            };
            return Json(items, JsonRequestBehavior.AllowGet);
        }

        public JsonResult CheckName(string value)
        {
            var data=new { status=value =="yanglei"?"ok":"error",msg= "Username should be `awesome`!" };
            return Json(data);
        }
        public JsonResult UpdateUser(string id,string name)
        {
            var data = new { status = "Error", msg = "Username should be `yanglei`!" };
            return Json(data);
        }

        public JsonResult SaveUser(string name, string status, string group)
        {
            var error = new { field= "name", msg= "Server-side error for this username!" };
            return Json(error);
        }
    }

    public class SelectItem
    {
        public string id { get; set; }
        public string text { get; set; }
    }
}
