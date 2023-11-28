/* eslint-env mocha */
import EasySpeech from '../src/EasySpeech.js'
import { expect } from 'chai'
import {
  randomId,
  clearScope,
  initScope,
  createUtteranceClass
} from './test-helpers.js'
import sinon from 'sinon/pkg/sinon-esm.js'

describe('unit tests', function () {
  afterEach(function () {
    clearScope()
    EasySpeech.debug(() => {})
  })

  describe('EasySpeech.detect', function () {
    it('returns, which of the web speech api is supported', function () {
      expect(EasySpeech.detect()).to.deep.equal({
        speechSynthesis: undefined,
        speechSynthesisErrorEvent: undefined,
        speechSynthesisEvent: undefined,
        speechSynthesisUtterance: undefined,
        speechSynthesisVoice: undefined,
        onboundary: false,
        onend: false,
        onerror: false,
        onmark: false,
        onpause: false,
        onresume: false,
        onstart: false,
        onvoiceschanged: false
      })

      const fake = {
        speechSynthesis: { id: randomId() },
        speechSynthesisErrorEvent: { id: randomId() },
        speechSynthesisEvent: { id: randomId() },
        speechSynthesisUtterance: createUtteranceClass(),
        speechSynthesisVoice: { id: randomId() },
        onboundary: false,
        onend: true, // set in prototype
        onerror: false,
        onmark: false,
        onpause: false,
        onresume: false,
        onstart: false,
        onvoiceschanged: false
      }
      globalThis.speechSynthesis = fake.speechSynthesis
      globalThis.speechSynthesisErrorEvent = fake.speechSynthesisErrorEvent
      globalThis.speechSynthesisEvent = fake.speechSynthesisEvent
      globalThis.speechSynthesisUtterance = fake.speechSynthesisUtterance
      globalThis.speechSynthesisVoice = fake.speechSynthesisVoice
      expect(EasySpeech.detect()).to.deep.equal(fake)
    })
  })
  describe('EasySpeech.status', function () {
    it('returns the internal status of the component', function () {
      const status = EasySpeech.status()
      expect(status).to.deep.equal({ status: 'created' })
    })
  })
  describe('EasySpeech.defaults', function () {
    it('skips invalid values', async function () {
      await initScope()
      const oldDefaults = EasySpeech.defaults()

      // invalid types
      EasySpeech.defaults({
        voice: randomId(),
        rate: randomId(),
        volume: randomId(),
        pitch: randomId()
      })

      // invalid values
      EasySpeech.defaults({
        voice: [],
        rate: 100,
        volume: 100,
        pitch: 100
      })
      EasySpeech.defaults({
        voice: [],
        rate: -100,
        volume: -100,
        pitch: -100
      })
      expect(EasySpeech.defaults()).to.deep.equal(oldDefaults)
    })
    it('allows to set valid defaults', function () {
      const oldDefaults = EasySpeech.defaults()
      const newDefaults = {
        voice: { lang: 'en-US', name: 'en-Bob', voiceURI: 'localhost' },
        rate: 1.1,
        volume: 0.9,
        pitch: 1.1
      }
      expect(newDefaults).to.not.deep.equal(oldDefaults)
      EasySpeech.defaults(newDefaults)
      expect(EasySpeech.defaults()).to.deep.equal(newDefaults)
    })
  })
  describe('EasySpeech.voices', function () {
    it('throws if not initialized', function () {
      EasySpeech.reset()
      expect(() => EasySpeech.voices()).to.throw(errorName)
    })
    it('returns the voices', async function () {
      const voice = { lang: randomId() }
      await initScope({
        speechSynthesis: { getVoices: () => [voice] }
      })

      expect(EasySpeech.voices()).to.deep.equal([voice])
    })
  })
  describe('EasySpeech.init', function () {
    afterEach(function () {
      EasySpeech.reset()
    })
    it('throws if browser misses features present', async function () {
      EasySpeech.reset()
      try {
        await EasySpeech.init()
        expect.fail()
      } catch (e) {
        expect(e.message).to.equal('EasySpeech: browser misses features')
      }

      globalThis.SpeechSynthesisUtterance = createUtteranceClass()

      try {
        await EasySpeech.init()
        expect.fail()
      } catch (e) {
        expect(e.message).to.equal('EasySpeech: browser misses features')
      }
    })
    it('throws if browser misses voices (onvoiceschanged)', function (done) {
      globalThis.SpeechSynthesisUtterance = createUtteranceClass()
      globalThis.speechSynthesis = {
        getVoices: () => {},
        onvoiceschanged: null
      }
      EasySpeech.init({ maxTimeout: 88, interval: 200 })
        .then(() => done(expect.fail()))
        .catch(e => {
          expect(e.message).to.equal('EasySpeech: browser has no voices (timeout)')
          done()
        })

      globalThis.speechSynthesis.onvoiceschanged()
    })
    it('throws if browser misses voices (timeout)', async function () {
      globalThis.SpeechSynthesisUtterance = createUtteranceClass()
      globalThis.speechSynthesis = {
        getVoices: () => {}
      }
      try {
        await EasySpeech.init({
          maxTimeout: 100,
          interval: 50
        })
        expect.fail()
      } catch (e) {
        expect(e.message).to.equal('EasySpeech: browser has no voices (timeout)')
      }
    })
    it('does not throw if quiet argument is passed', async function () {
      EasySpeech.reset()
      const init = await EasySpeech.init({ quiet: true })
      expect(init).to.equal(false)
    })
    it('completes when loaded voices is available', async function () {
      const SpeechSynthesisUtterance = createUtteranceClass()
      const id = randomId()
      const speechSynthesis = {
        getVoices: () => [{ id }]
      }
      globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
      globalThis.speechSynthesis = speechSynthesis

      const initialized = await EasySpeech.init()
      expect(initialized).to.equal(true)
      // no re-init without reset
      expect(await EasySpeech.init()).to.equal(false)
      expect(EasySpeech.status()).to.deep.equal({
        status: 'init: complete',
        initialized: true,
        speechSynthesis,
        speechSynthesisUtterance: SpeechSynthesisUtterance,
        speechSynthesisVoice: undefined,
        speechSynthesisEvent: undefined,
        speechSynthesisErrorEvent: undefined,
        voices: [{ id }],
        defaultVoice: { id },
        defaults: {
          pitch: 1,
          rate: 1,
          volume: 1,
          voice: null
        },
        handlers: {},
        onboundary: false,
        onend: true, // set in prototype
        onerror: false,
        onmark: false,
        onpause: false,
        onresume: false,
        onstart: false,
        onvoiceschanged: false,
        maxLengthExceeded: 'warn'
      })
    })

    it('completes when loaded voices is available before timeout', function (done) {
      const SpeechSynthesisUtterance = createUtteranceClass()
      const speechSynthesis = {
        getVoices: () => null
      }

      globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
      globalThis.speechSynthesis = speechSynthesis

      EasySpeech.init({ maxTimeout: 1500, interval: 250 })
        .catch(e => done(e))
        .then(initialized => {
          expect(initialized).to.equal(true)
          expect(EasySpeech.status()).to.deep.equal({
            status: 'init: complete',
            initialized: true,
            speechSynthesis,
            speechSynthesisUtterance: SpeechSynthesisUtterance,
            speechSynthesisVoice: undefined,
            speechSynthesisEvent: undefined,
            speechSynthesisErrorEvent: undefined,
            voices: [{ id }],
            defaultVoice: { id },
            defaults: {
              pitch: 1,
              rate: 1,
              volume: 1,
              voice: null
            },
            handlers: {},
            onboundary: false,
            onend: true, // set in prototype
            onerror: false,
            onmark: false,
            onpause: false,
            onresume: false,
            onstart: false,
            onvoiceschanged: false,
            maxLengthExceeded: 'warn'
          })
          done()
        })

      const id = randomId()
      setTimeout(() => {
        speechSynthesis.getVoices = () => [{ id }]
      }, 500)
    })
    it('completes when loaded voices is available in onvoiceschanged', function (done) {
      const SpeechSynthesisUtterance = createUtteranceClass()
      const speechSynthesis = {
        getVoices: () => null,
        onvoiceschanged: null
      }

      globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
      globalThis.speechSynthesis = speechSynthesis

      EasySpeech.init({ maxTimeout: 1500, interval: 250 })
        .catch(e => done(e))
        .then(initialized => {
          expect(initialized).to.equal(true)
          expect(EasySpeech.status()).to.deep.equal({
            status: 'init: complete',
            initialized: true,
            speechSynthesis,
            speechSynthesisUtterance: SpeechSynthesisUtterance,
            speechSynthesisVoice: undefined,
            speechSynthesisEvent: undefined,
            speechSynthesisErrorEvent: undefined,
            voices: [{ id }],
            defaultVoice: { id },
            defaults: {
              pitch: 1,
              rate: 1,
              volume: 1,
              voice: null
            },
            handlers: {},
            onboundary: false,
            onend: true, // set in prototype
            onerror: false,
            onmark: false,
            onpause: false,
            onresume: false,
            onstart: false,
            onvoiceschanged: true,
            maxLengthExceeded: 'warn'
          })
          done()
        })

      const id = randomId()
      setTimeout(() => {
        speechSynthesis.getVoices = () => [{ id }]
        speechSynthesis.onvoiceschanged()
      }, 500)
    })
    it('completes when loaded voices is available in voiceschanged', function (done) {
      const SpeechSynthesisUtterance = createUtteranceClass()
      const speechSynthesis = {
        getVoices: () => null,
        addEventListener: (name, fn) => {
          expect(name).to.equal('voiceschanged')
          listener = fn
          listenerAdded = true
          console.debug('voiceschanged added')
        },
        removeEventListener: (name, fn) => {
          expect(name).to.equal('voiceschanged')
          expect(fn).to.equal(listener)
          listener = null
          listenerRemoved = true
        }
      }

      let listener = null
      let listenerAdded = false
      let listenerRemoved = false

      globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
      globalThis.speechSynthesis = speechSynthesis

      EasySpeech.init({ maxTimeout: 1500, interval: 1000 })
        .catch(e => done(e))
        .then(initialized => {
          expect(initialized).to.equal(true)
          expect(EasySpeech.status()).to.deep.equal({
            status: 'init: complete',
            initialized: true,
            speechSynthesis,
            speechSynthesisUtterance: SpeechSynthesisUtterance,
            speechSynthesisVoice: undefined,
            speechSynthesisEvent: undefined,
            speechSynthesisErrorEvent: undefined,
            voices: [{ id }],
            defaultVoice: { id },
            defaults: {
              pitch: 1,
              rate: 1,
              volume: 1,
              voice: null
            },
            handlers: {},
            onboundary: false,
            onend: true, // set in prototype
            onerror: false,
            onmark: false,
            onpause: false,
            onresume: false,
            onstart: false,
            onvoiceschanged: false,
            maxLengthExceeded: 'warn'
          })
          expect(listener).to.equal(null)
          expect(listenerAdded).to.equal(true)
          expect(listenerRemoved).to.equal(true)
          done()
        })

      const id = randomId()
      setTimeout(() => {
        speechSynthesis.getVoices = () => [{ id }]
        listener()
      }, 500)
    })
  })
  describe('EasySpeech.on', function () {
    afterEach(function () {
      EasySpeech.reset()
    })
    it('allows to attach global listeners to SpeechSynthesisUtterance events', async function () {
      const SpeechSynthesisUtterance = createUtteranceClass()
      const speechSynthesis = {
        getVoices: () => [{}]
      }
      globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
      globalThis.speechSynthesis = speechSynthesis

      await EasySpeech.init()

      const fn = () => {}
      const handlers = {
        boundary: fn,
        end: fn,
        error: fn,
        mark: fn,
        pause: fn,
        resume: fn,
        start: fn
      }

      EasySpeech.on(handlers)
      expect(EasySpeech.status().handlers).to.deep.equal(handlers)
    })
  })

  const errorName = 'EasySpeech: not initialized. Run EasySpeech.init() first'

  describe('EasySpeech.pause', async function () {
    afterEach(function () {
      EasySpeech.reset()
    })
    it('throws if not intialized', function () {
      expect(() => EasySpeech.pause())
        .to.throw(errorName)
    })
    it('pauses, if currently speaking', function (done) {
      const SpeechSynthesisUtterance = createUtteranceClass()
      const speechSynthesis = {
        getVoices: () => [{}],
        pause: function () {
          done()
        }
      }
      globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
      globalThis.speechSynthesis = speechSynthesis

      EasySpeech.init()
        .catch(e => done(e))
        .then(() => EasySpeech.pause())
    })
  })
  describe('EasySpeech.resume', function () {
    afterEach(function () {
      EasySpeech.reset()
    })
    it('throws if not intialized', function () {
      expect(() => EasySpeech.resume())
        .to.throw(errorName)
    })
    it('resume, if currently paused', function (done) {
      const SpeechSynthesisUtterance = createUtteranceClass()
      const speechSynthesis = {
        getVoices: () => [{}],
        resume: function () {
          done()
        }
      }
      globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
      globalThis.speechSynthesis = speechSynthesis

      EasySpeech.init()
        .catch(e => done(e))
        .then(() => EasySpeech.resume())
    })
  })
  describe('EasySpeech.cancel', function () {
    afterEach(function () {
      EasySpeech.reset()
    })
    it('throws if not intialized', function () {
      expect(() => EasySpeech.cancel())
        .to.throw(errorName)
    })
    it('cancels, if currently speaking', function (done) {
      const SpeechSynthesisUtterance = createUtteranceClass()
      const speechSynthesis = {
        getVoices: () => [{}],
        cancel: function () {
          done()
        }
      }
      globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
      globalThis.speechSynthesis = speechSynthesis

      EasySpeech.init()
        .catch(e => done(e))
        .then(() => EasySpeech.cancel())
    })
  })
  describe('EasySpeech.speak', function () {
    afterEach(function () {
      EasySpeech.reset()
    })
    it('throws if not intialized', function () {
      expect(() => EasySpeech.speak({}))
        .to.throw(errorName)
    })
    it('throws if no text is given', function (done) {
      const SpeechSynthesisUtterance = createUtteranceClass()

      const speechSynthesis = {
        getVoices: () => [{}],
        speak: function () {
          done(new Error('should not reach'))
        },
        cancel: () => {}
      }
      globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
      globalThis.speechSynthesis = speechSynthesis

      EasySpeech.init()
        .catch(e => done(e))
        .then(() => {
          expect(() => EasySpeech.speak({})).to.throw('EasySpeech: at least some valid text is required to speak')
          done()
        })
    })
    it('ignores if text exceeds 4096 bytes length', function (done) {
      const spy = sinon.spy(console, 'warn')
      const SpeechSynthesisUtterance = createUtteranceClass()
      const id = randomId()
      const speechSynthesis = {
        getVoices: () => [{ id }],
        cancel: () => {},
        speak: function () {
          expect(spy.calledWith('EasySpeech: text exceeds max length of 4096 bytes, which will not work with some voices.'))
            .to.equal(false)
          spy.restore()
          done()
        }
      }
      globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
      globalThis.speechSynthesis = speechSynthesis
      EasySpeech.init({ maxLengthExceeded: 'none'})
        .catch(done)
        .then(() => {
          const buffer = Buffer.alloc(4097, '0')
          const decoder = new TextDecoder('UTF-8')
          const text = decoder.decode(buffer)
          EasySpeech.init()
            .catch(done)
            .then(() => {
              EasySpeech.speak({ text }).catch(done)
            })
        })
    })
    it('warns if text exceeds 4096 bytes length', function (done) {
      const spy = sinon.spy(console, 'warn')
      const SpeechSynthesisUtterance = createUtteranceClass()
      const id = randomId()
      const speechSynthesis = {
        getVoices: () => [{ id }],
        cancel: () => {},
        speak: function () {
          expect(spy.calledWith('EasySpeech: text exceeds max length of 4096 bytes, which will not work with some voices.'))
            .to.equal(true)
          spy.restore()
          done()
        }
      }
      globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
      globalThis.speechSynthesis = speechSynthesis
      EasySpeech.init()
        .catch(done)
        .then(() => {
          const buffer = Buffer.alloc(4097, '0')
          const decoder = new TextDecoder('UTF-8')
          const text = decoder.decode(buffer)
          EasySpeech.init()
            .catch(done)
            .then(() => {
              EasySpeech.speak({ text }).catch(done)
            })
        })
    })
    it('throws if text exceeds 4096 bytes length', function (done) {
      const SpeechSynthesisUtterance = createUtteranceClass()
      const id = randomId()
      const speechSynthesis = {
        getVoices: () => [{ id }]
      }
      globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
      globalThis.speechSynthesis = speechSynthesis
      EasySpeech.init({ maxLengthExceeded: 'error' })
        .catch(done)
        .then(() => {
          const speechSynthesis = {
            getVoices: () => [{}],
            speak: function () {
              done(new Error('should not reach'))
            },
            cancel: () => {}
          }
          globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
          globalThis.speechSynthesis = speechSynthesis

          const buffer = Buffer.alloc(4097, '0')
          const decoder = new TextDecoder('UTF-8')
          const text = decoder.decode(buffer)
          EasySpeech.init()
            .catch(e => done(e))
            .then(() => {
              expect(() => EasySpeech.speak({ text }))
                .to.throw('EasySpeech: text exceeds max length of 4096 bytes, which will not work with some voices.')
              done()
            })
        })
    })
    it('speaks, if at least some text is given', function (done) {
      const SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
        constructor (text) {
          this.text = text
        }

        addEventListener () {}
      }

      const text = randomId()
      const speechSynthesis = {
        getVoices: () => [{}],
        speak: function (u) {
          expect(u.text).to.equal(text)
          done()
        },
        cancel: () => {},
        pause: () => {},
        resume: () => {}
      }
      globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
      globalThis.speechSynthesis = speechSynthesis

      EasySpeech.init()
        .catch(e => done(e))
        .then(async () => {
          await EasySpeech.speak({ text })
        })
    })
    it('allows to force-speak in case voices are not loaded but functionality is supported', async function () {
      let reached = false
      const text = 'hello'
      const SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
        constructor (text) {
          this.text = text
          this.listeners = {}
          this.onend = null
          this.onstart = null
          this.onerror = null
        }

        addEventListener (name, fn) {
          if (name === 'error' && !SpeechSynthesisUtterance.allowError) return
          this.listeners[name] = this.listeners[name] || []
          this.listeners[name].push(fn)
        }

        fire () {
          Object.values(this.listeners).forEach(list => list.forEach(fn => fn()))
        }
      }
      const speechSynthesis = {
        getVoices: () => [{}],
        speak: function (u) {
          expect(u.text).to.equal(text)
          reached = true
          setTimeout(() => u.fire(), 10)
        },
        pause: () => {},
        resume: () => {},
        cancel: () => {}
      }
      globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
      globalThis.speechSynthesis = speechSynthesis
      EasySpeech.init().catch(e => expect.fail(e)) // may not be finished, simulate pending
      await EasySpeech.speak({ text, force: true })
      expect(reached).to.equal(true)
    })
    it('uses voice intervals to handle longer texts (resumeInfinity)', function (done) {
      const SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
        constructor (text) {
          this.text = text
        }

        addEventListener (name, fn) {
          if (name === 'start') this.listener = fn
        }
      }

      const text = randomId()
      let pauseCalled = false
      let resumeCalled = false

      const speechSynthesis = {
        getVoices: () => [{}],
        speak: function (u) {
          u.listener() // start event
          expect(u.text).to.equal(text)
          setTimeout(() => {
            expect(pauseCalled).to.equal(true)
            expect(resumeCalled).to.equal(true)
            done()
          }, 1500)
        },
        cancel: () => {},
        pause: () => {
          pauseCalled = true
        },
        resume: () => {
          resumeCalled = true
        }
      }
      globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
      globalThis.speechSynthesis = speechSynthesis
      globalThis.SpeechSynthesisVoice = function (lang, name, voiceURI) {
        this.lang = lang
        this.name = name
        this.voiceURI = voiceURI
      }

      EasySpeech.init()
        .catch(e => done(e))
        .then(async () => {
          await EasySpeech.speak({ text })
        })
    })
    it('allows to force-prevent resumeInfinite', function (done) {
      const SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
        constructor (text) {
          this.text = text
        }

        addEventListener (name, fn) {
          if (name === 'start') this.listener = fn
        }
      }

      const text = randomId()
      let pauseCalled = false
      let resumeCalled = false

      const speechSynthesis = {
        getVoices: () => [{}],
        speak: function (u) {
          u.listener() // start event
          expect(u.text).to.equal(text)
          setTimeout(() => {
            expect(pauseCalled).to.equal(false)
            expect(resumeCalled).to.equal(false)
            done()
          }, 1500)
        },
        cancel: () => {},
        pause: () => {
          pauseCalled = true
        },
        resume: () => {
          resumeCalled = true
        }
      }
      globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
      globalThis.speechSynthesis = speechSynthesis
      globalThis.SpeechSynthesisVoice = function (lang, name, voiceURI) {
        this.lang = lang
        this.name = name
        this.voiceURI = voiceURI
      }

      EasySpeech.init()
        .catch(e => done(e))
        .then(async () => {
          await EasySpeech.speak({ text, infiniteResume: false })
        })
    })
    it('allows to force-include resumeInfinite', function (done) {
      const SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
        constructor (text) {
          this.text = text
        }

        addEventListener (name, fn) {
          if (name === 'start') this.listener = fn
        }
      }

      // simulate safari
      globalThis.GestureEvent = () => {}

      const text = randomId()
      let pauseCalled = false
      let resumeCalled = false

      const speechSynthesis = {
        getVoices: () => [{}],
        speak: function (u) {
          u.listener() // start event
          expect(u.text).to.equal(text)
          expect(pauseCalled).to.equal(true)
          expect(resumeCalled).to.equal(true)

          // cleanup fake-feature
          delete globalThis.GestureEvent
          done()
        },
        cancel: () => {},
        pause: () => {
          pauseCalled = true
        },
        resume: () => {
          resumeCalled = true
        }
      }
      globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
      globalThis.speechSynthesis = speechSynthesis
      globalThis.SpeechSynthesisVoice = function (lang, name, voiceURI) {
        this.lang = lang
        this.name = name
        this.voiceURI = voiceURI
      }

      EasySpeech.init()
        .catch(e => done(e))
        .then(async () => {
          await EasySpeech.speak({ text, infiniteResume: true })
        })
    })
    it('allows to override defaults', function (done) {
      const SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
        constructor (text) {
          this.text = text
        }

        addEventListener () {}
      }

      const text = randomId()
      const speechSynthesis = {
        getVoices: () => [{}],
        speak: function (u) {
          expect(u.text).to.equal(text)
          expect(u.pitch).to.equal(1.123456789)
          expect(u.voice.id).to.equal(id)
          done()
        },
        cancel: () => {},
        pause: () => {},
        resume: () => {}
      }
      globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
      globalThis.speechSynthesis = speechSynthesis

      const id = randomId()

      EasySpeech.init()
        .catch(e => done(e))
        .then(async () => {
          await EasySpeech.speak({ text, pitch: 1.123456789, voice: { id } })
        })
    })
    it('allows to add custom listeners', function (done) {
      const SpeechSynthesisUtterance = class SpeechSynthesisUtterance {
        constructor (text) {
          this.text = text
          this.listeners = {}
          this.onend = null
          this.onstart = null
          this.onerror = null
        }

        addEventListener (name, fn) {
          if (name === 'error' && !SpeechSynthesisUtterance.allowError) return
          this.listeners[name] = this.listeners[name] || []
          this.listeners[name].push(fn)
        }

        fire () {
          Object.values(this.listeners).forEach(list => list.forEach(fn => fn()))
        }
      }
      // no onerror to have clear promise state

      let localStartFired = false
      let defaultStartFired = false

      const text = randomId()
      const speechSynthesis = {
        getVoices: () => [{}],
        speak: function (u) {
          setTimeout(() => u.fire(), 10)
        },
        cancel: () => {},
        pause: () => {},
        resume: () => {}
      }
      globalThis.SpeechSynthesisUtterance = SpeechSynthesisUtterance
      globalThis.speechSynthesis = speechSynthesis

      const handlers = {
        start: () => {
          localStartFired = true
        }
      }

      EasySpeech.init()
        .catch(e => done(e))
        .then(async () => {
          EasySpeech.on({
            start: () => {
              defaultStartFired = true
            }
          })

          await EasySpeech.speak({ text, ...handlers })
          expect(defaultStartFired).to.equal(true)
          expect(localStartFired).to.equal(true)

          // test for error
          SpeechSynthesisUtterance.allowError = true
          const errorHandler = () => {}
          EasySpeech.speak({ text, error: errorHandler })
            .catch(e => done())
            .then(() => done(expect.fail()))
        })
    })
  })
})
