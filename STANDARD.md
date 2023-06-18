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
gps:[f|b]:[message-type]
```

Where:
- `gps:` is a type namespace (meaning "Generative Platform Standard")
- `f:` or `b:` is a direction of the signal
- `f:` (forward) indicates a signal from _Platform_ to _Project_
- `b:` (backward) indicates a signal from _Project_ to _Platform_

Additional fields are optional and depend on the signal type.

## Signal types

### `gps:f:init`
#### Description
This signal should be sent from _Platform_ to _Project_ to initialize the communication channel.
After the message is received by _Project_ it should send a `gps:b:init` message back to _Platform_.
Version of the standard should be specified in the `v` field. It is allowed to omit minor and patch numbers if
they are zero (e.g. `"1"` instead of `"1.0.0""`).

#### Example

```json
{
  "type": "gps:f:init",
  "v": "1"
}
```

### `gps:b:init`
#### Description
This signal should be sent from _Project_ to _Platform_ in response to `gps:f:init` message.
As a payload, it should contain additional field `"implementsSignals"` which should ab an array
of all possible signals (both forward and backward) that are supported by this project.

#### Example
```json
{
    "type": "gps:b:init",
    "implementsSignals": [
        {
            "type": "gps:f:download",
            "key": "download-small",
            "text": "512 x 515"
        },
        {
            "type": "gps:f:download",
            "key": "download-medium",
            "text": "1024 x 1024"
        },
        {
            "type": "gps:b:load-compl",
        },
        {
            "type": "gps:b:capt-prev",
        }
    ]
}
```

### `gps:b:load-compl`
#### Description
This signal should be sent from _Project_ to _Platform_ when the project is ready to be rendered.
As a result, _Platform_ should hide the loading indicator and show the project.

#### Example
```json
{
    "type": "gps:b:load-compl"
}
```

### `gps:b:capt-prev`
#### Description
This signal should be sent from _Project_ to _Platform_ when the project is ready to be captured.
It is especially important for projects that have some kind of animation.
_Platform_ can use this signal in order to make a screenshot of a _Project_.

#### Example
```json
{
    "type": "gps:b:capt-prev"
}
```

### `gps:f:download`
#### Description
This signal should be sent from _Platform_ to _Project_ when the user clicks on the download button.
Therefore, _Project_ should generate a data url with the image and send it back to _Platform_ via `gps:b:download` signal.
Two additional properties that can exists are `key` and `text`. `key` is a unique identifier of the
download option and `text` is a text that should be displayed to the user. It is helpful when
_Project_ supports multiple download options (e.g. different sizes of the image).

#### Example
```json
{
  "type": "gps:f:download",
  "key": "download-medium",
  "text": "1024 x 1024"
}
```

### `gps:b:download`
#### Description
_Project_ should reply on `gps:f:download` signal with this signal. It should contain a data url
with the image that should be downloaded. Projects are supposed to be used with `sandbox` attribute,
so it is not possible to download the image directly from the _Project_. Two required properties
are `dataUrl` and `ext`. `dataUrl` is a data url with the image and `ext` is a file extension of the image.

#### Example
```json
{
  "type": "gps:b:download",
  "dataUrl": "...",
  "ext": "png"
}
```
