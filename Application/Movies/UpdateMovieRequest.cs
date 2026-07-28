using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.Movies
{
    public class UpdateMovieRequest
    {
        [JsonPropertyName("movieName")]
        public string MovieName { get; set; } = string.Empty; [JsonPropertyName("email")]

        public int GenreID { get; set; }

        public DateTime DateAdded { get; set; }
        public DateTime ReleaseDate { get; set; }
        public int NumberInStock { get; set; }
        public int NumberAvailable { get; set; }
    }
}
