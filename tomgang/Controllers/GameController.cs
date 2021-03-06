using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using tomgang.Models;
using tomgang.Data;
using System.Security.Claims;


namespace tomgang.Controllers
{
    public class GameController : Controller

    {
        private readonly Services.IGameValues _GameValues;
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        public GameController(Services.IGameValues gameValues, ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _GameValues = gameValues;
            _dbContext = dbContext;
            _userManager = userManager;
        }
    }
}