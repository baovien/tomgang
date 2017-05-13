using System.ComponentModel.DataAnnotations;
namespace tomgang.Models
{
    public class PlayerGains
    {
        [Key]
        public int Id{get; set;}

        public int value{get; set;}
    }
}