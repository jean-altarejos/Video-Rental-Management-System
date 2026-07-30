using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.Rental
{
    public class CreateRentalRequest
    {
        [JsonPropertyName("customerId")]
        public int CustomerID { get; set; }
        [JsonPropertyName("daterented")]
        public DateTime DateRented { get; set; } = DateTime.Now;

        public List<CreateRentalDetailRequest> RentalDetails { get; set; } = new();
    }

    public class CreateRentalDetailRequest 
    {
        [JsonPropertyName("movie")]
        public int MovieID { get; set; }
        public DateTime? DateReturned {  get; set; } = DateTime.Now; 
    }
}
