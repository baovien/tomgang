using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using tomgang.Data;
using tomgang.Models;

namespace tomgang.Hubs
{
    public class Broadcaster : Hub<IBroadcaster>
    {
        private readonly Services.IGameValues _GameValues;
        private readonly ApplicationDbContext _dbContext;
        private readonly UserManager<ApplicationUser> _userManager;
        public Broadcaster(Services.IGameValues gameValues, ApplicationDbContext dbContext, UserManager<ApplicationUser> userManager)
        {
            _GameValues = gameValues;
            _dbContext = dbContext;
            _userManager = userManager;
        }
        public override Task OnConnected()
        {
            // Set connection id for just connected client only
            return Clients.Client(Context.ConnectionId).SetConnectionId(Context.ConnectionId);
        }

        // Server side methods called from client
        public Task Subscribe(string chatroom)
        {
            return Groups.Add(Context.ConnectionId, chatroom.ToString());
        }
        public void liftClick(){
            var helo = Context.User.Identity.Name;
            _GameValues.onLiftClick(helo);
            
        }
        public double getCurrentGains(){
        var helo = Context.User.Identity.Name;
            return _GameValues.getGains(helo);
        }
        public Task Unsubscribe(string chatroom)
        {
            return Groups.Remove(Context.ConnectionId, chatroom.ToString());
        }
    }

    // Client side methods to be invoked by Broadcaster Hub
    public interface IBroadcaster
    {
        Task SetConnectionId(string connectionId);
        Task AddChatMessage(MessageViewModel message);
    }
}