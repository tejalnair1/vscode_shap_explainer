import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
	console.log("SHAP extension activated!");

	let disposable = vscode.commands.registerCommand("shap.runExplanation", async () => {

		vscode.window.showInformationMessage("Running SHAP…");

		// ---- 1. Ask user for model file ----
		const modelUri = await vscode.window.showOpenDialog({
			canSelectMany: false,
			filters: { "Model Files": ["joblib"] }
		});

		if (!modelUri) {
			vscode.window.showWarningMessage("Model not selected.");
			return;
		}

		const modelPath = modelUri[0].fsPath;

		// ---- 2. Ask user for data file ----
		const dataUri = await vscode.window.showOpenDialog({
			canSelectMany: false,
			filters: { "NumPy Arrays": ["npy"] }
		});

		if (!dataUri) {
			vscode.window.showWarningMessage("Data not selected.");
			return;
		}

		const dataPath = dataUri[0].fsPath;

		// ---- 3. Build output path for SHAP HTML ----
		const outputPath = path.join(context.extensionPath, "shap_output.png");

		// const outputPath = path.join(context.extensionPath, "shap_output.html");

		// ---- 4. Path to your Python script ----
		const scriptPath = path.join(context.extensionPath, "scripts", "explain.py");

		// ---- 5. Construct Python command ----
		const pythonPath = "/Applications/anaconda3/envs/shapenv/bin/python";

		const command = `"${pythonPath}" "${scriptPath}" "${modelPath}" "${dataPath}" "${outputPath}"`;
		// ---- 6. Execute Python ----
		exec(command, (err, stdout, stderr) => {
			if (err) {
				vscode.window.showErrorMessage("Error running SHAP.");
				console.error(stderr);
				return;
			}

			vscode.window.showInformationMessage("SHAP output generated!");

			// Open SHAP HTML result
			vscode.env.openExternal(vscode.Uri.file(outputPath));
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
