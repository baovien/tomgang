using System.ComponentModel.DataAnnotations;

namespace tomgang.Models
{
    public class Achievement
    
    {

        [Key]
        public int Id{get; set;}

        public int type{get; set;}
        public int value{get; set;}
    }
}