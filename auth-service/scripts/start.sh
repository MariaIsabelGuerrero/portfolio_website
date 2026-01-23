#!/bin/sh
set -e

echo "Starting Portfolio Auth Service..."

# Run database setup
./scripts/setup-db.sh

# Start the Next.js application
echo "Starting Next.js server..."
npm start
