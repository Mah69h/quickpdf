import pdfplumber
import pandas as pd
import sys

pdf_path = sys.argv[1]
excel_path = sys.argv[2]

rows = []

with pdfplumber.open(pdf_path) as pdf:

    for page in pdf.pages:

        words = page.extract_words()

        current_row = []
        last_top = None

        for word in words:

            top = round(word['top'])

            # New row detected
            if last_top is not None and abs(top - last_top) > 5:

                rows.append(current_row)

                current_row = []

            current_row.append(word['text'])

            last_top = top

        if current_row:
            rows.append(current_row)

# Normalize columns
max_cols = max(len(r) for r in rows)

normalized_rows = []

for row in rows:

    while len(row) < max_cols:
        row.append('')

    normalized_rows.append(row)

# Create DataFrame
df = pd.DataFrame(normalized_rows)

# Export Excel
df.to_excel(
    excel_path,
    index=False
)

print("Excel created successfully")