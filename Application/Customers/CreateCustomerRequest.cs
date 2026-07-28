using System.Text.Json.Serialization;

namespace Video_Rental_Management_System.Application.Customers
{
    public class CreateCustomerRequest
    {
        [JsonPropertyName("name")]
        public string CustomerName { get;  set; } = string.Empty;
        [JsonPropertyName("email")]
        public string Email { get; set; } = string.Empty;

        public bool IsSubscribedToNewsletter { get;  set; }
        [JsonPropertyName("birthDate")]
        public DateTime Birthdate { get;  set; }

    }
}
