let selectedGoal = null;
let selectedDays = 4;
let currentPlan = null;

async function generatePlan(goal, days) {
  const params = new URLSearchParams({ goal, days: String(days) });
  return apiFetch(`/plan/generate?${params}`, { method: 'POST', mockKey: 'plan-generate' });
}

async function savePlan(goal, days) {
  return apiFetch('/plan/save', {
    method: 'POST',
    mockKey: 'plan-save',
    body: { goal, days }
  });
}

async function fetchMyPlan() {
  if (MEStrongConfig.USE_MOCK) return getStoredPlan();
  try {
    const plan = await apiFetch('/plan/my');
    if (plan) storePlan(plan);
    return plan;
  } catch {
    return getStoredPlan();
  }
}

function initGoalSelect() {
  const grid = document.getElementById('goal-grid');
  if (!grid) return;

  grid.innerHTML = Object.values(GOALS).map((g) => `
    <button type="button" class="goal-card" data-goal="${g.id}">
      <span class="goal-icon">${g.icon}</span>
      <span class="goal-title">${g.title}</span>
      <span class="goal-desc">${g.desc}</span>
    </button>
  `).join('');

  grid.querySelectorAll('.goal-card').forEach((btn) => {
    btn.addEventListener('click', () => {
      grid.querySelectorAll('.goal-card').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedGoal = btn.dataset.goal;
      document.getElementById('goal-next').disabled = false;
    });
  });

  document.getElementById('goal-next')?.addEventListener('click', () => {
    if (!selectedGoal) return;
    sessionStorage.setItem('mestrong_selected_goal', selectedGoal);
    window.location.href = 'days-select.html';
  });
}

function initDaysSelect() {
  selectedGoal = sessionStorage.getItem('mestrong_selected_goal');
  if (!selectedGoal) {
    window.location.href = 'goal-select.html';
    return;
  }

  const goalInfo = GOALS[selectedGoal];
  const label = document.getElementById('days-goal-label');
  if (label && goalInfo) label.textContent = goalInfo.title;

  const slider = document.getElementById('days-slider');
  const display = document.getElementById('days-value');
  const splitHint = document.getElementById('split-hint');

  const updateSplit = (days) => {
    let split = 'FULLBODY';
    if (days >= 5) split = 'PPL';
    else if (days >= 3) split = 'UPPER_LOWER';
    if (splitHint) splitHint.textContent = SPLIT_LABELS[split];
  };

  if (slider) {
    slider.value = selectedDays;
    display.textContent = selectedDays;
    updateSplit(selectedDays);
    syncDayPills(selectedDays);

    slider.addEventListener('input', () => {
      selectedDays = parseInt(slider.value, 10);
      display.textContent = selectedDays;
      updateSplit(selectedDays);
      syncDayPills(selectedDays);
    });
  }

  document.querySelectorAll('.day-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      selectedDays = parseInt(pill.dataset.days, 10);
      if (slider) slider.value = selectedDays;
      if (display) display.textContent = selectedDays;
      updateSplit(selectedDays);
      syncDayPills(selectedDays);
    });
  });

  document.getElementById('days-generate')?.addEventListener('click', async () => {
    const btn = document.getElementById('days-generate');
    setLoading(btn, true);
    try {
      currentPlan = await generatePlan(selectedGoal, selectedDays);
      currentPlan.goal = selectedGoal;
      currentPlan.days = selectedDays;
      storePlan(currentPlan);
      showToast('Trainingsplan erstellt', 'success');
      window.location.href = 'plan.html';
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(btn, false);
    }
  });
}

function syncDayPills(days) {
  document.querySelectorAll('.day-pill').forEach((pill) => {
    pill.classList.toggle('active', parseInt(pill.dataset.days, 10) === days);
  });
}

function initPlanView() {
  const tabsEl = document.getElementById('plan-tabs');
  const contentEl = document.getElementById('plan-content');
  if (!tabsEl || !contentEl) return;

  fetchMyPlan().then((plan) => {
    if (!plan || !plan.weeks?.length) {
      contentEl.innerHTML = `
        <div class="empty-state">
          <p>Noch kein Plan vorhanden.</p>
          <a href="goal-select.html" class="btn btn-primary">Plan erstellen</a>
        </div>
      `;
      return;
    }

    currentPlan = plan;
    renderPlanHeader(plan);
    renderPlanTabs(plan, tabsEl, contentEl);
  });
}

