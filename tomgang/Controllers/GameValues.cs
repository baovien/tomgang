using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using tomgang.Services;
using tomgang.Data;
using tomgang.Models;

namespace tomgang.Controllers
{
    public class GameValues : Services.IGameValues
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly IAchievement _achievement;
        private readonly IPlayerAchievements _playerAchievments;
        private readonly IPlayerGains _playerGains;
        private readonly IPlayerUpgrades _playerUpgrades;
        private readonly IUpgrade _upgrade;

        public GameValues(
            ApplicationDbContext dbContext,
            IAchievement achievement,
            IPlayerAchievements playerAchievements,
            IPlayerGains playerGains,
            IPlayerUpgrades playerUpgrades,
            IUpgrade upgrade)
            {
            _dbContext = dbContext;
            _achievement = achievement;
            _playerAchievments = playerAchievements;
            _playerGains = playerGains;
            _playerUpgrades = playerUpgrades;
            _upgrade = upgrade;
        }
        public void onAccountCreation(string userid){
             _dbContext.PlayerGainsTable.Add(new PlayerGains(userid, 0));
            //Setter alle verdiene til ny bruker til startverdier
        }
        public void onLiftClick(){
            //getter mouse click value til brukeren
            //adder mouse click value til playerGains
        }
        public void increaseGains(){
            //Getter Gains/s til brukeren
            //Adder Gains/s på current Gains utifra hvor lang tid som har gått siden sist
        }
        public void buyUpgrade(){
            //Henter upgraden som er kjøpt og applyer den til brukeren
            //Setter den som kjøpt
        }
    }
}