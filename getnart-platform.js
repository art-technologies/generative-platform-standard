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

  // `iframeSelector` - identifies generative project iframe
  constructor(iframeSelector) {
    this.iframe = iframeSelector;

    /** Checks if iframe implements loading events and listens to events if so subscribe to events */
    if (iframeSelector.contentWindow.$implementsDelegatedLoading) {
      const strongRef = this;
      window.addEventListener("message", function (event) {
        if (event.data === "loading-complete") {
          strongRef.onLoadingComplete();
        }
      });
    }
  }

  signalMessage(signal) {
    this.iframe.contentWindow.postMessage(signal, "*");
  }

  get implementsDelegatedLoading() {
    return this.iframe?.contentWindow?.$implementsDelegatedLoading || false;
  }

  get implementsPreviewCaptureTrigger() {
    return (
      this.iframe?.contentWindow?.$implementsPreviewCaptureTrigger || false
    );
  }

  get getSignals() {
    return this.iframe?.contentWindow?.$implementsSignals || [];
  }

  get projectImplementations() {
    return {
      downloadAsset: this.iframe.contentWindow.$implementsDownloadAsset,
      delegatedLoading: this.iframe.contentWindow.$implementsDelegatedLoading,
      previewCaptureTrigger: this.iframe.contentWindow.$implementsPreviewCaptureTrigger,
      signals:  this.iframe?.contentWindow?.$implementsSignals || [],
    };
  }
}
