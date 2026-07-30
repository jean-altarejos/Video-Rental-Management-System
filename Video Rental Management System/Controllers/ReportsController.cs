using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using Video_Rental_Management_System.Infrastructure.Persistence;

namespace Video_Rental_Management_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReportsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /api/reports/customer
        [HttpGet("customer/{customerId}/rentals")]
        public async Task<IActionResult> GetCustomerRentalList(int customerId)
        {
            var rentals = await _context.RentalDetails
                .Where(d => d.RentalHeader.CustomerID == customerId)
                .Select(d => new
                {
                    d.RentalDetailID,
                    MovieTitle = d.Movie.MovieName,
                    d.RentalHeader.DateRented,
                    d.DateReturned,
                    Status = d.DateReturned != null
                        ? "Returned"
                        : (DateTime.Today - d.RentalHeader.DateRented).Days > 7 ? "Overdue" : "Active",
                    DaysOverdue = d.DateReturned == null && (DateTime.Today - d.RentalHeader.DateRented).Days > 7
                        ? (DateTime.Today - d.RentalHeader.DateRented).Days
                        : 0
                })
                .OrderByDescending(d => d.DateRented)
                .ToListAsync();

            return Ok(rentals);
        }

        // GET: /api/reports/movies-inventory
        public enum MovieInventoryFilter
        {
            All = 0,
            Available = 1,
            OutOfStock = 2
        }

        [HttpGet("reports/movie-inventory")]
        public async Task<IActionResult> GetMovieInventoryReport([FromQuery] MovieInventoryFilter filter = MovieInventoryFilter.All)
        {
            // 1. Base query projecting stock counts
            // Assuming 'TotalStock' is a column on Movie, and 'AvailableStock' is calculated 
            // by subtracting active (unreturned) rentals from TotalStock.
            var query = _context.Movies
                .Select(m => new
                {
                    m.MovieID,
                    m.MovieName,
                    Genre = m.Genre.GenreName, // Adjust based on your navigation property name
                    m.NumberInStock,
                    ActiveRentals = _context.RentalDetails.Count(rd => rd.MovieID == m.MovieID && rd.DateReturned == null)
                })
                .Select(m => new
                {
                    m.MovieID,
                    m.MovieName,
                    m.Genre,
                    TotalStock = m.NumberInStock,
                    AvailableStock = m.NumberInStock - m.ActiveRentals
                });

            // 2. Apply filtering based on availability
            switch (filter)
            {
                case MovieInventoryFilter.Available:
                    query = query.Where(m => m.AvailableStock > 0);
                    break;

                case MovieInventoryFilter.OutOfStock:
                    query = query.Where(m => m.AvailableStock <= 0);
                    break;

                case MovieInventoryFilter.All:
                default:
                    // No filter applied
                    break;
            }

            // 3. Project to final output format
            var report = await query
                .Select(m => new
                {
                    Movie = m.MovieName,
                    m.Genre,
                    m.TotalStock,
                    m.AvailableStock
                })
                .OrderBy(m => m.Movie)
                .ToListAsync();

            return Ok(report);
        }

    }  
}

