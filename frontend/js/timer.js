let workoutTimerInterval = null;
let restTimerInterval = null;
let workoutSeconds = 0;
let restSeconds = 0;
let restRunning = false;
let restDefault = 90;

function formatTimer(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function startWorkoutTimer(startedAt) {
  if (startedAt) {
    workoutSeconds = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
  }
  stopWorkoutTimer();
  updateWorkoutTimerDisplay();
  workoutTimerInterval = setInterval(() => {
    workoutSeconds++;
    updateWorkoutTimerDisplay();
  }, 1000);
}

function stopWorkoutTimer() {
  if (workoutTimerInterval) {
    clearInterval(workoutTimerInterval);
    workoutTimerInterval = null;
  }
}

function updateWorkoutTimerDisplay() {
  const el = document.getElementById('workout-timer');
  if (el) el.textContent = formatTimer(workoutSeconds);
}

function startRestTimer(seconds) {
  restSeconds = seconds || restDefault;
  restRunning = true;
  renderRestBar();
  stopRestTimer();
  restTimerInterval = setInterval(() => {
    if (!restRunning) return;
    restSeconds--;
    renderRestBar();
    if (restSeconds <= 0) {
      stopRestTimer();
      showToast('Pause vorbei — weiter geht\'s!', 'success');
      if (navigator.vibrate) navigator.vibrate(200);
    }
  }, 1000);
}

function stopRestTimer() {
  if (restTimerInterval) {
    clearInterval(restTimerInterval);
    restTimerInterval = null;
  }
}

function toggleRestPause() {
  restRunning = !restRunning;
  renderRestBar();
}

function resetRestTimer() {
  restSeconds = restDefault;
  restRunning = true;
  renderRestBar();
}

function renderRestBar() {
  const bar = document.getElementById('rest-timer-bar');
  if (!bar) return;
  const pct = Math.max(0, (restSeconds / restDefault) * 100);
  bar.innerHTML = `
    <div class="rest-inner">
      <div class="rest-left">
        <span class="rest-label">Pause</span>
        <span class="rest-time mono" id="rest-time-display">${formatTimer(restSeconds)}</span>
      </div>
      <div class="rest-progress"><div class="rest-fill" style="width:${pct}%"></div></div>
      <div class="rest-actions">
        <button type="button" class="rest-btn" id="rest-reset" aria-label="Zurücksetzen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
        </button>
        <button type="button" class="rest-btn rest-btn-main" id="rest-pause" aria-label="Pause">
          ${restRunning ? '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>' : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'}
        </button>
      </div>
    </div>
  `;
  document.getElementById('rest-reset')?.addEventListener('click', resetRestTimer);
  document.getElementById('rest-pause')?.addEventListener('click', toggleRestPause);
}
