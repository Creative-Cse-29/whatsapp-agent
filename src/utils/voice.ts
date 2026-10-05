/**
 * Voice utilities for WhatsApp AI Agent
 * Wraps Web Speech API for Text-to-Speech (TTS) and Speech-to-Text (STT)
 */

export interface SpeechSettings {
  rate: number;
  pitch: number;
  voiceURI?: string;
}

class VoiceManager {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private recognition: any = null;
  private isListening = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  // Text-To-Speech
  public isTtsSupported(): boolean {
    return Boolean(this.synth);
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void,
    settings: SpeechSettings = { rate: 1.0, pitch: 1.0 }
  ) {
    if (!this.synth) {
      onError?.(new Error('Speech synthesis not supported in this browser.'));
      return;
    }

    this.stopSpeaking();

    // Clean markdown/emojis for cleaner speech
    const cleanText = text
      .replace(/[*#_`~]/g, '')
      .replace(/https?:\/\/\S+/g, 'link')
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = settings.rate || 1.0;
    utterance.pitch = settings.pitch || 1.0;

    const voices = this.getVoices();
    if (settings.voiceURI) {
      const selected = voices.find((v) => v.voiceURI === settings.voiceURI);
      if (selected) utterance.voice = selected;
    } else {
      // Pick a natural English voice if possible
      const enVoice = voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      onError?.(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pauseSpeaking() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resumeSpeaking() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return Boolean(this.synth && this.synth.speaking);
  }

  // Speech-To-Text
  public isSttSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  public startListening(
    onResult: (transcript: string) => void,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (!this.isSttSupported()) {
      onError?.(new Error('Speech recognition not supported in your browser. Please use Chrome/Edge or type your question.'));
      return;
    }

    this.stopListening();

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onstart = () => {
        this.isListening = true;
        onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        onError?.(event);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onEnd?.();
      };

      this.recognition.start();
    } catch (e) {
      this.isListening = false;
      onError?.(e);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const voiceManager = new VoiceManager();
