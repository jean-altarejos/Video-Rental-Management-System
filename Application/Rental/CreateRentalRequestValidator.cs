using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Rental
{
    public class CreateRentalRequestValidator : AbstractValidator<CreateRentalRequest>
    {
        public CreateRentalRequestValidator()
        {
            RuleFor(x => x.CustomerID)
                .GreaterThan(0).WithMessage("Customer ID is required.");

            RuleFor(x => x.DateRented)
                .NotEmpty().WithMessage("Date Rented is required.");


            RuleFor(x => x.RentalDetails)
            .NotNull().WithMessage("Rental details are required.")
            .Must(details => details != null && details.Count > 0)
            .WithMessage("At least one movie must be selected for rental.");

            // --- NESTED RULE FOR EACH MOVIE ITEM IN THE LIST ---
            RuleForEach(x => x.RentalDetails).ChildRules(detail =>
            {
                detail.RuleFor(d => d.MovieID)
                    .GreaterThan(0).WithMessage("Invalid Movie ID.");
            });
        }
    }

    public class RentalDetailItemDtoValidator : AbstractValidator<CreateRentalDetailRequest>
    {
        public RentalDetailItemDtoValidator()
        {
            RuleFor(x => x.MovieID)
                .GreaterThan(0).WithMessage("A valid Movie ID must be provided.");
        }
    }
}

