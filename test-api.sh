#!/bin/bash
echo "Logging in..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/autenticacion/iniciar-sesion \
  -H "Content-Type: application/json" \
  -H "X-Tenant-Domain: localhost" \
  -d '{"correoElectronico":"admin@codepyme.com", "contrasena":"admin123"}')

TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
echo "Token: $TOKEN"

echo "Fetching tenants..."
curl -s -v -X GET http://localhost:3000/api/v1/tenants \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Tenant-Domain: localhost"
