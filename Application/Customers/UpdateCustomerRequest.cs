using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Application.Customers
{
    public class UpdateCustomerRequest
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("customerName")]
        public string CustomerName {
            get => Name;
            set => Name = value;
        }

        [JsonPropertyName("email")]
        public string Email { get;  set; } = string.Empty;

        public bool IsSubscribedToNewsletter { get;  set; }

        [JsonPropertyName("birthDate")]
        public DateTime Birthdate { get;  set; }
    }
}
