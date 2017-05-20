using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace tomgang.Controllers
{
    public class GameController : Controller
    {
        private readonly Services.IGameValues _GameValues;
        public GameController(Services.IGameValues gameValues){
            _GameValues = gameValues;
        }
    }
}
