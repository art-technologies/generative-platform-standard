interface IGenArtPlatformCallbacks {
    onInit?: (version: string, signals: unknown) => void
    onLoadingComplete?: () => void
    onCapturePreview?: () => void
    onLoadingProgress?: (progress: number) => void
}

export interface ISignal {
    type: string
}

export interface IDownloadSignal extends ISignal {
    type: "gps:f:download"
    key: string
    text: string
}

export declare class GenArtPlatform {
    constructor(iframe: HTMLIFrameElement, callbacks: IGenArtPlatformCallbacks);
    triggerDownload: (key: string) => Promise<void>;
    downloadSignals: IDownloadSignal[]
}