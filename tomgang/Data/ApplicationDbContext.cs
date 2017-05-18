using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using tomgang.Models;

namespace tomgang.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Message> Message { get; set; }
        
        //Tables som holder styr på spillets verdier
        public DbSet<Upgrade> UpgradeTable { get; set;}
        public DbSet<Achievement> AchievementTable { get; set;}
        public DbSet<PlayerGains> PlayerGainsTable { get; set;}
        public DbSet<PlayerAchievements> PlayerAchievmentTable { get; set;}
        public DbSet<PlayerUpgrades> PlayerUpgradeTable { get; set;}
        
        
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);

            builder.Entity<Message>()
                .Property(m => m.DateCreated)
                .HasDefaultValueSql("strftime('%Y-%m-%d %H:%M:%S')");
        }
    }
}
