using System.ComponentModel.DataAnnotations;
using tomgang.Services;
namespace tomgang.Models
{
    public class Item
    {

        public Item () {}

        public Item(string id, string inc, int Cost){
            Id = id;
            income = inc;
            cost = Cost;
        }
        [Key]
        public string Id{get; set;}
        public string income{get; set;}
        public int cost{get; set;}
    }
}