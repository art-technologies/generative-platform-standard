interface IGenArtPlatformCallbacks {
    onInit?: (version: string, signals: unknown) => void
    onLoadingComplete?: () => void
    onCapturePreview?: () => void
}

interface ISignal {
    type: string
}

interface IDownloadSignal extends ISignal {
    type: "gps:f:download"
    key: string
    text: string
}

export declare class GenArtPlatform {
    constructor(iframe: HTMLIFrameElement, callbacks: IGenArtPlatformCallbacks);
    triggerDownload: (key: string) => void;
    downloadSignals: IDownloadSignal[]
}