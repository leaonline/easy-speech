# Easy Speech

[![Test suite](https://github.com/jankapunkt/easy-speech/actions/workflows/tests.yml/badge.svg)](https://github.com/jankapunkt/easy-speech/actions/workflows/tests.yml)
[![CodeQL Semantic Analysis](https://github.com/jankapunkt/easy-speech/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/jankapunkt/easy-speech/actions/workflows/codeql-analysis.yml)
![npm bundle size](https://img.shields.io/bundlephobia/min/easy-speech)
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
![GitHub](https://img.shields.io/github/license/jankapunkt/easy-speech)

Cross browser Speech Synthesis

This project was created, because it's always a struggle to get the synthesis
part of `Web Speech API` running on most major browsers.

**Note:** this is not a polyfill package, if your target browser does not 
support speech synthesis or the Web Speech API, this package is not usable.
  
## Install

Install from npm via

```bash
$ npm install easy-speech
``` 

## Usage

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


### Initialize

Preparing everything to work is not as clear as it should, especially when 
targeting cross-browser functionality. The asynchronous init function will help
you with this situation:

```javascript
EasySpeech.init({ maxTimeout: 5000, interval: 250 })
    .then(() => console.debug('load complete'))
    .catch(e => console.error(e))
``` 

It will go through several stages to setup the environment:

- detect and that SpeechSynthesis is basically supported, if not -> fail
- load voices directly
- if not loaded but `onvoiceschanged` is available: use `onvoiceschanged`
- if `onvoiceschanged` is not available: fallback to timeout
- if `onvoiceschanged` is fired but no voices available: fallback to timeout
- timeout reloads voices in a given `interval` until a `maxTimeout` is reached
- if voices are loaded until then -> complete
- if no voices found -> fail 

### Speak a voice



## API

There is a full API documentation available: [api docs](./API.md)

## Resources

This project used several resources to gain insights about how to get the best cross-browser SpeechSynthesis running:

- https://wicg.github.io/speech-api/#tts-section
- https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis
- https://gist.github.com/alrra/6741915
- https://github.com/ubershmekel/audio-language-tests
- https://stackoverflow.com/questions/33889107/speech-synthesis-in-chrome-for-android-not-loading-voices
- https://stackoverflow.com/questions/49506716/speechsynthesis-getvoices-returns-empty-array-on-windows
- https://stackoverflow.com/questions/21947730/chrome-speech-synthesis-with-longer-texts

## License

MIT, see [license file](./LICENSE)
