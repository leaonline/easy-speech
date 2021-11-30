import EasySpeech from '../index.js'

export const randomId = (length = 1) => (Math.random() * length).toString(16)
export const clearScope = () => {
  Object.assign(globalThis, {
    speechSynthesis: undefined,
    speechSynthesisErrorEvent: undefined,
    speechSynthesisEvent: undefined,
    speechSynthesisUtterance: undefined,
    speechSynthesisVoice: undefined
  })
}
export const initScope = async ({ speechSynthesis } = {}) => {
  const speechSynthClass = Object.assign({
    getVoices: () => [{}],
    cancel: () => {},
    pause: () => {},
    resume: () => {},
    speak: () => {}
  }, speechSynthesis)

  globalThis.SpeechSynthesisUtterance = createUtteranceClass()
  globalThis.speechSynthesis = speechSynthClass

  return await EasySpeech.init()
}

export const createUtteranceClass = () => {
  const c = class SpeechSynthesisUtterance {
    constructor (text) {
      this.text = text
      this.onend = null
      this.onstart = null
      this.onerror = null
    }
  }

  c.prototype.onend = null

  return c
}
