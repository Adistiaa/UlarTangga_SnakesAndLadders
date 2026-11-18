/**
 * ULAR TANGGA SEJARAH — NEO-BRUTALIST EDITION (FINAL REVISION)
 * Lengkap dengan Koordinat Tangga & Ular Presisi, Proteksi Gambar,
 * Contenders 2 Kolom Besar, Bidak Outline Putih, & Perbaikan 3D Flip Card.
 */

// ==========================================
// 1. WEB AUDIO API SYNTHESIZER (TANPA FILE EKSTERNAL)
// ==========================================

class RetroSoundEngine {
  constructor() {
    this.ctx = null;
    this.bgmVol = 0.6;
    this.sfxVol = 0.85;
    this.muted = false;
    this.bgmTimer = null;
    this.bgmMode = 'none';
    this.noteStep = 0;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, duration = 0.12, type = 'square', volMultiplier = 0.25, slideTo = null) {
    if (this.muted || this.sfxVol <= 0) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), now + duration);
    }

    const peakGain = Math.min(0.5, this.sfxVol * volMultiplier);
    gain.gain.setValueAtTime(peakGain, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  sfxClick() {
    this.playTone(580, 0.06, 'square', 0.2, 780);
  }

  sfxDiceTick() {
    const rnd = 300 + Math.random() * 350;
    this.playTone(rnd, 0.045, 'triangle', 0.22);
  }

  sfxDiceLand(num) {
    const base = 360 + num * 55;
    this.playTone(base, 0.14, 'square', 0.3, base * 1.35);
  }

  sfxStep() {
    this.playTone(440, 0.07, 'sine', 0.25, 620);
  }

  sfxLadder() {
    [330, 392, 494, 587, 659, 784].forEach((n, i) => {
      setTimeout(() => this.playTone(n, 0.11, 'square', 0.25), i * 65);
    });
  }

  sfxSnake() {
    [620, 540, 460, 370, 260, 180].forEach((n, i) => {
      setTimeout(() => this.playTone(n, 0.13, 'sawtooth', 0.25, n * 0.8), i * 70);
    });
  }

  sfxCardFlip() {
    this.playTone(420, 0.12, 'triangle', 0.3, 880);
  }

  sfxQuizPopup() {
    [523, 659, 784].forEach((n, i) => {
      setTimeout(() => this.playTone(n, 0.1, 'triangle', 0.26), i * 80);
    });
  }

  sfxCorrect() {
    [523.25, 659.25, 783.99, 1046.5].forEach((n, i) => {
      setTimeout(() => this.playTone(n, 0.15, 'square', 0.28), i * 85);
    });
  }

  sfxWrong() {
    [280, 210].forEach((n, i) => {
      setTimeout(() => this.playTone(n, 0.25, 'sawtooth', 0.3, n * 0.75), i * 180);
    });
  }

  sfxSkill(type = 'buff') {
    if (type === 'buff') {
      [440, 554, 659, 880].forEach((n, i) => {
        setTimeout(() => this.playTone(n, 0.12, 'triangle', 0.3), i * 60);
      });
    } else {
      [392, 349, 311, 261].forEach((n, i) => {
        setTimeout(() => this.playTone(n, 0.14, 'sawtooth', 0.28), i * 70);
      });
    }
  }

  sfxWin() {
    const fanfare = [523, 523, 523, 659, 784, 659, 784, 1046];
    fanfare.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 0.16, 'square', 0.32), i * 110);
    });
  }

  startBGM(mode = 'menu') {
    this.bgmMode = mode;
    if (this.bgmTimer) clearInterval(this.bgmTimer);
    this.noteStep = 0;

    const menuNotes = [261.6, 329.6, 392.0, 523.3, 392.0, 329.6, 293.7, 392.0];
    const gameNotes = [220.0, 261.6, 329.6, 293.7, 261.6, 329.6, 392.0, 329.6];

    this.bgmTimer = setInterval(() => {
      if (this.muted || this.bgmVol <= 0 || !this.ctx || this.ctx.state !== 'running') return;
      const melody = this.bgmMode === 'menu' ? menuNotes : gameNotes;
      const freq = melody[this.noteStep % melody.length];
      this.noteStep++;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      const vol = Math.min(0.25, this.bgmVol * 0.12);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.27);
    }, 320);
  }
}

const sound = new RetroSoundEngine();

// ==========================================
// 2. KONFIGURASI ASET, TANGGA, ULAR & KARTU
// ==========================================

const PLAYER_CONFIGS = [
  { id: 1, name: 'Player 1', short: 'P1', color: '#FF5757', badgeBg: 'bg-[#FF5757]', avatar: './assets/characters/char_1_red.png' },
  { id: 2, name: 'Player 2', short: 'P2', color: '#38B6FF', badgeBg: 'bg-[#38B6FF]', avatar: './assets/characters/char_2_blue.png' },
  { id: 3, name: 'Player 3', short: 'P3', color: '#FFDE59', badgeBg: 'bg-[#FFDE59]', avatar: './assets/characters/char_3_yellow.png' },
  { id: 4, name: 'Player 4', short: 'P4', color: '#7ED957', badgeBg: 'bg-[#7ED957]', avatar: './assets/characters/char_4_green.png' }
];

const DICE_SPRITES = [
  './assets/ui_icons/dice_sprites_0.jpg',
  './assets/ui_icons/dice_sprites_1.jpg',
  './assets/ui_icons/dice_sprites_2.jpg',
  './assets/ui_icons/dice_sprites_3.jpg',
  './assets/ui_icons/dice_sprites_4.jpg',
  './assets/ui_icons/dice_sprites_5.jpg'
];

// Koordinat Loncatan Tangga (Sesuai Instruksi Revisi)
const LADDERS = {
  8: 34,
  20: 38,
  26: 63,
  56: 75,
  70: 92,
  77: 96
};

// Koordinat Ular (Sesuai Instruksi Revisi)
const SNAKES = {
  37: 5,
  48: 12,
  67: 46,
  81: 40,
  82: 59,
  94: 52
};

