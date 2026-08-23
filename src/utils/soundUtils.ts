// Zero-dependency Web Audio API Sound Effects Synthesizer

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Generic tone generator
  private playTone(freq: number, type: OscillatorType, duration: number, startDelay = 0, volume = 0.15) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startDelay);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime + startDelay);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + startDelay + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + startDelay);
      osc.stop(this.ctx.currentTime + startDelay + duration);
    } catch {
      // Ignore audio failure
    }
  }

  // 1. UI Button Click
  public playClick() {
    this.playTone(600, 'sine', 0.06, 0, 0.08);
  }

  // 2. Map Pin Drop / Guess Placed
  public playPinDrop() {
    this.playTone(420, 'triangle', 0.08, 0, 0.12);
    this.playTone(840, 'sine', 0.12, 0.04, 0.1);
  }

  // 3. High Score / Bullseye (Direct Hit) Chime
  public playBullseye() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.28, idx * 0.07, 0.18);
    });
  }

  // 4. Good / Moderate Score Chime
  public playGoodScore() {
    if (this.isMuted) return;
    const notes = [440, 554.37, 659.25]; // A4, C#5, E5
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.22, idx * 0.08, 0.15);
    });
  }

  // 5. Low Score / Far Guess
  public playTryAgain() {
    if (this.isMuted) return;
    this.playTone(330, 'sawtooth', 0.25, 0, 0.1);
    this.playTone(277.18, 'sawtooth', 0.35, 0.15, 0.1);
  }

  // 6. Route Step Added
  public playRouteStep() {
    this.playTone(587.33, 'sine', 0.12, 0, 0.14); // D5
    this.playTone(880, 'sine', 0.18, 0.06, 0.16); // A5
  }

  // 7. Route Completed Fanfare
  public playRouteSuccess() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 880, 1046.5]; // C, E, G, A, high C
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.35, idx * 0.09, 0.2);
    });
  }

  // 8. Hint Revealed
  public playHint() {
    this.playTone(880, 'sine', 0.15, 0, 0.1);
    this.playTone(1174.66, 'sine', 0.25, 0.08, 0.1);
  }

  // 9. Stage / Level Completed
  public playStageComplete() {
    if (this.isMuted) return;
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    notes.forEach((freq, idx) => {
      this.playTone(freq, 'triangle', 0.4, idx * 0.08, 0.22);
    });
  }
}

export const soundFX = new SoundEffectsManager();
