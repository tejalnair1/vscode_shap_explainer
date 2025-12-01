import * as vscode from "vscode";

interface ShapValue {
    id: number;
    text: string;
    value: number;
    percent: number;
}

interface ShapResponse {
    shap_values: ShapValue[];
}

export function activate(context: vscode.ExtensionContext) {
    console.log("FeatureSHAP extension activated.");

    const disposable = vscode.commands.registerCommand(
        "featureshap.computeShap",
        async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage("No active editor.");
                return;
            }

            const selection = editor.selection;
            const selectedCode = editor.document.getText(selection);

            if (!selectedCode.trim()) {
                vscode.window.showErrorMessage("No code selected.");
                return;
            }

            const shapValues = await getShapValues(selectedCode);
            if (!shapValues) {
                vscode.window.showErrorMessage("Failed to fetch SHAP values.");
                return;
            }

            // Output window
            const channel = vscode.window.createOutputChannel("FeatureSHAP");
            channel.show(true);
            channel.clear();
            // channel.appendLine("Selected Code:");
            // channel.appendLine(selectedCode);
            // channel.appendLine("\nSHAP Response (Raw):");
            // channel.appendLine(JSON.stringify(shapValues, null, 2));
            // channel.appendLine("\nASCII Visualization:\n");

            const ascii = renderAsciiBars(shapValues);
            channel.appendLine(ascii);
        }
    );

    context.subscriptions.push(disposable);
}

// ---------------------- SHAP Server Call ----------------------
async function getShapValues(code: string) {
    try {
        const response = await fetch("http://127.0.0.1:5005/compute_shap", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const data = (await response.json()) as ShapResponse;
        return data.shap_values as ShapValue[];

    } catch (err: any) {
        vscode.window.showErrorMessage("SHAP server error: " + err.message);
        return null;
    }
}

// ---------------------- ASCII Bar Graph ----------------------
function renderAsciiBars(
    values: { id: number; text: string; value: number; percent: number }[]
) {
    const width = 30; // total bar width

    function charForPercent(p: number) {
        if (p >= 80) return "█";  // strongest
        if (p >= 50) return "▓";  // medium
        if (p >= 20) return "▒";  // light
        return "░";              // very light
    }

    return values
        .map((v) => {
            const barLength = Math.round((v.percent / 100) * width);
            const blockChar = charForPercent(v.percent);

            const bar = blockChar.repeat(barLength);

            // collapse multiline text into single readable line
            const textOneLine = v.text.replace(/\n\s*/g, " ");

            return `Line ${v.id} | ${textOneLine} | ${bar.padEnd(width, " ")}  (${v.percent.toFixed(
                1
            )}%)`;
        })
        .join("\n");
}





export function deactivate() {}
