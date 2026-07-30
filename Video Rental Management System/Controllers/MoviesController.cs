using Application.DTO;
using Application.Movies;
using Azure.Core;
using Domain.Entities;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Video_Rental_Management_System.Application.Customers;
using Video_Rental_Management_System.Application.Movies;
using Video_Rental_Management_System.Infrastructure.Persistence;

namespace Video_Rental_Management_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IValidator<CreateMovieRequest> _createvalidator;
        private readonly IValidator<UpdateMovieRequest> _updatevalidator;

        public MoviesController(
            ApplicationDbContext context,
            IValidator<CreateMovieRequest> createValidator,
            IValidator<UpdateMovieRequest> updateValidator
        )
        {
            _context = context;
            _createvalidator = createValidator;
            _updatevalidator = updateValidator;
        }

        //Read ALL - Get: api/movies
        /*
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var movies = await _context.Movies.ToListAsync();
            return Ok(movies);
        }
        */

        //Read one by ID - Get: api/movies/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null) return NotFound(new { Message = "Movie not found." });
            return Ok(movie);
        }

        //Create - Post: api/movies
        [HttpPost]
        public async Task<IActionResult> CreateMovie([FromBody] CreateMovieRequest request)
        {
            // 1.Run FluentValidation manually or via pipeline
            var validationResult = await _createvalidator.ValidateAsync(request);

            if (!validationResult.IsValid)
            {
                // 2. Returns 400 Bad Request formatted for React
                return BadRequest(validationResult.ToDictionary());
            }

            // 2. Map request DTO to Domain Entity
            var movie = new Movie(request.MovieName, request.GenreID, request.ReleaseDate, request.DateAdded, request.NumberInStock, request.NumberAvailable);

            _context.Movies.Add(movie);

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = movie.MovieID }, movie);
        }

        //Update - Put: api/movies/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateMovie(int id, [FromBody] UpdateMovieRequest request)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null) return NotFound(new { Message = "Movie not found." });

            movie.UpdateDetails(request.MovieName, request.GenreID,request.ReleaseDate, request.DateAdded, request.NumberInStock,request.NumberAvailable);

            await _context.SaveChangesAsync();
            return Ok(movie);


        }

        //Delete - Delete: api/movies/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null) return NotFound(new { Message = "Movie not found." });
            _context.Movies.Remove(movie);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("genres")]
        public async Task<IActionResult> GetGenres()
        {
            var genres = await _context.Genres
                .Select(g => new { g.GenreID, g.GenreName })
                .ToListAsync();

            return Ok(genres);
        }

        [HttpGet]
        public async Task<IActionResult> GetMovies([FromQuery] MovieQueryParameter queryParams)
        {
            var query = _context.Movies.AsQueryable();

            // 1. Filter by Genre (Case-insensitive)
            if (!string.IsNullOrWhiteSpace(queryParams.Genre))
            {
                query = query.Where(m => m.Genre.ToString().ToLower() == queryParams.Genre.ToLower());
            }

            // 2. Filter by Stock Availability
            if (queryParams.InStockOnly.HasValue && queryParams.InStockOnly.Value)
            {
                query = query.Where(m => m.NumberAvailable > 0);
            }

            // 3. Optional Search Term
            if (!string.IsNullOrWhiteSpace(queryParams.SearchTerm))
            {
                query = query.Where(m => m.MovieName.Contains(queryParams.SearchTerm));
            }

            // 4. Get Total Count for Pagination Metadata
            var totalCount = await query.CountAsync();

            // 5. Apply Pagination (Skip & Take)
            var items = await query
                .OrderBy(m => m.MovieName)
                .Skip((queryParams.PageNumber - 1) * queryParams.PageSize)
                .Take(queryParams.PageSize)
                .ToListAsync();

            var result = new PagedResult<Movie>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = queryParams.PageNumber,
                PageSize = queryParams.PageSize
            };

            return Ok(result);
        }
    }
}
