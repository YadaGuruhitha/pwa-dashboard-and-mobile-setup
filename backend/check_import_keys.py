
from pathlib import Path
import pandas as pd

PROJECT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_DIR / "data" / "prepared"

FILES = [
    "stuard_soil_data_prepared.csv",
    "stuard_environmental_data (1)_prepared.csv",
    "stuard_water_meter_data_prepared.csv",
]

for filename in FILES:
    file_path = DATA_DIR / filename
    df = pd.read_csv(file_path)

    print(f"\nDataset: {filename}")
    print(f"Total rows: {len(df)}")

    missing_ids = df["id"].isna().sum()
    missing_devices = df["device_identifier"].isna().sum()
    duplicate_keys = df.duplicated(
        subset=["id", "device_identifier"]
    ).sum()

    print(f"Missing IDs: {missing_ids}")
    print(f"Missing device identifiers: {missing_devices}")
    print(f"Duplicate ID/device pairs: {duplicate_keys}")
