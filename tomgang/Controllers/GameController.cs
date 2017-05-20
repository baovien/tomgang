using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using tomgang.Models;
using tomgang.Data;

namespace tomgang.Controllers
{
    public class GameController : Controller
    {
        private readonly Services.IGameValues _GameValues;
        private readonly ApplicationDbContext _dbContext;
        public GameController(Services.IGameValues gameValues,ApplicationDbContext dbContext){
            _GameValues = gameValues;
            _dbContext = dbContext;
        }
    }
}