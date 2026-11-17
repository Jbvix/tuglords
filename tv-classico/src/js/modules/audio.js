export const Audio = {
    synth: null,
    polySynth: null,
    initialized: false,
    muted: false,

    // --- Fundo musical ---
    musicBus: null,      // Barramento de volume dedicado à trilha (independente dos SFX)
    padSynth: null,      // Acordes sustentados (clima)
    bassSynth: null,     // Linha de baixo
    leadSynth: null,     // Melodia
    chordLoop: null,     // Loop de progressão de acordes/baixo (Tone.Loop)
    melodySeq: null,     // Sequência melódica (Tone.Sequence)
    musicReady: false,   // Trilha já montada?
    musicPlaying: false, // Transport rodando para a música?

    // Alterna mudo e retorna o novo estado (true = mudo).
    // Também pausa/retoma o fundo musical para acompanhar o estado.
    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopMusic();
        } else {
            this.startMusic();
        }
        return this.muted;
    },

    init() {
        try { this._sfxLoad(); } catch (e) {}
        if (this.initialized) return;

        // Degradação graciosa: se a lib Tone.js não carregou (CDN bloqueado/offline),
        // o jogo segue normalmente sem áudio, em vez de lançar erro a cada clique.
        if (typeof Tone === 'undefined') {
            console.warn("🔇 Tone.js indisponível — áudio desativado.");
            return;
        }

        try {
            // Os navegadores deixam o AudioContext suspenso até um gesto do
            // usuário. init() roda no primeiro clique, então retomamos o
            // contexto aqui — sem isto nem efeitos nem música tocam.
            if (Tone.context.state !== 'running') {
                Tone.start().catch(() => {});
            }

            // Simple synth for single notes (movement, dice)
            this.synth = new Tone.Synth({
                oscillator: { type: "square" },
                envelope: { attack: 0.01, decay: 0.1, sustain: 0, release: 0.1 }
            }).toDestination();

            // PolySynth for chords (success, critical)
            this.polySynth = new Tone.PolySynth(Tone.Synth).toDestination();
            this.polySynth.set({
                oscillator: { type: "triangle" },
                envelope: { attack: 0.05, decay: 0.2, sustain: 0.1, release: 1 }
            });

            this.initialized = true;
            console.log("🔊 Audio System Initialized");
        } catch (e) {
            console.warn("🔇 Falha ao inicializar áudio:", e.message);
        }
    },

    // ===== Efeitos sonoros (ElevenLabs, HTML5 Audio pré-carregado; Menu liga/desliga) =====
    sfxOn() { try { return localStorage.getItem('tvSfx') !== 'off'; } catch (e) { return true; } },
    setSfx(on) { try { localStorage.setItem('tvSfx', on ? 'on' : 'off'); } catch (e) {} },
    _sfx: null,
    _sfxBuf: null,
    _ctx() {
        // Efeitos via Web Audio (um único pipeline). No webOS cada <audio> ocupa um
        // recurso de mídia e tocar um efeito podia preemptar/pausar a trilha.
        try {
            if (typeof Tone !== 'undefined' && Tone.context && Tone.context.rawContext) return Tone.context.rawContext;
        } catch (e) {}
        if (!this._ac) { const C = window.AudioContext || window.webkitAudioContext; if (C) this._ac = new C(); }
        return this._ac || null;
    },
    _sfxLoad() {
        if (this._sfx) return;
        this._sfx = {}; this._sfxBuf = {};
        const ctx = this._ctx();
        ['certificado', 'azar', 'dado', 'pulo', 'compra', 'moeda'].forEach((n) => {
            const url = 'tv/sfx/' + n + '.mp3';
            if (ctx && window.fetch) {
                fetch(url).then((r) => r.arrayBuffer()).then((ab) => new Promise((ok, ko) => ctx.decodeAudioData(ab, ok, ko)))
                    .then((buf) => { this._sfxBuf[n] = buf; }).catch(() => {});
            }
            const a = document.createElement('audio');
            a.preload = 'none'; a.src = url;   // só fallback; não ocupa decodificador à toa
            this._sfx[n] = a;
        });
    },
    // Desbloqueio no primeiro OK (gesto): retoma o AudioContext e toca um buffer mudo.
    unlockSfx() {
        this._sfxLoad();
        const ctx = this._ctx();
        if (!ctx) return;
        try {
            if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
            const b = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource();
            s.buffer = b; s.connect(ctx.destination); s.start(0);
        } catch (e) {}
    },
    sfxStatus(n) {
        this._sfxLoad();
        const c = this._ctx();
        return (this._sfxBuf[n] ? 'ok' : 'carregando') + (c ? ', ' + c.state : ', sem WebAudio');
    },
    playSfx(n, vol, forcar) {
        if (this.muted || (!forcar && !this.sfxOn())) return;
        this._sfxLoad();
        let dur = 1.5;
        const buf = this._sfxBuf[n], ctx = this._ctx();
        if (buf && ctx) {
            try {
                if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
                const src = ctx.createBufferSource(), g = ctx.createGain();
                src.buffer = buf; g.gain.value = vol;
                src.connect(g); g.connect(ctx.destination); src.start(0);
                dur = buf.duration;
            } catch (e) { return; }
        } else {
            const a = this._sfx[n];
            if (!a) return;
            try { a.pause(); a.currentTime = 0; } catch (e) {}
            a.volume = vol;
            const pr = a.play();
            if (pr && pr.catch) pr.catch(() => {});
            if (a.duration) dur = a.duration;
        }
        // ducking: guarda até quando há efeito ativo; restaura sempre para o alvo fixo
        if (n !== 'pulo') {
            this._duckAte = Math.max(this._duckAte || 0, Date.now() + dur * 1000 + 150);
            const m = this.trackEl;
            if (m) m.volume = Math.min(m.volume, this.DUCK_VOL);
            clearTimeout(this._duckT);
            this._duckT = setTimeout(() => this._unduck(), this._duckAte - Date.now());
        }
    },
    TRACK_VOL: 0.8,
    DUCK_VOL: 0.5,
    _unduck() {
        this._duckT = null;
        if (Date.now() < (this._duckAte || 0)) { this._duckT = setTimeout(() => this._unduck(), this._duckAte - Date.now()); return; }
        if (this.trackEl) this.trackEl.volume = this.TRACK_VOL;
    },
    playCertificate() { this.playSfx('certificado', 1.0); },
    playBadLuck() { this.playSfx('azar', 1.0); },

    playDice() {
        if (this.sfxOn()) {
            const t = Date.now();
            if (!this._diceT || t - this._diceT > 1800) { this._diceT = t; this.playSfx('dado', 1.0); }
            return;
        }
        return;
        const now = Tone.now();
        // Rapid clicks
        this.synth.triggerAttackRelease("C6", "32n", now);
        this.synth.triggerAttackRelease("A5", "32n", now + 0.1);
        this.synth.triggerAttackRelease("F5", "32n", now + 0.2);
    },

    playMove() {
        this.playSfx('pulo', 0.7);
        return;
        // Short blip
        this.synth.triggerAttackRelease("C5", "64n");
    },

    playSuccess() {
        if (!this.initialized || this.muted) return;
        const now = Tone.now();
        // Major arpeggio
        this.polySynth.triggerAttackRelease(["C5", "E5", "G5", "C6"], "8n", now);
    },

    playBuy() { this.playSfx('compra', 1.0); },
    // Tilintar de moedas (ElevenLabs): recebe ou paga dinheiro (salário, aluguel, bônus)
    playCoin() {
        const t = Date.now();
        if (this._coinT && t - this._coinT < 400) return;
        this._coinT = t; this.playSfx('moeda', 1.0);
    },

    playMoney() {
        if (!this.initialized || this.muted) return;
        const now = Tone.now();
        // Coin sound
        this.synth.triggerAttackRelease("B5", "16n", now);
        this.synth.triggerAttackRelease("E6", "16n", now + 0.1);
    },

    playCritical() {
        if (!this.initialized || this.muted) return;
        const now = Tone.now();
        // Low dissonant sound
        this.polySynth.triggerAttackRelease(["C2", "F#2"], "4n", now);
    },

    playError() {
        if (!this.initialized || this.muted) return;
        const now = Tone.now();
        // Descending slide
        this.synth.triggerAttackRelease("G4", "16n", now);
        this.synth.triggerAttackRelease("C4", "16n", now + 0.1);
    },

    // Monta os instrumentos e a sequência do fundo musical (uma única vez).
    // Trilha de AVENTURA MARÍTIMA animada: 124 BPM, baixo pulsante, arpejo,
    // batida (bumbo + chimbal) e melodia marcante. A reprodução é controlada
    // pelo Tone.Transport em start/stopMusic.
    _setupMusic() {
        if (this.musicReady || typeof Tone === 'undefined') return;

        // Barramento próprio — mais presente (volume aumentado a pedido).
        this.musicBus = new Tone.Volume(0).toDestination(); // tv12: +6 dB (equivale ao 0,35→0,80 dos temas)

        // Pad de acordes (cama harmônica, discreto).
        this.padSynth = new Tone.PolySynth(Tone.Synth).connect(this.musicBus);
        this.padSynth.set({
            oscillator: { type: "sawtooth" },
            envelope: { attack: 0.15, decay: 0.3, sustain: 0.4, release: 0.6 }
        });
        this.padSynth.volume.value = -14;

        // Baixo pulsante (colcheias) — motor rítmico.
        this.bassSynth = new Tone.Synth({
            oscillator: { type: "sawtooth" },
            envelope: { attack: 0.01, decay: 0.18, sustain: 0.2, release: 0.1 }
        }).connect(this.musicBus);
        this.bassSynth.volume.value = -3;

        // Arpejo rápido (semicolcheias) — brilho e energia.
        this.arpSynth = new Tone.Synth({
            oscillator: { type: "triangle" },
            envelope: { attack: 0.005, decay: 0.08, sustain: 0, release: 0.08 }
        }).connect(this.musicBus);
        this.arpSynth.volume.value = -14;

        // Melodia marcante à frente.
        this.leadSynth = new Tone.Synth({
            oscillator: { type: "sawtooth" },
            envelope: { attack: 0.01, decay: 0.15, sustain: 0.25, release: 0.2 }
        }).connect(this.musicBus);
        this.leadSynth.volume.value = -8;

        // Bateria: bumbo (four-on-the-floor) + chimbal nas contratempos.
        this.kickSynth = new Tone.MembraneSynth({
            octaves: 6, pitchDecay: 0.05,
            envelope: { attack: 0.001, decay: 0.3, sustain: 0 }
        }).connect(this.musicBus);
        this.kickSynth.volume.value = -4;

        this.hatSynth = new Tone.NoiseSynth({
            noise: { type: "white" },
            envelope: { attack: 0.001, decay: 0.03, sustain: 0 }
        }).connect(this.musicBus);
        this.hatSynth.volume.value = -20;

        // Progressão Am – F – C – G (4 compassos), clássica e empolgante.
        const chords = [
            ["A3", "C4", "E4"], ["F3", "A3", "C4"],
            ["C4", "E4", "G4"], ["G3", "B3", "D4"]
        ];
        const roots = ["A1", "F1", "C2", "G1"];
        const fifths = ["E2", "C2", "G2", "D2"];

        // Padrões pré-computados (4 compassos) — evitam disputa de estado.
        const bass = [];
        chords.forEach((c, b) => bass.push(roots[b], roots[b], fifths[b], roots[b], roots[b], fifths[b], roots[b], fifths[b]));
        const arp = [];
        chords.forEach(c => arp.push(c[0], c[1], c[2], c[1], c[2], c[1], c[0], c[1], c[0], c[1], c[2], c[1], c[2], c[1], c[0], c[2]));
        const melody = [
            "A4", null, "C5", "E5", "A5", null, "E5", "C5",
            "F4", null, "A4", "C5", "F5", null, "C5", "A4",
            "C5", "E5", "G5", null, "E5", "C5", "E5", null,
            "G4", "B4", "D5", "G5", "D5", "B4", "G4", null
        ];

        let bar = 0;
        this.chordLoop = new Tone.Loop((time) => {
            this.padSynth.triggerAttackRelease(chords[bar % 4], "2n", time, 0.3);
            bar++;
        }, "1m").start(0);

        this.kickLoop = new Tone.Loop((time) => {
            this.kickSynth.triggerAttackRelease("C1", "8n", time, 0.9);
        }, "4n").start(0);

        let hb = 0;
        this.hatLoop = new Tone.Loop((time) => {
            if (hb % 2 === 1) this.hatSynth.triggerAttackRelease("16n", time, 0.35);
            hb++;
        }, "8n").start(0);

        this.bassSeq = new Tone.Sequence((time, n) => {
            if (n) this.bassSynth.triggerAttackRelease(n, "8n", time, 0.85);
        }, bass, "8n").start(0);

        this.arpSeq = new Tone.Sequence((time, n) => {
            if (n) this.arpSynth.triggerAttackRelease(n, "16n", time, 0.4);
        }, arp, "16n").start(0);

        this.melodySeq = new Tone.Sequence((time, n) => {
            if (n) this.leadSynth.triggerAttackRelease(n, "8n", time, 0.55);
        }, melody, "8n").start(0);

        Tone.Transport.bpm.value = 124;
        this.musicReady = true;
    },

    // --- Trilha da TV: 'tema-1' | 'tema-2' | 'tema-3' | 'tema-4' | 'original' (Tone.js) ---
    trackEl: null,
    getTrack() {
        let t = null;
        try { t = localStorage.getItem('tuglords_tv_trilha'); } catch (e) {}
        if (t === 'tema-4-continuacao') { t = 'tema-7'; try { localStorage.setItem('tuglords_tv_trilha', t); } catch (e) {} }
        return (t === 'tema-1' || t === 'tema-2' || t === 'tema-3' || t === 'tema-4' || t === 'tema-4-estendido' || t === 'tema-5' || t === 'tema-6' || t === 'tema-7' || t === 'original') ? t : 'tema-7';
    },
    setTrack(t) {
        try { localStorage.setItem('tuglords_tv_trilha', t); } catch (e) {}
        this.stopMusic();
        this.startMusic();
        return t;
    },
    _querTrilha: false,
    _startFile(t) {
        if (!this.trackEl) {
            const el = document.createElement('audio');
            el.loop = true; el.preload = 'auto'; el.volume = this.TRACK_VOL;
            // Chromium 53/webOS às vezes ignora loop ou para em erro/stall: reinicia.
            el.addEventListener('ended', () => { if (this._querTrilha) { try { el.currentTime = 0; } catch (e) {} this._tocarFile(); } });
            el.addEventListener('error', () => { if (this._querTrilha) setTimeout(() => { try { el.load(); } catch (e) {} this._tocarFile(); }, 1500); });
            el.addEventListener('pause', () => { if (this._querTrilha) setTimeout(() => { if (this._querTrilha && el.paused) this._tocarFile(); }, 400); });
            this.trackEl = el;
            this._watchdog();
        }
        const src = 'tv/audio/' + t + '.mp3';
        if (this.trackEl.getAttribute('data-t') !== t) {
            this.trackEl.src = src;
            this.trackEl.setAttribute('data-t', t);
        }
        this._querTrilha = true;
        this._tocarFile();
    },
    _tocarFile() {
        const el = this.trackEl;
        if (!el || this.muted || !this._querTrilha) return;
        const pr = el.play();
        if (pr && pr.catch) pr.catch((e) => {
            console.warn('🔇 Trilha bloqueada/rejeitada, nova tentativa em 3 s:', e && e.message);
            this.restauros = (this.restauros || 0);
        });
    },
    restauros: 0,
    _watchdog() {
        if (this._wd) return;
        this._wd = setInterval(() => {
            if (this.muted) return;
            const t = this.getTrack();
            if (t === 'original') {
                if (this.musicPlaying && typeof Tone !== 'undefined' && Tone.Transport.state !== 'started') { this.restauros++; try { Tone.Transport.start(); } catch (e) {} }
                return;
            }
            const el = this.trackEl;
            if (!el || !this._querTrilha) return;
            if (el.paused || el.ended) { this.restauros++; this._tocarFile(); }
            if (Date.now() >= (this._duckAte || 0) && el.volume < this.TRACK_VOL - 0.01) { this.restauros++; el.volume = this.TRACK_VOL; }
            try { const c = this._ctx(); if (c && c.state === 'suspended' && c.resume) c.resume(); } catch (e) {}
        }, 3000);
    },
    _stopFile() {
        this._querTrilha = false;
        if (this.trackEl) { try { this.trackEl.pause(); } catch (e) {} }
    },

    // Inicia a trilha escolhida (nunca duas ao mesmo tempo).
    startMusic() {
        this.init();
        if (this.muted) return;
        const t = this.getTrack();
        if (t === 'original') {
            this._stopFile();
            this._startTone();
        } else {
            this._stopTone();
            this._startFile(t);
        }
    },

    stopMusic() {
        this._stopFile();
        this._stopTone();
    },

    // Fundo musical original (Tone.js), respeitando o estado de mudo.
    _startTone() {
        // Garante que o sistema de áudio foi inicializado mesmo se a música
        // for solicitada antes do primeiro init() por clique.
        this.init();
        if (!this.initialized || this.muted || this.musicPlaying) return;

        try {
            this._setupMusic();
            if (!this.musicReady) return;

            const begin = () => {
                if (this.muted || this.musicPlaying) return;
                Tone.Transport.start();
                this.musicPlaying = true;
                console.log("🎵 Fundo musical iniciado");
            };

            // Garante o AudioContext rodando antes de iniciar o Transport;
            // se ainda estiver suspenso, retoma e só então começa.
            if (Tone.context.state === 'running') {
                begin();
            } else {
                Tone.start().then(begin).catch((e) =>
                    console.warn("🔇 Falha ao retomar contexto de áudio:", e.message));
            }
        } catch (e) {
            console.warn("🔇 Falha ao iniciar fundo musical:", e.message);
        }
    },

    // Pausa o fundo musical sem desmontar a sequência (permite retomar).
    _stopTone() {
        if (!this.musicPlaying || typeof Tone === 'undefined') return;
        try {
            Tone.Transport.pause();
        } catch (e) {
            console.warn("🔇 Falha ao pausar fundo musical:", e.message);
        }
        this.musicPlaying = false;
    }
};

if (typeof window !== 'undefined') window.TugAudio = Audio;

if (typeof document !== 'undefined') {
    // webOS suspende mídia ao ir para segundo plano/overlay do sistema; ao voltar, retoma.
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && Audio._querTrilha && Audio.trackEl && Audio.trackEl.paused) Audio._tocarFile();
    });
}
