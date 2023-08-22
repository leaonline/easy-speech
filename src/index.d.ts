type Status =
  | { status: "created" }
  | {
      status: "init: complete";
      initialized: boolean;
      speechSynthesis: SpeechSynthesis;
      speechSynthesisUtterance: SpeechSynthesisUtterance;
      speechSynthesisVoice: SpeechSynthesisVoice;
      speechSynthesisEvent: SpeechSynthesisEvent;
      speechSynthesisErrorEvent: SpeechSynthesisErrorEvent;
      voices: SpeechSynthesisVoice[];
      defaults: {
        pitch: number;
        rate: number;
        volume: number;
        voice: SpeechSynthesisVoice | null;
      };
      handlers: any;
    };

export class EasySpeech {
  public init(request: {
    maxTimeout: number;
    interval: number;
    quiet: boolean;
  }): Promise<boolean>;

  public detect(): {
    speechSynthesis: SpeechSynthesis | undefined;
    speechSynthesisUtterance: SpeechSynthesisUtterance | undefined;
    speechSynthesisVoice: SpeechSynthesisVoice | undefined;
    speechSynthesisEvent: SpeechSynthesisEvent | undefined;
    speechSynthesisErrorEvent: SpeechSynthesisErrorEvent | undefined;
    onvoiceschanged: boolean;
    onboundary: boolean;
    onend: boolean;
    onerror: boolean;
    onmark: boolean;
    onpause: boolean;
    onresume: boolean;
    onstart: boolean;
  };

  public status(): Status;

  public voices(): SpeechSynthesisVoice[];

  public on(handlers: {
    boundary?: (event: SpeechSynthesisEvent) => void;
    end?: (event: SpeechSynthesisEvent) => void;
    mark?: (event: SpeechSynthesisEvent) => void;
    pause?: (event: SpeechSynthesisEvent) => void;
    resume?: (event: SpeechSynthesisEvent) => void;
    start?: (event: SpeechSynthesisEvent) => void;
    error?: (event: SpeechSynthesisErrorEvent) => void;
  }): SpeechSynthesisVoice[];

  public defaults(options: {
    voice?: SpeechSynthesisVoice;
    pitch?: number;
    rate?: number;
    volume?: number;
  }): {
    pitch: Number;
    rate: Number;
    volume: Number;
    voice: null | SpeechSynthesisVoice;
  };

  public speak(options: {
    text: string;
    voice?: SpeechSynthesisVoice;
    pitch?: number;
    rate?: number;
    volume?: number;
    force?: boolean;
    infiniteResume?: boolean;
    boundary?: (event: SpeechSynthesisEvent) => void;
    end?: (event: SpeechSynthesisEvent) => void;
    mark?: (event: SpeechSynthesisEvent) => void;
    pause?: (event: SpeechSynthesisEvent) => void;
    resume?: (event: SpeechSynthesisEvent) => void;
    start?: (event: SpeechSynthesisEvent) => void;
    error?: (event: SpeechSynthesisErrorEvent) => void;
  }): Promise<any>;

  public cancel(): void;

  public resume(): void;

  public pause(): void;

  public reset(): void;
}
