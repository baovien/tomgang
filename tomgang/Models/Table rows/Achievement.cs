using System.ComponentModel.DataAnnotations;
using tomgang.Services;
namespace tomgang.Models
{
    public class Achievement
    
    {

        public Achievement () {}

        public Achievement(string id, int typ, int val){
            Id = id;
            type = typ;
            value = val;
        }

        [Key]
        public string Id{get; set;}

        public int type{get; set;}
        public int value{get; set;}
    }
}