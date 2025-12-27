#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."

until pg_isready -h db -U app -d postgres > /dev/null 2>&1; do
  sleep 2
done

echo "Generating migrations..."
npm run drizzle:generate

echo "Running migrations..."
npm run drizzle:migrate

echo "Seeding database..."
npm run drizzle:seed

echo "Starting application..."
exec node dist/server/index.mjs