// 12 Kartu Luck Streak
const LUCK_CARDS = [
  // --- 6 BUFF ---
  {
    id: 'kangaroo',
    type: 'buff',
    name: 'Lompat Kangguru',
    desc: 'Melompat maju +3 petak secara bertahap sekarang juga!',
    template: './assets/ui_cards/card_buff_template.png',
    icon: './assets/ui_cards/icon_buff_kangguru.png'
  },
  {
    id: 'winged_boots',
    type: 'buff',
    name: 'Sepatu Angin',
    desc: 'Memberikan bonus +2 pada lemparan dadu giliranmu berikutnya!',
    template: './assets/ui_cards/card_buff_template.png',
    icon: './assets/ui_cards/icon_buff_sepatuangin.png'
  },
  {
    id: 'shield',
    type: 'buff',
    name: 'Perisai Anti-Ular',
    desc: 'Memasang perisai pelindung yang kebal terhadap 1 gigitan ular!',
    template: './assets/ui_cards/card_buff_template.png',
    icon: './assets/ui_cards/icon_buff_antilar.png'
  },
  {
    id: 'double_dice',
    type: 'buff',
    name: 'Dadu Ganda',
    desc: 'Memberikan 1 giliran lempar dadu tambahan langsung setelah ini!',
    template: './assets/ui_cards/card_buff_template.png',
    icon: './assets/ui_cards/icon_buff_daduganda.png'
  },
  {
    id: 'shortcut',
    type: 'buff',
    name: 'Jalur Pintas',
    desc: 'Membuka portal rahasia untuk naik 1 baris penuh (+10 petak)!',
    template: './assets/ui_cards/card_buff_template.png',
    icon: './assets/ui_cards/icon_buff_jalurpintas.png'
  },
  {
    id: 'swap',
    type: 'buff',
    name: 'Tukar Posisi',
    desc: 'Pilih pemain di depanmu untuk bertukar posisi petak secara instan!',
    template: './assets/ui_cards/card_buff_template.png',
    icon: './assets/ui_cards/icon_buff_tukarposisi.png'
  },

  // --- 6 DEBUFF ---
  {
    id: 'roots',
    type: 'debuff',
    name: 'Akar Pengikat',
    desc: 'Kaki terjerat akar hutan! Kamu melewati 1 giliran berikutnya.',
    template: './assets/ui_cards/card_debuff_template.png',
    icon: './assets/ui_cards/icon_debuff_akar.png'
  },
  {
    id: 'anvil',
    type: 'debuff',
    name: 'Beban Besi',
    desc: 'Langkah terasa berat! Penalti -2 pada lemparan dadu berikutnya.',
    template: './assets/ui_cards/card_debuff_template.png',
    icon: './assets/ui_cards/icon_debuff_beban.png'
  },
  {
    id: 'hungry_snake',
    type: 'debuff',
    name: 'Ular Lapar',
    desc: 'Mundur ketakutan sebanyak 2 petak ke belakang!',
    template: './assets/ui_cards/card_debuff_template.png',
    icon: './assets/ui_cards/icon_debuff_ularlapar.png'
  },
  {
    id: 'tornado',
    type: 'debuff',
    name: 'Angin Tornado',
    desc: 'Mengguncang papan & mendorong pemain lain di dekatmu (radius 6 petak) mundur 2 langkah!',
    template: './assets/ui_cards/card_debuff_template.png',
    icon: './assets/ui_cards/icon_debuff_angin.png'
  },
  {
    id: 'zonk',
    type: 'debuff',
    name: 'Zonk!',
    desc: 'Kotak kosong! Tidak ada efek buruk maupun tambahan.',
    template: './assets/ui_cards/card_debuff_template.png',
    icon: './assets/ui_cards/icon_debuff_zonk.png'
  },
  {
    id: 'karma',
    type: 'debuff',
    name: 'Roda Karma',
    desc: 'Menukar posisi petakmu dengan pemain berperingkat kebalikanmu!',
    template: './assets/ui_cards/card_debuff_template.png',
    icon: './assets/ui_cards/icon_debuff_karma.png'
  }
];

// ==========================================
// 3. BANK SOAL SEJARAH (PILIHAN GANDA & ESAI)
// ==========================================

const HISTORY_QUESTIONS = [
  {
    type: 'mcq',
    question: 'Siapakah tokoh yang mengetik naskah Proklamasi Kemerdekaan Indonesia pada malam sebelum 17 Agustus 1945?',
    options: ['Sayuti Melik', 'Achmad Soebardjo', 'Sukarni', 'Sutan Sjahrir'],
    answer: 'Sayuti Melik',
    fact: 'Sayuti Melik mengetik naskah Proklamasi dari tulisan tangan Ir. Soekarno di rumah Laksamana Maeda.'
  },
  {
    type: 'mcq',
    question: 'Kerajaan Hindu tertua di Nusantara yang terletak di tepi Sungai Mahakam, Kalimantan Timur adalah...',
    options: ['Kutai Martadipura', 'Tarumanegara', 'Sriwijaya', 'Kalingga'],
    answer: 'Kutai Martadipura',
    fact: 'Kerajaan Kutai berdiri sekitar abad ke-4 Masehi, dibuktikan dengan 7 prasasti Yupa peninggalan Raja Mulawarman.'
  },
  {
    type: 'mcq',
    question: 'Peristiwa penculikan Ir. Soekarno dan Moh. Hatta oleh golongan muda ke luar Jakarta pada 16 Agustus 1945 dikenal sebagai peristiwa...',
    options: ['Rengasdengklok', 'Bandung Lautan Api', 'Linggarjati', 'Ambarawa'],
    answer: 'Rengasdengklok',
    fact: 'Peristiwa Rengasdengklok bertujuan agar Soekarno-Hatta segera memproklamasikan kemerdekaan tanpa pengaruh Jepang.'
  },
  {
    type: 'mcq',
    question: 'Sumpah Pemuda diikrarkan pada Kongres Pemuda II di Batavia pada tanggal...',
    options: ['28 Oktober 1928', '20 Mei 1908', '10 November 1945', '1 Juni 1945'],
    answer: '28 Oktober 1928',
    fact: 'Pada Kongres Pemuda II, lagu Indonesia Raya pertama kali dikumandangkan dengan biola oleh W.R. Supratman.'
  },
  {
    type: 'mcq',
    question: 'Mahapatih dari Kerajaan Majapahit yang terkenal dengan Sumpah Palapa untuk menyatukan Nusantara adalah...',
    options: ['Gajah Mada', 'Hayam Wuruk', 'Raden Wijaya', 'Ken Arok'],
    answer: 'Gajah Mada',
    fact: 'Gajah Mada mengucapkan Sumpah Palapa saat diangkat menjadi Mahapatih Amangkubhumi pada tahun 1336 M.'
  },
  {
    type: 'mcq',
    question: 'Konferensi Asia-Afrika (KAA) tahun 1955 yang melahirkan Dasasila Bandung diselenggarakan di gedung...',
    options: ['Gedung Merdeka, Bandung', 'Istana Bogor', 'Gedung Pancasila, Jakarta', 'Benteng Vredeburg'],
    answer: 'Gedung Merdeka, Bandung',
    fact: 'KAA berlangsung pada 18–24 April 1955 dan dihadiri oleh 29 negara dari benua Asia dan Afrika.'
  },
  {
    type: 'mcq',
    question: 'Organisasi pergerakan nasional modern pertama di Indonesia yang berdiri pada 20 Mei 1908 adalah...',
    options: ['Budi Utomo', 'Sarekat Islam', 'Indische Partij', 'Perhimpunan Indonesia'],
    answer: 'Budi Utomo',
    fact: 'Budi Utomo didirikan oleh Dr. Soetomo dan para mahasiswa STOVIA atas gagasan dr. Wahidin Soedirohoesodo.'
  },
  {
    type: 'mcq',
    question: 'Pahlawan nasional asal Maluku yang memimpin perlawanan rakyat merebut Benteng Duurstede di Saparua adalah...',
    options: ['Kapitan Pattimura', 'Sultan Hasanuddin', 'Pangeran Antasari', 'Teuku Umar'],
    answer: 'Kapitan Pattimura',
    fact: 'Kapitan Pattimura (Thomas Matulessy) memimpin perlawanan rakyat Maluku terhadap Belanda pada tahun 1817.'
  },
  {
    type: 'essay',
    question: 'Di kota manakah bom atom pertama dijatuhkan oleh Sekutu di Jepang pada tanggal 6 Agustus 1945?',
    keywords: ['hiroshima', 'hirosima'],
    hint: 'Diawali huruf H (kota kedua pada 9 Agustus adalah Nagasaki).',
    answerDisplay: 'Hiroshima',
    fact: 'Bom atom "Little Boy" dijatuhkan di Hiroshima pada 6 Agustus 1945, disusul "Fat Man" di Nagasaki pada 9 Agustus 1945.'
  },
  {
    type: 'essay',
    question: 'Siapakah nama pencipta lagu kebangsaan "Indonesia Raya"?',
    keywords: ['supratman', 'soepratman', 'wage rudolf'],
    hint: 'W.R. S.........',
    answerDisplay: 'W.R. Supratman (Wage Rudolf Supratman)',
    fact: 'W.R. Supratman memperdengarkan instrumen biola Indonesia Raya pada penutupan Kongres Pemuda II tanggal 28 Oktober 1928.'
  },
  {
    type: 'essay',
    question: 'Kerajaan maritim bercorak Buddha terbesar di Sumatera yang berpusat di Palembang pada abad ke-7 adalah Kerajaan...',
    keywords: ['sriwijaya'],
    hint: 'Diawali huruf S dan terkenal sebagai pusat pembelajaran agama Buddha di Asia Tenggara.',
    answerDisplay: 'Sriwijaya',
    fact: 'Kerajaan Sriwijaya mencapai puncak kejayaan pada masa pemerintahan Raja Balaputradewa.'
  },
  {
    type: 'essay',
    question: 'Siapakah pahlawan wanita asal Jepara yang kumpulan suratnya diterbitkan menjadi buku "Habis Gelap Terbitlah Terang"?',
    keywords: ['kartini', 'ra kartini', 'raden adjeng kartini'],
    hint: 'R.A. K......',
    answerDisplay: 'R.A. Kartini',
    fact: 'Surat-surat R.A. Kartini kepada sahabatnya di Belanda dikumpulkan oleh J.H. Abendanon pada tahun 1911.'
  },
  {
    type: 'essay',
    question: 'Siapakah nama Pangeran dari Kesultanan Yogyakarta yang memimpin Perang Jawa pada tahun 1825–1830?',
    keywords: ['diponegoro', 'pangeran diponegoro'],
    hint: 'Pangeran D.........',
    answerDisplay: 'Pangeran Diponegoro',
    fact: 'Perang Diponegoro (Perang Jawa) dipicu oleh pemasangan patok jalan oleh Belanda yang melewati makam leluhur Pangeran Diponegoro.'
  },
  {
    type: 'essay',
    question: 'Apa nama badan bentukan Jepang yang diketuai oleh Dr. K.R.T. Radjiman Wedyodiningrat untuk mempersiapkan kemerdekaan Indonesia (singkatan 6 huruf)?',
    keywords: ['bpupki', 'dokuritsu junbi cosakai'],
    hint: 'B P U P K I',
    answerDisplay: 'BPUPKI (Badan Penyelidik Usaha-usaha Persiapan Kemerdekaan Indonesia)',
    fact: 'BPUPKI mengadakan sidang pertama pada 29 Mei – 1 Juni 1945 untuk merumuskan dasar negara Indonesia.'
  },
  {
    type: 'essay',
    question: 'Tanggal 10 November diperingati sebagai Hari Pahlawan untuk mengenang pertempuran besar tahun 1945 di kota...',
    keywords: ['surabaya', 'suroboyo'],
    hint: 'Kota Pahlawan di Jawa Timur.',
    answerDisplay: 'Surabaya',
    fact: 'Pertempuran 10 November 1945 di Surabaya terkenal dengan pidato pembakar semangat dari Bung Tomo.'
  }
];

