namespace tomgang.Services
{
    public interface IGameValues
    {
        void onAccountCreation(string userid);
        void onLiftClick(string userid);
        void increaseGains(string userid,double secondsSinceLastCall);

        void buyUpgrade(string userid, int id);

        void checkAchievements(string userid);
    }
    
}