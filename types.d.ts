interface IGenArtPlatformCallbacks {
    onInit?: (version: string, signals: unknown) => void
    onLoadingComplete?: () => void
    onCapturePreview?: () => void
}

export declare class GenArtPlatform {
    constructor(iframe: HTMLIFrameElement, callbacks: IGenArtPlatformCallbacks);
    triggerDownload: (key: string) => void;
}