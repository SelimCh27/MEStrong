const PLAN_DAY_NAMES = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const PLAN_DAY_TEMPLATES = {
  FULLBODY_A: {
    focus: 'Ganzkörper A',
    exercises: [
      { name: 'Kniebeugen', sets: 4, reps: '6-10', type: 'COMPOUND' },
      { name: 'Bankdrücken', sets: 4, reps: '8-12', type: 'COMPOUND' },
      { name: 'Rudern', sets: 3, reps: '10-12', type: 'COMPOUND' },
      { name: 'Schulterdrücken', sets: 3, reps: '8-12', type: 'COMPOUND' },
      { name: 'Bizeps Curls', sets: 3, reps: '10-12', type: 'ISOLATION' }
    ]
  },
  FULLBODY_B: {
    focus: 'Ganzkörper B',
    exercises: [
      { name: 'Rumänisches Kreuzheben', sets: 4, reps: '8-10', type: 'COMPOUND' },
      { name: 'Schrägbankdrücken', sets: 4, reps: '8-12', type: 'COMPOUND' },
      { name: 'Klimmzüge', sets: 3, reps: '6-10', type: 'COMPOUND' },
      { name: 'Ausfallschritte', sets: 3, reps: '10-12', type: 'COMPOUND' },
      { name: 'Trizeps Pushdown', sets: 3, reps: '12-15', type: 'ISOLATION' }
    ]
  },
  UPPER_A: {
    focus: 'Oberkörper',
    exercises: [
      { name: 'Bankdrücken', sets: 4, reps: '8-12', type: 'COMPOUND' },
      { name: 'Klimmzüge', sets: 3, reps: '6-10', type: 'COMPOUND' },
      { name: 'Schulterdrücken', sets: 3, reps: '8-12', type: 'COMPOUND' },
      { name: 'Rudern', sets: 3, reps: '10-12', type: 'COMPOUND' },
      { name: 'Trizeps Pushdown', sets: 3, reps: '12-15', type: 'ISOLATION' }
    ]
  },
  LOWER_A: {
    focus: 'Unterkörper',
    exercises: [
      { name: 'Kniebeugen', sets: 4, reps: '6-10', type: 'COMPOUND' },
      { name: 'Rumänisches Kreuzheben', sets: 3, reps: '8-10', type: 'COMPOUND' },
      { name: 'Beinpresse', sets: 3, reps: '10-12', type: 'COMPOUND' },
      { name: 'Beinstrecker', sets: 3, reps: '12-15', type: 'ISOLATION' },
      { name: 'Wadenheben', sets: 4, reps: '12-20', type: 'ISOLATION' }
    ]
  },
  UPPER_B: {
    focus: 'Oberkörper B',
    exercises: [
      { name: 'Schrägbankdrücken', sets: 4, reps: '8-12', type: 'COMPOUND' },
      { name: 'Latzug', sets: 3, reps: '8-12', type: 'COMPOUND' },
      { name: 'Seitheben', sets: 3, reps: '12-15', type: 'ISOLATION' },
      { name: 'Face Pulls', sets: 3, reps: '15-20', type: 'ISOLATION' },
      { name: 'Bizeps Curls', sets: 3, reps: '10-12', type: 'ISOLATION' }
    ]
  },
  LOWER_B: {
    focus: 'Unterkörper B',
    exercises: [
      { name: 'Frontkniebeugen', sets: 3, reps: '8-10', type: 'COMPOUND' },
      { name: 'Hip Thrust', sets: 4, reps: '8-12', type: 'COMPOUND' },
      { name: 'Ausfallschritte', sets: 3, reps: '10-12', type: 'COMPOUND' },
      { name: 'Beinbeuger', sets: 3, reps: '12-15', type: 'ISOLATION' },
      { name: 'Wadenheben sitzend', sets: 4, reps: '15-20', type: 'ISOLATION' }
    ]
  },
  PUSH: {
    focus: 'Push',
    exercises: [
      { name: 'Bankdrücken', sets: 4, reps: '8-12', type: 'COMPOUND' },
      { name: 'Schrägbankdrücken', sets: 3, reps: '8-12', type: 'COMPOUND' },
      { name: 'Schulterdrücken', sets: 3, reps: '8-12', type: 'COMPOUND' },
      { name: 'Seitheben', sets: 3, reps: '12-15', type: 'ISOLATION' },
      { name: 'Trizeps Pushdown', sets: 3, reps: '12-15', type: 'ISOLATION' }
    ]
  },
  PULL: {
    focus: 'Pull',
    exercises: [
      { name: 'Klimmzüge', sets: 4, reps: '6-10', type: 'COMPOUND' },
      { name: 'Latzug', sets: 3, reps: '8-12', type: 'COMPOUND' },
      { name: 'Rudern', sets: 3, reps: '10-12', type: 'COMPOUND' },
      { name: 'Face Pulls', sets: 3, reps: '15-20', type: 'ISOLATION' },
      { name: 'Bizeps Curls', sets: 3, reps: '10-12', type: 'ISOLATION' }
    ]
  },
  LEGS: {
    focus: 'Legs',
    exercises: [
      { name: 'Kniebeugen', sets: 4, reps: '6-10', type: 'COMPOUND' },
      { name: 'Rumänisches Kreuzheben', sets: 3, reps: '8-10', type: 'COMPOUND' },
      { name: 'Beinpresse', sets: 3, reps: '10-12', type: 'COMPOUND' },
      { name: 'Beinbeuger', sets: 3, reps: '12-15', type: 'ISOLATION' },
      { name: 'Wadenheben', sets: 4, reps: '12-20', type: 'ISOLATION' }
    ]
  }
};

