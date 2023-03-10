**2.0.0**
- Added multiple build targets
- Potentially breaking for ci, since build output is
  now in `/dist` folder
- Npm package also links to respective files in `/dist`
  instead of `index.js`, which is now moved to `/src` folder
- `/docs` are now compatible with older and exotic browsers

**1.2.0**
- tests: updated
- fix(core): init() prevents infinite pending, in case onvoiceschanged exists but never fires
- feature(core): speak() accepts force flag to force-speak even if no voices are loaded
- update(build): IDE files added to gitignore

**1.1.1**
- fixed `resumeInfinity` timer on android browsers, because on Android
  `speechSynthesis.pause()` has the same effect as `cancel`

**1.1.0**
- coverage only includes main file
- fix issue in docs/pages where first selected voice is ignored
- debug utterance properties when speaking
- load default voices when exist or use fallbacks when not
- coverage improved to ~98%
- fix broken feature detected by using bracket notation in favour of 'in' keyword
- improved detection and additional voiceschanged fallback  when onvoiceschanged does not exist
- remove optional chaining as some browsers still have problems with it**

**1.0.0**
- initial implementation