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

const GENERATIVE_PLATFORM_STANDARD_VERSION = "1.0.1";

function downloadFile(dataUrl, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export class GenArtPlatform {
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

      if (message.type === "gps:b:init" && message.implementsSignals) {
        this.projectStandardVersion = message.v;
        this.implementsSignals = message.implementsSignals;
        if (typeof this.callbacks.onInit === "function") {
          this.callbacks.onInit(this.projectStandardVersion, this.implementsSignals);
          // prevent from calling twice
          this.callbacks.onInit = undefined;
        }
      }

      if (message.type === "gps:b:load-compl") {
        if (typeof this.callbacks.onLoadingComplete === "function") {
          this.callbacks.onLoadingComplete();
        }
      }

      if (message.type === "gps:b:capt-prev") {
        if (typeof this.callbacks.onCapturePreview === "function") {
          this.callbacks.onCapturePreview();
        }
      }

      if (message.type === "gps:b:download") {
        // is project initiated download without prior request from platform - ignore it
        if (!this.pendingDownload) {
          return
        }

        downloadFile(message.dataUrl, `${this.pendingDownload.key}.${message.ext}`);
        if (typeof this.pendingDownload.callback === "function") {
          this.pendingDownload.callback();
        }
        this.pendingDownload = undefined;
      }
    })

    const sendInitialMessage = () => {
      this.iframe.contentWindow.postMessage({
        type: "gps:f:init",
        v: GENERATIVE_PLATFORM_STANDARD_VERSION,
      }, "*");
    }

    // there is no guaranteed way to check that iframe is ready to receive messages
    // so let's add load listened and try to send message right away
    // send two init messages should not cause any issues
    this.iframe.addEventListener("load", sendInitialMessage);
    sendInitialMessage();
  }

  get downloadSignals() {
    return this.implementsSignals?.filter((signal) => signal.type === "gps:f:download");
  }

  triggerDownload(key) {
    // TODO: in future, we probably want to allow multiple downloads
    if (this.pendingDownload) {
      return Promise.reject("Only one active download is supported at a time");
    }

    return new Promise((resolve) => {
      this.pendingDownload = {
        key,
        callback: resolve,
      }
      this.iframe.contentWindow.postMessage({
        type: "gps:f:download",
        key,
      }, "*");
    })
  }
}
