function getToken() {
  return sessionStorage.getItem(MEStrongConfig.TOKEN_KEY);
}

function getUser() {
  const raw = sessionStorage.getItem(MEStrongConfig.USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function setAuth(token, user) {
  sessionStorage.setItem(MEStrongConfig.TOKEN_KEY, token);
  sessionStorage.setItem(MEStrongConfig.USER_KEY, JSON.stringify(user));
}

function clearAuth() {
  sessionStorage.removeItem(MEStrongConfig.TOKEN_KEY);
  sessionStorage.removeItem(MEStrongConfig.USER_KEY);
  sessionStorage.removeItem(MEStrongConfig.PLAN_KEY);
  sessionStorage.removeItem(MEStrongConfig.SESSION_KEY);
}

function initNewUser(userId) {
  sessionStorage.removeItem(MEStrongConfig.PLAN_KEY);
  sessionStorage.removeItem(MEStrongConfig.SESSION_KEY);
  localStorage.removeItem(`mestrong_plan_${userId}`);
  localStorage.removeItem(`mestrong_history_${userId}`);
  localStorage.removeItem(`mestrong_prs_${userId}`);
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = pageUrl('login.html');
    return false;
  }
  return true;
}

function redirectIfAuthed() {
  if (getToken()) {
    window.location.href = pageUrl('dashboard.html');
    return true;
  }
  return false;
}

function isInPages() {
  const p = window.location.pathname + window.location.href;
  return p.includes('/pages/') || p.includes('\\pages\\');
}

function pageUrl(file) {
  return isInPages() ? file : `pages/${file}`;
}

function assetPath(file) {
  return isInPages() ? `../${file}` : file;
}

function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('de-AT', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(minutes) {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m}min`;
  return `${m} min`;
}

function calcEpley1RM(weight, reps) {
  if (!weight || !reps) return 0;
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

function setLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  btn.classList.toggle('is-loading', loading);
}

function getStoredPlan() {
  const fromSession = sessionStorage.getItem(MEStrongConfig.PLAN_KEY);
  if (fromSession) return JSON.parse(fromSession);
  const user = getUser();
  if (user) {
    const fromLocal = localStorage.getItem(`mestrong_plan_${user.userId}`);
    if (fromLocal) {
      const plan = JSON.parse(fromLocal);
      sessionStorage.setItem(MEStrongConfig.PLAN_KEY, JSON.stringify(plan));
      return plan;
    }
  }
  return null;
}

function storePlan(plan) {
  sessionStorage.setItem(MEStrongConfig.PLAN_KEY, JSON.stringify(plan));
  const user = getUser();
  if (user) {
    localStorage.setItem(`mestrong_plan_${user.userId}`, JSON.stringify(plan));
  }
}

function getActiveSession() {
  const raw = sessionStorage.getItem(MEStrongConfig.SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function storeActiveSession(session) {
  sessionStorage.setItem(MEStrongConfig.SESSION_KEY, JSON.stringify(session));
}

function clearActiveSession() {
  sessionStorage.removeItem(MEStrongConfig.SESSION_KEY);
}

function getUserHistory() {
  const user = getUser();
  if (!user) return [];
  const raw = localStorage.getItem(`mestrong_history_${user.userId}`);
  return raw ? JSON.parse(raw) : [];
}

function addHistoryEntry(entry) {
  const user = getUser();
  if (!user) return;
  const list = getUserHistory();
  list.unshift(entry);
  localStorage.setItem(`mestrong_history_${user.userId}`, JSON.stringify(list.slice(0, 10)));
}

function getExerciseProgress(exercise) {
  const history = getUserHistory();
  const points = [];
  history.slice().reverse().forEach((session) => {
    const sets = (session.sets || []).filter((s) => s.exercise === exercise);
    if (!sets.length) return;
    const avg = sets.reduce((a, s) => a + s.weight, 0) / sets.length;
    points.push({
      date: session.completedAt,
      avgWeight: Math.round(avg * 10) / 10,
      sessionId: session.sessionId
    });
  });
  return points;
}

function getExerciseORM(exercise) {
  const history = getUserHistory();
  const points = [];
  history.forEach((session) => {
    (session.sets || []).filter((s) => s.exercise === exercise).forEach((s) => {
      points.push({
        date: session.completedAt,
        orm: s.orm,
        weight: s.weight,
        reps: s.reps
      });
    });
  });
  return points.sort((a, b) => new Date(a.date) - new Date(b.date));
}
