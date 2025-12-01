import json
import sys
import random

# --- Input ---
selected_text = sys.argv[1]
output_path = sys.argv[2]

# --- Split into lines ---
lines = selected_text.strip().split("\n")

# Remove empty lines (indent only, newlines, etc.)
lines = [ln for ln in lines if ln.strip()]

# Generate fake SHAP % per line
scores = [round(random.uniform(0.01, 0.50), 4) for _ in lines]

# Normalize to sum to ~1.0 like real SHAP
norm = sum(scores)
scores = [s / norm for s in scores]

# Format output
data = {
    "lines": lines,
    "scores": scores
}

with open(output_path, "w") as f:
    json.dump(data, f)
