using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using tomgang.Data;
using tomgang.Models;

namespace tomgang.Hubs
{
    public class Broadcaster : Hub<IBroadcaster>
    {
        private readonly Services.IGameValues _GameValues;
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        public Broadcaster(Services.IGameValues gameValues, ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _GameValues = gameValues;
            _dbContext = dbContext;
            _userManager = userManager;
        }
        public override Task OnConnected()
        {
            // Set connection id for just connected client only
            return Clients.Client(Context.ConnectionId).SetConnectionId(Context.ConnectionId);
        }

        // Server side methods called from client
        public Task Subscribe(string chatroom)
        {
            return Groups.Add(Context.ConnectionId, chatroom.ToString());
        }
        public void liftClick(){
            var brukernavn = Context.User.Identity.Name;
            _GameValues.onLiftClick(brukernavn);
            
        }
        public Dictionary<string, dynamic> getUserInfo(){
            var brukernavn = Context.User.Identity.Name;
            return _GameValues.getUserInfo(brukernavn);
        }
        public double getCurrentGains(){
            var brukernavn = Context.User.Identity.Name;
            return _GameValues.getGains(brukernavn);
        }
        public List<Tuple<string, int>> checkUpgrades(){
            var brukernavn = Context.User.Identity.Name;
            return _GameValues.checkEligibleUpgrades(brukernavn);
        }
        public List<string> checkAchis(){
            var brukernavn = Context.User.Identity.Name;
            return _GameValues.checkAchievements(brukernavn);
        }
        public List<Tuple<string, int>> getItemAmount(){
            var brukernavn = Context.User.Identity.Name;
            return _GameValues.getItemAmounts(brukernavn);
        }
        public int getSingleItemAmount(string itemid){
            var brukernavn = Context.User.Identity.Name;
            return _GameValues.getItemAmount(brukernavn, itemid);
        }
        public double getIncomeValue(){
            var brukernavn = Context.User.Identity.Name;
            return _dbContext.PlayerGains.Find(brukernavn).incomeValue;
        }
        public void increaseGains(){
            var brukernavn = Context.User.Identity.Name;
            _GameValues.increaseGains(brukernavn);
        }
        public Task Unsubscribe(string chatroom)
        {
            return Groups.Remove(Context.ConnectionId, chatroom.ToString());
        }

        public void upgradeClick(string id){
            var brukernavn = Context.User.Identity.Name;
            _GameValues.buyUpgrade(brukernavn, id);
        }

        public bool itemClick(string itemid){
            var brukernavn = Context.User.Identity.Name;
            return _GameValues.buyItem(brukernavn, itemid);
        }
        public Dictionary<string, double> getHighscore(){
            return _GameValues.getHighscore();
        }
    }

    // Client side methods to be invoked by Broadcaster Hub
    public interface IBroadcaster
    {
        Task SetConnectionId(string connectionId);
        Task AddChatMessage(MessageViewModel message);
    }
}