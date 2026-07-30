using Application.Movies;
using Application.Rental;
using Domain.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using Video_Rental_Management_System.Application.Movies;
using Video_Rental_Management_System.Infrastructure.Persistence;

namespace Video_Rental_Management_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Route: api/rentals
    public class RentalsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IValidator<CreateRentalRequest> _createvalidator;
        private readonly IValidator<UpdateRentalDetailRequest> _updatevalidator;
        private readonly IValidator<ReturnMovieRequest> _returnvalidator;

        public RentalsController(
            ApplicationDbContext context,
            IValidator<CreateRentalRequest> createValidator,
            IValidator<UpdateRentalDetailRequest> updateValidator,
            IValidator<ReturnMovieRequest> returnValidator
            )
        {
            _context = context;
            _createvalidator = createValidator;
            _updatevalidator = updateValidator;
            _returnvalidator = returnValidator;
        }

        // GET: api/rentals (Fetch active & past rentals with details)
        [HttpGet]
        public async Task<IActionResult> GetRentals()
        {
            var rentals = await _context.RentalHeaders
            .Include(r => r.Customer)
            .Include(r => r.RentalDetails)
                .ThenInclude(d => d.Movie) 
            .OrderByDescending(r => r.DateRented)
            .ToListAsync();

            return Ok(rentals);
        }

        // POST: api/rentals (Process new rental transaction)
        [HttpPost]
        public async Task<IActionResult> CreateRental([FromBody] CreateRentalRequest request)
        {
            // Step 1: Save RentalHeader first to generate Primary Key (RentalID)
            var header = new RentalHeader
            {
                CustomerID = request.CustomerID,
                DateRented = request.DateRented,
                CreatedDate = DateTime.UtcNow,
                ModifiedDate = DateTime.UtcNow
            };

            _context.RentalHeaders.Add(header);
            await _context.SaveChangesAsync(); // Database generates header.RentalID here!

            // Step 2: Create RentalDetails using generated header.RentalID
            var details = request.RentalDetails.Select(d => new RentalDetail
            {
                RentalID = header.RentalID, // Explicitly assign generated Foreign Key
                MovieID = d.MovieID,
                DateReturned = null
            }).ToList();


            _context.RentalDetails.AddRange(details);
            await _context.SaveChangesAsync();

            return Ok(header);
        }

        // POST: /api/rentals/return
        [HttpPost("return")]
        public async Task<IActionResult> ReturnMovie([FromBody] ReturnMovieRequest request)
        {
            var validationResult = await _returnvalidator.ValidateAsync(request);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.ToDictionary());
            }


            // 1. Fetch the rental detail record
            var detail = await _context.RentalDetails.FindAsync(request.RentalDetailId);
            if (detail == null)
            {
                return NotFound("Rental record detail not found.");
            }

            // 2. Business Rule: Prevent duplicate returns
            if (detail.DateReturned.HasValue)
            {
                return BadRequest("This movie has already been returned.");
            }

            // 3. Mark as returned
            detail.DateReturned = request.DateReturned;

            // 4. Business Rule: Increase NumberAvailable for the movie
            var movie = await _context.Movies.FindAsync(detail.MovieID);
            if (movie != null)
            {
                movie.NumberAvailable += 1;
            }

            // 5. Save all changes atomically
            await _context.SaveChangesAsync();

            return Ok(new { message = "Movie returned successfully.", detail });
        }

        // 1. GET /api/rentals/{id}
        // Retrieves a single rental transaction header by its RentalID along with its details
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetRentalById(int id)
        {
            var rental = await _context.RentalHeaders
                .Include(r => r.Customer)
                .Include(r => r.RentalDetails)
                    .ThenInclude(d => d.Movie)
                .FirstOrDefaultAsync(r => r.RentalID == id);


            if (rental == null)
            {
                return NotFound($"Rental transaction with ID {id} was not found.");
            }

            return Ok(rental);
        }

        // 2. GET /api/rentals/customer/{customerId}
        // Retrieves all rental history/headers for a specific customer
        [HttpGet("customer/{customerId:int}")]
        public async Task<IActionResult> GetRentalsByCustomer(int customerId)
        {
            // Check if customer exists first (optional, but good practice)
            var customerExists = await _context.Customers.AnyAsync(c => c.CustomerId == customerId);
            if (!customerExists)
            {
                return NotFound($"Customer with ID {customerId} does not exist.");
            }

            var customerRentals = await _context.RentalHeaders
                .Where(r => r.CustomerID == customerId)
                .Include(r => r.RentalDetails)
                    .ThenInclude(d => d.Movie)
                .OrderByDescending(r => r.DateRented) // Show latest rentals first
                .ToListAsync();

            return Ok(customerRentals);
        }
    }
}
