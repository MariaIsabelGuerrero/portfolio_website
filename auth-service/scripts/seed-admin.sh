#!/bin/sh
# Seed script to create the admin user for the portfolio
# SECURITY: This script is disabled in production

# Check if we're in production
if [ "${NODE_ENV}" = "production" ]; then
  echo "Skipping seed: production environment detected"
  exit 0
fi

# Check if DATABASE_URL contains production indicators
if echo "$DATABASE_URL" | grep -qi "production\|digitalocean\|rds.amazonaws"; then
  echo "Skipping seed: production database URL detected"
  exit 0
fi

echo "Seeding admin user..."

# Create admin user via the auth service API
ADMIN_EMAIL="admin@portfolio.com"
ADMIN_PASSWORD="password123"
ADMIN_NAME="Portfolio Admin"

# Check if admin already exists by trying to sign in
SIGN_IN_RESPONSE=$(wget -qO- --post-data "{\"email\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASSWORD}\"}" \
  --header="Content-Type: application/json" \
  "http://localhost:3001/api/auth/sign-in/email" 2>/dev/null || true)

if echo "$SIGN_IN_RESPONSE" | grep -q "token\|session\|user"; then
  echo "Admin user already exists, skipping creation"
else
  # Create admin via signup endpoint
  SIGNUP_RESPONSE=$(wget -qO- --post-data "{\"email\":\"${ADMIN_EMAIL}\",\"password\":\"${ADMIN_PASSWORD}\",\"name\":\"${ADMIN_NAME}\"}" \
    --header="Content-Type: application/json" \
    "http://localhost:3001/api/auth/sign-up/email" 2>/dev/null || true)

  if echo "$SIGNUP_RESPONSE" | grep -q "error"; then
    echo "Admin signup may have failed: $SIGNUP_RESPONSE"
    echo "Admin user might already exist"
  else
    echo "Admin user created successfully"
  fi
fi

# Update role to ADMIN and verify email directly in DB
if [ -n "$DATABASE_URL" ]; then
  DB_CONNECTION="$DATABASE_URL"
else
  DB_HOST="${POSTGRES_HOST:-auth-db}"
  DB_USER="${POSTGRES_USER:-auth_user}"
  DB_PASS="${POSTGRES_PASSWORD:-auth_pass}"
  DB_NAME="${POSTGRES_DB:-auth_db}"
  DB_CONNECTION="postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:5432/${DB_NAME}"
fi

# Set role to ADMIN and verify email
psql "$DB_CONNECTION" -c "UPDATE \"user\" SET \"role\" = 'ADMIN', \"emailVerified\" = true WHERE \"email\" = '${ADMIN_EMAIL}';" 2>/dev/null

if [ $? -eq 0 ]; then
  echo "Admin role and email verification set successfully"
else
  echo "Failed to update admin role (user might not exist yet)"
fi

# Clear any failed login attempts for admin
psql "$DB_CONNECTION" -c "DELETE FROM \"login_attempt\" WHERE \"email\" = '${ADMIN_EMAIL}';" 2>/dev/null

echo "Admin seeding complete!"
