using System.ComponentModel.DataAnnotations;
using tomgang.Services;
using System;
namespace tomgang.Models
{
    public class PlayerGains
    {
        public PlayerGains () {}

        public PlayerGains(string id){
            Id = id;
            currentGainsValue = 0;
            incomeValue =  0;
            clickValue = 1;
            itemMultiplier = 1;
            totalGains = 0;
            timeJoined = DateTime.Now;
            lastPurchaseTime = DateTime.Now;
        }
        [Key]
        public string Id{get; set;}
        public double clickValue{get; set;}
        public double incomeValue{get; set;}
        public double currentGainsValue{get; set;}
        public double totalGains{get; set;}
        public int timesClicked{get;set;}
        public double itemMultiplier{get;set;}
        public DateTime timeJoined {get;set;}
        public DateTime lastPurchaseTime {get;set;}
    }
}