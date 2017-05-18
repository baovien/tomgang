using System.ComponentModel.DataAnnotations;
using tomgang.Services;
namespace tomgang.Models
{
    public class PlayerGains : IPlayerGains
    {
        public PlayerGains(string id, int currentGains, int income, int click){
            Id = id;
            currentGainsValue = currentGains;
            incomeValue = income;
            clickValue = click;
        }
        [Key]
        public string Id{get; set;}

        public int clickValue{get; set;}
        public int incomeValue{get; set;}
        public int currentGainsValue{get; set;}
    }
}