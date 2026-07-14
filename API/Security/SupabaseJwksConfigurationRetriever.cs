using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;

namespace API.Security;

public sealed class SupabaseJwksConfigurationRetriever
    : IConfigurationRetriever<OpenIdConnectConfiguration>
{
    private readonly string _issuer;

    public SupabaseJwksConfigurationRetriever(string issuer)
    {
        _issuer = issuer;
    }

    public async Task<OpenIdConnectConfiguration> GetConfigurationAsync(
        string address,
        IDocumentRetriever retriever,
        CancellationToken cancellationToken)
    {
        var document = await retriever.GetDocumentAsync(
            address,
            cancellationToken);

        var jsonWebKeySet = new JsonWebKeySet(document);

        var configuration = new OpenIdConnectConfiguration
        {
            Issuer = _issuer,
            JwksUri = address
        };

        foreach (var signingKey in jsonWebKeySet.GetSigningKeys())
        {
            configuration.SigningKeys.Add(signingKey);
        }

        return configuration;
    }
}