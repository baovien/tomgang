using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Linq;
using System;
using tomgang.Services;
using tomgang.Data;
using tomgang.Models;
using System.Collections.Generic;

namespace tomgang.Controllers
{
    public class GameValues : Services.IGameValues
    {
        private readonly ApplicationDbContext _dbContext;
        public GameValues(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public void onAccountCreation(string userid)
        {
            _dbContext.PlayerGains.Add(new PlayerGains(userid));
            _dbContext.SaveChanges();
            //Setter alle verdiene til ny bruker til startverdier
        }
        public double getGains(string brukernavn)
        {
            var userid = _dbContext.Users.Where(m => m.UserName == brukernavn).Select(m => m.Id).SingleOrDefault();
            return _dbContext.PlayerGains.Find(userid).currentGainsValue;
        }

        public Dictionary<string, dynamic> getUserInfo(string brukernavn)
        {
            var map = new Dictionary<string, dynamic>();
            var userid = _dbContext.Users.Where(m => m.UserName == brukernavn).Select(m => m.Id).SingleOrDefault();
            map.Add("currentGains", _dbContext.PlayerGains.Find(userid).currentGainsValue);
            map.Add("incomeValue", _dbContext.PlayerGains.Find(userid).incomeValue);
            map.Add("clickValue", _dbContext.PlayerGains.Find(userid).clickValue);
            map.Add("totalGains", _dbContext.PlayerGains.Find(userid).totalGains);
            map.Add("timesClicked", _dbContext.PlayerGains.Find(userid).timesClicked);
            map.Add("timeJoined", _dbContext.PlayerGains.Find(userid).timeJoined);
            return map;
        }
        public void onLiftClick(string brukernavn)
        {
            var userid = _dbContext.Users.Where(m => m.UserName == brukernavn).Select(m => m.Id).SingleOrDefault();
            Console.Write(userid);
            _dbContext.PlayerGains.Find(userid).totalGains +=
            _dbContext.PlayerGains.Find(userid).clickValue;
            _dbContext.PlayerGains.Find(userid).currentGainsValue +=
            _dbContext.PlayerGains.Find(userid).clickValue;
            _dbContext.PlayerGains.Find(userid).timesClicked++; //Teller antall klikk (Relevant for achis og upgrade unlocks)
            _dbContext.SaveChanges();
            //getter mouse click value til brukeren
            //adder mouse click value til playerGains
        }
        public void increaseGains(string brukernavn)
        {
            var userid = _dbContext.Users.Where(m => m.UserName == brukernavn).Select(m => m.Id).SingleOrDefault();

            //Loopen regner ut totale gains/s utifra alle items og deres upgrademultipliers
            var cumulative = 1.0;
            var increaseGains = 0.0;
            //For hvert item i item
            foreach (var item in _dbContext.Item)
            {   //For hver upgrade til spilleren
                foreach (var thing in _dbContext.PlayerUpgrades.Where(m => m.Id == userid))
                {   //Hvis typen matcher itemtypen er det riktig type, da betyr det at player har en upgrade
                    //som påvirker itemet vi sjekker for nå. Altså må multiplieren tas med.
                    if (item.type == _dbContext.Upgrade.Find(thing.type).type)
                    {
                        cumulative *= _dbContext.Upgrade.Find(thing.type).multi;
                    }
                }
                //Når det er regnet ut legger man til incomen til det ene itemet.
                if (item.type > 3)
                {
                    increaseGains +=
                    (_dbContext.PlayerItems
                    .Where(m => m.userid == userid && m.itemID == item.Id)
                    .Select(m => m.ID).Count() * item.income * cumulative);
                    cumulative = 1.0;
                }
                else
                {
                    _dbContext.PlayerGains.Find(userid).clickValue = 1 +
                    (_dbContext.PlayerItems
                    .Where(m => m.userid == userid && m.itemID == item.Id)
                    .Select(m => m.ID).Count() * item.income * cumulative);
                    cumulative = 1.0;
                }
            }
            //Til slutt sitter man igjen med incomen til alle items, altså total gains/s
            _dbContext.PlayerGains.Find(userid).incomeValue = increaseGains;

            var diff = DateTime.Now.Subtract(_dbContext.PlayerGains.Find(userid).lastPurchaseTime);
            var secondsSinceLastCall = diff.TotalSeconds;
            _dbContext.PlayerGains.Find(userid).lastPurchaseTime = DateTime.Now;

            //Tar tiden siden den var kalt sist i betraktning når jeg øker verdiene gitt gains/s
            _dbContext.PlayerGains.Find(userid).totalGains +=
            _dbContext.PlayerGains.Find(userid).incomeValue * secondsSinceLastCall;
            _dbContext.PlayerGains.Find(userid).currentGainsValue +=
            _dbContext.PlayerGains.Find(userid).incomeValue * secondsSinceLastCall;
            _dbContext.PlayerGains.Find(userid).lastPurchaseTime = DateTime.Now;
            _dbContext.SaveChanges();


            //Getter Gains/s til brukeren
            //Adder Gains/s på current Gains utifra hvor lang tid som har gått siden sist
        }
        public bool buyUpgrade(string brukernavn, string id)
        {
            var userid = _dbContext.Users.Where(m => m.UserName == brukernavn).Select(m => m.Id).SingleOrDefault();
            //IDen bestemmer hva upgraden vil påvirke. Om flere typer
            //upgrades er ønsket er det bare å adde en case for typen.

            //Henter upgraden som er kjøpt og applyer den til brukeren
            //Setter den som kjøpt
            if (_dbContext.PlayerGains.Find(userid).currentGainsValue >= _dbContext.Upgrade.Find(id).cost)
            {
                increaseGains(brukernavn);
                _dbContext.PlayerGains.Find(userid).currentGainsValue -= _dbContext.Upgrade.Find(id).cost;
                switch (_dbContext.Upgrade.Find(id).type)
                {
                    case 1:
                        //Multipliser med income
                        _dbContext.PlayerGains.Find(userid).incomeValue *= _dbContext.Upgrade.Find(id).multi;
                        break;
                    case 2:
                        //Add på income
                        _dbContext.PlayerGains.Find(userid).incomeValue += _dbContext.Upgrade.Find(id).multi;
                        break;
                    default:
                        break;
                }
                _dbContext.PlayerUpgrades.Add(new PlayerUpgrades(userid, id));
                _dbContext.SaveChanges();
                return true;
            }else{
                return false;
            }
        }
        public List<string> checkAchievements(string brukernavn)
        {
            var userid = _dbContext.Users.Where(m => m.UserName == brukernavn).Select(m => m.Id).SingleOrDefault();
            //var earnedAchievements = _dbContext.PlayerAchievments.Where(m => m.Id == userid).Select(m => m.type).ToList();
            //Loope igjennom alle achievement reqs og sjekke om brukeren har fått noen
            //Adde achievements brukeren har fått

            foreach (var item in _dbContext.Achievement)
            {
                switch (item.type)
                {
                    case 0:
                        //Sjekker user har større verdi enn required og om user har achien fra før
                        if (_dbContext.PlayerGains.Find(userid).currentGainsValue >=
                        item.value && _dbContext.PlayerAchievments.Where(m => m.Id == userid && m.type == item.Id).Count() == 0)
                        {
                            _dbContext.PlayerAchievments.Add(new PlayerAchievements(userid, item.Id));
                        }
                        break;
                    case 1:
                        if (_dbContext.PlayerGains.Find(userid).clickValue >=
                            item.value && _dbContext.PlayerAchievments.Where(m => m.Id == userid && m.type == item.Id).Count() == 0)
                        {
                            _dbContext.PlayerAchievments.Add(new PlayerAchievements(userid, item.Id));
                        }
                        break;
                    case 2:
                        if (_dbContext.PlayerGains.Find(userid).timesClicked >=
                            item.value && _dbContext.PlayerAchievments.Where(m => m.Id == userid && m.type == item.Id).Count() == 0)
                        {
                            _dbContext.PlayerAchievments.Add(new PlayerAchievements(userid, item.Id));
                        }
                        break;
                    case 3:
                        if (_dbContext.PlayerGains.Find(userid).incomeValue >=
                        item.value && _dbContext.PlayerAchievments.Where(m => m.Id == userid && m.type == item.Id).Count() == 0)
                        {
                            _dbContext.PlayerAchievments.Add(new PlayerAchievements(userid, item.Id));
                        }
                        break;
                    case 4:
                        if (_dbContext.PlayerGains.Find(userid).totalGains >=
                        item.value && _dbContext.PlayerAchievments.Where(m => m.Id == userid && m.type == item.Id).Count() == 0)
                        {
                            _dbContext.PlayerAchievments.Add(new PlayerAchievements(userid, item.Id));
                        }
                        break;
                    default:
                        break;
                }
            }
            _dbContext.SaveChanges();
            var list = _dbContext.PlayerAchievments.Where(m => m.Id == userid).Select(m => m.type).ToList();
            return (list);
        }
        public List<Tuple<string, int>> checkEligibleUpgrades(string brukernavn)
        {
            var userid = _dbContext.Users.Where(m => m.UserName == brukernavn).Select(m => m.Id).SingleOrDefault();
            var time = new Stopwatch();
            time.Start();
            time.Restart();

            //Lager en liste som inneholder alle upgrades ikke allerede kjøpt.
            //Videre skal vi fjerne upgrades brukeren ikke kvalifiserer for i denne funksjonen.
            var purchasedUpgrades = _dbContext.PlayerUpgrades.Where(m => m.Id == userid).Select(m => m.type).ToList();
            var allUpgrades = _dbContext.Upgrade.Select(m => m.Id).ToList();
            var affordableEligibleUpgrades = allUpgrades.Except(purchasedUpgrades).ToList();
            //List<string> inaffordableEligibleUpgrades = null;

            foreach (var item in _dbContext.Upgrade)
            {
                //int requirementType = _dbContext.Upgrade.Find(item.Id).reqType;
                //int requirementValue = _dbContext.Upgrade.Find(item.Id).reqValue;
                int requirementValue = item.reqValue;
                int requirementType = item.reqType;
                switch (requirementType)
                {
                    case 1: //Sjekker timesClicked for å unlocke upgrade
                        if (_dbContext.PlayerGains.Find(userid).timesClicked < requirementValue)
                        {
                            affordableEligibleUpgrades.RemoveAll(m => m.Equals(_dbContext.Upgrade.Find(item.Id).Id));
                            //Fjerner en upgrade fra eligibleUpgrades om bruker ikke har verdiene som kreves
                            //for å unlocke den.
                        }
                        break;
                    case 2: //Sjekker clickValue for å unlocke upgrade
                        if (_dbContext.PlayerGains.Find(userid).clickValue < requirementValue)
                        {
                            affordableEligibleUpgrades.RemoveAll(m => m.Equals(_dbContext.Upgrade.Find(item.Id).Id));
                            //Fjerner en upgrade fra eligibleUpgrades om bruker ikke har verdiene som kreves
                            //for å unlocke den.
                        }
                        break;
                    case 3: //Sjekker incomeValue for å unlocke upgrade
                        if (_dbContext.PlayerGains.Find(userid).incomeValue < requirementValue)
                        {
                            affordableEligibleUpgrades.RemoveAll(m => m.Equals(_dbContext.Upgrade.Find(item.Id).Id));
                            //Fjerner en upgrade fra eligibleUpgrades om bruker ikke har verdiene som kreves
                            //for å unlocke den.
                        }
                        break;
                    case 4: //Sjekker totalGains for å unlocke upgrade
                        if (_dbContext.PlayerGains.Find(userid).totalGains < requirementValue)
                        {
                            affordableEligibleUpgrades.RemoveAll(m => m.Equals(_dbContext.Upgrade.Find(item.Id).Id));
                            //Fjerner en upgrade fra eligibleUpgrades om bruker ikke har verdiene som kreves
                            //for å unlocke den.
                        }
                        break;
                    case 5: //Sjekker summen av antall items for å unlocke upgrade
                        if (_dbContext.PlayerItems
                            .Where(m => m.userid == userid)
                            .Select(m => m.ID).Count() < requirementValue)
                        {
                            affordableEligibleUpgrades.RemoveAll(m => m.Equals(_dbContext.Upgrade.Find(item.Id).Id));
                        }
                        break;
                    default:
                        break;
                }
                /*if (_dbContext.PlayerGains.Find(userid).currentGainsValue < item.cost)
                {
                    affordableEligibleUpgrades.RemoveAll(m => m.Equals(_dbContext.Upgrade.Find(item.Id).Id));
                    inaffordableEligibleUpgrades.Add(item.Id);
                    //Fjerner en upgrade fra eligibleUpgrades om bruker ikke har verdiene som kreves
                    //for å unlocke den.
                }*/
            }
            var list = new List<Tuple<string, int>>();
            foreach (var upgrade in affordableEligibleUpgrades)
            {
                list.Add(Tuple.Create(upgrade, _dbContext.Upgrade.Find(upgrade).cost));
            }
            //System.Console.WriteLine(time.ElapsedMilliseconds);
            return list;

            /*var aflength = affordableEligibleUpgrades.Count;
            affordableEligibleUpgrades.AddRange(inaffordableEligibleUpgrades);
            affordableEligibleUpgrades.Add(aflength.ToString());
            return affordableEligibleUpgrades;*/
        }
        public bool buyItem(string brukernavn, string itemid)
        {
            var userid = _dbContext.Users.Where(m => m.UserName == brukernavn).Select(m => m.Id).SingleOrDefault();
            //Hvis bruker har råd til upgraden
            //startverdi*(e^0.14x)
            var amount = _dbContext.PlayerItems
            .Where(m => m.userid == userid && m.itemID == itemid)
            .Select(m => m.ID).Count();
            var startingPrice = _dbContext.Item.Find(itemid).cost;
            double price = (startingPrice * Math.Pow(Math.E, 0.14 * amount));
            /*Console.WriteLine(amount);
            Console.WriteLine(startingPrice);
            Console.WriteLine(price);*/

            if (_dbContext.PlayerGains.Find(userid).currentGainsValue >= price)
            {
                increaseGains(brukernavn);
                _dbContext.PlayerGains.Find(userid).currentGainsValue -= price;
                _dbContext.PlayerItems.Add(new Models.PlayerItems(userid, itemid));
                _dbContext.SaveChanges();
                return true;
            }
            else
            {
                return false;
            }
        }
        public List<Tuple<string, int>> getItemAmounts(string brukernavn)
        {
            var userid = _dbContext.Users.Where(m => m.UserName == brukernavn).Select(m => m.Id).SingleOrDefault();
            var list = new List<Tuple<string, int>>();
            foreach (var item in _dbContext.Item)
            {
                list.Add(Tuple.Create(item.Id,
                _dbContext.PlayerItems
                .Where(m => m.userid == userid && m.itemID == item.Id)
                .Select(m => m.ID).Count()));
            }
            return list;
        }

        public int getItemAmount(string brukernavn, string itemid)
        {
            var userid = _dbContext.Users.Where(m => m.UserName == brukernavn).Select(m => m.Id).SingleOrDefault();
            return (_dbContext.PlayerItems
                .Where(m => m.userid == userid && m.itemID == itemid)
                .Select(m => m.ID).Count());
        }
        public List<Tuple<string, double>> getHighscore()
        {
            var highscore = new List<Tuple<string, double>>();
            foreach (var player in _dbContext.PlayerGains)
            {
                var username = _dbContext.Users.Find(player.Id).UserName;
                highscore.Add(Tuple.Create(username, player.totalGains));
            }

            return highscore;
        }

    }
}