FROM mcr.microsoft.com/dotnet/aspnet:9.0-noble
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080
COPY src/Vzp.FeedbackHub.Api/bin/Release/net9.0/publish /app
COPY resources/entryendpoint.sh entryendpoint.sh
ENTRYPOINT ["/bin/sh", "entryendpoint.sh"]
