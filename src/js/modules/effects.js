// ========== EFFECTS MODULE (Sprint 6 — Emoção & Imersão) ==========
// Efeitos visuais/táteis puramente de DOM. Sem dependência do estado do jogo,
// então pode ser importado por qualquer módulo sem risco de ciclo.

function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export const FX = {
    // Vibração tátil (celular). Silenciosamente ignorada onde não há suporte.
    haptic(pattern) {
        try {
            if (navigator.vibrate) navigator.vibrate(pattern);
        } catch (e) { /* no-op */ }
    },

    // Flash de cor em tela cheia (vermelho = perigo, dourado = conquista).
    flash(color = 'rgba(239,68,68,0.35)', duration = 350) {
        if (reducedMotion()) return;
        const el = document.createElement('div');
        el.className = 'fx-flash';
        el.style.background = color;
        document.body.appendChild(el);
        requestAnimationFrame(() => el.classList.add('show'));
        setTimeout(() => {
            el.classList.remove('show');
            setTimeout(() => el.remove(), 320);
        }, duration);
    },

    // Treme a tela (pagamento pesado, falência).
    shake() {
        if (reducedMotion()) return;
        const screen = document.getElementById('gameScreen') || document.body;
        screen.classList.remove('fx-shake');
        void screen.offsetWidth; // força reflow para reiniciar a animação
        screen.classList.add('fx-shake');
        setTimeout(() => screen.classList.remove('fx-shake'), 600);
    },

    // Chuva de confetes (vitória).
    confetti(durationMs = 2600) {
        if (reducedMotion()) return;
        const colors = ['#fbbf24', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6', '#ec4899', '#f8fafc'];
        const container = document.createElement('div');
        container.className = 'fx-confetti';
        document.body.appendChild(container);
        for (let i = 0; i < 130; i++) {
            const p = document.createElement('div');
            p.className = 'fx-confetti-piece';
            p.style.left = (Math.random() * 100) + 'vw';
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            p.style.animationDelay = (Math.random() * 0.9) + 's';
            p.style.animationDuration = (2 + Math.random() * 1.6) + 's';
            p.style.width = p.style.height = (6 + Math.random() * 6) + 'px';
            container.appendChild(p);
        }
        setTimeout(() => container.remove(), durationMs + 2200);
    },

    // Banner central de troca de turno na cor do jogador.
    turnBanner(text, color) {
        if (reducedMotion()) return;
        let banner = document.getElementById('fxTurnBanner');
        if (!banner) {
            banner = document.createElement('div');
            banner.id = 'fxTurnBanner';
            banner.className = 'fx-turn-banner';
            document.body.appendChild(banner);
        }
        banner.style.setProperty('--banner-color', color || '#fbbf24');
        banner.textContent = text;
        banner.classList.remove('show');
        void banner.offsetWidth;
        banner.classList.add('show');
        setTimeout(() => banner.classList.remove('show'), 1700);
    }
};
