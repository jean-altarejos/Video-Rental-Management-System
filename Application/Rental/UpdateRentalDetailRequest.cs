using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Rental
{
    public class UpdateRentalDetailRequest
    {
        public int RentalDetailId { get; set; }
        public int MovieID { get; set; }

        public DateTime DateReturned { get; set; } = DateTime.Today;
    }
}
