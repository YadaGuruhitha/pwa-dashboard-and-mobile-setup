
from pathlib import Path
import pandas as pd

# Locate the project's data folder
DATA_DIR = Path(__file__).resolve().parent.parent / "data"

csv_files = sorted(DATA_DIR.glob("*.csv"))

if not csv_files:
    print(f"No CSV files found in: {DATA_DIR}")
else:
    for file_path in csv_files:
        print("\n" + "=" * 70)
        print(f"FILE: {file_path.name}")

        try:
            df = pd.read_csv(file_path)

            print(f"Rows: {len(df):,}")
            print(f"Columns: {len(df.columns)}")
            print(f"Duplicate rows: {df.duplicated().sum():,}")
            print(f"Missing values: {df.isna().sum().sum():,}")

            print("\nColumn details:")
            print(df.dtypes.to_string())

            missing = df.isna().sum()
            missing = missing[missing > 0]

            if not missing.empty:
                print("\nColumns with missing values:")
                print(missing.to_string())
            else:
                print("\nNo missing values found.")

        except Exception as error:
            print(f"Could not read this file: {error}")
