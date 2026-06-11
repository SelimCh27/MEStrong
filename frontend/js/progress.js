let progressChart = null;
let currentMetric = 'weight';

const EXERCISE_OPTIONS = [
  'Bankdrücken',
  'Kniebeugen',
  'Klimmzüge',
  'Schulterdrücken',
  'Rudern'
];

async function fetchProgress(exercise) {
  if (MEStrongConfig.USE_MOCK) {
    return apiFetch(`/progress/${encodeURIComponent(exercise)}`, { mockKey: 'progress' });
  }
  return apiFetch(`/progress/${encodeURIComponent(exercise)}`);
}

async function fetchORM(exercise) {
  if (MEStrongConfig.USE_MOCK) {
    return apiFetch(`/1rm/${encodeURIComponent(exercise)}`, { mockKey: 'orm' });
  }
  return apiFetch(`/1rm/${encodeURIComponent(exercise)}`);
}

function initProgress() {
  const select = document.getElementById('exercise-select');
  const canvas = document.getElementById('progress-chart');
  if (!select || !canvas) return;

  const history = getUserHistory();
  const fromHistory = new Set();
  history.forEach((s) => (s.exercises || []).forEach((e) => fromHistory.add(e)));
  const options = [...new Set([...EXERCISE_OPTIONS, ...fromHistory])];

  select.innerHTML = options.map((ex) => `<option value="${ex}">${ex}</option>`).join('');

  document.querySelectorAll('.metric-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.metric-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      currentMetric = pill.dataset.metric;
      load();
    });
  });

  const load = async () => {
    const exercise = select.value;
    const [progress, orm] = await Promise.all([
      fetchProgress(exercise),
      fetchORM(exercise)
    ]);
    renderSummaryHero(progress, orm, exercise);
    renderChart(canvas, progress, orm, exercise);
    renderInsight(progress);
  };

  select.addEventListener('change', load);
  load();
}

function renderSummaryHero(progress, orm, exercise) {
  const el = document.getElementById('progress-hero');
  if (!el) return;

  const info = getExerciseInfo(exercise);
  const latest = progress.length ? progress[progress.length - 1] : null;
  const latestOrm = orm.length ? orm[orm.length - 1] : null;
  const prs = getStoredPRs();

  if (!progress.length && !orm.length) {
    el.innerHTML = `
      <div class="empty-state" style="padding:1.5rem 1rem">
        <p>Noch keine Daten für ${exercise}. Absolviere ein Training!</p>
      </div>
    `;
    return;
  }

  el.innerHTML = `
    <div class="exercise-header-block" style="margin-bottom:1rem">
      <img src="${info.image}" alt="${exercise}" class="exercise-header-img" style="height:120px" onerror="this.src='${assetPath('assets/exercises/default.jpg')}'">
      <div class="exercise-header-info">
        <h2>${exercise}</h2>
        ${prs[exercise] ? `<span class="pr-badge">PR ${prs[exercise]} kg</span>` : ''}
      </div>
    </div>
    <div class="summary-card">
      <div class="summary-top">
        <div>
          <div class="summary-weight">${currentMetric === 'orm' && latestOrm ? latestOrm.orm : latest ? latest.avgWeight : '—'}<small style="font-size:0.9rem;color:var(--text-muted)"> kg</small></div>
          <div class="summary-date">${latest ? formatDate(latest.date) : 'Keine Daten'}</div>
        </div>
        ${prs[exercise] ? '<div class="pr-circle">PR</div>' : ''}
      </div>
    </div>
  `;
}

function renderChart(canvas, progress, orm, exercise) {
  const ctx = canvas.getContext('2d');
  if (progressChart) progressChart.destroy();

  const source = currentMetric === 'orm' ? orm : progress;

  if (!source.length) {
    progressChart = null;
    return;
  }

  const labels = source.map((d) => formatDate(d.date));
  const values = source.map((d) => currentMetric === 'orm' ? d.orm : d.avgWeight);

  progressChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: exercise,
        data: values,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.06)',
        borderWidth: 2.5,
        pointBackgroundColor: '#007bff',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        tension: 0.35,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#fff',
          titleColor: '#111',
          bodyColor: '#4b5563',
          borderColor: '#e5e8ed',
          borderWidth: 1,
          callbacks: { label: (c) => ` ${c.parsed.y} kg` }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: '#9ca3af', font: { size: 11 } } },
        y: {
          grid: { color: '#f3f4f6' },
          ticks: { color: '#9ca3af', font: { family: 'JetBrains Mono', size: 11 } },
          beginAtZero: false
        }
      }
    }
  });
}

function renderInsight(data) {
  const el = document.getElementById('progress-insight');
  if (!el) return;
  if (data.length < 2) {
    el.innerHTML = data.length === 0 ? '' : '<div class="insight-card insight-neutral">Mehr Trainings nötig für einen Trend.</div>';
    return;
  }

  const first = data[0].avgWeight;
  const last = data[data.length - 1].avgWeight;
  const diff = last - first;
  const pct = first > 0 ? ((diff / first) * 100).toFixed(1) : 0;

  let message = '';
  let type = 'neutral';
  if (diff > 2) {
    message = `+${diff.toFixed(1)} kg (${pct}%) seit ${formatDate(data[0].date)}.`;
    type = 'positive';
  } else if (diff < -2) {
    message = `${Math.abs(diff).toFixed(1)} kg Rückgang — Erholung einplanen.`;
    type = 'warning';
  } else {
    message = `Stabiles Niveau bei ${last} kg.`;
    type = 'neutral';
  }

  el.innerHTML = `<div class="insight-card insight-${type}">${message}</div>`;
}
