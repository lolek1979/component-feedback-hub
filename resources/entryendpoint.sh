#!/bin/sh
/usr/sbin/update-ca-certificates && mkdir -p /etc/pki/tls/certs/ && ln -sf /usr/lib/ssl/certs/ca-certificates.crt /etc/pki/tls/certs/ca-bundle.crt && dotnet Vzp.FeedbackHub.Api.dll