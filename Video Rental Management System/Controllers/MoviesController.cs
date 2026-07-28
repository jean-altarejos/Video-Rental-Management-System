using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Video_Rental_Management_System.Domain.Entities;
using Video_Rental_Management_System.Infrastructure.Persistence;

namespace Video_Rental_Management_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MoviesController(ApplicationDbContext context)
        {
            _context = context;
        }

        //Read ALL - Get: api/movies
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var movies = await _context.Movies.ToListAsync();
            return Ok(movies);
        }

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
        public async Task<IActionResult> CreateMovie([FromBody] Movie movie)
        {
            _context.Movies.Add(movie);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = movie.MovieID }, movie);
        }

        //Update - Put: api/movies/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateMovie(int id, [FromBody] Movie updatedMovie)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null) return NotFound(new { Message = "Movie not found." });
            movie.MovieName = updatedMovie.MovieName;
            movie.GenreID = updatedMovie.GenreID;
            movie.ReleaseDate = updatedMovie.ReleaseDate;
            movie.NumberInStock = updatedMovie.NumberInStock;
            movie.NumberAvailable = updatedMovie.NumberAvailable;
            movie.ModifiedDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return NoContent();
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
    }
}
