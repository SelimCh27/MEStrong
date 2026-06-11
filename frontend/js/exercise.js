let exerciseChart = null;

function initExercisePage() {
  if (!requireAuth()) return;

  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');
  if (!name) {
    window.location.href = pageUrl('plan.html');
    return;
  }

  const info = getExerciseInfo(name);
  const hero = document.getElementById('exercise-hero');
  const title = document.getElementById('exercise-title');

  if (hero) {
    hero.src = info.image;
    hero.onerror = () => { hero.src = assetPath('assets/exercises/default.jpg'); };
  }
  if (title) title.textContent = name;
  document.title = `${name} — MEStrong`;

  const tabs = document.querySelectorAll('.exercise-tab');
  const panels = document.querySelectorAll('.exercise-tab-panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => t.classList.toggle('active', t === tab));
      panels.forEach((p) => p.classList.toggle('hidden', p.dataset.panel !== target));
    });
  });

  renderSummaryTab(name);
  renderHowToTab(info);
  renderHistoryTab(name);
}

async function renderSummaryTab(name) {
  const panel = document.getElementById('panel-summary');
  if (!panel) return;

  const progress = getExerciseProgress(name);
  const orm = getExerciseORM(name);
  const prs = getStoredPRs();

  const latest = progress.length ? progress[progress.length - 1] : null;
  const latestOrm = orm.length ? orm[orm.length - 1] : null;

  if (!progress.length && !orm.length) {
    panel.innerHTML = `
      <div class="empty-state">
        <p>Noch keine Daten für ${name}.</p>
        <a href="${pageUrl('plan.html')}" class="btn btn-primary">Zum Plan</a>
      </div>
    `;
    return;
  }

  panel.innerHTML = `
    <div class="summary-card">
      <div class="summary-top">
        <div>
          <div class="summary-weight">${latest ? latest.avgWeight + ' <small style="font-size:1rem;color:var(--text-muted)">kg Ø</small>' : '—'}</div>
          <div class="summary-date">${latest ? formatDate(latest.date) : 'Noch keine Daten'}</div>
        </div>
        ${prs[name] ? '<div class="pr-circle">PR</div>' : ''}
      </div>
      ${progress.length > 1 ? '<div class="chart-wrapper" style="height:200px;margin:0;padding:0.5rem 0;border:none;box-shadow:none"><canvas id="exercise-mini-chart"></canvas></div>' : ''}
    </div>
  `;

  if (latestOrm) {
    panel.innerHTML += `
      <div class="card" style="padding:1rem;margin-bottom:1rem">
        <span class="section-label">Geschätztes 1RM</span>
        <span class="mono" style="font-size:1.5rem;font-weight:600;color:var(--blue)">${latestOrm.orm} kg</span>
        <span style="display:block;font-size:0.82rem;color:var(--text-muted);margin-top:0.2rem">${latestOrm.weight} kg × ${latestOrm.reps} Wdh.</span>
      </div>
    `;
  }

  if (progress.length > 1 && typeof Chart !== 'undefined') {
    const ctx = document.getElementById('exercise-mini-chart')?.getContext('2d');
    if (ctx) {
      if (exerciseChart) exerciseChart.destroy();
      exerciseChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: progress.map((d) => formatDate(d.date)),
          datasets: [{
            data: progress.map((d) => d.avgWeight),
            borderColor: '#007bff',
            backgroundColor: 'rgba(0,123,255,0.06)',
            borderWidth: 2,
            pointRadius: 4,
            tension: 0.35,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 10 } } },
            y: { grid: { color: '#f3f4f6' }, ticks: { font: { family: 'JetBrains Mono', size: 10 } } }
          }
        }
      });
    }
  }
}

function renderHowToTab(info) {
  const panel = document.getElementById('panel-howto');
  if (!panel) return;

  panel.innerHTML = `
    <div class="muscle-section">
      <h4>Primäre Muskeln</h4>
      <div class="muscle-tags">${info.primary.map((m) => `<span class="muscle-tag">${m}</span>`).join('')}</div>
    </div>
    ${info.secondary.length ? `
      <div class="muscle-section">
        <h4>Sekundäre Muskeln</h4>
        <div class="muscle-tags">${info.secondary.map((m) => `<span class="muscle-tag secondary">${m}</span>`).join('')}</div>
      </div>
    ` : ''}
    <div class="muscle-section">
      <h4>Ausführung</h4>
      <ol class="instruction-list">${info.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
    </div>
  `;
}

function renderHistoryTab(name) {
  const panel = document.getElementById('panel-history');
  if (!panel) return;

  const orm = getExerciseORM(name);

  if (!orm.length) {
    panel.innerHTML = '<div class="empty-state"><p>Noch keine Einträge.</p></div>';
    return;
  }

  panel.innerHTML = `
    <div class="history-timeline">
      ${orm.slice().reverse().map((entry) => `
        <div class="history-entry">
          <div>
            <span class="history-entry-weight">${entry.weight} kg × ${entry.reps}</span>
            <span class="history-entry-date">${formatDate(entry.date)}</span>
          </div>
          <span class="mono" style="color:var(--blue);font-weight:600">${entry.orm} kg 1RM</span>
        </div>
      `).join('')}
    </div>
  `;
}
