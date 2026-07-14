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

        public DbSet<AuditLog> AuditLogs { get; set; } = default!;

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

            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.Property(auditLog => auditLog.Id)
                    .HasColumnType("uuid");
                entity.Property(auditLog => auditLog.CreatedAtUtc)
                    .HasColumnType("timestamp with time zone");
                entity.Property(auditLog => auditLog.UserId)
                    .HasMaxLength(100);
                entity.Property(auditLog => auditLog.IpAddress)
                    .HasMaxLength(64);
                entity.Property(auditLog => auditLog.UserAgent)
                    .HasMaxLength(512);
                entity.Property(auditLog => auditLog.HttpMethod)
                    .HasMaxLength(16)
                    .IsRequired();
                entity.Property(auditLog => auditLog.Path)
                    .HasMaxLength(500)
                    .IsRequired();
                entity.Property(auditLog => auditLog.RouteTemplate)
                    .HasMaxLength(500);
                entity.Property(auditLog => auditLog.EndpointName)
                    .HasMaxLength(250);
                entity.Property(auditLog => auditLog.ResourceId)
                    .HasMaxLength(100);
                entity.Property(auditLog => auditLog.StatusCode)
                    .HasColumnType("integer");
                entity.Property(auditLog => auditLog.IsSuccess)
                    .HasColumnType("boolean");
                entity.Property(auditLog => auditLog.DurationMilliseconds)
                    .HasColumnType("bigint");
                entity.Property(auditLog => auditLog.TraceId)
                    .HasMaxLength(128)
                    .IsRequired();
                entity.Property(auditLog => auditLog.ExceptionType)
                    .HasMaxLength(250);

                entity.HasIndex(auditLog => auditLog.CreatedAtUtc);
                entity.HasIndex(auditLog => new
                {
                    auditLog.UserId,
                    auditLog.CreatedAtUtc
                });
                entity.HasIndex(auditLog => new
                {
                    auditLog.Path,
                    auditLog.CreatedAtUtc
                });
                entity.HasIndex(auditLog => new
                {
                    auditLog.StatusCode,
                    auditLog.CreatedAtUtc
                });
                entity.HasIndex(auditLog => auditLog.TraceId);
            });
        }
    }
}
