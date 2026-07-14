using API.Extensions;
using Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// DbContext, repository ve service DI kayıtları.
builder.Services.AddInfrastructure(builder.Configuration);

// Supabase JWT authentication ve AdminOnly policy kayıtları.
builder.Services.AddSupabaseAuthentication(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors("FrontendPolicy");

// Önce JWT okunur ve HttpContext.User oluşturulur.
app.UseAuthentication();

// Ardından kullanıcının endpoint'e erişim izni kontrol edilir.
app.UseAuthorization();

app.MapControllers();

app.Run();