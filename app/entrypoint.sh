#!/bin/sh

# Wait for the database to be ready
until nc -z -v -w30 db 3306
do
  echo "Waiting for database connection..."
  sleep 1
done

# Run the setup script
echo "Setting up the database..."
# node ./setup.js

# Start the API service
exec npm start