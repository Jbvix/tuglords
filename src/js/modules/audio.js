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
    // A reprodução em si é controlada pelo Tone.Transport em start/stopMusic.
    _setupMusic() {
        if (this.musicReady || typeof Tone === 'undefined') return;

        // Barramento próprio em volume baixo — fica abaixo dos efeitos sonoros.
        this.musicBus = new Tone.Volume(-16).toDestination();

        // Pad de acordes: clima oceânico, ataque/relaxamento suaves.
        this.padSynth = new Tone.PolySynth(Tone.Synth).connect(this.musicBus);
        this.padSynth.set({
            oscillator: { type: "sine" },
            envelope: { attack: 0.8, decay: 0.4, sustain: 0.6, release: 2.5 }
        });
        this.padSynth.volume.value = -6;

        // Baixo: sustenta a fundação harmônica.
        this.bassSynth = new Tone.Synth({
            oscillator: { type: "triangle" },
            envelope: { attack: 0.1, decay: 0.3, sustain: 0.7, release: 1.5 }
        }).connect(this.musicBus);
        this.bassSynth.volume.value = -4;

        // Melodia: leve, à frente do pad.
        this.leadSynth = new Tone.Synth({
            oscillator: { type: "triangle" },
            envelope: { attack: 0.05, decay: 0.2, sustain: 0.2, release: 0.8 }
        }).connect(this.musicBus);
        this.leadSynth.volume.value = -10;

        // Progressão de 4 compassos em Lá menor (i – VI – III – VII): calma e marítima.
        const chords = [
            ["A3", "C4", "E4"], // Am
            ["F3", "A3", "C4"], // F
            ["C4", "E4", "G4"], // C
            ["G3", "B3", "D4"]  // G
        ];
        const bassNotes = ["A2", "F2", "C3", "G2"];
        let bar = 0;

        this.chordLoop = new Tone.Loop((time) => {
            const i = bar % chords.length;
            this.padSynth.triggerAttackRelease(chords[i], "1m", time, 0.5);
            this.bassSynth.triggerAttackRelease(bassNotes[i], "2n", time, 0.7);
            bar++;
        }, "1m").start(0);

        // Melodia em colcheias sobre os 4 compassos (null = pausa).
        const melody = [
            "E4", null, "A4", null, "C5", null, "B4", null,
            "C5", null, "A4", null, "G4", null, "E4", null,
            "E4", null, "G4", null, "C5", null, "E5", null,
            "D5", null, "B4", null, "G4", null, "B4", "D5"
        ];
        this.melodySeq = new Tone.Sequence((time, note) => {
            if (note) this.leadSynth.triggerAttackRelease(note, "8n", time, 0.6);
        }, melody, "8n").start(0);

        Tone.Transport.bpm.value = 76;
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
