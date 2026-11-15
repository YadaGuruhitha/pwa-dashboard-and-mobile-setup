from pathlib import Path
import pandas as pd

PROJECT_DIR = Path(__file__).resolve().parent.parent
INPUT_DIR = PROJECT_DIR / "data" / "cleaned"
OUTPUT_DIR = PROJECT_DIR / "data" / "prepared"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

FILES = [
    "stuard_soil_data_cleaned.csv",
    "stuard_environmental_data (1)_cleaned.csv",
    "stuard_water_meter_data_cleaned.csv",
]

NUMERIC_COLUMNS = {
    "stuard_soil_data_cleaned.csv": [
        "id", "line", "electrical_conductivity",
        "humidity", "temperature", "battery"
    ],
    "stuard_environmental_data (1)_cleaned.csv": [
        "id", "co2", "humidity", "pressure",
        "temperature", "battery"
    ],
    "stuard_water_meter_data_cleaned.csv": [
        "id", "line", "current_volume"
    ],
}

for filename in FILES:
    df = pd.read_csv(INPUT_DIR / filename, dtype=str)

    # Convert Unix timestamps (milliseconds) to UTC dates
    timestamp_numbers = pd.to_numeric(
        df["ts_generation"], errors="coerce"
    )
    df["ts_generation"] = pd.to_datetime(
        timestamp_numbers,
        unit="ms",
        utc=True,
        errors="coerce",
    )

    # Convert measurement columns to numeric values
    for column in NUMERIC_COLUMNS[filename]:
        if column in df.columns:
            df[column] = pd.to_numeric(
                df[column], errors="coerce"
            )

    output_name = filename.replace(
        "_cleaned.csv", "_prepared.csv"
    )
    output_path = OUTPUT_DIR / output_name
    df.to_csv(output_path, index=False)

    print(f"\nDataset: {filename}")
    print(f"Rows prepared: {len(df)}")
    print(
        "Invalid timestamps:",
        df["ts_generation"].isna().sum()
    )
    print(
        "Missing values preserved:",
        int(df.isna().sum().sum())
    )
    print(f"Saved to: {output_path}")
