using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace tomgang.Controllers
{
    public class GameValues : IGameValues
    {
        public void onAccountCreation(){
             System.Console.WriteLine("Hello");
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