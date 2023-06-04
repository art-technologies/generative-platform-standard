# Generative Platform Standard Description

## Standard versioning

This standard is versioned using [Semantic Versioning](https://semver.org/). The version number is
defined in `package.json` file.

## Signal format

The main communication channel between _Platform_ and _Project_ is `window.postMessage` method.
In the context of this standard, we call these messages "signals".
_Platform_ can send signal to _Project_ and _Project_ can send signal to _Platform_.

Signal is a valid JSON object that required to have a `type` field which value should be
the following string:

```
genps:[f|b]:[message-type]
```

Where:
- `genps:` is a type namespace (meaning "Generative Platform Standard")
- `f:` or `b:` is a direction of the signal
- `f:` (forward) indicates a signal from _Platform_ to _Project_
- `b:` (backward) indicates a signal from _Project_ to _Platform_

Additional fields are optional and depend on the signal type.

## Signal types

### `genps:f:init`
#### Description
This signal should be sent from _Platform_ to _Project_ to initialize the communication channel.
After the message is received by _Project_ it should send a `genps:b:init` message back to _Platform_.
Version of the standard should be specified in the `v` field. It is allowed to omit minor and patch numbers if
they are zero (e.g. `"1"` instead of `"1.0.0""`).

#### Example

```json
{
  "type": "genps:f:init",
  "v": "1"
}
```

### `genps:b:init`
#### Description
This signal should be sent from _Project_ to _Platform_ in response to `genps:f:init` message.
As a payload, it should contain additional field `"implementsSignals"` which should ab an array
of all possible signals (both forward and backward) that are supported by this project.

#### Example
```json
{
    "type": "genps:b:init",
    "implementsSignals": [
        {
            "type": "genps:f:download",
            "key": "download-small",
            "text": "512 x 515"
        },
        {
            "type": "genps:f:download",
            "key": "download-medium",
            "text": "1024 x 1024"
        },
        {
            "type": "genps:b:loading-complete",
        },
        {
            "type": "genps:b:capture-preview",
        }
    ]
}
```

### `genps:b:loading-complete`
#### Description
This signal should be sent from _Project_ to _Platform_ when the project is ready to be rendered.
As a result, _Platform_ should hide the loading indicator and show the project.

#### Example
```json
{
    "type": "genps:b:loading-complete"
}
```

### `genps:b:capture-preview`
#### Description
This signal should be sent from _Project_ to _Platform_ when the project is ready to be captured.
It is especially important for projects that have some kind of animation.
_Platform_ can use this signal in order to make a screenshot of a _Project_.

#### Example
```json
{
    "type": "genps:b:capture-preview"
}
```

### `genps:f:download`
#### Description
This signal should be sent from _Platform_ to _Project_ when the user clicks on the download button.
Therefore, _Project_ should generate a data url with the image and send it back to _Platform_ via `genps:b:download` signal.
Two additional properties that can exists are `key` and `text`. `key` is a unique identifier of the
download option and `text` is a text that should be displayed to the user. It is helpful when
_Project_ supports multiple download options (e.g. different sizes of the image).

#### Example
```json
{
  "type": "genps:f:download",
  "key": "download-medium",
  "text": "1024 x 1024"
}
```

### `genps:b:download`
#### Description
_Project_ should reply on `genps:f:download` signal with this signal. It should contain a data url
with the image that should be downloaded. Projects are supposed to be used with `sandbox` attribute,
so it is not possible to download the image directly from the _Project_. Two required properties
are `dataUrl` and `ext`. `dataUrl` is a data url with the image and `ext` is a file extension of the image.

#### Example
```json
{
  "type": "genps:b:download",
  "dataUrl": "...",
  "ext": "png"
}
```
