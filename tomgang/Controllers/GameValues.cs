using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Linq;
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


        //Denne trenger userid, typen upgrade kjøpt og tilhørende value
        public void buyUpgrade(string userid, string id){
            //IDen bestemmer hva upgraden vil påvirke. Om flere typer
            //upgrades er ønsket er det bare å adde en case for typen.
            
            //Henter upgraden som er kjøpt og applyer den til brukeren
            //Setter den som kjøpt
            switch (_dbContext.Upgrade.Find(id).type){
                case 1:
                    //Multipliser med income
                    _dbContext.PlayerGains.Find(userid).incomeValue *= _dbContext.Upgrade.Find(id).multi;
                    break;
                case 2:
                    //Add på income
                    _dbContext.PlayerGains.Find(userid).incomeValue += _dbContext.Upgrade.Find(id).multi;
                    break;
                case 3:
                    _dbContext.PlayerGains.Find(userid).clickValue *= _dbContext.Upgrade.Find(id).multi;
                    //Multipliser med click
                    break;
                case 4:
                    _dbContext.PlayerGains.Find(userid).clickValue += _dbContext.Upgrade.Find(id).multi;
                    //Add på click
                    break;
            }
            //_dbContext.PlayerUpgrades.Add(new PlayerUpgrades(userid, id));
            _dbContext.SaveChanges();
        }
        public void checkAchievements(string userid){
                //Loope igjennom alle achievement reqs og sjekke om brukeren har fått noen
                //Adde achievements brukeren har fått
        
                for (int i = 0; i < _dbContext.Achievement.Count(); i++)
                {
                    switch(_dbContext.Achievement.Find(i).type){
                        case 0:
                        //Sjekker user har større verdi enn required og om user har achien fra før
                            if(_dbContext.PlayerGains.Find(userid).currentGainsValue >= 
                            _dbContext.Achievement.Find(i).value &&
                            _dbContext.PlayerAchievments.Find(userid, i) != null){
                                _dbContext.PlayerAchievments.Add(new PlayerAchievements(userid, i));
                            }
                            break;
                        case 1:
                            break;
                        case 2:
                            break;
                            
                    }
                }
                    
            _dbContext.SaveChanges();
                }
        }
}