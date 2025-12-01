(function () {
    const vscode = acquireVsCodeApi();
    const container = document.getElementById("container");

    // Tell extension we are ready
    vscode.postMessage({ command: "ready" });

    window.addEventListener("message", (event) => {
        const msg = event.data;

        if (msg.command === "showShap") {
            container.innerHTML = "";

            msg.shap.forEach((item) => {
                const div = document.createElement("div");
                div.className = "item";

                div.innerHTML = `
                    <div><strong>Line ${item.id}</strong>: ${item.text}</div>
                    <div class="value">SHAP: ${item.value.toFixed(4)}</div>
                `;

                container.appendChild(div);
            });
        }
    });
})();
