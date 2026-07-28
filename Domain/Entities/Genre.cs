using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Video_Rental_Management_System.Domain.Entities
{
    public class Genre
    {
        public int GenreID { get; set; }
        public string GenreName { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
