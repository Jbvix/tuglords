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

    playDice() {
        if (!this.initialized || this.muted) return;
        const now = Tone.now();
        // Rapid clicks
        this.synth.triggerAttackRelease("C6", "32n", now);
        this.synth.triggerAttackRelease("A5", "32n", now + 0.1);
        this.synth.triggerAttackRelease("F5", "32n", now + 0.2);
    },

    playMove() {
        if (!this.initialized || this.muted) return;
        // Short blip
        this.synth.triggerAttackRelease("C5", "64n");
    },

    playSuccess() {
        if (!this.initialized || this.muted) return;
        const now = Tone.now();
        // Major arpeggio
        this.polySynth.triggerAttackRelease(["C5", "E5", "G5", "C6"], "8n", now);
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
        this.musicBus = new Tone.Volume(-6).toDestination();

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

    // Inicia (ou retoma) o fundo musical, respeitando o estado de mudo.
    startMusic() {
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
    stopMusic() {
        if (!this.musicPlaying || typeof Tone === 'undefined') return;
        try {
            Tone.Transport.pause();
        } catch (e) {
            console.warn("🔇 Falha ao pausar fundo musical:", e.message);
        }
        this.musicPlaying = false;
    }
};
