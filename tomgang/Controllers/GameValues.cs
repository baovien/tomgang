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

        public GameValues(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public void onAccountCreation(string userid){
             _dbContext.PlayerGains.Add(new PlayerGains(userid, 0, 0, 1));
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