// ==========================================
// 4. STATE PERMAINAN
// ==========================================

const state = {
  players: [],
  currentTurnIndex: 0,
  isBusy: false,
  extraTurnPending: false,
  selectedCard: null,
  swapTargetId: null,
  historyTiles: new Set(),
  usedQuestionIndices: new Set(),
  quizTimerInterval: null,
  settings: {
    quizFreq: 'high',
    quizType: 'mixed',
    bounceRule: true,
    showQuizTiles: true
  }
};

// Geseran posisi proporsional jika beberapa karakter berada di petak yang sama
const PAWN_OFFSETS = [
  { dx: -1.8, dy: -1.4 },
  { dx: 1.8, dy: -1.4 },
  { dx: -1.8, dy: 1.6 },
  { dx: 1.8, dy: 1.6 }
];

// ==========================================
// 5. REFERENSI DOM
// ==========================================

const dom = {
  screenMenu: document.getElementById('screen-main-menu'),
  screenGame: document.getElementById('screen-gameplay'),
  btnQuickAudio: document.getElementById('btn-quick-audio'),
  quickAudioIcon: document.getElementById('quick-audio-icon'),
  quickAudioLabel: document.getElementById('quick-audio-label'),

  modalPlayerSelect: document.getElementById('modal-player-select'),
  modalSettings: document.getElementById('modal-settings'),
  modalAbout: document.getElementById('modal-about'),

  modalQuiz: document.getElementById('modal-history-quiz'),
  quizTypeBadge: document.getElementById('quiz-type-badge'),
  quizTimerBadge: document.getElementById('quiz-timer-badge'),
  quizPlayerInfo: document.getElementById('quiz-player-info'),
  quizQuestionText: document.getElementById('quiz-question-text'),
  quizMcqContainer: document.getElementById('quiz-mcq-container'),
  quizEssayContainer: document.getElementById('quiz-essay-container'),
  quizEssayInput: document.getElementById('quiz-essay-input'),
  btnSubmitEssay: document.getElementById('btn-submit-essay'),
  btnQuizHint: document.getElementById('btn-quiz-hint'),
  quizHintText: document.getElementById('quiz-hint-text'),
  quizFeedbackPanel: document.getElementById('quiz-feedback-panel'),
  quizFeedbackTitle: document.getElementById('quiz-feedback-title'),
  quizFeedbackDesc: document.getElementById('quiz-feedback-desc'),
  btnQuizContinue: document.getElementById('btn-quiz-continue'),

  modalLuckStreak: document.getElementById('modal-luck-streak'),
  luckCardsContainer: document.getElementById('luck-cards-container'),
  luckOutcomePanel: document.getElementById('luck-outcome-panel'),
  luckOutcomeTitle: document.getElementById('luck-outcome-title'),
  luckOutcomeDesc: document.getElementById('luck-outcome-desc'),
  luckInteractiveOptions: document.getElementById('luck-interactive-options'),
  btnApplyCard: document.getElementById('btn-apply-card'),

  modalWinner: document.getElementById('modal-winner'),
  winnerAvatar: document.getElementById('winner-avatar'),
  winnerName: document.getElementById('winner-name'),
  winnerStats: document.getElementById('winner-stats'),

  boardWrapper: document.getElementById('board-wrapper'),
  boardGrid: document.getElementById('board-grid'),
  pawnsLayer: document.getElementById('pawns-layer'),
  boardFxBanner: document.getElementById('board-fx-banner'),
  boardFxTitle: document.getElementById('board-fx-title'),
  boardFxSub: document.getElementById('board-fx-sub'),
  playersContainer: document.getElementById('players-container'),
  turnBadge: document.getElementById('turn-badge'),
  diceBox: document.getElementById('dice-box'),
  diceImg: document.getElementById('dice-img'),
  btnRollDice: document.getElementById('btn-roll-dice'),
  diceResultText: document.getElementById('dice-result-text'),
  actionLog: document.getElementById('action-log'),
  legendLadders: document.getElementById('legend-ladders'),
  legendSnakes: document.getElementById('legend-snakes')
};

// ==========================================
// 6. INISIALISASI & PROTEKSI GAMBAR GLOBAL
// ==========================================

function init() {
  enforceGlobalImageProtection();
  generateRandomHistoryTiles();
  buildBoardGrid();
  populateHazardsLegend();
  bindEvents();

  const unlockAudio = () => {
    sound.ensureContext();
    if (sound.bgmMode === 'none') {
      sound.startBGM('menu');
    }
    window.removeEventListener('pointerdown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio);
}

/**
 * Mencegah klik kanan (contextmenu) dan drag-and-drop pada seluruh gambar di aplikasi
 */
function enforceGlobalImageProtection() {
  document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG' || e.target.closest('#board-wrapper') || e.target.closest('#modal-luck-streak')) {
      e.preventDefault();
    }
  });

  document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
    }
  });
}

function generateRandomHistoryTiles() {
  state.historyTiles.clear();
  const forbidden = new Set([
    1, 100,
    ...Object.keys(LADDERS).map(Number),
    ...Object.values(LADDERS).map(Number),
    ...Object.keys(SNAKES).map(Number),
    ...Object.values(SNAKES).map(Number)
  ]);

  while (state.historyTiles.size < 16) {
    const rnd = Math.floor(Math.random() * 96) + 2;
    if (!forbidden.has(rnd)) {
      state.historyTiles.add(rnd);
    }
  }
}

