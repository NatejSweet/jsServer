import sys
import os
from dotenv import load_dotenv
import mysql.connector

def add_world_to_important_worlds(conn, world_name):
    cursor = conn.cursor()
    query = "SELECT * FROM worlds WHERE worldName = %s"
    cursor.execute(query, (world_name,))

    result = cursor.fetchone()
    cursor.close()

    if result:
        world_id, world_name, mainPage, img1Id, img2Id, pages, NavItems, mapMarkers, public, ownerId = result

        insert_statement = f"""
import mysql.connector
import os
from dotenv import load_dotenv

world_id = {world_id}
world_name = "{world_name}"
mainPage = "{mainPage}"
img1Id = {img1Id}
img2Id = {img2Id}
NavItems = '{NavItems}'
mapMarkers = '{mapMarkers}'
public = {public}
ownerId = "{ownerId}"

conn = mysql.connector.connect(
    user='DB_USER',
    password='DB_PASSWORD',
    host='DB_HOST',
    database='DB_DATABASE'
)

cursor = conn.cursor()
# Insert the other data

query = 'INSERT INTO worlds (world_id, world_name, mainPage, img1Id, img2Id, NavItems, mapMarkers, public, ownerId) (%s, %s, %s, %s, %s, %s, %s, %s, %s);
VALUES = (world_id, world_name, mainPage, img1Id, img2Id, NavItems, mapMarkers, public, ownerId)'
# Update the pages column
query = 'UPDATE worlds SET pages = pages WHERE world_id = world_id'
cursor.execute(query)
conn.commit()
cursor.close()
conn.close()
"""

        file_path = "insert_world.py"

        if not os.path.exists(file_path):
            open(file_path, "a+").close()

        with open(file_path, "w") as file:
            file.write(insert_statement)

    else:
        print(f"World '{world_name}' not found in the database.")
if not load_dotenv():
    print("Error occurred while loading .env file")
    sys.exit(1)

mode = sys.argv[1] if len(sys.argv) > 1 else None
world_name = sys.argv[2] if len(sys.argv) > 2 else None

if not world_name:
    world_name = 'Khorvair'
    try:
        conn = mysql.connector.connect(
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST'),
            database=os.getenv('DB_DATABASE')
        )
        add_world_to_important_worlds(conn, world_name)
    except mysql.connector.Error as error:
        print("Error occurred while connecting to production database:", error)
        sys.exit(1)

conn.close()