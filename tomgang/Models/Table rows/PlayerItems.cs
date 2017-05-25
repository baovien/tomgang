using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using tomgang.Services;
using System;
namespace tomgang.Models
{
    public class PlayerItems
    {

        public PlayerItems () {}

        public PlayerItems(string id, string item){
            userid = id;
            itemID = item;
          //  time = DateTime.Now;
        }
        [Key]
        public int ID{get;set;}
        public string userid{get;set;}
        public string itemID{get; set;}
        //public DateTime time {get;set;}
    }
}