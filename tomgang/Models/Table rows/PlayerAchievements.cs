using System.ComponentModel.DataAnnotations;
using tomgang.Services;
namespace tomgang.Models
{
    public class PlayerAchievements
    {

        public PlayerAchievements () {}

        public PlayerAchievements(string id, int typ){
            Id = id;
            type = typ;
        }
        [Key]
        public int identifier{get;set;}
        public string Id{get; set;}

        public int type{get; set;}

    }
}