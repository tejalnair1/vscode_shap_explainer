import sys
import json
import joblib
import numpy as np
import shap
import matplotlib.pyplot as plt

# --------------------------
# Read input arguments
# --------------------------
model_path = sys.argv[1]
data_path = sys.argv[2]
output_json_path = sys.argv[3]
output_png_path = sys.argv[4]

# --------------------------
# Load model and data
# --------------------------
model = joblib.load(model_path)
X = np.load(data_path)

# Feature names (fallback if not available)
feature_names = [f"feat_{i}" for i in range(X.shape[1])]

# --------------------------
# Compute SHAP values
# --------------------------
explainer = shap.Explainer(model, X)
shap_values = explainer(X, check_additivity=False)

vals = shap_values.values   # (samples, features, classes)

# --------------------------
# Global feature importance
# collapse samples (0) and classes (2)
# keep features (1)
# --------------------------
mean_abs = np.mean(np.abs(vals), axis=(0, 2))

# Save JSON summary
json_result = {
    "feature_names": feature_names,
    "mean_abs_shap": mean_abs.tolist()
}

with open(output_json_path, "w") as f:
    json.dump(json_result, f)

# --------------------------
# Beeswarm PNG
# --------------------------

expl_for_plot = shap.Explanation(
    values=np.mean(np.abs(shap_values.values), axis=2),
    data=X,
    feature_names=feature_names
)

plt.figure()
shap.plots.beeswarm(expl_for_plot, show=False)
plt.tight_layout()
plt.savefig(output_png_path, dpi=200)
plt.close()

print("JSON_AND_PNG_READY")
