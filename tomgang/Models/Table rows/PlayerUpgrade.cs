using System.ComponentModel.DataAnnotations;

namespace tomgang.Models
{
    public class PlayerUpgrade
    {
        [Key]
        public int Id{get; set;}

        public int type{get; set;} 
    }
}