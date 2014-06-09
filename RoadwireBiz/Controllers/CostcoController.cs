using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace RoadwireBiz.Controllers
{
    public class CostcoController : Controller
    {
        // GET: Costco
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Partial(string name)
        {
            return PartialView("Partials/" + name);
        }

    }
}