// =============================================================
// Ambient audio bed, played from audio/theme.mp3 through a gain
// node so it can fade in/out instead of hard-cutting. Browsers
// block audio until a user gesture, so playback only actually
// starts on click (or on the next click/keypress anywhere, if
// sound was left on from a previous visit).
// =============================================================

const STORAGE_KEY = "starchart-sound";

export function setupAudio(button) {
  let ctx = null;
  let masterGain = null;
  let started = false;
  let enabled = localStorage.getItem(STORAGE_KEY) === "on";

  function updateButton() {
    button.textContent = enabled ? "SOUND: ON" : "SOUND: OFF";
    button.setAttribute("aria-pressed", String(enabled));
  }
  updateButton();

  function buildGraph() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);

    const el = new Audio("audio/theme.mp3");
    el.loop = true;
    const source = ctx.createMediaElementSource(el);
    source.connect(masterGain);
    el.play();

    started = true;
  }

  function fadeTo(value, duration) {
    const now = ctx.currentTime;
    masterGain.gain.cancelScheduledValues(now);
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(value, now + duration);
  }

  function play() {
    if (!started) buildGraph();
    if (ctx.state === "suspended") ctx.resume();
    fadeTo(0.09, 1.6);
  }

  function pause() {
    if (started) fadeTo(0, 0.8);
  }

  function setEnabled(next) {
    enabled = next;
    localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
    updateButton();
    if (enabled) play();
    else pause();
  }

  button.addEventListener("click", () => setEnabled(!enabled));

  // If sound was left on from a previous visit, resume it on the first
  // interaction anywhere on the page (autoplay policies require a gesture,
  // and that gesture doesn't have to be the sound button itself).
  if (enabled) {
    const resumeOnGesture = () => {
      play();
      window.removeEventListener("pointerdown", resumeOnGesture);
      window.removeEventListener("keydown", resumeOnGesture);
    };
    window.addEventListener("pointerdown", resumeOnGesture, { once: true });
    window.addEventListener("keydown", resumeOnGesture, { once: true });
  }
}
