# FAQ

> Please read this carefully before opening a new issue.

## Overview

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [How can I use / install different voices?](#how-can-i-use--install-different-voices)
- [Why does this library exists if I can use TTS natively in the browser?](#why-does-this-library-exists-if-i-can-use-tts-natively-in-the-browser)
- [Why not using a cloud-based tts service?](#why-not-using-a-cloud-based-tts-service)
- [Can I include service xyz with this library?](#can-i-include-service-xyz-with-this-library)
- [Can I load my own / custom trained voices?](#can-i-load-my-own--custom-trained-voices)
- [My or my users voices sound all terrible, what can I do?](#my-or-my-users-voices-sound-all-terrible-what-can-i-do)
- [My voices play faster on a Mac M1 than on other machines](#my-voices-play-faster-on-a-mac-m1-than-on-other-machines)
- [Init failed with "EasySpeech: browser has no voices (timeout)"](#init-failed-with-easyspeech-browser-has-no-voices-timeout)
- [Error 'EasySpeech: not initialized. Run EasySpeech.init() first'](#error-easyspeech-not-initialized-run-easyspeechinit-first)
- [Some specific voices are missing, although they are installed on OS-level](#some-specific-voices-are-missing-although-they-are-installed-on-os-level)
- [My voices are gone or have changed after I updated my OS](#my-voices-are-gone-or-have-changed-after-i-updated-my-os)
- [Error 'EasySpeech: text exceeds max length of 4096 bytes.'](#error-easyspeech-text-exceeds-max-length-of-4096-bytes)
- [Safari plays speech delayed after interaction with other audio](#safari-plays-speech-delayed-after-interaction-with-other-audio)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## How can I use / install different voices?

> Note: the following cannot be influenced by this tool or JavaScript in general
> and requires active measures by the user who wants to different/better voices.
> This is by design and can only be changed if the Web Speech API standard improves.

- Browser-level: switch to Google Chrome as it delivers a set of Google Voices, which all sound pretty decent
- OS-level: install new voices, which is an OS-specific procedure
    - [Windows](https://support.microsoft.com/en-us/topic/download-languages-and-voices-for-immersive-reader-read-mode-and-read-aloud-4c83a8d8-7486-42f7-8e46-2b0fdf753130)
    - [MacOS](https://support.apple.com/guide/mac-help/change-the-voice-your-mac-uses-to-speak-text-mchlp2290/mac)
    - [Ubuntu](https://github.com/espeak-ng/espeak-ng/blob/master/docs/mbrola.md#installation-of-standard-packages)
    - [Android](https://support.google.com/accessibility/android/answer/6006983?hl=en&sjid=9301509494880612166-EU)
    - [iOS](https://support.apple.com/en-us/HT202362)

Please let me know if the guides are outdated or open a PR with updated links.

## Why does this library exists if I can use TTS natively in the browser?

Every browser vendor implements the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
differently and there a multiple nuances that make it difficult to provide similar functionality across major browsers.

## Why not using a cloud-based tts service?

Sure you can do that. However, different projects have different requirements.
If you can't afford a cloud-based service or are prohibited to do so then this
tool might be something for you.

## Can I include service xyz with this library?

No, it's solely a wrapper for the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis) "
standard".

## Can I load my own / custom trained voices?

Unfortunately, no. This is a current limitation of the Web Speech API itself
and there is nothing we can do about it.

If you want to this to become reality one day, you have to get in contact
with browser vendors and the [Web Incubator Community Group](https://github.com/WICG/speech-api).

## My or my users voices sound all terrible, what can I do?

Sometimes this is the result of bad settings, like `pitch` and `rate`.
Please check these value and try to run with explicit values of `1` for both of them.

If this has no effect, then is not an issue of bad pitch/rate. It's very likely that the installed voices
are simply bad / bad trained or old.

Please read on ["How can I use / install different voices?"](#how-can-i-use--install-different-voices)

## My voices play faster on a Mac M1 than on other machines

This is unfortunately a vendor-specific issue and also supposedly a bug in Safari.

Related issues:
- https://github.com/jankapunkt/easy-speech/issues/116

## Init failed with "EasySpeech: browser has no voices (timeout)"

This means your browser supports the minimum requirements for speech synthesis,
but you / your users have no voices installed on your / their system.

Please read on ["How can I use / install different voices?"](#how-can-i-use--install-different-voices)

## Error 'EasySpeech: not initialized. Run EasySpeech.init() first'

This means you haven't run `EasySpeech.init` yet. It's required to set up everything.
See the [API Docs](./API.md) on how to use it.

## Some specific voices are missing, although they are installed on OS-level

This is something I found on newer iOS versions (16+) to be the case.
While I have the Siri voice installed, it's not available in the browser.
This seems to be a vendor-specific issue, so you need to contact your OS vendor (in this case Apple).

## My voices are gone or have changed after I updated my OS

This seems to be a vendor-specific issue, so you need to contact your operating system vendor (Apple, Microsoft).

Related issues:
- https://github.com/jankapunkt/easy-speech/issues/209

## Error 'EasySpeech: text exceeds max length of 4096 bytes.'

Your text is too long for some voices to process it. You might want to split
it into smaller chunks and play the next one either by user invocation or
automatically. A small example:

```js
let index = 0
const text = [
  'This is the first sentence.',
  'This is the second sentence.',
]


async function playToEnd () {
  const chunk = text[index++]
  if (!chunk) { return true } // done
  
  await EasySpeech.speak({ text: chunk })
  return playToEnd()
}
```

Related issues:
- https://github.com/jankapunkt/easy-speech/issues/227

## Safari plays speech delayed after interaction with other audio

You can try to speak with `volume=0` before your actual voice is intended to speak.

Related issues:
- https://github.com/jankapunkt/easy-speech/issues/51
