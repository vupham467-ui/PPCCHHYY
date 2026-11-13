using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API_PCHY.Services.SMART_CA;
using APIPCHY.APIHelper;
using APIPCHY.Helpers;
using APIPCHY_PhanQuyen.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Net;
using QLTB_API.Helpers;
using QLTB_API.Pdf.Services;
using QLTB_API.PdfSign.Services;
using QLTB_API.Services.Audit;
using CHCT_API.Helpers;

namespace QLTB_API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Chỉ tiếp nhận thông tin IP/protocol được chuyển tiếp từ các reverse proxy
            // đã khai báo. Không tin cậy X-Forwarded-For từ mọi máy khách để tránh giả mạo IP.
            services.Configure<ForwardedHeadersOptions>(options =>
            {
                options.ForwardedHeaders = ForwardedHeaders.XForwardedFor
                    | ForwardedHeaders.XForwardedProto;
                options.ForwardLimit = Configuration.GetValue<int?>("ReverseProxy:ForwardLimit") ?? 1;

                foreach (string configuredProxy in Configuration
                    .GetSection("ReverseProxy:KnownProxies")
                    .GetChildren()
                    .Select(x => x.Value)
                    .Where(x => !string.IsNullOrWhiteSpace(x)))
                {
                    if (IPAddress.TryParse(configuredProxy, out IPAddress proxyAddress)
                        && !options.KnownProxies.Contains(proxyAddress))
                    {
                        options.KnownProxies.Add(proxyAddress);
                    }
                }
            });

            //Đăng ký TokenService
            services.AddScoped<TokenService>();

            //Đăng ký RequireAccessTokenAttribute nếu dùng như filter
            //services.AddScoped<RequireAccessTokenAttribute>();

            //services.AddSwaggerGen();
            //services.AddControllers();
            services.AddControllers(config =>
            {
                var policy = new AuthorizationPolicyBuilder()
                                 .RequireAuthenticatedUser()
                                 .Build();
                //config.Filters.Add(new RequireAccessTokenAttribute()); // chạy trước để thiết lập HttpContext.User
                config.Filters.Add(new AuthorizeFilter(policy)); //Kiểm tra quyền
                config.Filters.Add<NhatKyHeThongActionFilter>();
            });

            services.AddCors(options =>
            {
                var originsSection = Configuration.GetSection("Cors:Origins");
                if (!originsSection.Exists())
                {
                    throw new Exception("Cấu hình 'Cors:Origins' không tồn tại trong appsettings.json.");
                }
                var allowedOrigins = originsSection
                                   .GetChildren()
                                   .Select(x => x.Value)
                                   .Where(x => !string.IsNullOrEmpty(x))
                                   .ToArray();

                options.AddPolicy("CorsPolicy", //CorsPolicy
                builder => builder
                            //.AllowAnyOrigin()
                            .WithOrigins(allowedOrigins)
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials());
            });

            services.AddDirectoryBrowser();
            //services.AddControllers();


            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).
                AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidIssuer = Configuration["Jwt:Issuer"],
                        ValidAudience = Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"])),
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ClockSkew = TimeSpan.FromMinutes(2),
                        //ClockSkew = TimeSpan.Zero // Loại bỏ độ trễ
                    };

                    // Lấy token từ cookie:
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            if (string.IsNullOrEmpty(context.Token) &&
                                context.Request.Cookies.ContainsKey("accessToken"))
                            {
                                context.Token = context.Request.Cookies["accessToken"];
                            }
                            return Task.CompletedTask;
                        }
                    };
                });

            //Swagger với cấu hình JWT
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "QLTB API", Version = "v1" });

                // Thêm cấu hình cho Swagger dùng JWT
                var securityScheme = new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Nhập token dạng: Bearer {token}"
                };

                c.AddSecurityDefinition("Bearer", securityScheme);
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });


            // Cấu hình ConnectionOracle đọc từ appsettings.json
            ConnectionOracle.SetConfiguration(Configuration);
            FtpHelper.SetConfiguration(Configuration);

            AesEncryptionHelper.SetConfiguration(Configuration);

            // Ðãng ký các dịch vụ Transient
            services.AddTransient<SmartCA769>();

            services.AddScoped<IPdfService, PdfService>();
            services.AddScoped<IPdfSignService, PdfSignService>();
            services.AddSingleton<INhatKyHeThongQueue, NhatKyHeThongQueue>();
            services.AddHostedService<NhatKyHeThongWriterService>();
            services.AddScoped<NhatKyHeThongActionFilter>();
            //services.AddScoped<IFileService, FileService>();

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c =>
                    {
                        c.SwaggerEndpoint("/swagger/v1/swagger.json", "APIPCHY v1");

                    }
                );
            }

            // Phải chạy trước HTTPS, xác thực và nhật ký để RemoteIpAddress là IP thiết bị thật.
           app.UseForwardedHeaders();

// Không chuyển hướng HTTP sang HTTPS khi chạy local Development
            if (!env.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }

            app.UseStaticFiles();

            app.UseRouting();

            // CORS phải nằm sau UseRouting và trước Authentication
            app.UseCors("CorsPolicy");

            app.UseAuthentication();

            // Ghi nhận các thao tác nghiệp vụ chính sau khi đã xác thực người dùng,
            // nhưng trước phân quyền để vẫn lưu được yêu cầu bị từ chối 401/403.
            app.UseMiddleware<QLTB_API.Middlewares.NhatKyHeThongMiddleware>();

            //app.UseMiddleware<QLTB_API.Middlewares.PermissionMiddleware>();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });


        }
    }
}
