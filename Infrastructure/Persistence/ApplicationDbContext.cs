using Microsoft.EntityFrameworkCore;
using Video_Rental_Management_System.Domain.Entities;

namespace Video_Rental_Management_System.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
        {
        }

        public DbSet<Customer> Customers => Set<Customer>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(u => u.CustomerId);

                entity.Property(u => u.CustomerName)
                    .IsRequired()
                    .HasMaxLength(100);


                entity.Property(u => u.CustomerName)
                    .IsRequired()
                    .HasMaxLength(265);

                // Add unique index on Email
                entity.HasIndex(u => u.Email)
                    .IsUnique();

                entity.Property(u => u.Birthdate)
                    .IsRequired();

                entity.Property(u => u.CreatedDate)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");
            });
        }
    }
}
