using System.ComponentModel.DataAnnotations;
using tomgang.Services;
using System.Collections;
using System.Collections.Generic;
namespace tomgang.Models
{
    public class Item
    {

        public Item () {}

        public Item(string id, int inc, int Cost, string ImgPath){
            Id = id;
            income = inc;
            cost = Cost;
            imgPath = ImgPath;
        }
        [Key]
        public string Id{get; set;}
        public int income{get; set;}
        public int cost{get; set;}
        public string imgPath{get; set;}
    }
    public class Items{
        public IList<Item> items {get;set;}
    }
}