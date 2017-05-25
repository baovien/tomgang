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
            //System.Console.WriteLine("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ");
        }
        public void onLiftClick(string userid)
        {
            _dbContext.PlayerGains.Find(userid).totalGains +=
            _dbContext.PlayerGains.Find(userid).clickValue;
            _dbContext.PlayerGains.Find(userid).currentGainsValue +=
            _dbContext.PlayerGains.Find(userid).clickValue;
            _dbContext.PlayerGains.Find(userid).timesClicked++; //Teller antall klikk (Relevant for achis og upgrade unlocks)
            _dbContext.SaveChanges();
            //getter mouse click value til brukeren
            //adder mouse click value til playerGains
        }
        public void increaseGains(string userid, double secondsSinceLastCall)
        {
            _dbContext.PlayerGains.Find(userid).totalGains +=
            _dbContext.PlayerGains.Find(userid).incomeValue * secondsSinceLastCall;
            _dbContext.PlayerGains.Find(userid).currentGainsValue +=
            _dbContext.PlayerGains.Find(userid).incomeValue * secondsSinceLastCall;
            _dbContext.SaveChanges();

            //Getter Gains/s til brukeren
            //Adder Gains/s på current Gains utifra hvor lang tid som har gått siden sist
        }


        //Denne trenger userid, typen upgrade kjøpt og tilhørende value
        public void buyUpgrade(string userid, string id)
        {
            //IDen bestemmer hva upgraden vil påvirke. Om flere typer
            //upgrades er ønsket er det bare å adde en case for typen.

            //Henter upgraden som er kjøpt og applyer den til brukeren
            //Setter den som kjøpt
            if (_dbContext.PlayerGains.Find(userid).currentGainsValue >= _dbContext.Upgrade.Find(id).cost)
            {
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
                    case 3:
                        _dbContext.PlayerGains.Find(userid).clickValue *= _dbContext.Upgrade.Find(id).multi;
                        //Multipliser med click
                        break;
                    case 4:
                        _dbContext.PlayerGains.Find(userid).clickValue += _dbContext.Upgrade.Find(id).multi;
                        //Add på click
                        break;
                    case 5:
                        _dbContext.PlayerGains.Find(userid).itemMultiplier *= _dbContext.Upgrade.Find(id).multi;
                        break;
                    default:
                        break;
                }
                _dbContext.PlayerUpgrades.Add(new PlayerUpgrades(userid, id));
                _dbContext.SaveChanges();
            }
        }
        public List<string> checkAchievements(string userid)
        {
            var earnedAchievements = _dbContext.PlayerAchievments.Where(m => m.Id == userid).Select(m => m.type).ToList();
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
                    default:
                        break;
                }
            }
            _dbContext.SaveChanges();
            var list = _dbContext.PlayerAchievments.Where(m => m.Id == userid).Select(m => m.type).ToList();
            return (list);
        }
        public List<Tuple<string, int>> checkEligibleUpgrades(string userid)
        {
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
        public void buyItem(string userid, string itemid)
        {
            //Hvis bruker har råd til upgraden
            //startverdi*(e^0.14x)

            var amount = _dbContext.PlayerItems
            .Where(m => m.userid == userid && m.itemID == itemid)
            .Select(m => m.ID).Count();
            var startingPrice = _dbContext.Item.Find(itemid).cost;
            double price = (startingPrice * Math.Pow(Math.E, amount));
            Console.WriteLine(amount);
            Console.WriteLine(startingPrice);
            Console.WriteLine(price);

            if (_dbContext.PlayerGains.Find(userid).currentGainsValue >= price)
            {
                Console.WriteLine("--------------------------------------------------IF ENTERED--------------------------------");
                _dbContext.PlayerGains.Find(userid).currentGainsValue -= price;
                _dbContext.PlayerItems.Add(new Models.PlayerItems(userid, itemid));
                _dbContext.SaveChanges();
            }
            else
            {
                Console.WriteLine("--------------------------------------------------ELSE--------------------------------");
            }

        }
    }
}