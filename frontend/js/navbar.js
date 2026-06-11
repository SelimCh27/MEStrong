const NAV_ITEMS = [
  { href: 'dashboard.html', label: 'Home', icon: 'home', match: ['dashboard.html'] },
  { href: 'plan.html', label: 'Plan', icon: 'plan', match: ['plan.html', 'goal-select.html', 'days-select.html'] },
  { href: 'training.html', label: 'Training', icon: 'train', match: ['training.html'] },
  { href: 'progress.html', label: 'Stats', icon: 'stats', match: ['progress.html', 'exercise.html'] },
  { href: 'history.html', label: 'Verlauf', icon: 'log', match: ['history.html'] }
];

const NAV_ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z"/></svg>',
  plan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  train: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6.5 6.5h11v11h-11z"/><path d="M9 12h6M12 9v6"/></svg>',
  stats: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19V5M4 19h16"/><path d="M8 15v-4M12 15V9M16 15v-2"/></svg>',
  log: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>'
};

function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'dashboard.html';
}

function renderAppShell() {
  const page = getCurrentPage();
  const user = getUser();

  const sidebar = document.createElement('aside');
  sidebar.className = 'app-sidebar';
  sidebar.innerHTML = `
    <a href="dashboard.html" class="sidebar-brand">
      <img src="${assetPath('assets/logo.png')}" alt="MEStrong" class="brand-logo">
    </a>
    <nav class="sidebar-nav">
      ${NAV_ITEMS.map((item) => {
        const active = item.match.includes(page) ? 'active' : '';
        return `<a href="${item.href}" class="sidebar-link ${active}">
          <span class="nav-icon">${NAV_ICONS[item.icon]}</span>
          <span>${item.label}</span>
        </a>`;
      }).join('')}
    </nav>
    <div class="sidebar-footer">
      <div class="user-chip">
        <span class="user-avatar">${(user?.email || '?')[0].toUpperCase()}</span>
        <div class="user-meta">
          <span class="user-email">${user?.email || ''}</span>
          <button type="button" class="logout-link" id="logout-btn">Abmelden</button>
        </div>
      </div>
    </div>
  `;

  const bottomNav = document.createElement('nav');
  bottomNav.className = 'bottom-nav';
  bottomNav.innerHTML = NAV_ITEMS.map((item) => {
    const active = item.match.includes(page) ? 'active' : '';
    return `<a href="${item.href}" class="bottom-nav-item ${active}">
      <span class="nav-icon">${NAV_ICONS[item.icon]}</span>
      <span>${item.label}</span>
    </a>`;
  }).join('');

  const shell = document.getElementById('app-shell');
  if (shell) {
    shell.prepend(sidebar);
    document.body.appendChild(bottomNav);
  }

  document.getElementById('logout-btn')?.addEventListener('click', logoutUser);
}

function initAppShell() {
  if (!getToken()) return;
  renderAppShell();
}
