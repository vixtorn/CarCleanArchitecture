using System.Diagnostics;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace API.Middleware;

public sealed class AuditLogMiddleware
{
    private const int UserIdMaxLength = 100;
    private const int IpAddressMaxLength = 64;
    private const int UserAgentMaxLength = 512;
    private const int HttpMethodMaxLength = 16;
    private const int PathMaxLength = 500;
    private const int RouteTemplateMaxLength = 500;
    private const int EndpointNameMaxLength = 250;
    private const int ResourceIdMaxLength = 100;
    private const int TraceIdMaxLength = 128;
    private const int ExceptionTypeMaxLength = 250;

    private readonly RequestDelegate _next;
    private readonly ILogger<AuditLogMiddleware> _logger;

    public AuditLogMiddleware(
        RequestDelegate next,
        ILogger<AuditLogMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Path.StartsWithSegments("/api") ||
            HttpMethods.IsOptions(context.Request.Method))
        {
            await _next(context);
            return;
        }

        var requestStartedAtUtc = DateTimeOffset.UtcNow;
        var stopwatch = Stopwatch.StartNew();

        Exception? applicationException = null;

        try
        {
            await _next(context);
        }
        catch (Exception exception)
        {
            applicationException = exception;

            // Preserve the original exception and stack trace.
            throw;
        }
        finally
        {
            stopwatch.Stop();

            try
            {
                var auditLog = CreateAuditLog(
                    context,
                    requestStartedAtUtc,
                    stopwatch.ElapsedMilliseconds,
                    applicationException);

                // Create an independent scope so audit persistence receives
                // a separate CarsDbContext instance from the business request.
                await using var auditScope =
                    context.RequestServices.CreateAsyncScope();

                var auditLogRepository = auditScope
                    .ServiceProvider
                    .GetRequiredService<IAuditLogRepository>();

                await auditLogRepository.AddAsync(
                    auditLog,
                    CancellationToken.None);
            }
            catch (Exception auditException)
            {
                // Audit logging is secondary. It must never replace the API
                // response or hide the original application exception.
                //
                // Do not log the exception object, message, database details,
                // connection string or request values here.
                _logger.LogWarning(
                    "API audit persistence failed with exception type {ExceptionType}.",
                    auditException.GetType().Name);
            }
        }
    }

    private static AuditLog CreateAuditLog(
        HttpContext context,
        DateTimeOffset requestStartedAtUtc,
        long durationMilliseconds,
        Exception? applicationException)
    {
        var endpoint = context.GetEndpoint();

        var actionDescriptor = endpoint?
            .Metadata
            .GetMetadata<ControllerActionDescriptor>();

        var endpointName = actionDescriptor is not null
            ? $"{actionDescriptor.ControllerName}.{actionDescriptor.ActionName}"
            : endpoint?.DisplayName;

        var routeTemplate = endpoint is RouteEndpoint routeEndpoint
            ? routeEndpoint.RoutePattern.RawText
            : null;

        var statusCode = applicationException is null
            ? context.Response.StatusCode
            : StatusCodes.Status500InternalServerError;

        var traceId = Activity.Current?.TraceId.ToString()
            ?? context.TraceIdentifier;

        var resourceId = context.Request.RouteValues.TryGetValue(
            "id",
            out var routeId)
                ? routeId?.ToString()
                : null;

        return new AuditLog
        {
            Id = Guid.NewGuid(),

            // Represents when the API request arrived rather than when the
            // database insert completed.
            CreatedAtUtc = requestStartedAtUtc,

            UserId = Truncate(
                context.User.FindFirst("sub")?.Value,
                UserIdMaxLength),

            IpAddress = Truncate(
                context.Connection.RemoteIpAddress?.ToString(),
                IpAddressMaxLength),

            UserAgent = Truncate(
                context.Request.Headers.UserAgent.ToString(),
                UserAgentMaxLength),

            HttpMethod = Truncate(
                context.Request.Method,
                HttpMethodMaxLength) ?? "UNKNOWN",

            // Request.Path excludes query-string values.
            Path = Truncate(
                context.Request.Path.Value,
                PathMaxLength) ?? "/",

            RouteTemplate = Truncate(
                routeTemplate,
                RouteTemplateMaxLength),

            EndpointName = Truncate(
                endpointName,
                EndpointNameMaxLength),

            // Resource IDs are read only from the route value named "id".
            ResourceId = Truncate(
                resourceId,
                ResourceIdMaxLength),

            StatusCode = statusCode,

            IsSuccess = statusCode is >= 200 and <= 399,

            DurationMilliseconds = durationMilliseconds,

            TraceId = Truncate(
                traceId,
                TraceIdMaxLength) ?? "unknown",

            // Store only the exception type name.
            // Do not store the message or stack trace.
            ExceptionType = Truncate(
                applicationException?.GetType().Name,
                ExceptionTypeMaxLength)
        };
    }

    private static string? Truncate(
        string? value,
        int maximumLength)
    {
        if (value is null || value.Length <= maximumLength)
        {
            return value;
        }

        return value[..maximumLength];
    }
}