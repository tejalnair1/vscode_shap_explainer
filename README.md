# VS Code SHAP Explainer Extension

The **VS Code SHAP Explainer** is a developer tool designed to bring **Explainable AI (XAI)** directly into the IDE experience.  
It enables developers to run SHAP-style feature attribution on highlighted code blocks *from inside VS Code*, using a stubbed backend that mimics the real featureSHAP model.

This extension was developed for the **AI for Software Engineering** course and follows a modular, component-based design intended for later integration with the real featureSHAP implementation.

---

# Features

### 1. Run SHAP on highlighted code
Users simply:

1. Highlight any code or comment in the editor  
2. Right-click  
3. Select **Run SHAP on Selection**

The selected text is passed to the backend interface (currently a stub).

### 2. Built-in featureSHAP stub  
The extension calls a stub module (`feature_shap_stub.py`) that simulates the real featureSHAP backend.

The stub:
- Accepts the highlighted text (but ignores it)
- Returns **fixed, hardcoded SHAP values** for integration testing
- Outputs:
  - `shap_stub_output.json` — global feature importance  
  - `shap_stub_output.png` — dummy placeholder image (currently ignored)
This stub uses the **same interface** as the future featureSHAP model, enabling seamless replacement with the real component.

### 3. ASCII visualization inside VS Code  
After running an explanation, the extension displays global SHAP feature importance directly in the **Output Panel**:

```
=== SHAP Feature Importance ===

feat_0          | ▇▇▇▇▇▇▇▇▇▇▇▇▇  (0.120)
feat_1          | ▇▇▇▇  (0.040)
feat_2          | ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇  (0.310)
feat_3          | ▇▇▇▇▇▇▇▇▇▇▇▇  (0.190)

Done (stub).
```

### 4. PNG output currently disabled  
The PNG produced by the stub is ignored.  
Only ASCII SHAP output is shown.


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

### 4. Highlight code in the editor from some code file you have
Select any range of text (code or comments).

### 5. Right-click → **Run SHAP on Selection**
Or open the Command Palette:

```
Run SHAP on Selection
```

### 6. View explanation output
Results appear in the **SHAP Explanation** Output Panel.

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

---

# Resources

- [SHAP Documentation](https://shap.readthedocs.io/)
- [VS Code Extension API](https://code.visualstudio.com/api)

---

**Enjoy using the VS Code SHAP Explainer!**
