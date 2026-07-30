const MEStrongConfig = {
  USE_MOCK: false,
  API_BASE: '/api',
  MOCK_BASE: '../mock-data',
  TOKEN_KEY: 'mestrong_token',
  USER_KEY: 'mestrong_user',
  PLAN_KEY: 'mestrong_plan',
  SESSION_KEY: 'mestrong_active_session'
};

const GOALS = {
  MUSCLE_GAIN: {
    id: 'MUSCLE_GAIN',
    title: 'Muskelaufbau',
    desc: 'Mehr Masse, stärkere Grundübungen, progressives Volumen.',
    icon: '💪'
  },
  FAT_LOSS: {
    id: 'FAT_LOSS',
    title: 'Fettabbau',
    desc: 'Kraft erhalten, höhere Frequenz, effiziente Splits.',
    icon: '🔥'
  },
  RECOMP: {
    id: 'RECOMP',
    title: 'Recomposition',
    desc: 'Gleichzeitig Muskeln aufbauen und Fett reduzieren.',
    icon: '⚡'
  },
  MAINTENANCE: {
    id: 'MAINTENANCE',
    title: 'Erhaltung',
    desc: 'Bestehende Kraft halten mit flexiblem Wochenrhythmus.',
    icon: '🎯'
  }
};

const SPLIT_LABELS = {
  FULLBODY: 'Ganzkörper',
  UPPER_LOWER: 'Ober-/Unterkörper',
  PPL: 'Push Pull Legs'
};
