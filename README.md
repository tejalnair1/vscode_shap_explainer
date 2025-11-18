# VS Code SHAP Explainer Extension

The **VS Code SHAP Explainer** is a developer tool designed to bring **Explainable AI (XAI)** directly into the IDE experience.  
It enables developers to run SHAP (SHapley Additive exPlanations) on trained ML models *from inside VS Code*.

This extension was developed for the **AI for Software Engineering** course and follows proper component-based architecture, including the use of a **stub component** to simulate the featureSHAP backend.

---

# Features

### 1. Run SHAP explanations from VS Code  
Use the command palette:

```
Run SHAP Explanation
```

The extension prompts you to select:
- a trained model (`.joblib`)
- a dataset (`.npy`)

### 2. Built-in featureSHAP stub  
The extension calls a stub module (`feature_shap_stub.py`) that simulates the real featureSHAP backend.

The stub:
- Returns **fixed, hardcoded SHAP values** for integration testing
- Outputs:
  - `shap_output.json` — global feature importance scores
  - `shap_output.png` — placeholder beeswarm-style plot

This stub uses the **same interface** as the future featureSHAP model, enabling seamless replacement with the real component.

### 3. ASCII visualization inside VS Code  
After running an explanation, the extension displays global SHAP feature importance directly in the **Output Panel**:

```
=== SHAP Feature Importance ===

feat_0          | ▇▇▇▇▇▇▇▇▇▇▇▇▇  (0.120)
feat_1          | ▇▇▇▇  (0.040)
feat_2          | ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇  (0.310)
feat_3          | ▇▇▇▇▇▇▇▇▇▇▇▇  (0.190)

Done.
```

### 4. PNG SHAP visualization  
A PNG beeswarm plot (placeholder when using the stub) is generated and opened in the system’s default image viewer (e.g., macOS Preview).

---

# Project Structure

```
vscode-shap-explainer/
│
├── src/
│   └── extension.ts          # VS Code extension logic
│
├── scripts/
│   ├── feature_shap_stub.py  # Stubbed featureSHAP backend
│   └── explain.py            # Real SHAP backend (future use)
│
├── package.json
├── tsconfig.json
└── README.md
```

---

# Usage

### 1. Install dependencies

```bash
npm install
```

### 2. Compile the extension

```bash
npm run compile
```

### 3. Launch in Extension Development Host

Press:

```
F5
```

VS Code opens a **VS Code Extension Development Host** window.

### 4. Run SHAP

Open the Command Palette:

```
Cmd+Shift+P → Run SHAP Explanation
```

Select:
1. A `.joblib` model  
2. A `.npy` dataset  

The extension will display:
- ASCII SHAP bars in the **Output Panel**
- A PNG in the system viewer  
- A temporary JSON file containing SHAP values

---

# Requirements

- Python 3
- Required Python packages:
  - shap
  - numpy
  - matplotlib
  - joblib
- Trained model saved as `.joblib`
- Dataset saved as `.npy`

---


# Release Notes

### **0.1.0 — Current Version**
- Added featureSHAP stub backend  
- Integrated Python backend call  
- ASCII SHAP visualization inside VS Code  
- PNG plot generation (placeholder)  
- JSON export of global SHAP feature importance  
- Modular architecture ready for real model integration  

---

# Next Steps

- Replace stub with real featureSHAP implementation  
- Add a sidebar “SHAP Explorer” view 

---

# Resources

- [SHAP Documentation](https://shap.readthedocs.io/)
- [VS Code Extension API](https://code.visualstudio.com/api)

---

**Enjoy using the VS Code SHAP Explainer!**
