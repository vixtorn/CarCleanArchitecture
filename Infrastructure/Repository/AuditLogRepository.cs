using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistence;

namespace Infrastructure.Repository;

public sealed class AuditLogRepository : IAuditLogRepository
{
    private readonly CarsDbContext _dbContext;

    public AuditLogRepository(CarsDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(
        AuditLog auditLog,
        CancellationToken cancellationToken = default)
    {
        await _dbContext.AuditLogs.AddAsync(
            auditLog,
            cancellationToken);

        await _dbContext.SaveChangesAsync(
            cancellationToken);
    }
}