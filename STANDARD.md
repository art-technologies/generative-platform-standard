# Generative Platform Standard Description

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

#### Example
```json
{
    "type": "genps:f:init"
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

### `genps:b:download`
#### Description
This signal should be sent from _Platform_ to _Project_ when the user clicks on the download button.
Therefore, _Project_ should generate a downloadable file and initiate the download process.
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


