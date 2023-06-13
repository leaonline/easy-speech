<a name="module_EasySpeech"></a>

## EasySpeech

* [EasySpeech](#module_EasySpeech)
    * [module.exports](#exp_module_EasySpeech--module.exports) ⏏
        * [~EasySpeech](#module_EasySpeech--module.exports..EasySpeech) : <code>Object</code>
            * [.debug(fn)](#module_EasySpeech--module.exports..EasySpeech.debug)
            * [.detect()](#module_EasySpeech--module.exports..EasySpeech.detect) ⇒ <code>object</code>
            * [.status()](#module_EasySpeech--module.exports..EasySpeech.status) ⇒ <code>Object</code>
            * [.init(maxTimeout, interval, [quiet])](#module_EasySpeech--module.exports..EasySpeech.init) ⇒ <code>Promise.&lt;Boolean&gt;</code>
            * [.voices()](#module_EasySpeech--module.exports..EasySpeech.voices) ⇒ <code>Array.&lt;SpeechSynthesisVoice&gt;</code>
            * [.on(handlers)](#module_EasySpeech--module.exports..EasySpeech.on) ⇒ <code>Object</code>
            * [.defaults([options])](#module_EasySpeech--module.exports..EasySpeech.defaults) ⇒ <code>object</code>
            * [.speak(options, text, [voice], [handlers])](#module_EasySpeech--module.exports..EasySpeech.speak) ⇒ <code>Promise.&lt;(SpeechSynthesisEvent\|SpeechSynthesisErrorEvent)&gt;</code>
            * [.cancel()](#module_EasySpeech--module.exports..EasySpeech.cancel)
            * [.resume()](#module_EasySpeech--module.exports..EasySpeech.resume)
            * [.pause()](#module_EasySpeech--module.exports..EasySpeech.pause)
            * [.reset()](#module_EasySpeech--module.exports..EasySpeech.reset)

<a name="exp_module_EasySpeech--module.exports"></a>

### module.exports ⏏
EasySpeech is the default export; you can import it with whichever name you
like

**Kind**: Exported member  
**Example**  
```js
import EasySpeech from 'easy-speech'
```
**Example**  
```js
import Easy from 'easy-speech'
```
<a name="module_EasySpeech--module.exports..EasySpeech"></a>

#### module.exports~EasySpeech : <code>Object</code>
Cross browser Speech Synthesis with easy API.
This project was created, because it's always a struggle to get the synthesis
part of `Web Speech API` running on most major browsers.

Setup is very straight forward (see example).

**Kind**: inner constant of [<code>module.exports</code>](#exp_module_EasySpeech--module.exports)  
**See**

- https://wicg.github.io/speech-api/#tts-section
- https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis

**Example**  
```js
import EasySpeech from 'easy-speech'

const example = async () => {
  await EasySpeech.init() // required
  await EasySpeech.speak({ 'Hello, world' })
}
```

* [~EasySpeech](#module_EasySpeech--module.exports..EasySpeech) : <code>Object</code>
    * [.debug(fn)](#module_EasySpeech--module.exports..EasySpeech.debug)
    * [.detect()](#module_EasySpeech--module.exports..EasySpeech.detect) ⇒ <code>object</code>
    * [.status()](#module_EasySpeech--module.exports..EasySpeech.status) ⇒ <code>Object</code>
    * [.init(maxTimeout, interval, [quiet])](#module_EasySpeech--module.exports..EasySpeech.init) ⇒ <code>Promise.&lt;Boolean&gt;</code>
    * [.voices()](#module_EasySpeech--module.exports..EasySpeech.voices) ⇒ <code>Array.&lt;SpeechSynthesisVoice&gt;</code>
    * [.on(handlers)](#module_EasySpeech--module.exports..EasySpeech.on) ⇒ <code>Object</code>
    * [.defaults([options])](#module_EasySpeech--module.exports..EasySpeech.defaults) ⇒ <code>object</code>
    * [.speak(options, text, [voice], [handlers])](#module_EasySpeech--module.exports..EasySpeech.speak) ⇒ <code>Promise.&lt;(SpeechSynthesisEvent\|SpeechSynthesisErrorEvent)&gt;</code>
    * [.cancel()](#module_EasySpeech--module.exports..EasySpeech.cancel)
    * [.resume()](#module_EasySpeech--module.exports..EasySpeech.resume)
    * [.pause()](#module_EasySpeech--module.exports..EasySpeech.pause)
    * [.reset()](#module_EasySpeech--module.exports..EasySpeech.reset)

<a name="module_EasySpeech--module.exports..EasySpeech.debug"></a>

##### EasySpeech.debug(fn)
Enable module-internal debugging by passing your own callback function.
Debug will automatically pass through all updates to `status`

**Kind**: static method of [<code>EasySpeech</code>](#module_EasySpeech--module.exports..EasySpeech)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | A function, which always receives one argument, that  represents a current debug message |

**Example**  
```js
import EasySpeech from 'easy-speech'
import Log from '/path/to/my/Log'

EasySpeech.debug(arg => Log.debug('EasySpeech:', arg))
```
<a name="module_EasySpeech--module.exports..EasySpeech.detect"></a>

##### EasySpeech.detect() ⇒ <code>object</code>
Detects all possible occurrences of the main Web Speech API components
in the global scope.

The returning object will have the following structure (see example).

**Kind**: static method of [<code>EasySpeech</code>](#module_EasySpeech--module.exports..EasySpeech)  
**Returns**: <code>object</code> - An object containing all possible features and their status  
**Example**  
```js
EasySpeech.detect()

{
    speechSynthesis: SpeechSynthesis|undefined,
    speechSynthesisUtterance: SpeechSynthesisUtterance|undefined,
    speechSynthesisVoice: SpeechSynthesisVoice|undefined,
    speechSynthesisEvent: SpeechSynthesisEvent|undefined,
    speechSynthesisErrorEvent: SpeechSynthesisErrorEvent|undefined,
    onvoiceschanged: Boolean,
    onboundary: Boolean,
    onend: Boolean,
    onerror: Boolean,
    onmark: Boolean,
    onpause: Boolean,
    onresume: Boolean,
    onstart: Boolean
}
```
<a name="module_EasySpeech--module.exports..EasySpeech.status"></a>

##### EasySpeech.status() ⇒ <code>Object</code>
Returns a shallow copy of the current internal status. Depending of the
current state this might return an object with only a single field `status`
or a complete Object, including detected features, `defaults`, `handlers`
and supported `voices`.

**Kind**: static method of [<code>EasySpeech</code>](#module_EasySpeech--module.exports..EasySpeech)  
**Returns**: <code>Object</code> - the internal status  
**Example**  
```js
import EasySpeech from 'easy-speech'

// uninitialized
EasySpeech.status() // { status: 'created' }

// after EasySpeech.init
EasySpeech.status()

{
  status: 'init: complete',
  initialized: true,
  speechSynthesis: speechSynthesis,
  speechSynthesisUtterance: SpeechSynthesisUtterance,
  speechSynthesisVoice: SpeechSynthesisVoice,
  speechSynthesisEvent: SpeechSynthesisEvent,
  speechSynthesisErrorEvent: SpeechSynthesisErrorEvent,
  voices: [...],
  defaults: {
    pitch: 1,
    rate: 1,
    volume: 1,
    voice: null
  },
  handlers: {}
}
```
<a name="module_EasySpeech--module.exports..EasySpeech.init"></a>

##### EasySpeech.init(maxTimeout, interval, [quiet]) ⇒ <code>Promise.&lt;Boolean&gt;</code>
This is the function you need to run, before being able to speak.
It includes:
- feature detection
- feature assignment (into internal state)
- voices loading
- state update
- inform caller about success

It will load voices by a variety of strategies:

- detect and that SpeechSynthesis is basically supported, if not -> fail
- load voices directly
- if not loaded but `onvoiceschanged` is available: use `onvoiceschanged`
- if `onvoiceschanged` is not available: fallback to timeout
- if `onvoiceschanged` is fired but no voices available: fallback to timeout
- timeout reloads voices in a given `interval` until a `maxTimeout` is reached
- if voices are loaded until then -> complete
- if no voices found -> fail

Note: if once initialized you can't re-init (will skip and resolve to
`false`) unless you run `EasySpeech.reset()`.

**Kind**: static method of [<code>EasySpeech</code>](#module_EasySpeech--module.exports..EasySpeech)  
**Fulfil**: <code>Boolean</code> true, if initialized, false, if skipped (because already
  initialized)  
**Reject**: <code>Error</code> - The error `message` property will always begin with
  `EasySpeech: ` and contain one of the following:

  - `browser misses features` - The browser will not be able to use speech
     synthesis at all as it misses crucial features
  - `browser has no voices (timeout)` - No voice could be loaded with neither
     of the given strategies; chances are high the browser does not have
     any voices embedded (example: Chromium on *buntu os')  

| Param | Type | Description |
| --- | --- | --- |
| maxTimeout | <code>number</code> | [5000] the maximum timeout to wait for voices in ms |
| interval | <code>number</code> | [250] the interval in ms to check for voices |
| [quiet] | <code>boolean</code> | prevent rejection on errors, e.g. if no voices |

<a name="module_EasySpeech--module.exports..EasySpeech.voices"></a>

##### EasySpeech.voices() ⇒ <code>Array.&lt;SpeechSynthesisVoice&gt;</code>
Returns all available voices.

**Kind**: static method of [<code>EasySpeech</code>](#module_EasySpeech--module.exports..EasySpeech)  
**Condition**: `EasySpeech.init` must have been called and resolved to `true`  
<a name="module_EasySpeech--module.exports..EasySpeech.on"></a>

##### EasySpeech.on(handlers) ⇒ <code>Object</code>
Attaches global/default handlers to every utterance instance. The handlers
will run in parallel to any additional handlers, attached when calling
`EasySpeech.speak`

**Kind**: static method of [<code>EasySpeech</code>](#module_EasySpeech--module.exports..EasySpeech)  
**Returns**: <code>Object</code> - a shallow copy of the Object, containing all global handlers  
**Condition**: `EasySpeech.init` must have been called and resolved to `true`  

| Param | Type | Description |
| --- | --- | --- |
| handlers | <code>Object</code> |  |
| [handlers.boundary] | <code>function</code> | optional, event handler |
| [handlers.end] | <code>function</code> | optional, event handler |
| [handlers.error] | <code>function</code> | optional, event handler |
| [handlers.mark] | <code>function</code> | optional, event handler |
| [handlers.pause] | <code>function</code> | optional, event handler |
| [handlers.resume] | <code>function</code> | optional, event handler |
| [handlers.start] | <code>function</code> | optional, event handler |

<a name="module_EasySpeech--module.exports..EasySpeech.defaults"></a>

##### EasySpeech.defaults([options]) ⇒ <code>object</code>
Sets defaults for utterances. Invalid values will be ignored without error
or warning.

**Kind**: static method of [<code>EasySpeech</code>](#module_EasySpeech--module.exports..EasySpeech)  
**Returns**: <code>object</code> - a shallow copy of the current defaults  
**See**: https://wicg.github.io/speech-api/#utterance-attributes  

| Param | Type | Description |
| --- | --- | --- |
| [options] | <code>object</code> | Optional object containing values to set values |
| [options.voice] | <code>object</code> | Optional `SpeechSynthesisVoice` instance or  `SpeechSynthesisVoice`-like Object |
| [options.pitch] | <code>number</code> | Optional pitch value >= 0 and <= 2 |
| [options.rate] | <code>number</code> | Optional rate value >= 0.1 and <= 10 |
| [options.volume] | <code>number</code> | Optional volume value >= 0 and <= 1 |

<a name="module_EasySpeech--module.exports..EasySpeech.speak"></a>

##### EasySpeech.speak(options, text, [voice], [handlers]) ⇒ <code>Promise.&lt;(SpeechSynthesisEvent\|SpeechSynthesisErrorEvent)&gt;</code>
Speaks a voice by given parameters, constructs utterance by best possible
combinations of parameters and defaults.

If the given utterance parameters are missing or invalid, defaults will be
used as fallback.

**Kind**: static method of [<code>EasySpeech</code>](#module_EasySpeech--module.exports..EasySpeech)  
**Fulfill**: <code>SpeechSynthesisEvent</code> Resolves to the `end` event  
**Reject**: <code>SpeechSynthesisEvent</code> rejects using the `error` event  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | required options |
| text | <code>string</code> | required text to speak |
| [voice] | <code>object</code> | optional `SpeechSynthesisVoice` instance or   structural similar object (if `SpeechSynthesisUtterance` is not supported) |
| [options.pitch] | <code>number</code> | Optional pitch value >= 0 and <= 2 |
| [options.rate] | <code>number</code> | Optional rate value >= 0.1 and <= 10 |
| [options.volume] | <code>number</code> | Optional volume value >= 0 and <= 1 |
| [options.force] | <code>boolean</code> | Optional set to true to force speaking, no matter the internal state |
| [options.infiniteResume] | <code>boolean</code> | Optional, force or prevent internal resumeInfinity pattern |
| [handlers] | <code>object</code> | optional additional local handlers, can be   directly added as top-level properties of the options |
| [handlers.boundary] | <code>function</code> | optional, event handler |
| [handlers.end] | <code>function</code> | optional, event handler |
| [handlers.error] | <code>function</code> | optional, event handler |
| [handlers.mark] | <code>function</code> | optional, event handler |
| [handlers.pause] | <code>function</code> | optional, event handler |
| [handlers.resume] | <code>function</code> | optional, event handler |
| [handlers.start] | <code>function</code> | optional, event handler |

**Example**  
```js
const voice = EasySpeech.voices()[10] // get a voice you like

EasySpeech.speak({
  text: 'Hello, world',
  voice: voice,
  pitch: 1.2,  // a little bit higher
  rate: 1.7, // a little bit faster
  boundary: event => console.debug('word boundary reached', event.charIndex),
  error: e => notify(e)
})
```
<a name="module_EasySpeech--module.exports..EasySpeech.cancel"></a>

##### EasySpeech.cancel()
Cancels the current speaking, if any running

**Kind**: static method of [<code>EasySpeech</code>](#module_EasySpeech--module.exports..EasySpeech)  
<a name="module_EasySpeech--module.exports..EasySpeech.resume"></a>

##### EasySpeech.resume()
Resumes to speak, if any paused

**Kind**: static method of [<code>EasySpeech</code>](#module_EasySpeech--module.exports..EasySpeech)  
<a name="module_EasySpeech--module.exports..EasySpeech.pause"></a>

##### EasySpeech.pause()
Pauses the current speaking, if any running

**Kind**: static method of [<code>EasySpeech</code>](#module_EasySpeech--module.exports..EasySpeech)  
<a name="module_EasySpeech--module.exports..EasySpeech.reset"></a>

##### EasySpeech.reset()
Resets the internal state to a default-uninitialized state

**Kind**: static method of [<code>EasySpeech</code>](#module_EasySpeech--module.exports..EasySpeech)  
