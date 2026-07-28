using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Video_Rental_Management_System.backend.src.Core.Application.Customers;

namespace Video_Rental_Management_System.backend.src.Presentation.WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly IValidator<CreateCustomerRequest> _validator;

        public CustomersController(IValidator<CreateCustomerRequest> validator)
        {
            _validator = validator;
        }

        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] CreateCustomerRequest request)
        {
            // 1. Run FluentValidation manually or via pipeline
            var validationResult = await _validator.ValidateAsync(request);

            if (!validationResult.IsValid)
            {
                // 2. Returns 400 Bad Request formatted for React
                return BadRequest(validationResult.ToDictionary());
            }

            // 3. Process Domain logic & DB save...
            return Ok(new { Message = "User successfully validated and created!" });
        }
    }
}
