using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class RentalDetail
    {

        [Key]
        public int RentalDetailID { get; set; }


        [Required]
        public int RentalID { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        [ForeignKey(nameof(RentalID))]
        public RentalHeader? RentalHeader { get; set; }

        [Required]
        public int MovieID { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        [ForeignKey(nameof(MovieID))]
        public virtual Movie? Movie { get; set; }

        public DateTime? DateReturned { get; set; } = null;

        public RentalDetail() { }

        public RentalDetail(int rentalID, int movieID, DateTime dateReturned)
        {
            RentalID = rentalID;
            MovieID = movieID;
            DateReturned = dateReturned;
        }

        public void UpdateDetails(int rentalID, int movieID, DateTime dateReturned)
        {
            RentalID = rentalID;
            MovieID = movieID;
            DateReturned = dateReturned;
        }
    }

}

