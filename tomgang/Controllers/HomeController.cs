using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace tomgang.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Chat()
        {
            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "KONTAKT OSS";

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
