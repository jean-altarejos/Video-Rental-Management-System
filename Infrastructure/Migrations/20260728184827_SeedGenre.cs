using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedGenre : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Genres",
                columns: new[] { "GenreID", "CreatedDate", "GenreName", "ModifiedDate" },
                values: new object[,]
                {
                    { 1, new DateTime(2026, 7, 28, 18, 48, 26, 735, DateTimeKind.Utc).AddTicks(8234), "Action", null },
                    { 2, new DateTime(2026, 7, 28, 18, 48, 26, 735, DateTimeKind.Utc).AddTicks(8236), "Comedy", null },
                    { 3, new DateTime(2026, 7, 28, 18, 48, 26, 735, DateTimeKind.Utc).AddTicks(8238), "Drama", null },
                    { 4, new DateTime(2026, 7, 28, 18, 48, 26, 735, DateTimeKind.Utc).AddTicks(8239), "Sci-Fi", null },
                    { 5, new DateTime(2026, 7, 28, 18, 48, 26, 735, DateTimeKind.Utc).AddTicks(8240), "Horror", null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 5);
        }
    }
}
