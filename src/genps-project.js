window.addEventListener("message", function(event) {
    if (!event.data) {
        return;
    }

    if (event.data.type === "genps:f:init" && typeof window.genPSImplSignals !== "undefined") {
        event.source.postMessage({
            type: "genps:b:init",
            implementsSignals: window.genPSImplSignals,
        }, "*")
    }

    if (event.data.type === "genps:f:download" && typeof window.genPSOnDownload === "function") {
        window.genPSOnDownload(event.data.key);
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