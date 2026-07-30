using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Movie
    {
        [Key]
        public int MovieID { get; set; }

        [Required]
        [StringLength(100)]
        public string MovieName { get; set; } = string.Empty;

        [Required]
        public int GenreID { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        [ForeignKey(nameof(GenreID))]
        public virtual Genre? Genre { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime DateAdded { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime ReleaseDate { get; set; }

        [Range(0,20, ErrorMessage = "Number in Stock must be between 0 and 20.")]
        public int NumberInStock { get; set; }

        [Range(0, 20)]
        public int NumberAvailable { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        

        private Movie() { }

        public Movie(string movieName, int genreId, DateTime releaseDate, DateTime dateAdded, int numberInStock, int numberAvailable)
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

        public void UpdateDetails(string movieName, int genreId, DateTime releaseDate, DateTime dateAdded, int numberInStock, int numberAvailable)
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
            NumberAvailable = numberAvailable; // Reset available count to match stock
            ModifiedDate = DateTime.UtcNow;
        }
    }


}
