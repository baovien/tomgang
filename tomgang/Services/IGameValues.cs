using System;
using System.Collections.Generic;
namespace tomgang.Services
{
    public interface IGameValues
    {
        void onAccountCreation(string userid);
        void onLiftClick(string userid);
        void increaseGains(string userid);
        void buyUpgrade(string userid, string id);
        void buyItem(string userid, string itemid);
        List<string> checkAchievements(string userid);
        List<Tuple<string, int>> checkEligibleUpgrades(string userid);
        List<Tuple<string, int>> getItemAmounts(string userid);
    }
    
}