function renderPlanHeader(plan) {
  const el = document.getElementById('plan-header');
  if (!el) return;
  const goal = GOALS[plan.goal];
  el.innerHTML = `
    <div class="plan-meta">
      <span class="tag tag-blue">${goal?.title || plan.goal}</span>
      <span class="tag tag-green">${plan.days}× / Woche</span>
      <span class="tag">${SPLIT_LABELS[plan.splitType] || plan.splitType}</span>
    </div>
  `;
}

function renderPlanTabs(plan, tabsEl, contentEl) {
  let activeIdx = 0;

  const render = (idx) => {
    const day = plan.weeks[idx];
    tabsEl.innerHTML = plan.weeks.map((d, i) => `
      <button type="button" class="plan-tab ${i === idx ? 'active' : ''}" data-idx="${i}">
        <span class="tab-day">${d.day}</span>
        <span class="tab-focus">${d.focus}</span>
      </button>
    `).join('');

    contentEl.innerHTML = `
      <div class="plan-day-header">
        <h2>${day.focus}</h2>
        <span class="exercise-count">${day.exercises.length} Übungen</span>
      </div>
      <div class="exercise-list">
        ${day.exercises.map((ex) => {
          const img = getExerciseInfo(ex.name).image;
          return `
          <article class="exercise-card">
            <img src="${img}" alt="" class="exercise-thumb" loading="lazy">
            <div class="exercise-body">
              <h3>${ex.name}</h3>
              <div class="exercise-meta">
                <span class="mono">${ex.sets} Sätze</span>
                <span>·</span>
                <span class="mono">${ex.reps} Wdh.</span>
                <span class="type-badge ${ex.type?.toLowerCase()}">${ex.type === 'COMPOUND' ? 'Grundübung' : 'Isolation'}</span>
              </div>
            </div>
            <div class="exercise-actions">
              <button type="button" class="icon-btn" aria-label="Details" onclick="openExerciseDetail('${ex.name.replace(/'/g, "\\'")}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              </button>
              <a href="training.html?day=${day.dayId || idx + 1}" class="icon-btn" aria-label="Starten">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </a>
            </div>
          </article>`;
        }).join('')}
      </div>
      <a href="training.html?day=${day.dayId || idx + 1}" class="btn btn-primary btn-block btn-lg plan-start-btn">
        ${day.day} trainieren
      </a>
    `;

    tabsEl.querySelectorAll('.plan-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        activeIdx = parseInt(tab.dataset.idx, 10);
        render(activeIdx);
      });
    });
  };

  render(activeIdx);
}

function initDashboardPlan() {
  const el = document.getElementById('dashboard-next-workout');
  if (!el) return;

  fetchMyPlan().then((plan) => {
    if (!plan?.weeks?.length) {
      el.innerHTML = `
        <div class="workout-hero">
          <div class="workout-hero-body" style="padding:1.5rem">
            <h3>Starte mit deinem Plan</h3>
            <p class="workout-hero-meta">Wähle ein Ziel — wir erstellen deinen Wochenplan.</p>
            <a href="goal-select.html" class="btn btn-primary btn-block">Plan erstellen</a>
          </div>
        </div>
      `;
      return;
    }

    const today = new Date().getDay();
    const dayIdx = today === 0 ? 0 : Math.min(today - 1, plan.weeks.length - 1);
    const day = plan.weeks[dayIdx];
    const heroImg = getExerciseInfo(day.exercises[0]?.name).image;

    el.innerHTML = `
      <div class="workout-hero">
        <img src="${heroImg}" alt="" class="workout-hero-img">
        <div class="workout-hero-body">
          <div class="workout-hero-top">
            <span class="tag tag-blue">${day.day}</span>
            <span class="tag">${day.exercises.length} Übungen</span>
          </div>
          <h3>${day.focus}</h3>
          <p class="workout-hero-meta">ca. 55–65 min · ${SPLIT_LABELS[plan.splitType] || plan.splitType}</p>
          <div class="exercise-preview-list">
            ${day.exercises.slice(0, 4).map((e) => `<div class="exercise-preview-item">${e.name}</div>`).join('')}
          </div>
          <a href="training.html?day=${day.dayId || dayIdx + 1}" class="btn btn-primary btn-block btn-lg">Training starten</a>
        </div>
      </div>
    `;
  });
}
