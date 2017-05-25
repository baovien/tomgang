using System.ComponentModel.DataAnnotations;
using tomgang.Services;
using System;
namespace tomgang.Models
{
    public class PlayerUpgrades
    {

        public PlayerUpgrades () {}

        public PlayerUpgrades(string id, string typ){
            Id = id;
            type = typ;
            time = DateTime.Now;
        }
        [Key]
        public int identifier{get;set;}
        public string Id{get; set;}
        public string type{get; set;} 
        public DateTime time {get;set;}
    }
}