using System.ComponentModel.DataAnnotations;

namespace tomgang.Models
{
    public class NewMessageViewModel
    {
        [Required]
        public string Content { get; set; }
    }
}