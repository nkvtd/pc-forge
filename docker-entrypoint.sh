#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."

until pg_isready -h db -U app -d postgres > /dev/null 2>&1; do
  sleep 2
done

echo "Checking if database is initialized..."

npm run drizzle:migrate

echo "Checking if database needs seeding..."
npm run drizzle:seed

echo "Starting application..."
exec node dist/server/index.mjs
