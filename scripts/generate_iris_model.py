import numpy as np
import joblib
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import json

# Load Iris
data = load_iris()
X, y = data.data, data.target
feature_names = list(data.feature_names)

# Save feature names
with open("../shap_model/feature_names.json", "w") as f:
    json.dump(feature_names, f)

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model inside shapenv
clf = RandomForestClassifier(n_estimators=200, random_state=42)
clf.fit(X_train, y_train)

# Save model and sample data
joblib.dump(clf, "../shap_model/model.joblib")
np.save("../shap_model/data.npy", X_test[:20])

print("Created model.joblib, data.npy, feature_names.json")
