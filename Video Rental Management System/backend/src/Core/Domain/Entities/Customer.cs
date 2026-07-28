using System.Net.Mail;

namespace Video_Rental_Management_System.backend.src.Core.Domain.Entities
{
    public class Customer
    {
        public int CustomerId { get; private set; }
        public string CustomerName { get; private set; } = string.Empty;
        public string Email { get; private set; } = string.Empty;

        public bool IsSubscribedToNewsletter { get; private set; }
        public DateTime Birthdate { get; private set; }
        public DateTime CreatedDate { get; private set; }
        public DateTime? ModifiedDate {get; private set;}


        private Customer() { }

        public Customer(string custName, string email, bool isSubscribedToNewsletter, DateTime birthDate)
        {
            if (string.IsNullOrWhiteSpace(custName))
                throw new ArgumentException("Product name cannot be empty.", nameof(custName));

            //100-character domain validation limit
            if (custName.Length > 100)
                throw new ArgumentException("Product name cannot exceed 100 characters.", nameof(custName));

            if (!email.Contains('@') || !MailAddress.TryCreate(email, out _))
                throw new ArgumentException("Invalid email format. Email must contain an '@' sign and a valid domain.", nameof(email));

            // Calculate age relative to current UTC date
            var today = DateTime.UtcNow.Date;
            var age = today.Year - birthDate.Year;

            // Adjust age if birthday hasn't occurred yet this year
            if (birthDate.Date > today.AddYears(-age))
            {
                age--;
            }

            if (age < 13)
            {
                throw new ArgumentException("Users must be at least 13 years old.", nameof(birthDate));
            }

            CustomerName = custName;
            Email = email;
            IsSubscribedToNewsletter = isSubscribedToNewsletter;
            Birthdate = birthDate;
            CreatedDate = DateTime.UtcNow;
        }

    }
}
