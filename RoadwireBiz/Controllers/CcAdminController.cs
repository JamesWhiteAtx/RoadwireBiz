using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RoadwireBiz.Controllers
{
    [Authorize]
    public class CcAdminController : BaseController
    {
        // GET: Costco
        public ActionResult Index()
        {
            return View();
        }
    }
}