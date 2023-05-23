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

function buildGenArtStandardMessage(payload) {
  return {
    generativePlatformStandard: {
      ...payload,
    }
  }
}

function readGenArtStandardMessage(message) {
  return message.generativePlatformStandard
}

const uniqueId = () => {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substring(2);
  return dateString + randomness;
};

class GenArtPlatform {
  // we will store all signals that are supported by a project here
  // we expect project to report the list of features within a postMessage
  implementsSignals = undefined;
  id = undefined;

  // `iframeSelector` - identifies generative project iframe
  constructor(iframeElement, callbacks = {}) {
    this.callbacks = callbacks;
    this.iframe = iframeElement;
    this.id = uniqueId();

    window.addEventListener("message", (event) => {
      const message = readGenArtStandardMessage(event.data);
      if (!message || message.id !== this.id) {
        return;
      }

      if (message.type === "init" && message.implementsSignals) {
        this.implementsSignals = message.implementsSignals;
        if (typeof this.callbacks.onInit === "function") {
          this.callbacks.onInit(this.implementsSignals);
        }
      }

      if (message.type === "loading-complete") {
        if (typeof this.callbacks.onLoadingComplete === "function") {
          this.callbacks.onLoadingComplete();
        }
      }

      if (message.type === "capture-preview") {
        if (typeof this.callbacks.onCapturePreview === "function") {
          this.callbacks.onCapturePreview();
        }
      }
    })
    this.iframe.addEventListener("load", () => {
      this.iframe.contentWindow.postMessage(buildGenArtStandardMessage({
        id: this.id,
        type: "init-request"
      }), "*");
    })
  }

  get downloadSignals() {
    return this.implementsSignals?.filter((signal) => signal.type === "download");
  }

  triggerDownload(key) {
    this.iframe.contentWindow.postMessage(buildGenArtStandardMessage({
      id: this.id,
      type: "download",
      key,
    }), "*");
  }
}
