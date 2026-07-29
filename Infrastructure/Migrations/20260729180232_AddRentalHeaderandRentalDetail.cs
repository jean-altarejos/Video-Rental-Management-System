using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddRentalHeaderandRentalDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RentalHeaders",
                columns: table => new
                {
                    RentalID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DateRented = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CAST(GETUTCDATE() AS DATE)"),
                    CustomerID = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    ModifiedDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RentalHeaders", x => x.RentalID);
                    table.ForeignKey(
                        name: "FK_RentalHeaders_Customers_CustomerID",
                        column: x => x.CustomerID,
                        principalTable: "Customers",
                        principalColumn: "CustomerId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RentalDetails",
                columns: table => new
                {
                    RentalDetailID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RentalID = table.Column<int>(type: "int", nullable: false),
                    MovieID = table.Column<int>(type: "int", nullable: false),
                    DateReturned = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "CAST(GETUTCDATE() AS DATE)")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RentalDetails", x => x.RentalDetailID);
                    table.ForeignKey(
                        name: "FK_RentalDetails_Movies_MovieID",
                        column: x => x.MovieID,
                        principalTable: "Movies",
                        principalColumn: "MovieID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RentalDetails_RentalHeaders_RentalID",
                        column: x => x.RentalID,
                        principalTable: "RentalHeaders",
                        principalColumn: "RentalID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.UpdateData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2026, 7, 29, 18, 2, 31, 591, DateTimeKind.Utc).AddTicks(1784));

            migrationBuilder.UpdateData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2026, 7, 29, 18, 2, 31, 591, DateTimeKind.Utc).AddTicks(1787));

            migrationBuilder.UpdateData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2026, 7, 29, 18, 2, 31, 591, DateTimeKind.Utc).AddTicks(1788));

            migrationBuilder.UpdateData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 4,
                column: "CreatedDate",
                value: new DateTime(2026, 7, 29, 18, 2, 31, 591, DateTimeKind.Utc).AddTicks(1790));

            migrationBuilder.UpdateData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 5,
                column: "CreatedDate",
                value: new DateTime(2026, 7, 29, 18, 2, 31, 591, DateTimeKind.Utc).AddTicks(1791));

            migrationBuilder.CreateIndex(
                name: "IX_RentalDetails_MovieID",
                table: "RentalDetails",
                column: "MovieID");

            migrationBuilder.CreateIndex(
                name: "IX_RentalDetails_RentalID",
                table: "RentalDetails",
                column: "RentalID");

            migrationBuilder.CreateIndex(
                name: "IX_RentalHeaders_CustomerID",
                table: "RentalHeaders",
                column: "CustomerID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RentalDetails");

            migrationBuilder.DropTable(
                name: "RentalHeaders");

            migrationBuilder.UpdateData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2026, 7, 28, 18, 58, 14, 638, DateTimeKind.Utc).AddTicks(1113));

            migrationBuilder.UpdateData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2026, 7, 28, 18, 58, 14, 638, DateTimeKind.Utc).AddTicks(1116));

            migrationBuilder.UpdateData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2026, 7, 28, 18, 58, 14, 638, DateTimeKind.Utc).AddTicks(1118));

            migrationBuilder.UpdateData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 4,
                column: "CreatedDate",
                value: new DateTime(2026, 7, 28, 18, 58, 14, 638, DateTimeKind.Utc).AddTicks(1119));

            migrationBuilder.UpdateData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 5,
                column: "CreatedDate",
                value: new DateTime(2026, 7, 28, 18, 58, 14, 638, DateTimeKind.Utc).AddTicks(1120));
        }
    }
}
