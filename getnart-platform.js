/**
 * Generative Platform standard proposal.
 * This class is used to communicate with generative project iframe.
 *
 * Goals:
 * 1. Provide a standard way to communicate with generative projects.
 * 2. Provide a way to check if generative project implements certain
 * features such as downloading image and knowing when project is ready
 * for preview capture.
 *
 * Definitions:
 * - Generative Platform - platform showing generative artworks (Verse, OpenSea, fxhash, Artblocks etc.)
 * - Generative Project - iframe corresponding to generative artwork
 */

class GenArtPlatform {
  onLoadingComplete = () => {};
  onDownloadAsset = () => {};

  // `iframeSelector` - identifies generative project iframe
  constructor(iframeSelector) {
    this.iframe = iframeSelector;
    /** Checks if iframe implements downloading image support */
    if (iframeSelector.contentWindow.$implementsDownloadAsset) {
      this.onDownloadAsset();
    }

    /** Checks if iframe implements loading events */
    if (iframeSelector.contentWindow.$implementsDelegatedLoading) {
      const strongRef = this;
      window.addEventListener("message", function (event) {
        if (event.data === "loading-complete") {
          strongRef.onLoadingComplete();
        }
      });
    }
  }

  signalDownloadAsset() {
    this.iframe.contentWindow.postMessage("download-asset", "*");
  }

  get implementsDownloadAsset() {
    return this.iframe?.contentWindow?.$implementsDownloadAsset || false;
  }

  get implementsDelegatedLoading() {
    return this.iframe?.contentWindow?.$implementsDelegatedLoading || false;
  }

  get implementsPreviewCaptureTrigger() {
    return (
      this.iframe?.contentWindow?.$implementsPreviewCaptureTrigger || false
    );
  }

  get projectImplementations() {
    return {
      downloadAsset: this.iframe.contentWindow.$implementsDownloadAsset,
      delegatedLoading: this.iframe.contentWindow.$implementsDelegatedLoading,
      previewCaptureTrigger:
        this.iframe.contentWindow.$implementsPreviewCaptureTrigger,
    };
  }
}
