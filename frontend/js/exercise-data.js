function exerciseImg(file) {
  return assetPath(`assets/exercises/${file}`);
}

const EXERCISE_DB = {
  'Bankdrücken': {
    image: exerciseImg('bankdruecken.jpg'),
    primary: ['Brust', 'Vordere Schulter'],
    secondary: ['Trizeps'],
    steps: [
      'Auf die Bank legen, Füße fest auf dem Boden.',
      'Griff etwas breiter als schulterbreit, Schulterblätter zusammenziehen.',
      'Stange kontrolliert zur Brust senken, Ellbogen ca. 45°.',
      'Kraftvoll nach oben drücken, ohne die Schultern hochzuziehen.'
    ]
  },
  'Klimmzüge': {
    image: exerciseImg('klimmzuege.jpg'),
    primary: ['Latissimus', 'Bizeps'],
    secondary: ['Unterer Rücken', 'Core'],
    steps: [
      'Obergriff, Hände etwas breiter als schulterbreit.',
      'Aus dem Dead Hang kontrolliert hochziehen.',
      'Kinn über die Stange oder Brust zur Stange.',
      'Langsam in die Ausgangsposition.'
    ]
  },
  'Schulterdrücken': {
    image: exerciseImg('schulterdruecken.jpg'),
    primary: ['Schultern'],
    secondary: ['Trizeps', 'Oberer Brustbereich'],
    steps: [
      'Stange auf Schulterhöhe, Ellbogen leicht nach vorne.',
      'Kern anspannen, Gesäß an die Bank drücken.',
      'Stange über den Kopf drücken ohne ins Hohlkreuz zu gehen.',
      'Kontrolliert zurück auf Schulterhöhe.'
    ]
  },
  'Rudern': {
    image: exerciseImg('rudern.jpg'),
    primary: ['Mittlerer Rücken', 'Latissimus'],
    secondary: ['Bizeps', 'Hintere Schulter'],
    steps: [
      'Oberkörper ca. 45° nach vorne, Rücken gerade.',
      'Stange zur unteren Brust ziehen, Ellbogen eng am Körper.',
      'Schulterblätter zusammen, kurz halten.',
      'Langsam zurück.'
    ]
  },
  'Trizeps Pushdown': {
    image: exerciseImg('trizeps.jpg'),
    primary: ['Trizeps'],
    secondary: [],
    steps: [
      'Am Kabelzug, Ellbogen am Körper fixieren.',
      'Unterarme nach unten strecken.',
      'Kurz halten, Trizeps anspannen.',
      'Kontrolliert zurück.'
    ]
  },
  'Kniebeugen': {
    image: exerciseImg('kniebeugen.jpg'),
    primary: ['Quadrizeps', 'Gesäß'],
    secondary: ['Core', 'Unterer Rücken'],
    steps: [
      'Stange auf dem Trapez, Füße schulterbreit.',
      'Brust raus, in die Hocke gehen.',
      'Mindestens parallel, Knie in Richtung Zehen.',
      'Durch die Fersen nach oben drücken.'
    ]
  },
  'Rumänisches Kreuzheben': {
    image: exerciseImg('kreuzheben.jpg'),
    primary: ['Hamstrings', 'Gesäß'],
    secondary: ['Unterer Rücken'],
    steps: [
      'Stange vor den Oberschenkeln, leicht gebeugte Knie.',
      'Hüfte nach hinten, Stange nah am Körper.',
      'Bis zur Dehnung in den Hamstrings absenken.',
      'Hüfte nach vorne, aufrecht aufrichten.'
    ]
  },
  'Beinpresse': {
    image: exerciseImg('beinpresse.jpg'),
    primary: ['Quadrizeps', 'Gesäß'],
    secondary: ['Hamstrings'],
    steps: [
      'Füße schulterbreit auf der Plattform.',
      'Kontrolliert absenken bis ca. 90°.',
      'Ohne Gesäß abzuheben nach oben drücken.',
      'Knie nicht einknicken lassen.'
    ]
  },
  'Beinstrecker': {
    image: exerciseImg('beinstrecker.jpg'),
    primary: ['Quadrizeps'],
    secondary: [],
    steps: [
      'Rücken an die Lehne, Knie an der Achse.',
      'Beine strecken, kurz oben halten.',
      'Spannung im Quadrizeps.',
      'Langsam zurück.'
    ]
  },
  'Wadenheben': {
    image: exerciseImg('wadenheben.jpg'),
    primary: ['Waden'],
    secondary: [],
    steps: [
      'Bälle der Füße auf Erhöhung.',
      'Maximal auf Zehenspitzen drücken.',
      'Kurz oben halten.',
      'Langsam in die Dehnung.'
    ]
  },
  'Schrägbankdrücken': {
    image: exerciseImg('schraegbank.jpg'),
    primary: ['Obere Brust', 'Vordere Schulter'],
    secondary: ['Trizeps'],
    steps: [
      'Bank 30–45°, Füße fest.',
      'Stange zur oberen Brust absenken.',
      'Ellbogen leicht nach unten.',
      'Kraftvoll nach oben drücken.'
    ]
  },
  'Latzug': {
    image: exerciseImg('latzug.jpg'),
    primary: ['Latissimus'],
    secondary: ['Bizeps', 'Hintere Schulter'],
    steps: [
      'Obergriff, leicht zurückgelehnt.',
      'Stange zur oberen Brust ziehen.',
      'Schulterblätter zusammen.',
      'Kontrolliert zurück.'
    ]
  },
  'Seitheben': {
    image: exerciseImg('seitheben.jpg'),
    primary: ['Seitliche Schulter'],
    secondary: ['Trapez'],
    steps: [
      'Kurzhanteln seitlich, leicht gebeugte Ellbogen.',
      'Arme bis Schulterhöhe heben.',
      'Kurz halten.',
      'Langsam absenken.'
    ]
  },
  'Face Pulls': {
    image: exerciseImg('facepull.jpg'),
    primary: ['Hintere Schulter', 'Rotatorenmanschette'],
    secondary: ['Oberer Rücken'],
    steps: [
      'Seil auf Augenhöhe.',
      'Zum Gesicht ziehen, Ellbogen nach außen.',
      'Schulterblätter zusammen.',
      'Kontrolliert zurück.'
    ]
  },
  'Bizeps Curls': {
    image: exerciseImg('bizeps.jpg'),
    primary: ['Bizeps'],
    secondary: ['Unterarm'],
    steps: [
      'Kurzhanteln seitlich, Ellbogen fix.',
      'Ohne Schwung nach oben curlen.',
      'Oben kurz halten.',
      'Langsam absenken.'
    ]
  },
  'Frontkniebeugen': {
    image: exerciseImg('frontkniebeuge.jpg'),
    primary: ['Quadrizeps', 'Core'],
    secondary: ['Gesäß'],
    steps: [
      'Stange vor dem Körper auf den Schultern.',
      'Ellbogen hoch, Oberkörper aufrecht.',
      'Kontrolliert in die Hocke.',
      'Durch die Fersen hochkommen.'
    ]
  },
  'Hip Thrust': {
    image: exerciseImg('hipthrust.jpg'),
    primary: ['Gesäß'],
    secondary: ['Hamstrings'],
    steps: [
      'Rücken auf der Bank, Stange auf der Hüfte.',
      'Hüfte bis zur geraden Linie heben.',
      'Gesäß oben anspannen.',
      'Kontrolliert absenken.'
    ]
  },
  'Ausfallschritte': {
    image: exerciseImg('ausfallschritt.jpg'),
    primary: ['Quadrizeps', 'Gesäß'],
    secondary: ['Hamstrings'],
    steps: [
      'Großer Schritt nach vorne.',
      'Hinteres Knie Richtung Boden.',
      'Durch vordere Ferse hochdrücken.',
      'Seiten wechseln.'
    ]
  },
  'Beinbeuger': {
    image: exerciseImg('beinbeuger.jpg'),
    primary: ['Hamstrings'],
    secondary: [],
    steps: [
      'Bauchlage, Knie über der Kante.',
      'Fersen zum Gesäß ziehen.',
      'Kurz halten.',
      'Langsam zurück.'
    ]
  },
  'Wadenheben sitzend': {
    image: exerciseImg('waden-sitzend.jpg'),
    primary: ['Waden (Soleus)'],
    secondary: [],
    steps: [
      'Sitzen, Bälle der Füße auf Erhöhung.',
      'Auf Zehenspitzen drücken.',
      'Kurz halten.',
      'Langsam absenken.'
    ]
  }
};

function getExerciseInfo(name) {
  return EXERCISE_DB[name] || {
    image: exerciseImg('default.jpg'),
    primary: ['—'],
    secondary: [],
    steps: ['Technik folgt in der finalen Version.']
  };
}

function getStoredPRs() {
  const user = getUser();
  if (!user) return {};
  const raw = localStorage.getItem(`mestrong_prs_${user.userId}`);
  return raw ? JSON.parse(raw) : {};
}

function savePR(exercise, orm) {
  const user = getUser();
  if (!user) return false;
  const prs = getStoredPRs();
  const prev = prs[exercise] || 0;
  if (orm > prev) {
    prs[exercise] = orm;
    localStorage.setItem(`mestrong_prs_${user.userId}`, JSON.stringify(prs));
    return true;
  }
  return false;
}

function openExerciseDetail(name) {
  const base = isInPages() ? 'exercise.html' : 'pages/exercise.html';
  window.location.href = `${base}?name=${encodeURIComponent(name)}`;
}
