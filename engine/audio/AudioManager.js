/**
 * AudioManager.js
 * Synthesizes retro J2ME Nokia/Living Mobile sound effects and melodies via Web Audio API.
 */
class RetroAudioManager {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.masterGain = null;
        this.currentSource = null;
    }

    _initContext() {
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
                this.masterGain = this.ctx.createGain();
                this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
                this.masterGain.connect(this.ctx.destination);
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setMuted(muted) {
        this.muted = muted;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.3, this.ctx.currentTime);
        }
    }

    toggleMute() {
        this.setMuted(!this.muted);
        return this.muted;
    }

    /**
     * Synthesizes a J2ME single tone (frequency/note, duration in ms, volume 0-100).
     */
    playTone(note, duration, volume = 50) {
        if (this.muted) return;
        this._initContext();
        if (!this.ctx) return;

        try {
            // MIDI note to frequency: 440 * 2^((note - 69) / 12)
            const freq = note > 0 ? 440 * Math.pow(2, (note - 69) / 12) : 220;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = "square"; // Authentic 2005 8-bit / 16-bit retro buzzer
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            const vol = Math.max(0, Math.min(1, volume / 100)) * 0.25;
            const now = this.ctx.currentTime;
            const dur = Math.max(0.04, duration / 1000);

            gain.gain.setValueAtTime(vol, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(now);
            osc.stop(now + dur);
        } catch (e) {
            // Audio error non-fatal
        }
    }

    /**
     * Plays sound effect or melody tracks.
     */
    playAudio(id, bytes, mime, loopCount = 1) {
        if (this.muted) return;
        this._initContext();
        if (!this.ctx) return;

        try {
            // Quick tone synthesis for common game sound IDs
            const baseNotes = [60, 64, 67, 72, 76, 79, 84];
            const note = baseNotes[id % baseNotes.length];
            this.playTone(note, 120, 60);
        } catch (e) {}
    }

    playClick() {
        this.playTone(80, 20, 20);
    }
}

export const AudioManager = new RetroAudioManager();
if (typeof window !== 'undefined') {
    window.AudioManager = AudioManager;
}

