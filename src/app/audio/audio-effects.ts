// Typing click sound generator using Web Audio API
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtx;
}

export function playTypingClick(): void {
    try {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800 + Math.random() * 400, ctx.currentTime);

        gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.05);
    } catch {
        // Audio not supported, silently ignore
    }
}

// Ambient drone for background (toggleable)
let droneOsc: OscillatorNode | null = null;
let droneGain: GainNode | null = null;
let isDronePlaying = false;

export function toggleAmbientDrone(): boolean {
    const ctx = getAudioContext();

    if (isDronePlaying && droneOsc && droneGain) {
        droneGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
        droneOsc.stop(ctx.currentTime + 0.6);
        droneOsc = null;
        droneGain = null;
        isDronePlaying = false;
        return false;
    }

    droneOsc = ctx.createOscillator();
    droneGain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    // Create a deep, eerie drone
    droneOsc.type = 'sawtooth';
    droneOsc.frequency.setValueAtTime(55, ctx.currentTime); // Low A

    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.3, ctx.currentTime);
    lfoGain.gain.setValueAtTime(3, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(droneOsc.frequency);

    droneOsc.connect(droneGain);
    droneGain.connect(ctx.destination);

    droneGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    droneGain.gain.exponentialRampToValueAtTime(0.012, ctx.currentTime + 2);

    droneOsc.start(ctx.currentTime);
    lfo.start(ctx.currentTime);
    isDronePlaying = true;
    return true;
}

export function isAmbientPlaying(): boolean {
    return isDronePlaying;
}
