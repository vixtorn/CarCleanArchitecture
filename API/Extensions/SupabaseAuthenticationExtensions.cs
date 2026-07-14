using API.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions;

public static class SupabaseAuthenticationExtensions
{
    public const string AdminOnlyPolicy = "AdminOnly";

    public static IServiceCollection AddSupabaseAuthentication(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        var issuer = configuration["SupabaseAuth:Issuer"]?
            .TrimEnd('/');

        if (string.IsNullOrWhiteSpace(issuer))
        {
            throw new InvalidOperationException(
                "SupabaseAuth:Issuer configuration was not found.");
        }

        if (!Uri.TryCreate(
                issuer,
                UriKind.Absolute,
                out var issuerUri) ||
            issuerUri.Scheme != Uri.UriSchemeHttps)
        {
            throw new InvalidOperationException(
                "SupabaseAuth:Issuer must be a valid HTTPS address.");
        }

        if (!issuer.EndsWith(
                "/auth/v1",
                StringComparison.Ordinal))
        {
            throw new InvalidOperationException(
                "SupabaseAuth:Issuer must end with /auth/v1.");
        }

        var audience = configuration["SupabaseAuth:Audience"];

        if (string.IsNullOrWhiteSpace(audience))
        {
            throw new InvalidOperationException(
                "SupabaseAuth:Audience configuration was not found.");
        }

        var configuredAdminUserIds = configuration
            .GetSection("SupabaseAuth:AdminUserIds")
            .Get<string[]>()
            ?? [];

        if (configuredAdminUserIds.Length == 0)
        {
            throw new InvalidOperationException(
                "At least one Supabase admin user ID must be configured.");
        }

        if (configuredAdminUserIds.Any(
                userId => !Guid.TryParse(userId, out _)))
        {
            throw new InvalidOperationException(
                "Every Supabase admin user ID must be a valid UUID.");
        }

        var adminUserIds = configuredAdminUserIds
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var jwksAddress =
            $"{issuer}/.well-known/jwks.json";

        services
            .AddAuthentication(
                JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.MapInboundClaims = false;
                options.RequireHttpsMetadata = true;
                options.RefreshOnIssuerKeyNotFound = true;

                options.TokenValidationParameters =
                    new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = issuer,

                        ValidateAudience = true,
                        ValidAudience = audience,

                        ValidateIssuerSigningKey = true,
                        ValidateLifetime = true,

                        RequireSignedTokens = true,
                        RequireExpirationTime = true,

                        ClockSkew = TimeSpan.FromMinutes(1),

                        NameClaimType = "email",
                        RoleClaimType = "role",

                        ValidAlgorithms =
                            new[]
                            {
                                SecurityAlgorithms.EcdsaSha256
                            }
                    };

                options.ConfigurationManager =
                    new Microsoft.IdentityModel.Protocols
                        .ConfigurationManager
                        <OpenIdConnectConfiguration>(
                            jwksAddress,
                            new SupabaseJwksConfigurationRetriever(
                                issuer),
                            new HttpDocumentRetriever
                            {
                                RequireHttps = true
                            });
            });

        services.AddAuthorization(options =>
        {
            options.AddPolicy(
                AdminOnlyPolicy,
                policy =>
                {
                    policy.RequireAuthenticatedUser();

                    policy.RequireClaim(
                        "role",
                        "authenticated");

                    policy.RequireAssertion(context =>
                    {
                        var userId = context.User
                            .FindFirst("sub")
                            ?.Value;

                        return userId is not null &&
                               adminUserIds.Contains(userId);
                    });
                });
        });

        return services;
    }
}