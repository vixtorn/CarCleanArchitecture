using Application.Interfaces;
using Application.Services;
using Infrastructure.Persistence;
using Infrastructure.Repository; // Repository'lerin olduğu namespace
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
// DTO'ların ve servis arayüzlerinin olduğu Application katmanını buraya ekliyoruz:

namespace Infrastructure.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            // 1. Veri Tabanı Bağlantısı
            //CarsDbContext istenirse → SQL Server ayarlarıyla CarsDbContext ver.
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<CarsDbContext>(options =>//Burada program.cs'de yazdığımız koddan tek farkı builder.Add yerine services.Add kullanmamız.
                                                           //Çünkü bu metod extension method olarak yazıldı. Bu yüzden this IServiceCollection services parametresi ile çağırıyoruz.
                options.UseSqlServer(connectionString));

            // 2. Repository Kaydı (Veri erişim katmanı için şart!)
            // ICarRepository istenirse → CarRepository ver.
            services.AddScoped<ICarRepository, CarRepository>();

            // 3. İstediğin Servis Kaydı (Dependency Injection)
            // ICarService istenirse → CarService ver.
            services.AddScoped<ICarService, CarService>();

            return services;
        }
    }
}