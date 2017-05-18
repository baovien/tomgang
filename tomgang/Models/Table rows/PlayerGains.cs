using System.ComponentModel.DataAnnotations;
using tomgang.Services;
namespace tomgang.Models
{
    public class PlayerGains : IPlayerGains
    {
        public PlayerGains(string id, int val){
            Id = id;
            value = val;
        }
        [Key]
        public string Id{get; set;}

        public int value{get; set;}
    }
}