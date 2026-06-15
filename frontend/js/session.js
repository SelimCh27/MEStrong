let trainingState = {
    sessionId: null,
    planDayId: null,
    dayName: '',
    dayFocus: '',
    exercises: [],
    currentExerciseIdx: 0,
    sets: [],
    startedAt: null
};

// --- ECHTE BACKEND-ANBINDUNG ---

async function startSession(planDayId) {
    return apiFetch('/session', {
        method: 'POST',
        auth: true, // Sendet den JWT-Token im Header mit
        body: { planDayId: parseInt(planDayId, 10) } // Übergabe als Zahl für das Long-Feld im Backend
    });
}

async function addSet(sessionId, exercise, weight, reps) {
    return apiFetch(`/session/${sessionId}/set`, {
        method: 'POST',
        auth: true, // Sendet den JWT-Token im Header mit
        body: {
            exercise,
            weight: parseFloat(weight),
            reps: parseInt(reps, 10)
        }
    });
}

async function completeSession(sessionId) {
    return apiFetch(`/session/${sessionId}/complete`, {
        method: 'PUT', // Nutzt PUT passend zum @PutMapping im SessionController
        auth: true    // Sendet den JWT-Token im Header mit
    });
}

// --- UI- UND LOGIKSTEUERUNG ---

function initTraining() {
    if (!requireAuth()) return;
    document.body.classList.add('training-active');
    document.querySelector('.app-main')?.classList.add('training-mode');

    const params = new URLSearchParams(window.location.search);
    const dayParam = params.get('day') || '1';
    const dayIdNum = parseInt(dayParam, 10);

    fetchMyPlan().then(async (plan) => {
        if (!plan?.weeks?.length) {
            window.location.href = pageUrl('goal-select.html');
            return;
        }

        const day = plan.weeks.find((d) => d.dayId === dayIdNum || d.id === dayIdNum)
            || plan.weeks[dayIdNum - 1]
            || plan.weeks[0];
        trainingState.planDayId = day.dayId ?? day.id ?? dayIdNum;
        trainingState.dayName = day.day;
        trainingState.dayFocus = day.focus;
        trainingState.exercises = day.exercises;

        const existing = getActiveSession();
        if (existing && existing.planDayId === trainingState.planDayId) {
            trainingState = { ...trainingState, ...existing };
            startWorkoutTimer(trainingState.startedAt);
            renderTrainingUI();
        } else {
            try {
                const session = await startSession(trainingState.planDayId);
                trainingState.sessionId = session.sessionId;
                trainingState.startedAt = session.startedAt;
                trainingState.sets = [];
                trainingState.currentExerciseIdx = 0;
                storeActiveSession(trainingState);
                startWorkoutTimer(trainingState.startedAt);
                renderTrainingUI();
            } catch (err) {
                showToast(err.message, 'error');
            }
        }
    });
}

function getExerciseSetCount(exerciseName) {
    return trainingState.sets.filter((s) => s.exercise === exerciseName).length;
}

function isExerciseComplete(exerciseName, targetSets) {
    const target = parseInt(targetSets, 10) || 1;
    return getExerciseSetCount(exerciseName) >= target;
}

