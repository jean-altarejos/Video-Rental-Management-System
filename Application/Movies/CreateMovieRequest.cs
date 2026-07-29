using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Video_Rental_Management_System.Application.Movies
{
    public class CreateMovieRequest
    {

        [JsonPropertyName("movieName")]
        public string MovieName { get; set; } = string.Empty; 
        [JsonPropertyName("genreID")]
        public int GenreID { get; set; }

        [JsonPropertyName("dateAdded")]
        public DateTime DateAdded { get; set; }
        [JsonPropertyName("releaseDate")]
        public DateTime ReleaseDate { get; set; }
        [JsonPropertyName("numberInStock")]
        public int NumberInStock { get; set; }
        [JsonPropertyName("numberAvailable")]
        public int NumberAvailable { get; set; }

    }
}
