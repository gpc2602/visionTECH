import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private spanishVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();
    
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices(): void {
    this.voices = this.synth.getVoices();
    
    this.spanishVoice = this.voices.find(voice => 
      voice.lang.includes('es') || voice.lang.includes('ES')
    ) || null;
    
    console.log('Voces disponibles:', this.voices.length);
    console.log('Voz en español encontrada:', this.spanishVoice?.name || 'No encontrada');
  }

  speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        reject('Speech synthesis no disponible');
        return;
      }

      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      if (this.spanishVoice) {
        utterance.voice = this.spanishVoice;
      }
      
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 90.5;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event);

      this.synth.speak(utterance);
    });
  }

  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  isSupported(): boolean {
    return 'speechSynthesis' in window;
  }
}
