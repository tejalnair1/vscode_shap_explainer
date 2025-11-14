import shap
import sys
import numpy as np
import joblib
import json
import matplotlib.pyplot as plt

model_path = sys.argv[1]
data_path = sys.argv[2]
output_path = sys.argv[3]

print("model_path:", model_path)
print("data_path:", data_path)
print("output_path:", output_path)

model = joblib.load(model_path)
X = np.load(data_path)

# Load feature names
try:
    with open("feature_names.json", "r") as f:
        feature_names = json.load(f)
except:
    feature_names = None

explainer = shap.Explainer(model, X)
shap_values = explainer(X, check_additivity=False)

# Mean abs across classes
mean_abs = np.mean(np.abs(shap_values.values), axis=2)

expl_for_plot = shap.Explanation(
    values=mean_abs,
    data=X,
    feature_names=feature_names
)

plt.figure()
shap.plots.beeswarm(expl_for_plot, show=False)
plt.tight_layout()
plt.savefig(output_path, dpi=200)
plt.close()

print("Saved SHAP beeswarm PNG to:", output_path)
