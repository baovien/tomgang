using System.ComponentModel.DataAnnotations;
using tomgang.Services;
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
}