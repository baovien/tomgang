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
             _dbContext.PlayerGains.Add(new PlayerGains(userid));
             _dbContext.SaveChanges();
            //Setter alle verdiene til ny bruker til startverdier
            //System.Console.WriteLine("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ");
        }
        public void onLiftClick(string userid){
            _dbContext.PlayerGains.Find(userid).currentGainsValue +=
            _dbContext.PlayerGains.Find(userid).clickValue;
            _dbContext.SaveChanges();
            //_dbContext.PlayerGains
            //getter mouse click value til brukeren
            //adder mouse click value til playerGains
        }
        public void increaseGains(string userid,double secondsSinceLastCall){
            _dbContext.PlayerGains.Find(userid).currentGainsValue +=
            _dbContext.PlayerGains.Find(userid).incomeValue*secondsSinceLastCall;
            _dbContext.SaveChanges();
            //Getter Gains/s til brukeren
            //Adder Gains/s på current Gains utifra hvor lang tid som har gått siden sist
        }
        public void buyUpgrade(){
            
            _dbContext.SaveChanges();
            //Henter upgraden som er kjøpt og applyer den til brukeren
            //Setter den som kjøpt
        }
        public void checkAchievements(){

            _dbContext.SaveChanges();
        }
        public void giveAchievment(){

            _dbContext.SaveChanges();
        }
    }
}