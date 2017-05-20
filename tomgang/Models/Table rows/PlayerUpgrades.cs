using System.ComponentModel.DataAnnotations;
using tomgang.Services;
namespace tomgang.Models
{
    public class PlayerUpgrades
    {

        public PlayerUpgrades () {}

        public PlayerUpgrades(string id, string typ){
            Id = id;
            type = typ;
        }
        [Key]
        public string Id{get; set;}

        public string type{get; set;} 
    }
}