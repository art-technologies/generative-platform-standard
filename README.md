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

- **Download Asset** - allows Generative Platform to trigger downloading high quality asset rendered by Generative project. Generative platform may implement download button according to their own product and branding guidelines.
- **Preview Capture Trigger** - instructs Generative platform's preview capturing system to capture current state of the generated artwork.
- **Delegated Loading** - allows Generative platform to show loading UI while Generative project is loading. When Generative project finishes loading

## Standard Definition

Formal definition of the standard can be found [here](STANDARD.md).

## Instructions for Artists

**Note: If you're building On-Chain project, please refer to [this section](#note-for-on-chain-projects).**

Artist may choose to implement one or more features that Generative platform supports. Most important feature
is Download Asset. We have prepared a small library that you can use to implement this feature. You can find
it [here](build/genps-project.min.js) (minified) or [here](src/genps-project.js) (unminified).

You can also find a full example of how to use it [here](example/project).

### Download Asset
#### Instructions
To allow Generative platform trigger signals such as asset download implement the following code:

```js
gpsImplSignals = [
    {
        "type": "download",
        "key": "download-small",
        "text": "512 x 515"
    },
    {
        "type": "download",
        "key": "download-medium",
        "text": "1024 x 1024"
    },
    {
        "type": "download",
        "key": "download-large",
        "text": "2048 x 2048"
    }
]
```

Then define a function `gpsOnDownload`, library will automatically call this function when user clicks on the download
button. Second argument is a callback you need to invoke when dataURL for image is ready.

**Project does not initiate download within this standard. Instead, it sends data url to platform
and platform handles download on its own.**

```js
gpsOnDownload = (key, onReady) => {
    const canvas = document.querySelector("canvas");
    const dataURL = canvas.toDataURL("image/png");
    onReady(dataURL, "png");
}
```

### Preview Capture Trigger
#### Description
This trigger should be called when you want to instruct _Platform_ to capture current state of the artwork.

#### Instructions
When your artwork is finished rendering call `gpsCaptPrev()` method.

### Delegated Loading
#### Description
To delegate loading UI to generative platform add the following code.

#### Instructions
When your project is finished loading or you'd like it to be displayed call `gpsLoadCompl()` method.

### Note for On-Chain projects

We do understand that for on-chain project size of the project is very important.
The actual minified standard is less than 500 bytes. However, if you're not using all the features
you can do the following:
1. Edit [source file](/src/genps-project.js) to remove unused features
2. Minify the file either using `yarn build:project` or using any other cusom tool for minifaction
3. Use the minified file in your project

## Instructions for platforms

All work with standard API is done within `GenArtPlatform` class.
Source code can be found [here](/src/genps-platform.js).
You can also check out [example](/example/platform) to see how it works.

### Initialising a class
Given a project is always an `iframe` you need to pass a DOM element of an `iframe` to the class:
```js
const projectIframe = containerElement.querySelector(".project-iframe");
new GenArtPlatform(projectIframe, {
  // here we pass callbacks that will be discussed later  
})
```

**Note:** library will handle case with multiple _projects_ itself, no need to add additional code.

### Available callbacks
When you initialise a class you can pass callbacks that will be called when project sends signals.
Currently, following callbacks are supported:

#### onInit
This callback is called when _project_ is initialised (meaning that _project_ supports
the standard and is ready to receive further signals):
```js
function onInit(version, signals) {
    // here `version` is actual version of standard
    // `signals` is the array of signals that project supports
    console.log(genArtPlatform.downloadSignals);
}
```
Important: after `onInit` is called you have access to `genArtPlatform.downloadSignals` array.
Here you can find all possible image resolutions for download. You can use this array to build
your UI.

#### onLoadComplete
This callback is called when _project_ sends a signal that it's finished loading:
```js
function onLoadComplete() {
    // here you can hide loading UI
}
```

#### onPreviewCapture
This callback is called when _project_ sends a signal to capture a preview:
```js
function onCapturePreview() {
    // here you can make a screenshot of the project for a static preview
}
```


### Available methods
#### triggerDownload


This method triggers download of the asset. It accepts one argument - `key` of particular download
option. You can retrieve these `key`s from `genArtPlatform.downloadSignals` array.
```js
genArtPlatform.triggerDownload("some-key");
```