function buildBoardGrid() {
  dom.boardGrid.innerHTML = '';
  for (let rowFromTop = 0; rowFromTop < 10; rowFromTop++) {
    const rowFromBottom = 9 - rowFromTop;
    const isEvenRowFromBottom = rowFromBottom % 2 === 0;

    for (let col = 0; col < 10; col++) {
      const tileNumber = isEvenRowFromBottom
        ? rowFromBottom * 10 + col + 1
        : rowFromBottom * 10 + (10 - col);

      const cell = document.createElement('div');
      cell.dataset.tile = tileNumber;
      cell.className = 'relative w-full h-full flex items-end justify-end p-0.5';

      if (state.settings.showQuizTiles && state.historyTiles.has(tileNumber)) {
        const badge = document.createElement('span');
        badge.className = 'w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#FFDE59] border border-black text-black font-black text-[9px] flex items-center justify-center rounded-sm opacity-90';
        badge.textContent = '?';
        cell.appendChild(badge);
      }

      dom.boardGrid.appendChild(cell);
    }
  }
}

function populateHazardsLegend() {
  dom.legendLadders.innerHTML = Object.entries(LADDERS)
    .map(([start, end]) => `<div>Petak ${start} &rarr; ${end}</div>`)
    .join('');

  dom.legendSnakes.innerHTML = Object.entries(SNAKES)
    .map(([head, tail]) => `<div>Petak ${head} &rarr; ${tail}</div>`)
    .join('');
}

function bindEvents() {
  dom.btnQuickAudio.addEventListener('click', () => {
    sound.muted = !sound.muted;
    dom.quickAudioIcon.textContent = sound.muted ? '🔇' : '🔊';
    dom.quickAudioLabel.textContent = sound.muted ? 'Audio: OFF' : 'Audio: ON';
    if (!sound.muted) sound.sfxClick();
  });

  document.getElementById('btn-open-play').addEventListener('click', () => {
    sound.sfxClick();
    dom.modalPlayerSelect.classList.remove('hidden');
  });

  document.getElementById('btn-cancel-select').addEventListener('click', () => {
    sound.sfxClick();
    dom.modalPlayerSelect.classList.add('hidden');
  });

  document.querySelectorAll('.player-count-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      sound.sfxClick();
      const count = parseInt(btn.dataset.players, 10);
      dom.modalPlayerSelect.classList.add('hidden');
      startNewGame(count);
    });
  });

  const openSettings = () => {
    sound.sfxClick();
    dom.modalSettings.classList.remove('hidden');
  };
  document.getElementById('btn-open-settings').addEventListener('click', openSettings);
  document.getElementById('btn-ingame-settings').addEventListener('click', openSettings);

  document.getElementById('setting-bgm-vol').addEventListener('input', (e) => {
    sound.bgmVol = parseInt(e.target.value, 10) / 100;
  });

  document.getElementById('setting-sfx-vol').addEventListener('input', (e) => {
    sound.sfxVol = parseInt(e.target.value, 10) / 100;
  });

  document.getElementById('btn-test-sfx').addEventListener('click', () => {
    sound.sfxCorrect();
  });

  document.getElementById('btn-close-settings').addEventListener('click', () => {
    sound.sfxClick();
    state.settings.quizFreq = document.getElementById('setting-quiz-freq').value;
    state.settings.quizType = document.getElementById('setting-quiz-type').value;
    state.settings.bounceRule = document.getElementById('setting-bounce').checked;
    state.settings.showQuizTiles = document.getElementById('setting-show-quiz-tiles').checked;
    buildBoardGrid();
    dom.modalSettings.classList.add('hidden');
  });

  document.getElementById('btn-open-about').addEventListener('click', () => {
    sound.sfxClick();
    dom.modalAbout.classList.remove('hidden');
  });

  document.getElementById('btn-close-about').addEventListener('click', () => {
    sound.sfxClick();
    dom.modalAbout.classList.add('hidden');
  });

  const tabBtnHowto = document.getElementById('tab-btn-howto');
  const tabBtnCreators = document.getElementById('tab-btn-creators');
  const tabHowto = document.getElementById('about-tab-howto');
  const tabCreators = document.getElementById('about-tab-creators');

  tabBtnHowto.addEventListener('click', () => {
    sound.sfxClick();
    tabHowto.classList.remove('hidden');
    tabCreators.classList.add('hidden');
    tabBtnHowto.classList.replace('bg-white', 'bg-[#FFDE59]');
    tabBtnCreators.classList.replace('bg-[#FFDE59]', 'bg-white');
  });

  tabBtnCreators.addEventListener('click', () => {
    sound.sfxClick();
    tabCreators.classList.remove('hidden');
    tabHowto.classList.add('hidden');
    tabBtnCreators.classList.replace('bg-white', 'bg-[#FFDE59]');
    tabBtnHowto.classList.replace('bg-[#FFDE59]', 'bg-white');
  });

  document.getElementById('btn-back-menu').addEventListener('click', () => {
    sound.sfxClick();
    dom.screenGame.classList.add('hidden');
    dom.screenMenu.classList.remove('hidden');
    sound.startBGM('menu');
  });

  document.getElementById('btn-restart-game').addEventListener('click', () => {
    sound.sfxClick();
    startNewGame(state.players.length || 2);
  });

  dom.btnRollDice.addEventListener('click', handleRollDice);
  dom.btnApplyCard.addEventListener('click', applySelectedLuckCard);

  document.getElementById('btn-win-rematch').addEventListener('click', () => {
    sound.sfxClick();
    dom.modalWinner.classList.add('hidden');
    startNewGame(state.players.length || 2);
  });

  document.getElementById('btn-win-menu').addEventListener('click', () => {
    sound.sfxClick();
    dom.modalWinner.classList.add('hidden');
    dom.screenGame.classList.add('hidden');
    dom.screenMenu.classList.remove('hidden');
    sound.startBGM('menu');
  });
}

// ==========================================
// 7. SETUP PERMAINAN, CONTENDERS 2 KOLOM BESAR & BIDAK
// ==========================================

function startNewGame(playerCount) {
  generateRandomHistoryTiles();
  buildBoardGrid();

  state.players = PLAYER_CONFIGS.slice(0, playerCount).map((cfg) => ({
    ...cfg,
    position: 1,
    score: 0,
    nextRollMod: 0,
    shield: false,
    skipTurn: false
  }));
  state.currentTurnIndex = 0;
  state.isBusy = false;
  state.extraTurnPending = false;
  state.selectedCard = null;

  dom.screenMenu.classList.add('hidden');
  dom.screenGame.classList.remove('hidden');
  sound.startBGM('game');

  dom.actionLog.innerHTML = '';
  addLog(`🎮 Permainan dimulai dengan <strong>${playerCount} Pemain</strong>! Jawab Kuis Sejarah untuk langkah bonus!`, 'system');

  renderPawns();
  renderPlayerStats();
  updateTurnIndicator();
}

function getTileCenterPercent(tile) {
  const clamped = Math.max(1, Math.min(100, tile));
  const zeroBased = clamped - 1;
  const rowFromBottom = Math.floor(zeroBased / 10);
  const colInRow = zeroBased % 10;

  const col = rowFromBottom % 2 === 0 ? colInRow : 9 - colInRow;
  const rowFromTop = 9 - rowFromBottom;

  return {
    left: col * 10 + 5,
    top: rowFromTop * 10 + 5
  };
}

function renderPawns() {
  dom.pawnsLayer.innerHTML = '';
  state.players.forEach((player, idx) => {
    const pawnWrapper = document.createElement('div');
    pawnWrapper.id = `pawn-p${player.id}`;
    pawnWrapper.className = 'board-pawn';

    const tag = document.createElement('span');
    tag.className = `${player.badgeBg} border border-black text-black font-['JetBrains_Mono'] font-black text-[8px] leading-none px-1 py-0.5 mb-0.5`;
    tag.textContent = player.short;

    const img = document.createElement('img');
    img.src = player.avatar;
    img.alt = player.name;
    img.draggable = false;
    img.className = 'board-pawn-img protected-img';

    pawnWrapper.appendChild(tag);
    pawnWrapper.appendChild(img);
    dom.pawnsLayer.appendChild(pawnWrapper);

    updatePawnPosition(player, idx);
  });
}

