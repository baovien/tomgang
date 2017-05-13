using System.ComponentModel.DataAnnotations;

namespace tomgang.Models
{
    public class Upgrade
    {
        [Key]
        public int Id{get; set;}

        public int type{get; set;}
        public int multi{get; set;}
    }
}