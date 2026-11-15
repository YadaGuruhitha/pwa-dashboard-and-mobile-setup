
from pathlib import Path
import os

import pandas as pd
import psycopg
from dotenv import load_dotenv

PROJECT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_DIR / "data" / "prepared"

load_dotenv(Path(__file__).resolve().parent / ".env")

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "5432"),
    "dbname": os.getenv("DB_NAME", "smart_irrigation_db"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD"),
}

DATASETS = [
    {
        "file": "stuard_soil_data_prepared.csv",
        "table": "soil_readings",
        "columns": [
            "source_record_id", "device_identifier", "recorded_at",
            "line", "electrical_conductivity", "humidity",
            "temperature", "battery",
        ],
    },
    {
        "file": "stuard_environmental_data (1)_prepared.csv",
        "table": "environmental_readings",
        "columns": [
            "source_record_id", "device_identifier", "recorded_at",
            "co2", "humidity", "pressure", "temperature", "battery",
        ],
    },
    {
        "file": "stuard_water_meter_data_prepared.csv",
        "table": "water_meter_readings",
        "columns": [
            "source_record_id", "device_identifier", "recorded_at",
            "line", "current_volume",
        ],
    },
]


def to_db_value(value):
    if pd.isna(value):
        return None

    if isinstance(value, pd.Timestamp):
        return value.to_pydatetime()

    if hasattr(value, "item"):
        return value.item()

    return value


def main():
    if not DB_CONFIG["password"]:
        raise RuntimeError("DB_PASSWORD is missing from backend/.env")

    with psycopg.connect(**DB_CONFIG) as connection:
        with connection.cursor() as cursor:
            for dataset in DATASETS:
                file_path = DATA_DIR / dataset["file"]
                df = pd.read_csv(file_path)

                # Rename source columns to match the database schema.
                df = df.rename(
                    columns={
                        "ts_generation": "recorded_at",
                        "id": "source_record_id",
                    }
                )

                # Convert IDs and timestamps to the correct data types.
                df["source_record_id"] = pd.to_numeric(
                    df["source_record_id"], errors="coerce"
                ).astype("Int64")

                df["recorded_at"] = pd.to_datetime(
                    df["recorded_at"],
                    utc=True,
                    errors="coerce",
                    format="mixed",
                )

                if df["source_record_id"].isna().any():
                    raise ValueError(
                        f"Missing or invalid IDs in {dataset['file']}"
                    )

                if df["recorded_at"].isna().any():
                    raise ValueError(
                        f"Missing or invalid timestamps in {dataset['file']}"
                    )
                columns = dataset["columns"]
                placeholders = ", ".join(["%s"] * len(columns))
                column_sql = ", ".join(f'"{c}"' for c in columns)

                query = f"""
                    INSERT INTO {dataset['table']} ({column_sql})
                    VALUES ({placeholders})
                    ON CONFLICT (source_record_id, device_identifier)
                    DO NOTHING
                """

                inserted = 0

                for row in df[columns].itertuples(
                    index=False, name=None
                ):
                    values = tuple(to_db_value(value) for value in row)
                    cursor.execute(query, values)
                    inserted += cursor.rowcount

                print(
                    f"{dataset['table']}: {len(df)} source rows, "
                    f"{inserted} inserted"
                )

    print("Historical data import completed.")


if __name__ == "__main__":
    main()
