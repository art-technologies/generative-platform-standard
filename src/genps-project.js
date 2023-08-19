const GENERATIVE_PLATFORM_STANDARD_VERSION = "1.0.1";

// there is a chance what events like gps:b:load-compl or gps:b:capt-prev will be sent before gps:f:init
// so we need to store them in queue and send them after gps:f:init
window.gpsMsgQueue = [];
window.gpsInited = false;

const replyPostMessage = (type, payload) => {
    if (!window.gpsInited) {
        window.gpsMsgQueue.push({ type, payload });
        return;
    }

    window.parent.postMessage({
        type,
        ...payload,
    }, "*")
};

window.addEventListener("message", (event) => {
    if (!event.data) {
        return;
    }

    switch(event.data.type) {
        case "gps:f:init":
            window.gpsInited = true;
            window.gpsImplSignals && replyPostMessage("gps:b:init", {
                implementsSignals: window.gpsImplSignals,
                v: GENERATIVE_PLATFORM_STANDARD_VERSION,
            });
            window.gpsMsgQueue.forEach(({ type, payload }) => replyPostMessage(type, payload));
            window.gpsMsgQueue = [];
            
        case "gps:f:download":
            window.gpsOnDownload?.(event.data.key, (dataUrl, ext) => {
                replyPostMessage("gps:b:download", { dataUrl, ext })
            });
    }
})

window.gpsLoadProg = (p) => replyPostMessage("gps:b:load-prog", { p })

window.gpsLoadCompl = () => replyPostMessage("gps:b:load-compl")

window.gpsCaptPrev = () => replyPostMessage("gps:b:capt-prev")