function updatePawnPosition(player, idx) {
  const pawnEl = document.getElementById(`pawn-p${player.id}`);
  if (!pawnEl) return;

  const { left, top } = getTileCenterPercent(player.position);
  const sameTilePlayers = state.players.filter((p) => p.position === player.position);
  const offset = sameTilePlayers.length > 1 ? PAWN_OFFSETS[idx] || { dx: 0, dy: 0 } : { dx: 0, dy: 0 };

  pawnEl.style.left = `${left + offset.dx}%`;
  pawnEl.style.top = `${top + offset.dy}%`;
  pawnEl.classList.toggle('has-shield', Boolean(player.shield));
}

function updateAllPawns() {
  state.players.forEach((p, idx) => updatePawnPosition(p, idx));
}

/**
 * Menampilkan Contenders dalam bentuk 1 baris 2 kolom besar (grid-cols-2)
 * dengan panggung gambar karakter yang besar dan informasi lengkap.
 */
function renderPlayerStats() {
  dom.playersContainer.innerHTML = '';

  state.players.forEach((p, idx) => {
    const isCurrent = idx === state.currentTurnIndex;
    const card = document.createElement('div');
    card.className = `border-3 border-black p-2.5 flex flex-col justify-between transition-all ${
      isCurrent ? 'bg-[#FFF3B0] shadow-[4px_4px_0px_#000] -translate-y-0.5' : 'bg-[#F8F8F8] shadow-[2px_2px_0px_#000]'
    }`;

    const badges = [];
    if (p.shield) badges.push('<span class="bg-[#5CE1E6] border border-black px-1.5 py-0.5 text-[9px] font-black">🛡️ PERISAI</span>');
    if (p.nextRollMod > 0) badges.push(`<span class="bg-[#7ED957] border border-black px-1.5 py-0.5 text-[9px] font-black">+${p.nextRollMod} DADU</span>`);
    if (p.nextRollMod < 0) badges.push(`<span class="bg-[#FF5757] text-white border border-black px-1.5 py-0.5 text-[9px] font-black">${p.nextRollMod} DADU</span>`);
    if (p.skipTurn) badges.push('<span class="bg-black text-white px-1.5 py-0.5 text-[9px] font-black">🌿 SKIP</span>');

    card.innerHTML = `
      <!-- Header Nama & Giliran -->
      <div class="flex items-center justify-between gap-1 mb-1.5">
        <span class="font-black text-xs uppercase truncate">${p.name}</span>
        ${
          isCurrent
            ? '<span class="text-[9px] font-black bg-black text-white px-1.5 py-0.5 shrink-0">AKTIF</span>'
            : `<span class="text-[9px] font-['JetBrains_Mono'] font-bold text-neutral-600">${p.short}</span>`
        }
      </div>

      <!-- Panggung Gambar Karakter Besar -->
      <div class="relative w-full h-24 ${p.badgeBg} border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-center p-2 mb-2 overflow-hidden">
        <img src="${p.avatar}" alt="${p.name}" draggable="false" class="protected-img h-full w-auto object-contain drop-shadow-[2px_2px_0px_rgba(0,0,0,0.65)]" />
        <div class="absolute bottom-1 right-1 font-['JetBrains_Mono'] font-black text-xs bg-white border-2 border-black px-1.5 py-0.5 shadow-[1px_1px_0px_#000]">
          #${p.position}
        </div>
      </div>

      <!-- Info Skor & Efek Aktif -->
      <div class="space-y-1">
        <div class="flex items-center justify-between text-[10px] font-['JetBrains_Mono'] font-extrabold bg-white border border-black px-1.5 py-0.5">
          <span>SKOR</span>
          <span>${p.score} PTS</span>
        </div>
        <div class="flex flex-wrap gap-1 min-h-[18px] items-center">
          ${badges.length ? badges.join('') : '<span class="text-[9px] text-neutral-600 font-bold">Siap melangkah</span>'}
        </div>
      </div>
    `;

    dom.playersContainer.appendChild(card);

    const pawnEl = document.getElementById(`pawn-p${p.id}`);
    if (pawnEl) {
      pawnEl.classList.toggle('active-pawn', isCurrent);
    }
  });
}

function updateTurnIndicator() {
  const currentPlayer = state.players[state.currentTurnIndex];
  dom.turnBadge.textContent = `TURN: P${currentPlayer.id}`;
  dom.diceResultText.textContent = `Giliran ${currentPlayer.name}`;
  dom.btnRollDice.disabled = false;
  renderPlayerStats();
}

function addLog(message, type = 'normal') {
  const entry = document.createElement('div');
  let bgClass = 'bg-[#F4F4F0] border-black';
  if (type === 'buff') bgClass = 'bg-[#D9F99D] border-black';
  if (type === 'debuff') bgClass = 'bg-[#FECACA] border-black';
  if (type === 'hazard') bgClass = 'bg-[#BAE6FD] border-black';
  if (type === 'system') bgClass = 'bg-[#FEF08A] border-black';

  entry.className = `p-2 border-2 ${bgClass} shadow-[2px_2px_0px_#000] leading-snug`;
  entry.innerHTML = message;
  dom.actionLog.prepend(entry);
}

function showBoardBanner(title, subtitle, duration = 1200) {
  dom.boardFxTitle.textContent = title;
  dom.boardFxSub.textContent = subtitle;
  dom.boardFxBanner.classList.remove('hidden');
  setTimeout(() => {
    dom.boardFxBanner.classList.add('hidden');
  }, duration);
}

// ==========================================
// 8. LOGIKA DADU & LANGKAH BERTAHAP
// ==========================================

function handleRollDice() {
  if (state.isBusy) return;
  const player = state.players[state.currentTurnIndex];

  if (player.skipTurn) {
    player.skipTurn = false;
    sound.sfxWrong();
    addLog(`🌿 <strong>${player.name}</strong> terjerat Akar Pengikat dan melewati giliran ini!`, 'debuff');
    renderPlayerStats();
    advanceTurn();
    return;
  }

  state.isBusy = true;
  dom.btnRollDice.disabled = true;
  dom.diceBox.classList.add('dice-shaking');

  let ticks = 0;
  const maxTicks = 12;
  const rollInterval = setInterval(() => {
    const randomFace = Math.floor(Math.random() * 6);
    dom.diceImg.src = DICE_SPRITES[randomFace];
    sound.sfxDiceTick();
    ticks++;

    if (ticks >= maxTicks) {
      clearInterval(rollInterval);
      dom.diceBox.classList.remove('dice-shaking');
      const rawRoll = Math.floor(Math.random() * 6) + 1;
      dom.diceImg.src = DICE_SPRITES[rawRoll - 1];
      sound.sfxDiceLand(rawRoll);
      resolveDiceRoll(player, rawRoll);
    }
  }, 65);
}

async function resolveDiceRoll(player, rawRoll) {
  const mod = player.nextRollMod || 0;
  player.nextRollMod = 0;

  const finalSteps = Math.max(1, rawRoll + mod);
  const modText = mod !== 0 ? ` (${mod > 0 ? '+' + mod : mod} = ${finalSteps})` : '';
  dom.diceResultText.textContent = `Dadu: ${rawRoll}${modText}`;

  const startPos = player.position;
  await animatePawnSteps(player, finalSteps);

  addLog(`🎲 <strong>${player.name}</strong> melempar dadu ${rawRoll}${modText}: Petak ${startPos} &rarr; <strong>Petak ${player.position}</strong>.`);

  if (checkVictory(player)) return;

  const shouldTriggerQuiz = checkShouldTriggerQuiz(player.position);
  if (shouldTriggerQuiz) {
    openHistoryQuizModal(player, () => {
      if (checkVictory(player)) return;
      checkBoardHazards(player, rawRoll === 6);
    });
  } else {
    checkBoardHazards(player, rawRoll === 6);
  }
}

