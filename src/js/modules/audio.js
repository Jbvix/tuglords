export const Audio = {
    synth: null,
    polySynth: null,
    initialized: false,

    init() {
        if (this.initialized) return;

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
    },

    playDice() {
        if (!this.initialized) return;
        const now = Tone.now();
        // Rapid clicks
        this.synth.triggerAttackRelease("C6", "32n", now);
        this.synth.triggerAttackRelease("A5", "32n", now + 0.1);
        this.synth.triggerAttackRelease("F5", "32n", now + 0.2);
    },

    playMove() {
        if (!this.initialized) return;
        // Short blip
        this.synth.triggerAttackRelease("C5", "64n");
    },

    playSuccess() {
        if (!this.initialized) return;
        const now = Tone.now();
        // Major arpeggio
        this.polySynth.triggerAttackRelease(["C5", "E5", "G5", "C6"], "8n", now);
    },

    playMoney() {
        if (!this.initialized) return;
        const now = Tone.now();
        // Coin sound
        this.synth.triggerAttackRelease("B5", "16n", now);
        this.synth.triggerAttackRelease("E6", "16n", now + 0.1);
    },

    playCritical() {
        if (!this.initialized) return;
        const now = Tone.now();
        // Low dissonant sound
        this.polySynth.triggerAttackRelease(["C2", "F#2"], "4n", now);
    },

    playError() {
        if (!this.initialized) return;
        const now = Tone.now();
        // Descending slide
        this.synth.triggerAttackRelease("G4", "16n", now);
        this.synth.triggerAttackRelease("C4", "16n", now + 0.1);
    }
};
