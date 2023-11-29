<h1 align="center">Easy Speech</h1>

<div align="center">
Cross browser Speech Synthesis; no dependencies.
</div>

  <p align="center">
    <br />
    <a href="https://github.com/jankapunkt/easy-speech/blob/master/API.md"><strong>API docs »</strong></a>
    <br />
  </p>


[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
[![Test suite](https://github.com/jankapunkt/easy-speech/actions/workflows/tests.yml/badge.svg)](https://github.com/jankapunkt/easy-speech/actions/workflows/tests.yml)
[![CodeQL Semantic Analysis](https://github.com/jankapunkt/easy-speech/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/jankapunkt/easy-speech/actions/workflows/codeql-analysis.yml)
![npm](https://img.shields.io/npm/v/easy-speech)
![npm bundle size](https://img.shields.io/bundlephobia/min/easy-speech)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/easy-speech)


## ⭐️ Why EasySpeech?

This project was created, because it's always a struggle to get the synthesis
part of `Web Speech API` running on most major browsers.

## ✨ Features

- 🪄 Single API for using `speechSynthesis` across multiple browsers
- 🌈 Async API (Promises, async/await)
- 🚀 Hooks for all events; global and/or voice-instance-specific
- 🌱 Easy to set up and integrate: auto-detects and loads available voices
- 🔧 Includes fixes or workarounds for many browser-specific quirks
- 📝 Internal logging via `EasySpeech.debug` hook
- 📦 Multiple build targets
- 🎮 Live demo to test your browser
 

**Note:** this is not a polyfill package, if your target browser does not  support speech synthesis or the Web Speech
API, this package is not usable.


## 🚀 Live Demo

The live demo is available at https://jankapunkt.github.io/easy-speech/
You can use it to test your browser for `speechSynthesis` support and functionality.

[![live demo screenshot](./docs/demo_screenshot.png)](https://jankapunkt.github.io/easy-speech/)

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [📦 Installation](#-installation)
- [👨‍💻 Usage](#-usage)
  - [🚀 Initialize](#-initialize)
  - [📢 Speak a voice](#-speak-a-voice)
  - [😵‍💫 Troubleshooting / FAQ](#-troubleshooting--faq)
- [🔬 API](#-api)
- [⌨️ Contribution and development](#-contribution-and-development)
- [📖 Resources](#-resources)
- [⚖️ License](#-license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 📦 Installation

Install from npm via

```bash
$ npm install easy-speech
``` 

You can also use the various builds for different targets, see the `dist` folder:

- `/dist/EasySpeech.js` - ESM
- `/dist/EasySpeech.cjs.js` - CommonJs 
- `/dist/EasySpeech.es5.js` - Legacy node compatible
- `/dist/EasySpeech.iife.js` - Legacy compatible build, works even with older 
  or exotic browsers, as long as they support Promises (PRs welcome to transform 
  to callbacks!)
- `/dist/index.d.ts` - TypeScript type definitions

You can use them via CDN:

```html
<!-- esm -->
<script type="module">
  import easySpeech from 'https://cdn.jsdelivr.net/npm/easy-speech/+esm'
</script>
```

```html
<!-- classic -->
<script src="https://cdn.jsdelivr.net/npm/easy-speech/dist/EasySpeech.iife.js"></script>
```

## 👨‍💻 Usage

Import `EasySpeech` and first, detect, if your browser is capable of tts (text
to speech):

```javascript
import EasySpeech from 'easy-speech'

EasySpeech.detect()
```

it returns an Object with the following information:

```javascript
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

If at least `SpeechSynthesis` and `SpeechSynthesisUtterance` are defined you
are good to go.


### 🚀 Initialize

Preparing everything to work is not as clear as it should, especially when 
targeting cross-browser functionality. The asynchronous init function will help
you with this situation:

```javascript
EasySpeech.init({ maxTimeout: 5000, interval: 250 })
    .then(() => console.debug('load complete'))
    .catch(e => console.error(e))
``` 

#### 💽 Loading voices

The init-routine will go through several stages to setup the environment:

- detect and that SpeechSynthesis is basically supported, if not -> fail
- load voices directly
- if not loaded but `onvoiceschanged` is available: use `onvoiceschanged`
- if `onvoiceschanged` is not available: fallback to timeout
- if `onvoiceschanged` is fired but no voices available: fallback to timeout
- timeout reloads voices in a given `interval` until a `maxTimeout` is reached
- if voices are loaded until then -> complete
- if no voices found -> fail 

If your init routing has still not detected / loaded any voices, allthough
speechSynth is supported please leave an issue!

#### Placing a fallback voice

If voices are found it will place a fallback voice by the following rules:

- If there is a voice among all voices with the `default` property set to true
  use this as fallback voice
- Otherwise find the first matching voice by current `navigator.language`
- Otherwise use the first voice in the Array

Note: This fallback voice is not overridden by `EasySpeech.defaults()`, your
default voice will be used in favor but the fallback voice will always be there
in case no voice is found when calling `EasySpeech.speak()`

### 📢 Speak a voice

This is as easy as it gets:

```javascript
await EasySpeech.speak({
  text: 'Hello, world!',
  voice: myLangVoice, // optional, will use a default or fallback
  pitch: 1,
  rate: 1,
  volume: 1,
  // there are more events, see the API for supported events
  boundary: e => console.debug('boundary reached')
})
```

The Promise will automatically resolve when the speaking ends or rejects when
an error occurred. You can additionally attach these event listeners if you like
or use `EasySpeech.on` to attach default listeners to every time you call 
`EasySpeech.speak`.

### 😵‍💫 Troubleshooting / FAQ

There is an own [FAQ section](./FAQ.md) available that aims to help with common issues.

## 🔬 API

There is a full API documentation available: [api docs](./API.md)

## ⌨️ Contribution and development

Every contribution is welcomed, please open issues if anything is not working
as expected.

If you intend to contribute code, please read the 
[guidelines on contributing](./CONTRIBUTING.md).

## 📖 Resources

This project used several resources to gain insights about how to get the best cross-browser SpeechSynthesis running:

- https://wicg.github.io/speech-api/#tts-section
- https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
- https://gist.github.com/alrra/6741915
- https://github.com/ubershmekel/audio-language-tests
- https://stackoverflow.com/questions/33889107/speech-synthesis-in-chrome-for-android-not-loading-voices
- https://stackoverflow.com/questions/49506716/speechsynthesis-getvoices-returns-empty-array-on-windows
- https://stackoverflow.com/questions/21947730/chrome-speech-synthesis-with-longer-texts
- https://stackoverflow.com/a/34130734
- https://stackoverflow.com/a/68060634
- https://stackoverflow.com/a/48056986
- https://bugs.chromium.org/p/chromium/issues/detail?id=582455
- https://stackoverflow.com/a/65883556

## ⚖️ License

MIT, see [license file](./LICENSE)
