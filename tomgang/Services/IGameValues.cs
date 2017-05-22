using System;
using System.Collections.Generic;
namespace tomgang.Services
{
    public interface IGameValues
    {
        void onAccountCreation(string userid);
        void onLiftClick(string userid);
        void increaseGains(string userid,double secondsSinceLastCall);

        void buyUpgrade(string userid, string id);

        List<string> checkAchievements(string userid);
        List<Tuple<string, int>> checkEligibleUpgrades(string userid);
    }
    
}