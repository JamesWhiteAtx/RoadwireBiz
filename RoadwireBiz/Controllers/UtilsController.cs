using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RoadwireBiz.Controllers
{
    public class UtilsController : BaseController
    {
        //
        // GET: /Utils/
        public ActionResult Index()
        {
            return View();
        }

        // GET: /Utils/Map
        public ActionResult Map(string id)
        {
            return RedirectToHashActId(id);
        }
	}
}