initGenArtPlatform(document.getElementById("project-1"));
initGenArtPlatform(document.getElementById("project-2"));

function initGenArtPlatform(containerElement) {
    const projectIframe = containerElement.querySelector(".project-iframe");
    const logElement = containerElement.querySelector(".log");
    const downloadContainer = containerElement.querySelector(".download-container");

    const genArtPlatform = new GenArtPlatform(projectIframe, {
        onInit: (signals) => {
            logElement.innerHTML += `<div><b>[EVENT FIRED]</b> onInit, supported signals:</div>`;
            logElement.innerHTML += `<pre>${JSON.stringify(signals, undefined, 4)}</pre>`;

            genArtPlatform.downloadSignals.forEach((signal) => {
                const btn = document.createElement("button");
                btn.innerText = signal.text;
                btn.disabled = true;
                btn.addEventListener("click", () => {
                    genArtPlatform.triggerDownload(signal.key);
                });
                downloadContainer.appendChild(btn);
            });
        },
        onLoadingComplete: () => {
            logElement.innerHTML += `<div><b>[EVENT FIRED]</b> onLoadingComplete</div>`;
        },
        onCapturePreview: () => {
            logElement.innerHTML += `<div><b>[EVENT FIRED]</b> onCapturePreview</div>`;
            const downloadButtons = downloadContainer.querySelectorAll("button");
            downloadButtons.forEach((btn) => {
                btn.disabled = false;
            });
        }
    });
}