using System.Net.Mail;
using System.Xml.Linq;

namespace Video_Rental_Management_System.Domain.Entities
{
    public class Customer
    {
        public int CustomerId { get;  set; }
        public string CustomerName { get;  set; } = string.Empty;
        public string Email { get;  set; } = string.Empty;

        public bool IsSubscribedToNewsletter { get;  set; }
        public DateTime Birthdate { get;  set; }
        public DateTime CreatedDate { get;  set; }
        public DateTime? ModifiedDate {get;  set;}


        private Customer() { }

        public Customer(string custName, string email, bool isSubscribedToNewsletter, DateTime birthDate)
        {
            if (string.IsNullOrWhiteSpace(custName))
                throw new ArgumentException("Customer name cannot be empty.", nameof(custName));

            //100-character domain validation limit
            if (custName.Length > 100)
                throw new ArgumentException("Customer name cannot exceed 100 characters.", nameof(custName));

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


        public void UpdateDetails(string custName, string email, bool isSubscribedToNewsletter, DateTime birthDate)
        {
            CustomerName = custName;
            Email = email;
            IsSubscribedToNewsletter = isSubscribedToNewsletter;
            ModifiedDate = DateTime.UtcNow;
            Birthdate = birthDate;
            
        }
    }
}
