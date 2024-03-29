/*
* Generative Platform support
*
* Each project can implement one or more of the following methods:
* - `download`- if generative platform should display a button for high quality asset download
* - `load-compl` - if generative platform should display a loader until project is ready to be displayed
* - `capt-prev` - if generative platform should wait for a trigger to capture a preview image
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


/*
 * Signals
 *
 * Description: Indicates to the Generative platform actions that can be signalled to generative project.
 *
 * Instructions: to implement this feature add below code to your project define list of operations that can be
 * signalled from Generative platform to generative project. Generative project should be able to understand the
 * signals.
 */
gpsImplSignals = [
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
        "type": "gps:f:download",
        "key": "download-small",
        "text": "512 x 515"
    },
    {
        "type": "gps:f:download",
        "key": "download-medium",
        "text": "1024 x 1024"
    },
    {
        "type": "gps:f:download",
        "key": "download-large",
        "text": "2048 x 2048"
    },
    /*
     * Delegated Loading (load-compl)
     *
     * Description: Indicates to the Generative platform that it should be responsible for showing loader UI
     * until project is ready to be displayed.
     *
     * Instructions: to implement this feature add below code to your project and call `loadingCompleted` method
     * when you want Generative Platform to stop showing loader display the project.
     */
    {
        "type": "gps:b:load-compl",
    },
    /*
     * Preview Capture Trigger (capt-prev)
     *
     * Description: Indicates to the Generative platform preview generator that Generative project
     * will trigger when to capture a preview image.
     *
     * Instructions: to implement this feature add below code to your project and trigger `capturePreview`
     * method when you want preview image to be captured.
     */
    {
        "type": "gps:b:capt-prev",
    }
]

const sleep = (durationMs) => new Promise((resolve) => {
    setTimeout(resolve, durationMs);
})

gpsOnDownload = (key, onReady) => {
    console.log("downloading asset");

    const canvas = document.querySelector("canvas");
    const dataURL = canvas.toDataURL("image/png");
    onReady(dataURL, "png");
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
    gpsLoadCompl();

    for (let i = 0; i < 200; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height);
        ctx.lineTo(Math.random() * ctx.canvas.width, Math.random() * ctx.canvas.height);
        ctx.stroke();
        await sleep(1000 / 60);
    }

    // we're indicating that project is ready to capture preview
    gpsCaptPrev();
}

setTimeout(() => {
    draw();
}, +urlParams.get('timeout') || 2000);

