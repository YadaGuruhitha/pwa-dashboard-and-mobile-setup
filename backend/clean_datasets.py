
from pathlib import Path
import pandas as pd

# Find the project's data folder
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
OUTPUT_DIR = DATA_DIR / "cleaned"
OUTPUT_DIR.mkdir(exist_ok=True)

for file_path in sorted(DATA_DIR.glob("*.csv")):
    df = pd.read_csv(file_path)

    # Remove repeated header rows, if present
    repeated_header = pd.Series(False, index=df.index)

    for column in df.columns:
        repeated_header |= (
            df[column].astype(str).str.strip() == column
        )

    cleaned = df.loc[~repeated_header].copy()

    output_path = OUTPUT_DIR / f"{file_path.stem}_cleaned.csv"
    cleaned.to_csv(output_path, index=False)

    print(f"\nFile: {file_path.name}")
    print(f"Repeated header rows removed: {repeated_header.sum()}")
    print(f"Rows before: {len(df)}")
    print(f"Rows after: {len(cleaned)}")
    print(f"Saved to: {output_path}")
