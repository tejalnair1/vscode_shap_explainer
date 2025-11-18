"""
Stub version of featureSHAP for integration testing.
This returns fixed, hardcoded SHAP values regardless of input.
"""

import sys
import json
import numpy as np

# Arguments (but ignored in stub)
model_path = sys.argv[1]
data_path = sys.argv[2]
output_json = sys.argv[3]
output_png = sys.argv[4]

# Hardcoded dummy feature names + SHAP values
feature_names = ["feat_0", "feat_1", "feat_2", "feat_3"]
mean_abs_shap = [0.12, 0.04, 0.31, 0.19]  # Fake SHAP values

# Save JSON
result = {
    "feature_names": feature_names,
    "mean_abs_shap": mean_abs_shap
}

with open(output_json, "w") as f:
    json.dump(result, f)

# Create a blank PNG placeholder
import matplotlib.pyplot as plt
plt.figure(figsize=(4, 1))
plt.text(0.5, 0.5, "Stub SHAP Image", ha='center', va='center')
plt.axis('off')
plt.savefig(output_png, dpi=150)
plt.close()

print("STUB_SHAP_DONE")
