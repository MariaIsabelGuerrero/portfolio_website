#!/bin/sh
set -e

echo "Setting up database schema..."

# Wait for database to be ready
until PGPASSWORD="$POSTGRES_PASSWORD" psql -h auth-db -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c '\q' 2>/dev/null; do
  echo "Waiting for database..."
  sleep 2
done

echo "Database is ready!"

# Run drizzle push to sync schema
npx drizzle-kit push

echo "Database schema setup complete!"
