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
            // const channel = vscode.window.createOutputChannel("FeatureSHAP");
            // channel.show(true);
            // channel.clear();

            // const ascii = renderAsciiBars(shapValues);
            // channel.appendLine(ascii);
            showShapWebview(shapValues);
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

// ---------------------- Webview Display ----------------------
function showShapWebview(values: { id: number; text: string; value: number; percent: number }[]) {
    const panel = vscode.window.createWebviewPanel(
        "featureshapView",
        "FeatureSHAP",
        vscode.ViewColumn.Beside,
        {
            enableScripts: true
        }
    );

    panel.webview.html = getWebviewContent(values);
}

function getWebviewContent(values: { id: number; text: string; value: number; percent: number }[]): string {
    const dataJson = JSON.stringify(values);

    return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>FeatureSHAP</title>
<style>
    body {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        margin: 0;
        padding: 0.8rem 1.2rem;
        background-color: #1e1e1e;
        color: #e5e5e5;
    }

    h1 {
        font-size: 1rem;       /* reduced */
        margin-bottom: 0.6rem; /* tighter spacing */
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 0.25rem 0.4rem; /* smaller padding */
        vertical-align: top;
        font-size: 0.75rem;      /* smaller text */
        line-height: 1.1rem;     /* tighter lines */
    }

    th {
        text-align: left;
        border-bottom: 1px solid #3a3a3a;
        color: #c5c5c5;
    }

    tr:nth-child(even) td {
        background-color: #252526;
    }

    .code-cell {
        font-family: "Fira Code", monospace;
        white-space: pre-wrap;      /* allow wrapping */
        overflow-wrap: break-word;  /* wrap long lines */
        word-break: break-word;
        max-width: 420px;           /* limit width to reduce scrolling */
    }

    .bar-wrapper {
        width: 100%;
        background-color: #2a2a2a;
        border-radius: 4px;
        height: 10px;               /* thinner bar */
        overflow: hidden;
        margin-top: 3px;
    }

    .bar {
        height: 100%;
        border-radius: 4px;
        background: linear-gradient(90deg, #3b82f6, #facc15, #ef4444);
        transition: width 0.25s ease-out;
    }

    .percent-text {
        font-size: 0.7rem;        /* smaller */
        color: #c5c5c5;
        margin-left: 0.35rem;
        white-space: nowrap;
    }

    .line-label {
        white-space: nowrap;
        font-size: 0.75rem;
        color: #9cdcfe;
    }
</style>
</head>
<body>
    <h1>FeatureSHAP Output</h1>
    <table>
        <thead>
            <tr>
                <th style="width: 8%;">Line</th>
                <th style="width: 52%;">Code</th>
                <th style="width: 40%;">FeatureSHAP Value</th>
            </tr>
        </thead>
        <tbody id="rows"></tbody>
    </table>

    <script>
        const data = ${dataJson};

        const tbody = document.getElementById("rows");
        data.forEach(item => {
            const tr = document.createElement("tr");

            const tdLine = document.createElement("td");
            tdLine.className = "line-label";
            tdLine.textContent = "Line " + item.id;

            const tdCode = document.createElement("td");
            tdCode.className = "code-cell";
            tdCode.textContent = item.text;

            const tdBar = document.createElement("td");
            const wrapper = document.createElement("div");
            wrapper.className = "bar-wrapper";

            const bar = document.createElement("div");
            bar.className = "bar";
            bar.style.width = item.percent.toFixed(1) + "%";

            const pct = document.createElement("span");
            pct.className = "percent-text";
            pct.textContent = item.percent.toFixed(1) + "%";

            wrapper.appendChild(bar);
            tdBar.appendChild(wrapper);
            tdBar.appendChild(pct);

            tr.appendChild(tdLine);
            tr.appendChild(tdCode);
            tr.appendChild(tdBar);

            tbody.appendChild(tr);
        });
    </script>
</body>
</html>`;
}



export function deactivate() {}
