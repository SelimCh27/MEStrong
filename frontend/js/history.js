async function fetchHistory() {
  if (MEStrongConfig.USE_MOCK) return getUserHistory();
  return apiFetch('/history');
}

function initHistory() {
  const list = document.getElementById('history-list');
  const stats = document.getElementById('history-stats');
  if (!list) return;

  fetchHistory().then((sessions) => {
    if (!sessions?.length) {
      if (stats) stats.innerHTML = '';
      const hasPlan = getStoredPlan();
      list.innerHTML = `
        <div class="empty-state">
          <p>Noch keine Trainings absolviert.</p>
          <a href="${hasPlan ? pageUrl('plan.html') : pageUrl('goal-select.html')}" class="btn btn-primary">
            ${hasPlan ? 'Zum Plan' : 'Plan erstellen'}
          </a>
        </div>
      `;
      return;
    }

    if (stats) {
      const totalSets = sessions.reduce((a, s) => a + s.totalSets, 0);
      const totalMin = sessions.reduce((a, s) => a + (s.duration || 0), 0);
      stats.innerHTML = `
        <div class="stat-tile">
          <span class="stat-num mono">${sessions.length}</span>
          <span class="stat-label">Einheiten</span>
        </div>
        <div class="stat-tile">
          <span class="stat-num mono">${totalSets}</span>
          <span class="stat-label">Sätze gesamt</span>
        </div>
        <div class="stat-tile">
          <span class="stat-num mono">${Math.round(totalMin / sessions.length)}</span>
          <span class="stat-label">Ø Minuten</span>
        </div>
      `;
    }

    list.innerHTML = sessions.map((s, i) => `
      <article class="history-card" style="animation-delay:${i * 60}ms">
        <div class="history-card-top">
          <div>
            <time datetime="${s.completedAt}">${formatDate(s.completedAt)}</time>
            ${s.dayFocus ? `<span style="display:block;font-size:0.78rem;color:var(--text-muted)">${s.dayName || ''} · ${s.dayFocus}</span>` : ''}
          </div>
          <span class="mono history-duration">${formatDuration(s.duration)}</span>
        </div>
        <div class="history-card-mid">
          <span class="mono history-sets">${s.totalSets} Sätze</span>
        </div>
        <div class="history-exercises">
          ${(s.exercises || []).map((ex) => `<span class="history-ex-tag">${ex}</span>`).join('')}
        </div>
      </article>
    `).join('');
  }).catch((err) => {
    list.innerHTML = `<div class="empty-state"><p>${err.message}</p></div>`;
  });
}
