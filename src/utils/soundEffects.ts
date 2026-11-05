/**
 * Web Audio API synthesizer for Abu Chat sounds
 * Includes WhatsApp-style ringing, incoming ringtone, message sent/receive chimes
 */

class SoundPlayer {
  private ctx: AudioContext | null = null;
  private ringOscillator: OscillatorNode | null = null;
  private ringGain: GainNode | null = null;
  private ringInterval: number | null = null;

  private getContext(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch (e) {
      console.warn('AudioContext not allowed or supported', e);
      return null;
    }
  }

  // Soft WhatsApp message sent chime (crisp double tick sound)
  playSent() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now); // A5
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Friendly incoming message pop sound
  playReceived() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.setValueAtTime(800, now + 0.06);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // Recording start sound (soft high pip)
  playRecordStart() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Recording stop sound
  playRecordStop() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Outgoing phone call ringing (EU/India WhatsApp double-beep cadence: bip-bip ... pause ... bip-bip)
  startOutgoingRinging() {
    this.stopRinging();
    const ctx = this.getContext();
    if (!ctx) return;

    const playBeepPair = () => {
      const now = ctx.currentTime;
      // First tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.frequency.setValueAtTime(440, now);
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.setValueAtTime(0.08, now + 0.35);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);

      // Second tone
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.frequency.setValueAtTime(440, now + 0.48);
      gain2.gain.setValueAtTime(0.08, now + 0.48);
      gain2.gain.setValueAtTime(0.08, now + 0.83);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.88);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.48);
      osc2.stop(now + 0.88);
    };

    playBeepPair();
    this.ringInterval = window.setInterval(() => {
      playBeepPair();
    }, 2800);
  }

  // Incoming WhatsApp-style melodious ringtone
  startIncomingRingtone() {
    this.stopRinging();
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [
      { f: 523.25, d: 0.18 }, // C5
      { f: 659.25, d: 0.18 }, // E5
      { f: 783.99, d: 0.18 }, // G5
      { f: 1046.5, d: 0.35 }, // C6
      { f: 783.99, d: 0.18 }, // G5
      { f: 1046.5, d: 0.45 }, // C6
    ];

    const playMelody = () => {
      let t = ctx.currentTime;
      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note.f, t);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + note.d);
        t += note.d + 0.05;
      });
    };

    playMelody();
    this.ringInterval = window.setInterval(() => {
      playMelody();
    }, 2500);
  }

  // Call ended / declined tone (three descending beeps)
  playCallEnd() {
    this.stopRinging();
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const freqs = [600, 480, 360];
    freqs.forEach((freq, idx) => {
      const t = now + idx * 0.14;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.1, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    });
  }

  stopRinging() {
    if (this.ringInterval) {
      clearInterval(this.ringInterval);
      this.ringInterval = null;
    }
  }
}

export const sounds = new SoundPlayer();
