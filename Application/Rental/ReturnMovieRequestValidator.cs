using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Rental
{
    public class ReturnMovieRequestValidator : AbstractValidator<ReturnMovieRequest>
    {
        public ReturnMovieRequestValidator()
        {
            RuleFor(x => x.RentalDetailId)
                .GreaterThan(0)
                .WithMessage("A valid Rental Detail ID is required.");

            RuleFor(x => x.DateReturned)
                .NotEmpty()
                .WithMessage("Date Returned is required.")
                .LessThanOrEqualTo(DateTime.Today)
                .WithMessage("Date Returned cannot be in the future.");
        }
    }
}
