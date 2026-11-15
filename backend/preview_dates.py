from pathlib import Path
import pandas as pd

data_dir = Path(__file__).resolve().parent.parent / "data" / "cleaned"

files = [
    "stuard_soil_data_cleaned.csv",
    "stuard_environmental_data (1)_cleaned.csv",
    "stuard_water_meter_data_cleaned.csv",
]

for filename in files:
    df = pd.read_csv(data_dir / filename)

    timestamps = pd.to_numeric(
        df["ts_generation"], errors="coerce"
    )

    dates = pd.to_datetime(
        timestamps, unit="ms", utc=True, errors="coerce"
    )

    print(f"\nDataset: {filename}")
    print(f"Earliest date (UTC): {dates.min()}")
    print(f"Latest date (UTC): {dates.max()}")
    print(f"Invalid dates: {dates.isna().sum()}")