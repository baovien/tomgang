using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using tomgang.Data;
using tomgang.Models;
using tomgang.Services;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity;

namespace tomgang
{
    public class Startup
    {

        public IHostingEnvironment _env;
        public IConfigurationRoot Configuration { get; }

        public Startup(IHostingEnvironment env)
        {

            //Setter _env med current hostingenv. Gjør dette for å få tilgang til environment i ConfigureServices
            _env = env;

            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

            if (env.IsDevelopment())
            {
                // For more details on using the user secret store see https://go.microsoft.com/fwlink/?LinkID=532709
                builder.AddUserSecrets<Startup>();
            }

            builder.AddEnvironmentVariables();
            Configuration = builder.Build();
        }
        

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {  
            // Add framework services.
            services.AddDbContext<ApplicationDbContext>(options => 
            {
                //Development mode, SQLite
                if(_env.IsDevelopment())
                {
                    options.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
                }
                else //Staging, Production, SQL server (Azure)
                {
                    options.UseSqlServer(Configuration.GetConnectionString("AzureSQL"));
                }
            });
                

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            var settings = new JsonSerializerSettings();
            settings.ContractResolver = new SignalRContractResolver();

            var serializer = JsonSerializer.Create(settings);

            services.Add(new ServiceDescriptor(typeof(JsonSerializer),
                                            provider => serializer,
                                            ServiceLifetime.Transient));


            services.AddSignalR(options => options.Hubs.EnableDetailedErrors = true);

            services.AddMvc();
            // Add application services.
            services.AddTransient<IEmailSender, AuthMessageSender>();
            services.AddTransient<ISmsSender, AuthMessageSender>();
        }

        // Called by Configure(). This needs an async function because
        // all the userManager and roleManager functions are async.
        public async Task CreateUsersAndRoles(IServiceScope serviceScope)
        {
            var userManager = serviceScope.ServiceProvider.GetService<UserManager<ApplicationUser>>();
            var roleManager = serviceScope.ServiceProvider.GetService<RoleManager<IdentityRole>>();

            // First create the admin role
            await roleManager.CreateAsync(new IdentityRole("Admin"));

            // Then add one admin user
            var adminUser = new ApplicationUser { UserName = "Anders", Email = "anders@bk.no" };
            await userManager.CreateAsync(adminUser, "Password1.");
            await userManager.AddToRoleAsync(adminUser, "Admin");

            var adminUser1 = new ApplicationUser { UserName = "Bao", Email = "bao@bk.no" };
            await userManager.CreateAsync(adminUser1, "Password1.");
            await userManager.AddToRoleAsync(adminUser1, "Admin");

            var adminUser2 = new ApplicationUser { UserName = "Kris", Email = "kris@bk.no" };
            await userManager.CreateAsync(adminUser2, "Password1.");
            await userManager.AddToRoleAsync(adminUser2, "Admin");
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();  

                using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
                {
                    var db = serviceScope.ServiceProvider.GetService<Data.ApplicationDbContext>();

                    db.Database.EnsureDeleted();
                    db.Database.EnsureCreated();

                    // Then create the standard users and roles
                    CreateUsersAndRoles(serviceScope).Wait();
                    
                }
                
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            app.UseIdentity();

            // Add external authentication middleware below. To configure them please see https://go.microsoft.com/fwlink/?LinkID=532715

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
            app.UseWebSockets();
            app.UseSignalR();
        }
    }
}
