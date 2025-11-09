using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Vzp.Config;
using Vzp.Framework.ContainerExtensions;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddNisComponentInfo();
builder.Services.AddNisKafka();
builder.Services.AddLogging(logging => {
    _ = logging.AddConsole();
    _ = logging.AddKafkaLogger();
});

// Add NIS services to the container.
builder.Services.AddNisApiDefaults();
builder.Services.AddNisApiVersioning();
builder.Services.AddNisCors(builder.Configuration);
builder.Services.AddNisEntraId(builder.Configuration);
builder.Services.AddNisDocumentationGenerator(builder.Configuration);
builder.Services.AddHealthChecks();
builder.Services.AddFeedbackHub(builder.Configuration);

var app = builder.Build();

// Configure NIS HTTP request pipeline.
app.MapNisHealthChecks();

app.UseNisSwagger();

app.MapNisControllers();

app.UseCors(CorsConf.NisCorsPolicy);

app.UseAuthentication();

app.UseAuthorization();

app.Run();