using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using tomgang.Services;
namespace tomgang.Models
{
    public class PlayerItems
    {

        public PlayerItems () {}

        public PlayerItems(string id, string item){
            userid = id;
            itemID = item;
            amount = 0;
        }
        [Key, Column(Order = 0)]
        public string userid{get;set;}
        [Key, Column(Order = 1)]
        public string itemID{get; set;}
        public int amount{get; set;} 
    }
}