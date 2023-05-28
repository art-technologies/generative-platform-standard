/*
* Generative Platform support
*
* Each project can implement one or more of the following methods:
* - `download`- if generative platform should display a button for high quality asset download
* - `loading-complete` - if generative platform should display a loader until project is ready to be displayed
* - `capture-preview` - if generative platform should wait for a trigger to capture a preview image
*/

/*
 * Signals
 *
 * Description: Indicates to the Generative platform actions that can be signalled to generative project.
 *
 * Instructions: to implement this feature add below code to your project define list of operations that can be
 * signalled from Generative platform to generative project. Generative project should be able to understand the
 * signals.
 */

window.$generativePlatofrmStandard = {
    methods: {},
    handlers: {},
}

function buildGenArtStandardMessage(payload) {
    return { generativePlatformStandard: { ...payload } }
}

function readGenArtStandardMessage(message) {
    return message.generativePlatformStandard
}

window.addEventListener("message", (event) => {
    const message = readGenArtStandardMessage(event.data);
    if (!message) {
        return;
    }

    if (message.type === "init-request") {
        window.$generativePlatofrmStandard.id = message.id
        event.source.postMessage(buildGenArtStandardMessage({
            id: window.$generativePlatofrmStandard.id,
            type: "init",
            implementsSignals: window.$generativePlatofrmStandard.implementsSignals,
        }), "*")
    }

    if (message.type === "download") {
        const onDownloadHandler = window.$generativePlatofrmStandard.handlers.onDownload;
        if (typeof onDownloadHandler === "function") {
            onDownloadHandler(message.key);
        }
    }
})

window.$generativePlatofrmStandard.methods.loadingComplete = () => {
    window.parent.postMessage(buildGenArtStandardMessage({
        id: window.$generativePlatofrmStandard.id,
        type: "loading-complete",
    }), "*");
}

window.$generativePlatofrmStandard.methods.capturePreview = () => {
    window.parent.postMessage(buildGenArtStandardMessage({
        id: window.$generativePlatofrmStandard.id,
        type: "capture-preview",
    }), "*");
}
/* GEN ART STANDARD END */

/*
 * Signals
 *
 * Description: Indicates to the Generative platform actions that can be signalled to generative project.
 *
 * Instructions: to implement this feature add below code to your project define list of operations that can be
 * signalled from Generative platform to generative project. Generative project should be able to understand the
 * signals.
 */
window.$generativePlatofrmStandard.implementsSignals = [
    /*
     * Download (download)
     *
     * Description: Indicates to the Generative platform that it should display a button for high quality asset
     * download.
     *
     * Instructions: to implement this feature add below code to your project and call `onDownload` method when
     * you want Generative Platform to display a button for high quality asset download.
     *
     * Note: `key` property is used to identify the download button. It is also used to trigger download when
     * `triggerDownload` method is called.
     */
    {
        "type": "download",
        "key": "download-small",
        "text": "512 x 515"
    },
    {
        "type": "download",
        "key": "download-medium",
        "text": "1024 x 1024"
    },
    {
        "type": "download",
        "key": "download-large",
        "text": "2048 x 2048"
    },
    /*
     * Delegated Loading (loading-complete)
     *
     * Description: Indicates to the Generative platform that it should be responsible for showing loader UI
     * until project is ready to be displayed.
     *
     * Instructions: to implement this feature add below code to your project and call `loadingCompleted` method
     * when you want Generative Platform to stop showing loader display the project.
     */
    {
        "type": "loading-complete",
    },
    /*
     * Preview Capture Trigger (capture-preview)
     *
     * Description: Indicates to the Generative platform preview generator that Generative project
     * will trigger when to capture a preview image.
     *
     * Instructions: to implement this feature add below code to your project and trigger `capturePreview`
     * method when you want preview image to be captured.
     */
    {
        "type": "capture-preview",
    }
]

const sleep = (durationMs) => new Promise((resolve) => {
    setTimeout(resolve, durationMs);
})

window.$generativePlatofrmStandard.handlers.onDownload = (key) => {
    console.log("downloading asset");

    const canvas = document.querySelector("canvas");
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `${key}.png`;
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const urlParams = new URLSearchParams(window.location.search);

async function draw() {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerWidth;
    // Create the gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, urlParams.get("color1") || "red");
    gradient.addColorStop(1, urlParams.get("color2") || "blue");

    // Fill a rectangle with the gradient
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // we're indicating that initial loading is complete
    window.$generativePlatofrmStandard.methods.loadingComplete();

    for (let i = 0; i < 200; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height);
        ctx.lineTo(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height);
        ctx.stroke();
        await sleep(1000 / 60);
    }

    // we're indicating that project is ready to capture preview
    window.$generativePlatofrmStandard.methods.capturePreview();
}

setTimeout(() => {
    draw();
}, +urlParams.get('timeout') || 2000);

