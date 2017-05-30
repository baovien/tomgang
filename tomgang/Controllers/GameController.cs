using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using tomgang.Models;
using tomgang.Data;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using Microsoft.AspNetCore.SignalR.Server;
using tomgang.Hubs;

namespace tomgang.Controllers
{
    public class GameController : Controller

    {
        private readonly Services.IGameValues _GameValues;
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        public GameController(Services.IGameValues gameValues, ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _GameValues = gameValues;
            _dbContext = dbContext;
            _userManager = userManager;
        }
        
        
        [HttpPost]
        public void upgradeClick(string id){
            _GameValues.buyUpgrade(User.FindFirstValue(ClaimTypes.NameIdentifier), id);
        }

        [HttpGet]
        public bool itemClick(string itemid){
            return _GameValues.buyItem(User.FindFirstValue(ClaimTypes.NameIdentifier), itemid);
        }
    }
}