from pathlib import Path
import pandas as pd

data_dir = Path(__file__).resolve().parent.parent / "data" / "cleaned"

files = [
    "stuard_soil_data_cleaned.csv",
    "stuard_environmental_data (1)_cleaned.csv",
    "stuard_water_meter_data_cleaned.csv",
]

for filename in files:
    df = pd.read_csv(data_dir / filename, dtype=str)
    timestamps = pd.to_numeric(
        df["ts_generation"], errors="coerce"
    ).dropna()

    print(f"\nDataset: {filename}")
    print(f"Valid timestamps: {len(timestamps)}")

    if not timestamps.empty:
        print(f"Minimum: {timestamps.min()}")
        print(f"Maximum: {timestamps.max()}")