function animatePawnSteps(player, stepsCount, direction = 1) {
  return new Promise((resolve) => {
    let remaining = Math.abs(stepsCount);
    let currentDir = direction;

    const stepTimer = setInterval(() => {
      if (remaining <= 0) {
        clearInterval(stepTimer);
        resolve();
        return;
      }

      let nextPos = player.position + currentDir;

      if (nextPos > 100) {
        if (state.settings.bounceRule) {
          currentDir = -1;
          nextPos = 99;
        } else {
          nextPos = 100;
        }
      }
      if (nextPos < 1) nextPos = 1;

      player.position = nextPos;
      sound.sfxStep();
      updateAllPawns();
      renderPlayerStats();
      remaining--;
    }, 220);
  });
}

function checkShouldTriggerQuiz(tile) {
  if (tile === 100 || tile === 1) return false;
  if (state.settings.quizFreq === 'always') return true;
  if (state.settings.quizFreq === 'tile_only') return state.historyTiles.has(tile);
  return state.historyTiles.has(tile) || Math.random() < 0.65;
}

// ==========================================
// 9. SISTEM KUIS SEJARAH (PILIHAN GANDA & ESAI)
// ==========================================

function pickHistoryQuestion() {
  const mode = state.settings.quizType;
  let pool = HISTORY_QUESTIONS.map((q, idx) => ({ ...q, idx }));

  if (mode === 'mcq') pool = pool.filter((q) => q.type === 'mcq');
  if (mode === 'essay') pool = pool.filter((q) => q.type === 'essay');

  let unused = pool.filter((q) => !state.usedQuestionIndices.has(q.idx));
  if (unused.length === 0) {
    state.usedQuestionIndices.clear();
    unused = pool;
  }

  const chosen = unused[Math.floor(Math.random() * unused.length)];
  state.usedQuestionIndices.add(chosen.idx);
  return chosen;
}

function openHistoryQuizModal(player, onCompleteCallback) {
  sound.sfxQuizPopup();
  const qData = pickHistoryQuestion();

  dom.quizFeedbackPanel.classList.add('hidden');
  dom.quizHintText.classList.add('hidden');
  dom.quizPlayerInfo.textContent = `Giliran ${player.name} • Petak #${player.position}`;
  dom.quizQuestionText.textContent = qData.question;

  let secondsLeft = 25;
  dom.quizTimerBadge.textContent = `⏱️ ${secondsLeft}s`;
  if (state.quizTimerInterval) clearInterval(state.quizTimerInterval);

  let answered = false;

  const finalizeAnswer = (isCorrect) => {
    if (answered) return;
    answered = true;
    clearInterval(state.quizTimerInterval);

    dom.quizMcqContainer.querySelectorAll('button').forEach((b) => (b.disabled = true));
    dom.quizEssayInput.disabled = true;
    dom.btnSubmitEssay.disabled = true;

    dom.quizFeedbackPanel.classList.remove('hidden');

    if (isCorrect) {
      sound.sfxCorrect();
      player.score += 100;
      dom.quizFeedbackPanel.className = 'border-3 border-black bg-[#D9F99D] p-4 shadow-[4px_4px_0px_#000] mb-4';
      dom.quizFeedbackTitle.textContent = '✅ Jawaban Benar! (+2 Langkah Bonus & +100 Poin)';
      dom.quizFeedbackDesc.innerHTML = `<strong>Fakta Sejarah:</strong> ${qData.fact}`;
    } else {
      sound.sfxWrong();
      const correctLabel = qData.type === 'mcq' ? qData.answer : qData.answerDisplay;
      dom.quizFeedbackPanel.className = 'border-3 border-black bg-[#FECACA] p-4 shadow-[4px_4px_0px_#000] mb-4';
      dom.quizFeedbackTitle.textContent = '❌ Kurang Tepat! (Mundur 1 Langkah)';
      dom.quizFeedbackDesc.innerHTML = `<strong>Jawaban Benar:</strong> ${correctLabel}<br/><strong>Fakta Sejarah:</strong> ${qData.fact}`;
    }

    dom.btnQuizContinue.onclick = async () => {
      sound.sfxClick();
      dom.modalQuiz.classList.add('hidden');

      if (isCorrect) {
        addLog(`📜 <strong>${player.name}</strong> menjawab benar Kuis Sejarah! Maju bonus +2 langkah!`, 'buff');
        await animatePawnSteps(player, 2, 1);
      } else {
        addLog(`📜 <strong>${player.name}</strong> belum tepat menjawab Kuis Sejarah. Mundur 1 langkah.`, 'debuff');
        if (player.position > 1) {
          await animatePawnSteps(player, 1, -1);
        }
      }

      onCompleteCallback();
    };
  };

  state.quizTimerInterval = setInterval(() => {
    secondsLeft--;
    dom.quizTimerBadge.textContent = `⏱️ ${secondsLeft}s`;
    if (secondsLeft <= 0) {
      finalizeAnswer(false);
    }
  }, 1000);

  if (qData.type === 'mcq') {
    dom.quizTypeBadge.textContent = '📜 Kuis Sejarah — Pilihan Ganda';
    dom.quizMcqContainer.classList.remove('hidden');
    dom.quizEssayContainer.classList.add('hidden');
    dom.quizMcqContainer.innerHTML = '';

    const prefixes = ['A', 'B', 'C', 'D'];
    const shuffledOptions = [...qData.options].sort(() => Math.random() - 0.5);

    shuffledOptions.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'neo-btn bg-white hover:bg-[#FFDE59] p-3 text-left font-bold text-sm flex items-center gap-2.5';
      btn.innerHTML = `
        <span class="bg-black text-white font-['JetBrains_Mono'] font-black px-2 py-0.5 text-xs">${prefixes[idx]}</span>
        <span>${optText}</span>
      `;
      btn.addEventListener('click', () => {
        const isRight = optText === qData.answer;
        btn.classList.replace('bg-white', isRight ? 'bg-[#7ED957]' : 'bg-[#FF5757]');
        finalizeAnswer(isRight);
      });
      dom.quizMcqContainer.appendChild(btn);
    });
  } else {
    dom.quizTypeBadge.textContent = '✍️ Kuis Sejarah — Esai Singkat';
    dom.quizMcqContainer.classList.add('hidden');
    dom.quizEssayContainer.classList.remove('hidden');
    dom.quizEssayInput.value = '';
    dom.quizEssayInput.disabled = false;
    dom.btnSubmitEssay.disabled = false;

    dom.btnQuizHint.onclick = () => {
      sound.sfxClick();
      dom.quizHintText.textContent = `Petunjuk: ${qData.hint}`;
      dom.quizHintText.classList.remove('hidden');
    };

    const submitEssay = () => {
      const rawInput = dom.quizEssayInput.value.trim().toLowerCase();
      if (!rawInput) return;
      const isMatch = qData.keywords.some((kw) => rawInput.includes(kw.toLowerCase()));
      finalizeAnswer(isMatch);
    };

    dom.btnSubmitEssay.onclick = submitEssay;
    dom.quizEssayInput.onkeydown = (e) => {
      if (e.key === 'Enter') submitEssay();
    };
  }

  dom.modalQuiz.classList.remove('hidden');
}

// ==========================================
// 10. PENGECEKAN TANGGA, ULAR & KEMENANGAN
// ==========================================

