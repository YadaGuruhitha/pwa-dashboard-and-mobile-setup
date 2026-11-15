
from pathlib import Path
import pandas as pd

project_dir = Path(__file__).resolve().parent.parent
data_dir = project_dir / "data" / "prepared"

files = [
    "stuard_soil_data_prepared.csv",
    "stuard_environmental_data (1)_prepared.csv",
    "stuard_water_meter_data_prepared.csv",
]

for filename in files:
    df = pd.read_csv(data_dir / filename)

    parsed = pd.to_datetime(
        df["ts_generation"], utc=True, errors="coerce", format="mixed"
    )

    invalid = df.loc[parsed.isna(), ["id", "ts_generation"]]

    print(f"\n--- {filename} ---")
    print("Timestamp column type:", df["ts_generation"].dtype)
    print("Invalid timestamps:", len(invalid))

    for _, row in invalid.head(5).iterrows():
        print(
            f"ID={row['id']} | "
            f"value={row['ts_generation']!r} | "
            f"type={type(row['ts_generation']).__name__}"
        )
