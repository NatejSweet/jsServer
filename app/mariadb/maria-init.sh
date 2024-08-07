#!/bin/bash
DB_USER=${MARIA_USER}
DB_PASS=${MARIA_PASSWORD}
DB_ROOT_PASS=${MARIA_ROOT_PASSWORD}
#!/bin/bash

# Read environment variables or set defaults
DB_USER=${MARIA_USER:-defaultUser}
DB_PASS=${MARIA_PASSWORD:-defaultPass}

# Path to your SQL script
SQL_SCRIPT_PATH="./create-user.sql"

# Create a temporary SQL file with substituted values
TEMP_SQL_SCRIPT="/tmp/create-user-temp.sql"

# Replace placeholders in the SQL script with actual environment variable values
sed "s/USERNAME_PLACEHOLDER/${DB_USER}/g; s/PASSWORD_PLACEHOLDER/${DB_PASS}/g" $SQL_SCRIPT_PATH > $TEMP_SQL_SCRIPT

# Execute the SQL script
# Replace 'root' and 'your_root_password' with your actual root username and password
mysql -u root --password="${DB_ROOT_PASS}" < $TEMP_SQL_SCRIPT

# Optionally, remove the temporary SQL file after execution
rm $TEMP_SQL_SCRIPT

mysql -u "${DB_USER}" -p"${DB_PASS}" < ./table-setup.sql