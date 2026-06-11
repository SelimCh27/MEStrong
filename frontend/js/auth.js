async function loginUser(email, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    auth: false,
    mockKey: 'auth',
    body: { email, password }
  });
  setAuth(data.token, { userId: data.userId, email: data.email });
  return data;
}

async function registerUser(email, password) {
  const data = await apiFetch('/auth/register', {
    method: 'POST',
    auth: false,
    mockKey: 'auth',
    body: { email, password }
  });
  setAuth(data.token, { userId: data.userId, email: data.email });
  initNewUser(data.userId);
  return data;
}

function logoutUser() {
  clearAuth();
  window.location.href = pageUrl('login.html');
}

function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      showToast('Bitte E-Mail und Passwort eingeben', 'error');
      return;
    }

    setLoading(btn, true);
    try {
      await loginUser(email, password);
      showToast('Willkommen zurück!', 'success');
      setTimeout(() => { window.location.href = pageUrl('dashboard.html'); }, 400);
    } catch (err) {
      showToast(err.message || 'Login fehlgeschlagen', 'error');
    } finally {
      setLoading(btn, false);
    }
  });
}

function initRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirm = form.confirm.value;

    if (password.length < 8) {
      showToast('Passwort muss mindestens 8 Zeichen haben', 'error');
      return;
    }
    if (password !== confirm) {
      showToast('Passwörter stimmen nicht überein', 'error');
      return;
    }

    setLoading(btn, true);
    try {
      await registerUser(email, password);
      showToast('Konto erstellt — los geht\'s!', 'success');
      setTimeout(() => { window.location.href = pageUrl('goal-select.html'); }, 400);
    } catch (err) {
      showToast(err.message || 'Registrierung fehlgeschlagen', 'error');
    } finally {
      setLoading(btn, false);
    }
  });
}
