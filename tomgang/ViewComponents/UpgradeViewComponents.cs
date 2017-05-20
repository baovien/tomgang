using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using tomgang.Data;

namespace ViewComponents
{
    // Controller for the view component that shows a list of recent articles
    public class UpgradeList : ViewComponent
    {
        private ApplicationDbContext db;

        public UpgradeList(ApplicationDbContext db)
        {
            this.db = db;
        
        }

        // This function fetches data for the view component.
        // It is an async function so it can run in parallell with other async functions.
        public async Task<IViewComponentResult> InvokeAsync()
        {
            var upgrades = await db.Upgrade.ToListAsync();
            return View(upgrades);
        }
    }
}