using Application.Customers;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Video_Rental_Management_System.Application.Customers;
using Video_Rental_Management_System.Domain.Entities;
using Video_Rental_Management_System.Infrastructure.Persistence;

namespace Video_Rental_Management_System.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IValidator<CreateCustomerRequest> _createvalidator;
        private readonly IValidator<UpdateCustomerRequest> _updatevalidator;

        public CustomersController(
            ApplicationDbContext context,
            IValidator<CreateCustomerRequest> createValidator,
            IValidator<UpdateCustomerRequest> updateValidator
            )
        {
            _context = context;
            _createvalidator = createValidator;
            _updatevalidator = updateValidator;
        }


        //Read ALL - Get: api/customers
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var customers = await _context.Customers.ToListAsync();
            return Ok(customers);
        }

        //Read one by ID - Get: api/customers/{id}
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound(new { Message = "Customer not found." });

            return Ok(customer);
        }

        // Create - Post: api/customers
        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerRequest request)
        {
            // 1. Run FluentValidation manually or via pipeline
            var validationResult = await _createvalidator.ValidateAsync(request);

            if (!validationResult.IsValid)
            {
                // 2. Returns 400 Bad Request formatted for React
                return BadRequest(validationResult.ToDictionary());
            }

            // 2. Map request DTO to Domain Entity
            var customer = new Customer(request.CustomerName, request.Email, request.IsSubscribedToNewsletter, request.Birthdate);

            // 3. Add to Entity Framework DbContext
            _context.Customers.Add(customer);

            // 4. Persist changes to SQL Server / LocalDB
            await _context.SaveChangesAsync();

            // 5. Return CreatedAtAction (HTTP 201) with the saved customer entity (includes generated ID)
            return CreatedAtAction(nameof(GetById), new { id = customer.CustomerId }, customer);
        }

        //Update - api/customers/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateCustomer(int id, [FromBody] UpdateCustomerRequest request)
        {

            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound(new { Message = "Customer not found." });


            string nameToUpdate = !string.IsNullOrWhiteSpace(request.Name)
            ? request.Name
            : request.CustomerName;

            //Update properties
            customer.UpdateDetails(nameToUpdate, request.Email, request.IsSubscribedToNewsletter, request.Birthdate);

            await _context.SaveChangesAsync();
            return Ok(customer);
        }

        //Delete - api/customers/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound(new { Message = "Customer not found." });

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
