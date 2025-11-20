import * as vscode from 'vscode';
import { exec } from 'child_process';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
    console.log("SHAP extension activated!");

    // ------------------------------------------------------------
    // Command: Run SHAP on highlighted selection (stub backend)
    // ------------------------------------------------------------
    let disposable = vscode.commands.registerCommand(
        "shap.runOnSelection",
        async () => {

            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage("No active editor.");
                return;
            }

            const selection = editor.document.getText(editor.selection);
            if (!selection.trim()) {
                vscode.window.showWarningMessage("No code selected.");
                return;
            }

            vscode.window.showInformationMessage("Running SHAP stub…");

            // Output JSON path (temp)
            const outputJSON = path.join(os.tmpdir(), "shap_stub_output.json");
            const outputPNG  = path.join(os.tmpdir(), "shap_stub_output.png"); // stub will create it, but we ignore it

            // Path to stub backend
            const scriptPath = path.join(
                context.extensionPath,
                "scripts",
                "feature_shap_stub.py"
            );

            // Python interpreter
            const pythonPath = "/Applications/anaconda3/envs/shapenv/bin/python";

            // The stub ignores actual inputs, but we keep the API shape consistent
            const fakeModel = "dummy-model";
            const fakeData = selection;  // eventually real model may use selected code

            const command = `"${pythonPath}" "${scriptPath}" "${fakeModel}" "${fakeData}" "${outputJSON}" "${outputPNG}"`;

            exec(command, (err, stdout, stderr) => {
                if (err) {
                    vscode.window.showErrorMessage("Error running SHAP stub.");
                    console.error(stderr);
                    return;
                }

                // Load JSON output
                let data;
                try {
                    data = JSON.parse(fs.readFileSync(outputJSON, "utf8"));
                } catch (e) {
                    vscode.window.showErrorMessage("Could not read SHAP stub output JSON.");
                    return;
                }

                const featureNames: string[] = data.feature_names;
                const shapValues: number[] = data.mean_abs_shap;

                // Create output channel
                const out = vscode.window.createOutputChannel("SHAP Explanation");
                out.clear();
                out.show(true);

                out.appendLine("=== SHAP Feature Importance (Stub) ===\n");

                const maxVal = Math.max(...shapValues);

                featureNames.forEach((name, i) => {
                    const val = shapValues[i];
                    const bar = "▇".repeat(Math.round((val / maxVal) * 30));
                    out.appendLine(
                        `${name.padEnd(15)} | ${bar}  (${val.toFixed(3)})`
                    );
                });

                out.appendLine("\nDone (stub).");
            });
        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() {}
