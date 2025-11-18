import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

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

		// ---- 3. Output paths (use temp directory) ----
		const outputJSON = path.join(os.tmpdir(), "shap_output.json");
		const outputPNG = path.join(os.tmpdir(), "shap_output.png");

		// ---- 4. STUB inserted here ----
		const scriptPath = path.join(context.extensionPath, "scripts", "feature_shap_stub.py");

		// ---- 5. Python interpreter path ----
		const pythonPath = "/Applications/anaconda3/envs/shapenv/bin/python";

		// ---- 6. Run Python ----
		const command = `"${pythonPath}" "${scriptPath}" "${modelPath}" "${dataPath}" "${outputJSON}" "${outputPNG}"`;

		exec(command, (err, stdout, stderr) => {
			if (err) {
				vscode.window.showErrorMessage("Error running SHAP.");
				console.error(stderr);
				return;
			}

			vscode.window.showInformationMessage("SHAP analysis complete!");

			// ---- 7. Read JSON ----
			console.log("Reading JSON from:", outputJSON);

			const data = JSON.parse(fs.readFileSync(outputJSON, "utf8"));
			const featureNames: string[] = data.feature_names;
			const shapValues: number[] = data.mean_abs_shap;

			// ---- 8. Create Output Panel ----
			const outputChannel = vscode.window.createOutputChannel("SHAP Explanation");
			outputChannel.clear();
			outputChannel.show(true);

			outputChannel.appendLine("=== SHAP Feature Importance ===\n");

			const maxVal = Math.max(...shapValues);

			featureNames.forEach((name, i) => {
				const val = shapValues[i];
				const bar = "▇".repeat(Math.round((val / maxVal) * 30));
				outputChannel.appendLine(
					`${name.padEnd(15)} | ${bar}  (${val.toFixed(3)})`
				);
			});
			outputChannel.appendLine("\n=== End of SHAP Explanation ===");

			// ---- 9. Open PNG in system image viewer ----
			vscode.env.openExternal(vscode.Uri.file(outputPNG));
		});
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
