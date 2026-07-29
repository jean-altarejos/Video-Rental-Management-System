using Application.Customers;
using Application.Movies;
using Application.Rental;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Video_Rental_Management_System.Application.Customers;
using Video_Rental_Management_System.Infrastructure.Persistence;

var builder = WebApplication.CreateBuilder(args);


// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:7066", "https://localhost:7066") // Vite or Create-React-App URL
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddValidatorsFromAssemblyContaining<CreateCustomerRequestValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateMovieRequestValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateRentalRequestValidator>();
builder.Services.AddScoped<IValidator<UpdateCustomerRequest>, UpdateCustomerRequestValidator>();
builder.Services.AddScoped<IValidator<UpdateMovieRequest>, UpdateMovieRequestValidator>();
builder.Services.AddScoped<IValidator<UpdateRentalDetailRequest>, UpdateRentalDetailRequestValidator>();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

// Enable CORS middleware before MapControllers
app.UseCors("AllowReactApp");

app.MapControllers();

app.Run();
