const GENERATIVE_PLATFORM_STANDARD_VERSION = "1";

window.addEventListener("message", function(event) {
    if (!event.data) {
        return;
    }

    if (event.data.type === "genps:f:init" && typeof window.genPSImplSignals !== "undefined") {
        event.source.postMessage({
            type: "genps:b:init",
            implementsSignals: window.genPSImplSignals,
            v: GENERATIVE_PLATFORM_STANDARD_VERSION,
        }, "*")
    }

    if (event.data.type === "genps:f:download" && typeof window.genPSOnDownload === "function") {
        window.genPSOnDownload(event.data.key, function onReady(dataUrl, ext) {
            window.parent.postMessage({
                type: "genps:b:download",
                dataUrl,
                ext,
            }, "*");
        });
    }
})

window.genPSOnTriggerLoadCompl = function() {
    window.parent.postMessage({
        type: "genps:b:loading-complete",
    }, "*");
}

window.genPSOnTriggerCaptPrev = function() {
    window.parent.postMessage({
        type: "genps:b:capture-preview",
    }, "*");
}