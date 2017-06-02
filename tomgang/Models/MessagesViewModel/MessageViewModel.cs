using System;
using System.ComponentModel.DataAnnotations;

namespace tomgang.Models
{
    public class MessageViewModel
    {
        public MessageViewModel() { }
        public MessageViewModel(Message message)
        {
            Content = message.Content;
            Author = message.User.UserName;
            Timestamp = message.DateCreated.AddHours(2);
        }
        [Required]
        public string Content { get; set; }

        [Required]
        public string Author { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime Timestamp { get; set; }
    }
}