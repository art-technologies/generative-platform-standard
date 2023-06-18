const GENERATIVE_PLATFORM_STANDARD_VERSION = "1";
const replyPostMessage = (type, payload) => window.parent.postMessage({
    type,
    ...payload,
}, "*");

window.addEventListener("message", (event) => {
    if (!event.data) {
        return;
    }

    switch(event.data.type) {
        case "gps:f:init":
            window.gpsImplSignals && replyPostMessage("gps:b:init", {
                implementsSignals: window.gpsImplSignals,
                v: GENERATIVE_PLATFORM_STANDARD_VERSION,
            })
            
        case "gps:f:download":
            window.gpsOnDownload?.(event.data.key, (dataUrl, ext) => {
                replyPostMessage("gps:b:download", { dataUrl, ext })
            });
    }
})

window.gpsLoadCompl = () => replyPostMessage("gps:b:load-compl")

window.gpsCaptPrev = () => replyPostMessage("gps:b:capt-prev")