using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Video_Rental_Management_System.Application.Customers;

namespace Application.Customers
{
    public class UpdateCustomerRequestValidator : AbstractValidator<UpdateCustomerRequest>
    {
        public UpdateCustomerRequestValidator()
        {
            // 1. Email rules
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("A valid email address containing '@' is required.");

            // 2. Age rule (13+ years old)
            RuleFor(x => x.Birthdate)
                .NotEmpty().WithMessage("Birth date is required.")
                .Must(BeAtLeast13YearsOld).WithMessage("You must be at least 13 years old.");
        }

        // Helper method to check age in memory
        private bool BeAtLeast13YearsOld(DateTime birthDate)
        {
            var today = DateTime.UtcNow.Date;
            var cutoff = today.AddYears(-13);
            return birthDate.Date <= cutoff;
        }
    }
}