function renderTrainingUI() {
    const topbar = document.getElementById('workout-topbar');
    const main = document.getElementById('training-main');
    const cta = document.getElementById('training-cta');
    if (!main) return;

    const exIdx = trainingState.currentExerciseIdx;
    const exercise = trainingState.exercises[exIdx];
    const info = getExerciseInfo(exercise.name);
    const exerciseSets = trainingState.sets.filter((s) => s.exercise === exercise.name);
    const targetSets = parseInt(exercise.sets, 10) || 1;
    const complete = isExerciseComplete(exercise.name, targetSets);
    const isLast = exIdx >= trainingState.exercises.length - 1;
    const nextExercise = !isLast ? trainingState.exercises[exIdx + 1] : null;

    if (topbar) {
        topbar.innerHTML = `
      <button type="button" class="btn-ghost" id="cancel-workout" aria-label="Abbrechen">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
      <span class="workout-timer mono" id="workout-timer">00:00</span>
      <div class="workout-topbar-actions">
        <button type="button" class="icon-btn" id="exercise-info-btn" aria-label="Übungsinfo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
        </button>
      </div>
    `;
        updateWorkoutTimerDisplay();
    }

    const totalVol = exerciseSets.reduce((a, s) => a + s.weight * s.reps, 0);
    const totalReps = exerciseSets.reduce((a, s) => a + s.reps, 0);
    const avgWeight = exerciseSets.length
        ? (exerciseSets.reduce((a, s) => a + s.weight, 0) / exerciseSets.length).toFixed(1)
        : '—';

    const rows = [];
    const rowCount = complete ? exerciseSets.length : Math.max(exerciseSets.length + 1, targetSets);
    for (let i = 0; i < rowCount; i++) {
        const set = exerciseSets[i];
        const setNum = i + 1;
        if (set) {
            rows.push(`
        <tr class="done-row">
          <td class="col-set">${setNum}</td>
          <td class="col-kg"><span class="done-val">${set.weight}</span></td>
          <td class="col-reps"><span class="done-val">${set.reps}</span>${set.isPR ? '<span class="pr-badge">PR!</span>' : ''}</td>
          <td><span class="set-check-btn checked"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg></span></td>
        </tr>
      `);
        } else if (!complete && i === exerciseSets.length) {
            rows.push(`
        <tr class="active-row" id="active-set-row">
          <td class="col-set">${setNum}</td>
          <td class="col-kg"><input type="number" id="input-weight" inputmode="decimal" step="0.5" min="0" placeholder="—"></td>
          <td class="col-reps"><input type="number" id="input-reps" inputmode="numeric" min="1" max="99" placeholder="—"></td>
          <td><button type="button" class="set-check-btn" id="save-set-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 13l4 4L19 7"/></svg></button></td>
        </tr>
      `);
        }
    }

    main.innerHTML = `
    <div class="training-exercise-header">
      <div class="training-exercise-thumb-wrap">
        <img src="${info.image}" alt="${exercise.name}" class="training-exercise-thumb" loading="lazy" onerror="this.src='${assetPath('assets/exercises/default.jpg')}'">
      </div>
      <div class="training-exercise-text">
        <span class="tag ${exercise.type === 'COMPOUND' ? 'tag-blue' : ''}">${exercise.type === 'COMPOUND' ? 'Grundübung' : 'Isolation'}</span>
        <h2>${exercise.name}</h2>
        <p class="training-exercise-meta">Ziel: <span class="mono">${targetSets} × ${exercise.reps}</span> · ${trainingState.dayName}</p>
      </div>
      <button type="button" class="icon-btn training-info-btn" id="exercise-info-btn-2" aria-label="Anleitung">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
      </button>
    </div>

    <div class="set-table-wrap">
      <table class="set-table">
        <thead><tr><th>Satz</th><th>kg</th><th>Wdh.</th><th></th></tr></thead>
        <tbody>${rows.join('')}</tbody>
      </table>
      ${!complete ? '<button type="button" class="add-set-btn" id="add-extra-set">+ Satz hinzufügen</button>' : ''}
    </div>

    <div class="workout-stats-row">
      <div class="workout-stat">
        <span class="workout-stat-val mono">${totalVol > 0 ? (totalVol / 1000).toFixed(1) + 't' : '—'}</span>
        <span class="workout-stat-lbl">Gesamtgewicht</span>
      </div>
      <div class="workout-stat">
        <span class="workout-stat-val mono">${totalReps || '—'}</span>
        <span class="workout-stat-lbl">Wiederholungen</span>
      </div>
      <div class="workout-stat">
        <span class="workout-stat-val mono">${avgWeight}${avgWeight !== '—' ? ' kg' : ''}</span>
        <span class="workout-stat-lbl">Ø Gewicht</span>
      </div>
    </div>

    <p class="training-progress-label">Übung ${exIdx + 1} von ${trainingState.exercises.length} · ${exerciseSets.length}/${targetSets} Sätze</p>

    ${complete ? `
      <div class="exercise-done-panel" id="exercise-done-panel">
        <div class="exercise-done-check">✓</div>
        <p class="exercise-done-title">${exercise.name} fertig!</p>
        <p class="exercise-done-sub">${isLast ? 'Alle Übungen absolviert — jetzt speichern.' : `Als Nächstes: ${nextExercise.name}`}</p>
        <button type="button" class="btn btn-primary btn-block btn-lg" id="next-exercise-btn">
          ${isLast ? 'Training abschließen und speichern' : `Nächste Übung: ${nextExercise.name} →`}
        </button>
        ${!isLast ? '<button type="button" class="btn btn-text btn-block" id="finish-early-btn">Training vorzeitig beenden</button>' : ''}
      </div>
    ` : (exerciseSets.length > 0 ? `
      <div class="exercise-skip-panel">
        <p>Noch ${targetSets - exerciseSets.length} Satz/Sätze offen — oder jetzt weiter:</p>
        <button type="button" class="btn btn-secondary btn-block" id="next-exercise-btn">
          ${isLast ? 'Training abschließen' : `Weiter: ${nextExercise.name} →`}
        </button>
      </div>
    ` : '')}
  `;

    if (cta) {
        cta.style.display = 'none';
        cta.innerHTML = '';
    }

    ensureRestBar();
    bindTrainingEvents(exercise);
    if (!complete) {
        document.getElementById('input-weight')?.focus();
    }
    if (complete || exerciseSets.length > 0) {
        setTimeout(() => {
            (document.getElementById('exercise-done-panel') || document.getElementById('next-exercise-btn'))
                ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
    }
}

function ensureRestBar() {
    if (!document.getElementById('rest-timer-bar')) {
        const bar = document.createElement('div');
        bar.id = 'rest-timer-bar';
        bar.className = 'rest-bar';
        bar.style.display = 'none';
        document.body.appendChild(bar);
    }
}

function showRestBar() {
    const bar = document.getElementById('rest-timer-bar');
    if (bar) {
        bar.style.display = 'block';
        startRestTimer(90);
    }
}

function bindTrainingEvents(exercise) {
    const openInfo = () => openExerciseDetail(exercise.name);
    document.getElementById('exercise-info-btn')?.addEventListener('click', openInfo);
    document.getElementById('exercise-info-btn-2')?.addEventListener('click', openInfo);

    document.getElementById('save-set-btn')?.addEventListener('click', () => saveCurrentSet(exercise));
    document.getElementById('input-reps')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveCurrentSet(exercise);
    });

    document.getElementById('add-extra-set')?.addEventListener('click', () => {
        showToast('Zuerst aktuellen Satz speichern', 'info');
    });

    document.getElementById('next-exercise-btn')?.addEventListener('click', async () => {
        if (trainingState.currentExerciseIdx < trainingState.exercises.length - 1) {
            trainingState.currentExerciseIdx++;
            storeActiveSession(trainingState);
            const bar = document.getElementById('rest-timer-bar');
            if (bar) bar.style.display = 'none';
            stopRestTimer();
            renderTrainingUI();
        } else {
            await finishTraining();
        }
    });

    document.getElementById('cancel-workout')?.addEventListener('click', () => {
        if (confirm('Training abbrechen? Fortschritt geht verloren.')) {
            stopWorkoutTimer();
            stopRestTimer();
            clearActiveSession();
            window.location.href = pageUrl('dashboard.html');
        }
    });

    document.getElementById('finish-early-btn')?.addEventListener('click', async () => {
        if (confirm('Training jetzt beenden und speichern?')) await finishTraining();
    });
}