const PLAN_SEQUENCES = {
  1: ['FULLBODY_A'],
  2: ['FULLBODY_A', 'FULLBODY_B'],
  3: ['UPPER_A', 'LOWER_A', 'FULLBODY_A'],
  4: ['UPPER_A', 'LOWER_A', 'UPPER_B', 'LOWER_B'],
  5: ['PUSH', 'PULL', 'LEGS', 'PUSH', 'PULL'],
  6: ['PUSH', 'PULL', 'LEGS', 'PUSH', 'PULL', 'LEGS'],
  7: ['PUSH', 'PULL', 'LEGS', 'PUSH', 'PULL', 'LEGS', 'UPPER_A']
};

const MEStrongMock = {
  login() { return { ok: true }; },
  register() { return { ok: true }; },

  sessionStart() {
    return { sessionId: Date.now(), startedAt: new Date().toISOString() };
  },

  sessionSet(body) {
    const orm = Math.round(body.weight * (1 + body.reps / 30) * 10) / 10;
    return { setId: Date.now(), orm };
  },

  sessionComplete() {
    return { completedAt: new Date().toISOString(), totalSets: 0, duration: 0 };
  },

  generatePlan(goal, days) {
    const count = Math.min(7, Math.max(1, parseInt(days, 10) || 4));
    let splitType = 'FULLBODY';
    if (count <= 2) splitType = 'FULLBODY';
    else if (count <= 4) splitType = 'UPPER_LOWER';
    else splitType = 'PPL';

    const sequence = PLAN_SEQUENCES[count] || PLAN_SEQUENCES[4];
    const weeks = sequence.map((key, i) => {
      const tpl = PLAN_DAY_TEMPLATES[key];
      return {
        day: PLAN_DAY_NAMES[i],
        dayId: i + 1,
        focus: tpl.focus,
        exercises: JSON.parse(JSON.stringify(tpl.exercises))
      };
    });

    return { goal, days: count, splitType, weeks };
  },

  planSave() {
    return { planId: Date.now(), message: 'Plan gespeichert' };
  }
};