function checkBoardHazards(player, rolledSix) {
  let climbedLadder = false;

  if (LADDERS[player.position]) {
    const dest = LADDERS[player.position];
    climbedLadder = true;
    sound.sfxLadder();
    showBoardBanner('🪜 NAIK TANGGA!', `${player.name} memanjat ke Petak #${dest}!`, 1200);
    addLog(`🪜 <strong>${player.name}</strong> menemukan Tangga di Petak ${player.position}! Naik ke <strong>Petak ${dest}</strong>!`, 'hazard');
    player.position = dest;
    updateAllPawns();
    renderPlayerStats();

    setTimeout(() => {
      if (checkVictory(player)) return;
      postMoveResolution(player, rolledSix || climbedLadder);
    }, 650);
    return;
  }

  if (SNAKES[player.position]) {
    const tail = SNAKES[player.position];
    if (player.shield) {
      player.shield = false;
      sound.sfxSkill('buff');
      showBoardBanner('🛡️ PERISAI AKTIF!', `${player.name} menahan gigitan ular di Petak #${player.position}!`, 1300);
      addLog(`🛡️ Perisai Anti-Ular milik <strong>${player.name}</strong> menahan Ular di Petak ${player.position}!`, 'buff');
      updateAllPawns();
      renderPlayerStats();
      postMoveResolution(player, rolledSix);
    } else {
      sound.sfxSnake();
      dom.boardWrapper.classList.add('board-shake');
      setTimeout(() => dom.boardWrapper.classList.remove('board-shake'), 500);
      showBoardBanner('🐍 AWAS ULAR!', `${player.name} meluncur turun ke Petak #${tail}!`, 1200);
      addLog(`🐍 <strong>${player.name}</strong> terkena Ular di Petak ${player.position}! Turun ke <strong>Petak ${tail}</strong>.`, 'debuff');
      player.position = tail;
      updateAllPawns();
      renderPlayerStats();

      setTimeout(() => {
        postMoveResolution(player, rolledSix);
      }, 650);
    }
    return;
  }

  postMoveResolution(player, rolledSix);
}

function postMoveResolution(player, triggerLuckStreak) {
  if (checkVictory(player)) return;

  if (triggerLuckStreak) {
    openLuckStreakModal(player);
  } else {
    finishTurn();
  }
}

function checkVictory(player) {
  if (player.position === 100) {
    state.isBusy = false;
    sound.sfxWin();
    addLog(`🏆 <strong>${player.name}</strong> mencapai Petak 100 dan MEMENANGKAN PERMAINAN!`, 'system');
    dom.winnerAvatar.src = player.avatar;
    dom.winnerName.textContent = `${player.name} Menang!`;
    dom.winnerStats.textContent = `Mencapai Petak #100 • Skor Sejarah: ${player.score} Poin`;
    dom.modalWinner.classList.remove('hidden');
    return true;
  }
  return false;
}

function finishTurn() {
  state.isBusy = false;
  if (state.extraTurnPending) {
    state.extraTurnPending = false;
    const currentPlayer = state.players[state.currentTurnIndex];
    addLog(`🎲 <strong>${currentPlayer.name}</strong> mengambil Giliran Tambahan!`, 'buff');
    updateTurnIndicator();
  } else {
    advanceTurn();
  }
}

function advanceTurn() {
  state.isBusy = false;
  state.currentTurnIndex = (state.currentTurnIndex + 1) % state.players.length;
  updateTurnIndicator();
}

// ==========================================
// 11. KARTU "LUCK STREAK" (FIXED 3D FLIP & TANPA BORDER PUTIH)
// ==========================================

function openLuckStreakModal(player) {
  state.selectedCard = null;
  state.swapTargetId = null;
  dom.luckOutcomePanel.classList.add('hidden');
  dom.luckInteractiveOptions.classList.add('hidden');
  dom.luckInteractiveOptions.innerHTML = '';
  dom.luckCardsContainer.innerHTML = '';

  const shuffled = [...LUCK_CARDS].sort(() => Math.random() - 0.5).slice(0, 3);

  shuffled.forEach((cardData) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'card-perspective';

    const inner = document.createElement('div');
    inner.className = 'card-inner';

    // Sisi Belakang Kartu (Tanpa border putih tambahan)
    const backFace = document.createElement('div');
    backFace.className = 'card-face card-back';
    backFace.innerHTML = `
      <img src="./assets/ui_cards/card_back.png" alt="Card Back" draggable="false" class="protected-img w-full h-full object-contain block" />
    `;

    // Sisi Depan Kartu (PENTING: Jangan tambahkan class 'relative' agar tidak menimpa position: absolute pada .card-face)
    const frontFace = document.createElement('div');
    frontFace.className = 'card-face card-front';
    frontFace.style.backgroundImage = `url('${cardData.template}')`;

    const typeLabelColor = cardData.type === 'buff' ? 'text-[#15803D]' : 'text-[#B91C1C]';

    frontFace.innerHTML = `
      <!-- Header Slot inside Template -->
      <div class="absolute top-[6%] inset-x-[12%] h-[11%] flex items-center justify-center">
        <span class="font-black text-xs uppercase tracking-widest ${typeLabelColor}">
          ${cardData.type === 'buff' ? '★ BUFF ★' : '✖ DEBUFF ✖'}
        </span>
      </div>

      <!-- Center Illustration Slot inside Template -->
      <div class="absolute top-[20%] bottom-[25%] inset-x-[11%] flex items-center justify-center overflow-hidden rounded">
        <img src="${cardData.icon}" alt="${cardData.name}" draggable="false" class="protected-img w-full h-full object-cover block" />
      </div>

      <!-- Bottom Name Slot inside Template -->
      <div class="absolute bottom-[6.5%] inset-x-[11%] h-[15%] flex items-center justify-center px-2 text-center">
        <span class="font-black text-xs uppercase leading-tight text-black">${cardData.name}</span>
      </div>
    `;

    inner.appendChild(backFace);
    inner.appendChild(frontFace);
    wrapper.appendChild(inner);

    inner.addEventListener('click', () => {
      if (state.selectedCard) return;
      sound.sfxCardFlip();
      state.selectedCard = cardData;
      inner.classList.add('is-flipped');

      setTimeout(() => {
        dom.luckOutcomeTitle.textContent = `${cardData.name} (${cardData.type.toUpperCase()})`;
        dom.luckOutcomeDesc.textContent = cardData.desc;

        if (cardData.id === 'swap') {
          setupSwapInteractivePicker(player);
        }

        dom.luckOutcomePanel.classList.remove('hidden');
      }, 450);
    });

    dom.luckCardsContainer.appendChild(wrapper);
  });

  dom.modalLuckStreak.classList.remove('hidden');
}

function setupSwapInteractivePicker(player) {
  const playersAhead = state.players.filter((p) => p.id !== player.id && p.position > player.position);
  if (playersAhead.length === 0) return;

  dom.luckInteractiveOptions.innerHTML = '<div class="w-full text-xs font-black uppercase mb-1">Pilih Target Tukar Posisi:</div>';
  playersAhead.forEach((target, idx) => {
    const btn = document.createElement('button');
    btn.className = `neo-btn px-3 py-1 text-xs font-black ${idx === 0 ? 'bg-[#FFDE59]' : 'bg-white'}`;
    btn.textContent = `${target.name} (Petak #${target.position})`;
    if (idx === 0) state.swapTargetId = target.id;

    btn.addEventListener('click', () => {
      sound.sfxClick();
      state.swapTargetId = target.id;
      dom.luckInteractiveOptions.querySelectorAll('button').forEach((b) => b.classList.replace('bg-[#FFDE59]', 'bg-white'));
      btn.classList.replace('bg-white', 'bg-[#FFDE59]');
    });

    dom.luckInteractiveOptions.appendChild(btn);
  });
  dom.luckInteractiveOptions.classList.remove('hidden');
}

