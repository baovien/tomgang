using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using tomgang.Models;
using tomgang.Data;
using System.Security.Claims;

namespace tomgang.Controllers
{
    public class GameController : Controller
    {
        private readonly Services.IGameValues _GameValues;
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        public GameController(
        Services.IGameValues gameValues, 
        ApplicationDbContext dbContext, 
        UserManager<ApplicationUser> userManager){
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

        [HttpPost]
        public void liftClick(){
            _GameValues.onLiftClick(User.FindFirstValue(ClaimTypes.NameIdentifier));
        }

        [HttpGet]
        public double getCurrentGains(){
            return _dbContext.PlayerGains.Find(User.FindFirstValue(ClaimTypes.NameIdentifier)).currentGainsValue;
        }
        
        [HttpGet]
        public List<Tuple<string, int>> checkUpgrades(){
            return _GameValues.checkEligibleUpgrades(User.FindFirstValue(ClaimTypes.NameIdentifier));
        }
        
        [HttpGet]
        public List<string> checkAchis(){
            return _GameValues.checkAchievements(User.FindFirstValue(ClaimTypes.NameIdentifier));
        }
        [HttpGet]
        public List<Tuple<string, int>> getItemAmount(){
            return _GameValues.getItemAmounts(User.FindFirstValue(ClaimTypes.NameIdentifier));
        }
        [HttpGet]
        public int getSingleItemAmount(string itemid){
            return _GameValues.getItemAmount(User.FindFirstValue(ClaimTypes.NameIdentifier), itemid);
        }
        [HttpGet]
        public double getIncomeValue(){
            return _dbContext.PlayerGains.Find(User.FindFirstValue(ClaimTypes.NameIdentifier)).incomeValue;
        }
        [HttpGet]
        public void increaseGains(){
            _GameValues.increaseGains(User.FindFirstValue(ClaimTypes.NameIdentifier));
        }
    }
}