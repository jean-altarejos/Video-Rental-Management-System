using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGenreIDAsFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "GenreId",
                table: "Movies",
                newName: "GenreID");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ReleaseDate",
                table: "Movies",
                type: "datetime2",
                nullable: false,
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateAdded",
                table: "Movies",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "CAST(GETUTCDATE() AS DATE)",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "GETUTCDATE()");

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

            migrationBuilder.CreateIndex(
                name: "IX_Movies_GenreID",
                table: "Movies",
                column: "GenreID");

            migrationBuilder.AddForeignKey(
                name: "FK_Movies_Genres_GenreID",
                table: "Movies",
                column: "GenreID",
                principalTable: "Genres",
                principalColumn: "GenreID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Movies_Genres_GenreID",
                table: "Movies");

            migrationBuilder.DropIndex(
                name: "IX_Movies_GenreID",
                table: "Movies");

            migrationBuilder.RenameColumn(
                name: "GenreID",
                table: "Movies",
                newName: "GenreId");

            migrationBuilder.AlterColumn<DateTime>(
                name: "ReleaseDate",
                table: "Movies",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AlterColumn<DateTime>(
                name: "DateAdded",
                table: "Movies",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()",
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldDefaultValueSql: "CAST(GETUTCDATE() AS DATE)");

            migrationBuilder.UpdateData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 1,
                column: "CreatedDate",
                value: new DateTime(2026, 7, 28, 18, 48, 26, 735, DateTimeKind.Utc).AddTicks(8234));

            migrationBuilder.UpdateData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 2,
                column: "CreatedDate",
                value: new DateTime(2026, 7, 28, 18, 48, 26, 735, DateTimeKind.Utc).AddTicks(8236));

            migrationBuilder.UpdateData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 3,
                column: "CreatedDate",
                value: new DateTime(2026, 7, 28, 18, 48, 26, 735, DateTimeKind.Utc).AddTicks(8238));

            migrationBuilder.UpdateData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 4,
                column: "CreatedDate",
                value: new DateTime(2026, 7, 28, 18, 48, 26, 735, DateTimeKind.Utc).AddTicks(8239));

            migrationBuilder.UpdateData(
                table: "Genres",
                keyColumn: "GenreID",
                keyValue: 5,
                column: "CreatedDate",
                value: new DateTime(2026, 7, 28, 18, 48, 26, 735, DateTimeKind.Utc).AddTicks(8240));
        }
    }
}
