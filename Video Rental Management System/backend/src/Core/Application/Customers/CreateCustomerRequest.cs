namespace Video_Rental_Management_System.backend.src.Core.Application.Customers
{
    public class CreateCustomerRequest
    {
        public string CustomerName { get; private set; } = string.Empty;
        public string Email { get; private set; } = string.Empty;

        public bool IsSubscribedToNewsletter { get; private set; }
        public DateTime Birthdate { get; private set; }

    }
}
