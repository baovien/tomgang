using System.ComponentModel.DataAnnotations;
using tomgang.Services;
namespace tomgang.Models
{
    public class PlayerAchievements
    {

        public PlayerAchievements () {}

        public PlayerAchievements(string id, string typ){
            Id = id;
            type = typ;
        }
        [Key]
        public int identifier{get;set;}
        public string Id{get; set;}

        public string type{get; set;}

    }
}