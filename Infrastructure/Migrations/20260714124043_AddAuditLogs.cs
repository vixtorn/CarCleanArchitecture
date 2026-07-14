using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditLogs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    Id = table.Column<Guid>(
                        type: "uuid",
                        nullable: false),

                    CreatedAtUtc = table.Column<DateTimeOffset>(
                        type: "timestamp with time zone",
                        nullable: false),

                    UserId = table.Column<string>(
                        type: "character varying(100)",
                        maxLength: 100,
                        nullable: true),

                    IpAddress = table.Column<string>(
                        type: "character varying(64)",
                        maxLength: 64,
                        nullable: true),

                    UserAgent = table.Column<string>(
                        type: "character varying(512)",
                        maxLength: 512,
                        nullable: true),

                    HttpMethod = table.Column<string>(
                        type: "character varying(16)",
                        maxLength: 16,
                        nullable: false),

                    Path = table.Column<string>(
                        type: "character varying(500)",
                        maxLength: 500,
                        nullable: false),

                    RouteTemplate = table.Column<string>(
                        type: "character varying(500)",
                        maxLength: 500,
                        nullable: true),

                    EndpointName = table.Column<string>(
                        type: "character varying(250)",
                        maxLength: 250,
                        nullable: true),

                    ResourceId = table.Column<string>(
                        type: "character varying(100)",
                        maxLength: 100,
                        nullable: true),

                    StatusCode = table.Column<int>(
                        type: "integer",
                        nullable: false),

                    IsSuccess = table.Column<bool>(
                        type: "boolean",
                        nullable: false),

                    DurationMilliseconds = table.Column<long>(
                        type: "bigint",
                        nullable: false),

                    TraceId = table.Column<string>(
                        type: "character varying(128)",
                        maxLength: 128,
                        nullable: false),

                    ExceptionType = table.Column<string>(
                        type: "character varying(250)",
                        maxLength: 250,
                        nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey(
                        "PK_AuditLogs",
                        x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_CreatedAtUtc",
                table: "AuditLogs",
                column: "CreatedAtUtc");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_Path_CreatedAtUtc",
                table: "AuditLogs",
                columns: new[]
                {
                    "Path",
                    "CreatedAtUtc"
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_StatusCode_CreatedAtUtc",
                table: "AuditLogs",
                columns: new[]
                {
                    "StatusCode",
                    "CreatedAtUtc"
                });

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_TraceId",
                table: "AuditLogs",
                column: "TraceId");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_UserId_CreatedAtUtc",
                table: "AuditLogs",
                columns: new[]
                {
                    "UserId",
                    "CreatedAtUtc"
                });

            // AuditLogs contains IP addresses, user IDs and API activity.
            // Enable RLS so Supabase Data API roles cannot access the table
            // unless an explicit policy is created later.
            migrationBuilder.Sql(
                """
                ALTER TABLE public."AuditLogs"
                ENABLE ROW LEVEL SECURITY;

                REVOKE ALL PRIVILEGES ON TABLE public."AuditLogs"
                FROM anon, authenticated;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuditLogs");
        }
    }
}