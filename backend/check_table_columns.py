import os
from dotenv import load_dotenv
import psycopg

load_dotenv()

connection = psycopg.connect(
    host=os.getenv("DB_HOST", "localhost"),
    port=os.getenv("DB_PORT", "5432"),
    dbname=os.getenv("DB_NAME", "smart_irrigation_db"),
    user=os.getenv("DB_USER", "postgres"),
    password=os.getenv("DB_PASSWORD"),
)

query = """
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
      'soil_readings',
      'environmental_readings',
      'water_meter_readings'
  )
ORDER BY table_name, ordinal_position;
"""

with connection:
    with connection.cursor() as cursor:
        cursor.execute(query)

        for table_name, column_name, data_type in cursor.fetchall():
            print(f"{table_name} | {column_name} | {data_type}")

connection.close()
