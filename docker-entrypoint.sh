#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."

until pg_isready -h db -U app -d postgres > /dev/null 2>&1; do
  sleep 2
done

echo "Checking if database needs migration..."
TABLE_COUNT=$(psql -h db -U app -d postgres -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';" 2>/dev/null || echo "0")

if [ "$TABLE_COUNT" -eq "0" ]; then
  echo "Database is empty, running migrations..."
  npm run drizzle:generate
  npm run drizzle:migrate

  echo "Seeding database..."
  npm run drizzle:seed
else
  echo "Database already initialized (found $TABLE_COUNT tables), skipping migrations and seed"
fi

echo "Starting application..."
exec node dist/server/index.mjs