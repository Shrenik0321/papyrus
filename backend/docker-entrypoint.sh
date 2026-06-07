#!/bin/sh
set -e

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
  echo "Applying Better Auth schema..."
  node dist/database/scripts/run-auth-migrate.js

  echo "Running TypeORM migrations..."
  node dist/database/scripts/run-migrate.js
fi

if [ "${RUN_SEEDS:-true}" = "true" ]; then
  echo "Running database seeders..."
  node dist/database/scripts/run-seed.js
fi

export RUN_SEEDS=false

echo "Starting API..."
exec node dist/main.js