async function saveCurrentSet(exercise) {
    const weight = parseFloat(document.getElementById('input-weight')?.value);
    const reps = parseInt(document.getElementById('input-reps')?.value, 10);

    if (isNaN(weight) || weight < 0) {
        showToast('Gewicht eingeben', 'error');
        return;
    }
    if (!reps || reps < 1) {
        showToast('Wiederholungen eingeben', 'error');
        return;
    }

    const btn = document.getElementById('save-set-btn');
    setLoading(btn, true);

    let orm = calcEpley1RM(weight, reps);
    try {
        const res = await addSet(trainingState.sessionId, exercise.name, weight, reps);
        if (res?.orm) orm = res.orm;
    } catch {}

    const isPR = savePR(exercise.name, orm);

    trainingState.sets.push({ exercise: exercise.name, weight, reps, orm, isPR });
    storeActiveSession(trainingState);
    setLoading(btn, false);

    if (isPR) showToast('Neuer Personal Record!', 'success');

    const done = isExerciseComplete(exercise.name, parseInt(exercise.sets, 10));
    if (!done) {
        showRestBar();
    } else {
        const bar = document.getElementById('rest-timer-bar');
        if (bar) bar.style.display = 'none';
        stopRestTimer();
        showToast('Übung fertig — scrolle runter und tippe „Nächste Übung“', 'success');
    }
    renderTrainingUI();
}

async function finishTraining() {
    stopWorkoutTimer();
    stopRestTimer();

    const completedAt = new Date().toISOString();
    const duration = Math.max(1, Math.round(workoutSeconds / 60));
    const exercises = [...new Set(trainingState.sets.map((s) => s.exercise))];

    addHistoryEntry({
        sessionId: trainingState.sessionId,
        completedAt,
        totalSets: trainingState.sets.length,
        duration,
        exercises,
        sets: trainingState.sets,
        dayName: trainingState.dayName,
        dayFocus: trainingState.dayFocus
    });

    try {
        await completeSession(trainingState.sessionId);
    } catch {}

    clearActiveSession();
    const bar = document.getElementById('rest-timer-bar');
    if (bar) bar.style.display = 'none';
    const cta = document.getElementById('training-cta');
    if (cta) cta.style.display = 'none';

    showToast('Training gespeichert', 'success');
    setTimeout(() => { window.location.href = pageUrl('history.html'); }, 500);
}