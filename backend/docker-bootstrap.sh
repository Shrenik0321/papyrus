#!/bin/sh
set -e

echo "Applying Better Auth schema..."
node dist/database/scripts/run-auth-migrate.js

echo "Running TypeORM migrations..."
node dist/database/scripts/run-migrate.js

echo "Running database seeders..."
node dist/database/scripts/run-seed.js

echo "Database bootstrap completed."
