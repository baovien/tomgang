using System.ComponentModel.DataAnnotations;

namespace tomgang.Models
{
    public class PlayerAchievement
    {
        [Key]
        public int Id{get; set;}

        public int type{get; set;}

    }
}