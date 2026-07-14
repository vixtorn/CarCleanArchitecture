namespace Domain.Entities
{
    public class AuditLog
    {
        public Guid Id { get; set; }
        public DateTimeOffset CreatedAtUtc { get; set; }
        public string? UserId { get; set; }
        public string? IpAddress { get; set; }
        public string? UserAgent { get; set; }
        public string HttpMethod { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
        public string? RouteTemplate { get; set; }
        public string? EndpointName { get; set; }
        public string? ResourceId { get; set; }
        public int StatusCode { get; set; }
        public bool IsSuccess { get; set; }
        public long DurationMilliseconds { get; set; }
        public string TraceId { get; set; } = string.Empty;
        public string? ExceptionType { get; set; }
    }
}
