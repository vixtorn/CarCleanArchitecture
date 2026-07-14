using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence
{
    public class CarsDbContext : DbContext
    {
        /*
         Bu kod, CarsDbContext oluşturulurken gerekli veritabanı ayarlarını dışarıdan alıp EF Core’un temel DbContext sınıfına iletir.
         DbContextOptions , veritabanı sağlayıcısı, bağlantı dizesi ve diğer yapılandırma seçeneklerini içerir. 
         Bu sayede DbContext, doğru veritabanına bağlanabilir ve gerekli işlemleri gerçekleştirebilir. Program.cs dosyasında AddDbContext metodu
         ile bu ayarlar sağlanır ve dependency injection ile DbContext kullanılabilir hale gelir.
         */
        public CarsDbContext(DbContextOptions<CarsDbContext> options)
            : base(options)
        {
        }   

        public DbSet<Car> Cars { get; set; } = default!;//DbSet, entitylerin veritabanındaki tablolarla eşleşmesini sağlar.
                                                        //Bu sayede Car entity'si için bir Cars tablosu oluşturulur.
                                                        //Kodda database Car Modeli ile tutulur. Database'de Cars tablosu oluşur. Bu tabloya CRUD operasyonları yapılabilir.

        //ModelBuilder ile beraber entitylerin özelliklerini yapılandırabiliriz. Örneğin,
        //Car entity'sinin Brand, Model ve Color özelliklerinin maksimum uzunluklarını belirleyebiliriz.
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Car>()
                .Property(c => c.Brand)
                .HasMaxLength(100);

            modelBuilder.Entity<Car>()
                .Property(c => c.Model)
                .HasMaxLength(100);

            modelBuilder.Entity<Car>()
                .Property(c => c.Color)
                .HasMaxLength(50);

            modelBuilder.Entity<Car>()
                .Property(c => c.ImagePath)
                .HasMaxLength(255); // Optional property for the image path
        }
    }
}