using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Video_Rental_Management_System.Domain.Entities
{
    public class Movie
    {
        public int MovieID { get; set; }
        public string MovieName { get; set; } = string.Empty;

        [Required]
        public int GenreID { get; set; }

        [ForeignKey(nameof(GenreID))]
        public virtual Genre? Genre { get; set; }
        public DateTime DateAdded { get; set; }
        public DateTime ReleaseDate { get; set; }
        public int NumberInStock { get; set; }
        public int NumberAvailable { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }

        private Movie() { }

        public Movie(string movieName, int genreId, DateTime releaseDate, int numberInStock, int numberAvailable)
        {
            if (string.IsNullOrWhiteSpace(movieName))
                throw new ArgumentException("Movie name cannot be empty.", nameof(movieName));
            if (movieName.Length > 100)
                throw new ArgumentException("Movie name cannot exceed 100 characters.", nameof(movieName));
            if (numberInStock < 0)
                throw new ArgumentException("Number in stock cannot be negative.", nameof(numberInStock));
            if(numberAvailable > numberInStock)
                throw new ArgumentException("Number available cannot exceed number in stock.", nameof(numberAvailable));
            MovieName = movieName;
            GenreID = genreId;
            ReleaseDate = releaseDate;
            NumberInStock = numberInStock;
            NumberAvailable = numberInStock; // Initially, all movies are available
            CreatedDate = DateTime.UtcNow;
        }

        public void UpdateDetails(string movieName, int genreId, DateTime releaseDate, int numberInStock, int numberAvailable)
        {
            if (string.IsNullOrWhiteSpace(movieName))
                throw new ArgumentException("Movie name cannot be empty.", nameof(movieName));
            if (movieName.Length > 100)
                throw new ArgumentException("Movie name cannot exceed 100 characters.", nameof(movieName));
            if (numberInStock < 0)
                throw new ArgumentException("Number in stock cannot be negative.", nameof(numberInStock));
            if (numberAvailable > numberInStock)
                throw new ArgumentException("Number available cannot exceed number in stock.", nameof(numberAvailable));
            MovieName = movieName;
            GenreID = genreId;
            ReleaseDate = releaseDate;
            NumberInStock = numberInStock;
            NumberAvailable = numberInStock; // Reset available count to match stock
            ModifiedDate = DateTime.UtcNow;
        }
    }


}
