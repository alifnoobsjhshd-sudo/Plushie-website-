// A tiny, high-fidelity Web Audio API synthesizer for adorable custom plushie sounds!
// It doesn't rely on any external mp3 files.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    // Attempt to resume if suspended
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSqueak() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // Cute squeak consists of a fast frequency sweep upwards, followed by a soft release.
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.type = 'triangle'; // Sweet, soft waveform
  
  // High-pitched starting frequency sweeping even higher (like a plushie squeeze!)
  osc.frequency.setValueAtTime(450, now);
  osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);
  osc.frequency.exponentialRampToValueAtTime(700, now + 0.22);

  // Soft envelope
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.25, now + 0.03);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

  osc.start(now);
  osc.stop(now + 0.25);
}

export function playHappyBubble() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Sound sequence of three quick cute ascending pop/bubbles
  const notes = [440, 554, 659, 880];
  const durations = [0.06, 0.06, 0.06, 0.08];
  
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    const startTime = now + idx * 0.055;
    
    osc.type = 'sine'; // Super clean pure tone
    osc.frequency.setValueAtTime(freq, startTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.1, startTime + durations[idx]);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.08, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + durations[idx]);
    
    osc.start(startTime);
    osc.stop(startTime + durations[idx]);
  });
}

export function playTickle() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // Multi-frequency giggle
  for (let i = 0; i < 5; i++) {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    const startTime = now + i * 0.04;
    const isOdd = i % 2 === 0;
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(isOdd ? 600 : 720, startTime);
    osc.frequency.setValueAtTime(isOdd ? 650 : 770, startTime + 0.03);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.06, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.035);
    
    osc.start(startTime);
    osc.stop(startTime + 0.04);
  }
}

export function playFeed() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // "Munch munch pop!"
  for (let i = 0; i < 3; i++) {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    const startTime = now + i * 0.09;
    osc.type = 'sine';
    
    // Low munch chewing frequencies
    osc.frequency.setValueAtTime(220, startTime);
    osc.frequency.exponentialRampToValueAtTime(110, startTime + 0.06);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.12, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.07);
    
    osc.start(startTime);
    osc.stop(startTime + 0.08);
  }

  // Final satisfied "ding!"
  const oscDing = ctx.createOscillator();
  const gainDing = ctx.createGain();
  oscDing.connect(gainDing);
  gainDing.connect(ctx.destination);
  
  const dingTime = now + 0.28;
  oscDing.type = 'sine';
  oscDing.frequency.setValueAtTime(1200, dingTime);
  oscDing.frequency.exponentialRampToValueAtTime(1500, dingTime + 0.15);
  
  gainDing.gain.setValueAtTime(0, dingTime);
  gainDing.gain.linearRampToValueAtTime(0.05, dingTime + 0.01);
  gainDing.gain.exponentialRampToValueAtTime(0.001, dingTime + 0.2);
  
  oscDing.start(dingTime);
  oscDing.stop(dingTime + 0.25);
}
