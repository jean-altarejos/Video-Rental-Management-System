using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Domain.Entities
{
    public class RentalHeader
    {
        [Key]
        public int RentalID { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime DateRented { get; set; }

        [Required]
        public int CustomerID { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        [ForeignKey(nameof(CustomerID))]
        public virtual Customer? Customer { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public ICollection<RentalDetail> RentalDetails { get; set; } = new List<RentalDetail>();
        public RentalHeader() { }

        public RentalHeader(DateTime dateRented, int customerID)
        {
            DateRented = dateRented;
            CustomerID = customerID;
            CreatedDate = DateTime.UtcNow;
        }

        public void UpdateDetails(DateTime dateRented, int customerID)
        {
            DateRented = dateRented;
            CustomerID = customerID;
            ModifiedDate = DateTime.UtcNow;
        }
    }

}


    