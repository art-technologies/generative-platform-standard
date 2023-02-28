# Generative platform standard

Main idea is to establish communication between Generative project created by the artists and Generative platform displaying the project
to maximise collector experience and overall integration of the project.

## Definitions

Generative platform - platform displaying generative projects as an iframe (Verse, OpenSea, fxhash, ArtBlocks etc.)

Generative project - code written by artists that is embedded as an iframe into the Generative platform.

## Motivation

A lot of generative art collectors wants to download or print high quality outputs they purchase. However, present experience of downloading high quality asset consists of pressing a key or adding aditional parameters to the iframe URL. It should be easier for collectors to download high quality assets of their favourite artworks by simply clicking a download button that Generative platform implements based on their UI and product needs.

This project aims to define the standard between Generative platform and Generative projects to accomplish aforementiond task and address most common problems.

## Current features

- Download Asset - allows Generative Platform to trigger downloading high quality asset rendered by Generative project. Generative platform may implement download button according to their own product and branding guidelines.
- Preview Capture Trigger - instructs Generative platform's preview capturing system to capture current state of the generated artwork.
- Delegated Loading - allows Generative platform to show loading UI while Generative project is loading. When Generative project finishes loading

## Instructions for Artists

### Download asset

To allow Generative paltform trigger high quality asset download add the following code.

```js
window.$implementsDownloadAsset = true;
window.addEventListener("message", function (event) {
  if (event.data == "download-asset") {
    downloadAsset();
  }
});

function downloadAsset() {
  // your download logic here
}
```

### Preview Capture trigger

To implement preview capture trigger add the following code

```js
window.$implementsPreviewCaptureTrigger = true;
function capturePreview() {
  dispatchEvent(new Event("capture-preview"));
}
```

When your artwork is finished rendering call `capturePreview()` method.

### Delegated Loading

To delegate loading UI to generative platform add the following code.

```js
window.$implementsDelegatedLoading = true;
function loadingComplete() {
  window.parent.postMessage("loading-complete", "*");
}
```

When your project is finished loading or you'd like it to be displayed call `loadingComplete()` method.

## Instructions for platforms

TBD. Example in `index.html`.
