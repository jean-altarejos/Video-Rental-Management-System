using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;


namespace Video_Rental_Management_System.Infrastructure.Middleware
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;
        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        {
            _logger = logger;
        }
        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
           _logger.LogError(exception, "An unhandled exception occurred: {Message}", exception.Message);

            // Handle FluentValidation Exception
            if (exception is ValidationException validationException)
            {
                httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;

                var validationErrors = validationException.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(
                        g => g.Key,
                        g => g.Select(e => e.ErrorMessage).ToArray()
                    );

                var errorResponse = new
                {
                    Success = false,
                    Message = "Validation failed.",
                    Errors = validationErrors
                };

                await httpContext.Response.WriteAsJsonAsync(errorResponse, cancellationToken);
                return true;
            }

            // Handle standard 500 exceptions
            httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
            var response = new
            {
                Success = false,
                Message = "An unexpected error occurred.",
                Detail = exception.Message
            };

            await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);
            return true;
         }
    }
}
