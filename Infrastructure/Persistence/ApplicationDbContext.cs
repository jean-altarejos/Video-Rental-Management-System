using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Video_Rental_Management_System.Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
        {
        }

        public DbSet<Customer> Customers => Set<Customer>();
        public DbSet<Movie> Movies => Set<Movie>();
        public DbSet<Genre> Genres => Set<Genre>();

        public DbSet<RentalHeader> RentalHeaders => Set<RentalHeader>();
        public DbSet<RentalDetail> RentalDetails => Set<RentalDetail>();

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

            modelBuilder.Entity<Movie>(entity =>
            {
                entity.HasKey(m => m.MovieID);

                entity.Property(m => m.MovieName)
                    .IsRequired()
                    .HasMaxLength(100);

                // Foreign Key Relationship (One Genre to Many Movies)
                entity.HasOne(m => m.Genre)
                    .WithMany() // or .WithMany(g => g.Movies) if Genre has a Movies collection
                    .HasForeignKey(m => m.GenreID)
                    .OnDelete(DeleteBehavior.Restrict);

                // SQL Server Default values for dates
                entity.Property(m => m.CreatedDate)
                    .HasDefaultValueSql("GETUTCDATE()");

                entity.Property(m => m.DateAdded)
                    .HasDefaultValueSql("CAST(GETUTCDATE() AS DATE)");
            });

            modelBuilder.Entity<Genre>(entity =>
            {
                entity.HasKey(u => u.GenreID);
                entity.Property(u => u.GenreName)
                    .IsRequired()
                    .HasMaxLength(100);
                entity.Property(u => u.CreatedDate)
                    .IsRequired()
                    .HasDefaultValueSql("GETUTCDATE()");
            });


            modelBuilder.Entity<Genre>().HasData(
                new Genre { GenreID = 1, GenreName = "Action", CreatedDate = DateTime.UtcNow },
                new Genre { GenreID = 2, GenreName = "Comedy", CreatedDate = DateTime.UtcNow },
                new Genre { GenreID = 3, GenreName = "Drama" , CreatedDate = DateTime.UtcNow },
                new Genre { GenreID = 4, GenreName = "Sci-Fi" , CreatedDate = DateTime.UtcNow },
                new Genre { GenreID = 5, GenreName = "Horror" , CreatedDate = DateTime.UtcNow }
            );

            modelBuilder.Entity<RentalHeader>(entity =>
            {
                entity.HasKey(x => x.RentalID);


                entity.Property(x => x.DateRented)
                    .HasDefaultValueSql("CAST(GETUTCDATE() AS DATE)");

                entity.HasOne(x => x.Customer)
                    .WithMany() 
                    .HasForeignKey(x => x.CustomerID)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(x => x.CreatedDate)
                    .HasDefaultValueSql("GETUTCDATE()");

            });

            modelBuilder.Entity<RentalDetail>(entity =>
            {
                entity.HasKey(x => x.RentalDetailID);


                entity.HasOne(x => x.RentalHeader)
                    .WithMany()
                    .HasForeignKey(x => x.RentalID)
                    .OnDelete(DeleteBehavior.Restrict);


                entity.HasOne(x => x.Movie)
                    .WithMany()
                    .HasForeignKey(x => x.MovieID)
                    .OnDelete(DeleteBehavior.Restrict);


                entity.Property(x => x.DateReturned)
                     .HasDefaultValueSql("CAST(GETUTCDATE() AS DATE)");

            });
        }
    }
}
