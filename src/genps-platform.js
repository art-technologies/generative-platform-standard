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

const GENERATIVE_PLATFORM_STANDARD_VERSION = "1";

function downloadFile(dataUrl, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

class GenArtPlatform {
  // we will store all signals that are supported by a project here
  // we expect project to report the list of features within a postMessage
  implementsSignals = undefined;
  projectStandardVersion = undefined;

  pendingDownload = undefined;

  // `iframeSelector` - identifies generative project iframe
  constructor(iframeElement, callbacks = {}) {
    this.callbacks = callbacks;
    this.iframe = iframeElement;

    window.addEventListener("message", (event) => {
      const message = event.data;
      if (!message || this.iframe.contentWindow !== event.source) {
        return;
      }

      if (message.type === "genps:b:init" && message.implementsSignals) {
        this.projectStandardVersion = message.v;
        this.implementsSignals = message.implementsSignals;
        if (typeof this.callbacks.onInit === "function") {
          this.callbacks.onInit(this.projectStandardVersion, this.implementsSignals);
        }
      }

      if (message.type === "genps:b:loading-complete") {
        if (typeof this.callbacks.onLoadingComplete === "function") {
          this.callbacks.onLoadingComplete();
        }
      }

      if (message.type === "genps:b:capture-preview") {
        if (typeof this.callbacks.onCapturePreview === "function") {
          this.callbacks.onCapturePreview();
        }
      }

      if (message.type === "genps:b:download") {
        // is project initiated download without prior request from platform - ignore it
        if (!this.pendingDownload) {
          return
        }

        downloadFile(message.dataUrl, `${this.pendingDownload.key}.${message.ext}`);
        this.pendingDownload = undefined;
      }
    })
    this.iframe.addEventListener("load", () => {
      this.iframe.contentWindow.postMessage({
        type: "genps:f:init",
        v: GENERATIVE_PLATFORM_STANDARD_VERSION,
      }, "*");
    })
  }

  get downloadSignals() {
    return this.implementsSignals?.filter((signal) => signal.type === "genps:f:download");
  }

  triggerDownload(key) {
    this.pendingDownload = { key };
    this.iframe.contentWindow.postMessage({
      type: "genps:f:download",
      key,
    }, "*");
  }
}