async function applySelectedLuckCard() {
  const card = state.selectedCard;
  const player = state.players[state.currentTurnIndex];
  dom.modalLuckStreak.classList.add('hidden');

  if (!card || !player) {
    finishTurn();
    return;
  }

  sound.sfxSkill(card.type);

  switch (card.id) {
    case 'kangaroo': {
      showBoardBanner('🦘 LOMPAT KANGGURU!', `${player.name} melompat +3 langkah!`, 1100);
      await animatePawnSteps(player, 3, 1);
      addLog(`🦘 <strong>${player.name}</strong> melompat +3 langkah dengan <strong>Lompat Kangguru</strong> ke Petak ${player.position}!`, 'buff');
      break;
    }

    case 'winged_boots': {
      player.nextRollMod += 2;
      showBoardBanner('🪽 SEPATU ANGIN!', `${player.name} mendapat +2 pada dadu berikutnya!`, 1100);
      addLog(`🪽 <strong>${player.name}</strong> memakai <strong>Sepatu Angin</strong> (+2 lemparan dadu berikutnya)!`, 'buff');
      break;
    }

    case 'shield': {
      player.shield = true;
      showBoardBanner('🛡️ PERISAI AKTIF!', `${player.name} kebal terhadap 1 ular berikutnya!`, 1100);
      addLog(`🛡️ <strong>${player.name}</strong> mengaktifkan <strong>Perisai Anti-Ular</strong>!`, 'buff');
      break;
    }

    case 'double_dice': {
      state.extraTurnPending = true;
      showBoardBanner('🎲 DADU GANDA!', `${player.name} mendapat 1 giliran tambahan!`, 1100);
      addLog(`🎲 <strong>${player.name}</strong> menarik <strong>Dadu Ganda</strong> dan mendapat giliran ekstra!`, 'buff');
      break;
    }

    case 'shortcut': {
      const target = Math.min(100, player.position + 10);
      player.position = target;
      showBoardBanner('🚀 JALUR PINTAS!', `${player.name} naik 1 baris penuh ke Petak #${target}!`, 1200);
      addLog(`🚀 <strong>${player.name}</strong> melewati <strong>Jalur Pintas</strong> (+10 petak) &rarr; Petak ${target}!`, 'buff');
      break;
    }

    case 'swap': {
      const playersAhead = state.players
        .filter((p) => p.id !== player.id && p.position > player.position)
        .sort((a, b) => a.position - b.position);

      const targetPlayer = state.players.find((p) => p.id === state.swapTargetId) || playersAhead[0];

      if (targetPlayer) {
        const tempPos = player.position;
        player.position = targetPlayer.position;
        targetPlayer.position = tempPos;
        showBoardBanner('🔄 TUKAR POSISI!', `${player.name} bertukar tempat dengan ${targetPlayer.name}!`, 1300);
        addLog(
          `🔄 <strong>${player.name}</strong> bertukar posisi dengan <strong>${targetPlayer.name}</strong> (Petak ${tempPos} &harr; Petak ${player.position})!`,
          'buff'
        );
      } else {
        showBoardBanner('👑 POSISI TERDEPAN!', `${player.name} sudah memimpin di depan (+1 langkah bonus)!`, 1200);
        player.position = Math.min(100, player.position + 1);
        addLog(`🔄 <strong>${player.name}</strong> sudah memimpin, mendapat bonus maju +1 petak!`, 'buff');
      }
      break;
    }

    case 'roots': {
      player.skipTurn = true;
      showBoardBanner('🌿 AKAR PENGIKAT!', `${player.name} harus melewati giliran berikutnya!`, 1200);
      addLog(`🌿 <strong>${player.name}</strong> terjerat <strong>Akar Pengikat</strong> (skip giliran berikutnya)!`, 'debuff');
      break;
    }

    case 'anvil': {
      player.nextRollMod -= 2;
      showBoardBanner('⚓ BEBAN BESI!', `${player.name} terkena -2 dadu berikutnya!`, 1100);
      addLog(`⚓ <strong>${player.name}</strong> terkena <strong>Beban Besi</strong> (-2 pada lemparan dadu berikutnya)!`, 'debuff');
      break;
    }

    case 'hungry_snake': {
      showBoardBanner('🐍 ULAR LAPAR!', `${player.name} mundur 2 langkah!`, 1100);
      await animatePawnSteps(player, 2, -1);
      addLog(`🐍 <strong>${player.name}</strong> mundur 2 langkah karena <strong>Ular Lapar</strong> ke Petak ${player.position}.`, 'debuff');
      break;
    }

    case 'tornado': {
      dom.boardWrapper.classList.add('board-shake');
      setTimeout(() => dom.boardWrapper.classList.remove('board-shake'), 500);
      const affected = [];
      state.players.forEach((other) => {
        if (other.id !== player.id && Math.abs(other.position - player.position) <= 6) {
          other.position = Math.max(1, other.position - 2);
          affected.push(other.name);
        }
      });
      if (affected.length > 0) {
        showBoardBanner('🌪️ ANGIN TORNADO!', `${affected.join(', ')} terdorong mundur 2 langkah!`, 1300);
        addLog(`🌪️ <strong>Angin Tornado!</strong> Mendorong ${affected.join(', ')} mundur 2 langkah!`, 'debuff');
      } else {
        showBoardBanner('🌪️ ANGIN TORNADO!', 'Tidak ada lawan dalam radius 6 petak!', 1100);
        addLog(`🌪️ <strong>${player.name}</strong> memicu <strong>Angin Tornado</strong>, namun tidak ada lawan di sekitar.`, 'debuff');
      }
      break;
    }

    case 'zonk': {
      showBoardBanner('💨 ZONK!', 'Aman! Tidak terjadi apa-apa.', 1000);
      addLog(`💨 <strong>${player.name}</strong> membuka kartu <strong>Zonk!</strong> Tidak ada efek.`, 'debuff');
      break;
    }

    case 'karma': {
      const ranked = [...state.players].sort((a, b) => b.position - a.position);
      const myRankIdx = ranked.findIndex((p) => p.id === player.id);
      const oppositeIdx = ranked.length - 1 - myRankIdx;
      const partner = ranked[oppositeIdx];

      if (partner && partner.id !== player.id && partner.position !== player.position) {
        const temp = player.position;
        player.position = partner.position;
        partner.position = temp;
        showBoardBanner('☯️ RODA KARMA!', `${player.name} & ${partner.name} bertukar posisi peringkat!`, 1300);
        addLog(
          `☯️ <strong>Roda Karma!</strong> <strong>${player.name}</strong> bertukar posisi dengan <strong>${partner.name}</strong> (Petak ${temp} &harr; Petak ${player.position})!`,
          'debuff'
        );
      } else {
        showBoardBanner('☯️ RODA KARMA!', 'Posisi peringkat tetap seimbang!', 1100);
        addLog(`☯️ <strong>${player.name}</strong> menarik <strong>Roda Karma</strong>, tetapi posisi tetap seimbang!`, 'debuff');
      }
      break;
    }
  }

  updateAllPawns();
  renderPlayerStats();

  setTimeout(() => {
    if (checkVictory(player)) return;

    if (LADDERS[player.position]) {
      const top = LADDERS[player.position];
      sound.sfxLadder();
      addLog(`🪜 Efek kartu membawa <strong>${player.name}</strong> ke Tangga! Naik ke <strong>Petak ${top}</strong>!`, 'hazard');
      player.position = top;
      updateAllPawns();
      renderPlayerStats();
    } else if (SNAKES[player.position]) {
      const tail = SNAKES[player.position];
      if (player.shield) {
        player.shield = false;
        addLog(`🛡️ Perisai <strong>${player.name}</strong> menahan Ular di Petak ${player.position}!`, 'buff');
      } else {
        sound.sfxSnake();
        addLog(`🐍 Efek kartu membawa <strong>${player.name}</strong> ke Ular! Turun ke <strong>Petak ${tail}</strong>.`, 'debuff');
        player.position = tail;
      }
      updateAllPawns();
      renderPlayerStats();
    }

    if (!checkVictory(player)) {
      finishTurn();
    }
  }, 550);
}

document.addEventListener('DOMContentLoaded', init);