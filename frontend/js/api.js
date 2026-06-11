async function apiFetch(endpoint, options = {}) {
  const { method = 'GET', body, auth = true, mockKey } = options;

  if (MEStrongConfig.USE_MOCK && mockKey) {
    await delay(200);
    return handleMock(mockKey, method, endpoint, body);
  }

  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http')
    ? endpoint
    : `${MEStrongConfig.API_BASE}${endpoint}`;

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new ApiError('Keine Verbindung zum Server. Bitte später erneut versuchen.', 0);
  }

  if (!response.ok) {
    let message = 'Ein Fehler ist aufgetreten';
    try {
      const err = await response.json();
      message = err.error || message;
    } catch {}
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return null;
  return response.json();
}

function handleMock(mockKey, method, endpoint, body) {
  switch (mockKey) {
    case 'auth': {
      const email = body?.email || 'user@mestrong.app';
      const userId = hashEmail(email);
      return {
        token: `mock-token-${userId}`,
        userId,
        email
      };
    }
    case 'plan-generate': {
      const params = new URLSearchParams(endpoint.split('?')[1] || '');
      const goal = params.get('goal') || body?.goal || 'MUSCLE_GAIN';
      const days = parseInt(params.get('days') || body?.days || '4', 10);
      return MEStrongMock.generatePlan(goal, days);
    }
    case 'plan-save':
      return MEStrongMock.planSave();
    case 'session-start':
      return MEStrongMock.sessionStart();
    case 'session-set':
      return MEStrongMock.sessionSet(body);
    case 'session-complete':
      return MEStrongMock.sessionComplete();
    case 'history':
      return getUserHistory();
    case 'progress': {
      const exercise = decodeURIComponent(endpoint.split('/').pop());
      return getExerciseProgress(exercise);
    }
    case 'orm': {
      const exercise = decodeURIComponent(endpoint.split('/').pop());
      return getExerciseORM(exercise);
    }
    default:
      throw new ApiError('Unbekannte Mock-Anfrage', 404);
  }
}

function hashEmail(email) {
  let h = 0;
  for (let i = 0; i < email.length; i++) {
    h = ((h << 5) - h) + email.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}
