using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace tomgang.Models.AccountViewModels
{
    public class ExternalLoginConfirmationViewModel
    {
        [Required]
        public string Email { get; set; }
    }
}
