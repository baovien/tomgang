using System.ComponentModel.DataAnnotations;
using tomgang.Services;
namespace tomgang.Models
{
    public class PlayerGains
    {
        public PlayerGains(string id){
            Id = id;
            currentGainsValue = 0;
            incomeValue =  0;
            clickValue = 1;
        }
        [Key]
        public string Id{get; set;}

        public double clickValue{get; set;}
        public double incomeValue{get; set;}
        public double currentGainsValue{get; set;}
    }
}