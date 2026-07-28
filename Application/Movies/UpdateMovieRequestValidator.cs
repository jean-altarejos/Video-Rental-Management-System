using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Movies
{
    public class UpdateMovieRequestValidator : AbstractValidator<UpdateMovieRequest>
    {
        public UpdateMovieRequestValidator() {
            RuleFor(x => x.MovieName)
            .NotEmpty().WithMessage("Movie title is required.")
            .MaximumLength(100).WithMessage("Movie title cannot exceed 100 characters.");

            RuleFor(x => x.GenreID)
                .GreaterThan(0).WithMessage("Please select a valid Genre.");

            RuleFor(x => x.ReleaseDate)
                .NotEmpty().WithMessage("Release date is required.");

            RuleFor(x => x.NumberInStock)
                .InclusiveBetween(0, 20).WithMessage("Number in stock must be between 0 and 20.");

            RuleFor(x => x.NumberAvailable)
                .GreaterThanOrEqualTo(0).WithMessage("Number available cannot be negative.")
                .LessThanOrEqualTo(x => x.NumberInStock)
                .WithMessage("Number available cannot exceed Total Number in Stock.");

        }
    }
}
