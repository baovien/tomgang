using System.ComponentModel.DataAnnotations;
using tomgang.Services;
namespace tomgang.Models
{
    public class Upgrade
    {

        public Upgrade() {}

        public Upgrade(string id, int typ, int mult){
            Id = id;
            type = typ;
            multi = mult;
        }
        [Key]
        public string Id{get; set;}

        public int type{get; set;}
        public int multi{get; set;}
        public int reqType{get; set;}
        public int reqValue{get; set;}
        public int cost{get; set;}
        //public string name {get; set;}
        //public string description {get; set;}
        //public string bildepath? {get; set;}
    }
}