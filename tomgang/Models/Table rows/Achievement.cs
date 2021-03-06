using System.ComponentModel.DataAnnotations;
using tomgang.Services;
using System.Collections;
using System.Collections.Generic;
namespace tomgang.Models
{
    public class Achievement
    
    {

        public Achievement () {}

        public Achievement(string id, int typ, int val, string ImgPath, string desc){
            Id = id;
            type = typ;
            value = val;
            imgPath = ImgPath;
            description = desc;
        }

        [Key]
        public string Id{get; set;}
        public int type{get; set;}
        public int value{get; set;}
        public string imgPath{get;set;}
        public string description{get;set;}
    }
    public class Achievements{
        public IList<Achievement> achievements {get;set;}
    }
}