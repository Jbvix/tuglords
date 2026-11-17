// ========== EFFECTS MODULE (Sprint 6 — Emoção & Imersão) ==========
// Efeitos visuais/táteis puramente de DOM. Sem dependência do estado do jogo,
// então pode ser importado por qualquer módulo sem risco de ciclo.

function reducedMotion() {
    return false; // TV: animações sempre ligadas
}

// Modo leve das moedas: Samsung antiga (Orsay/Maple), ?leve=1 / ?antiga=1
// ou aparelho fraco. Menos moedas, só opacidade + posição, sem rotação.
export function coinsLight() {
    try {
        var q = (location.search || '');
        if (/[?&](leve|antiga)=1/.test(q)) return true;
        if (/[?&]leve=0/.test(q)) return false;
        var ua = navigator.userAgent || '';
        if (/Maple|SMART-TV.*Safari\/53[0-7]|Orsay/i.test(ua)) return true;
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return true;
    } catch (e) { /* no-op */ }
    return false;
}

// Moeda Farolin desenhada em código (círculo dourado com F$).
function coinEl(light) {
    var c = document.createElement('div');
    c.className = 'fx-coin' + (light ? ' fx-coin-light' : '');
    c.innerHTML = '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">'
        + '<circle cx="12" cy="12" r="11" fill="#b45309"/><circle cx="12" cy="12" r="9" fill="#fbbf24"/>'
        + '<circle cx="12" cy="12" r="7" fill="none" stroke="#f59e0b" stroke-width="1"/>'
        + '<text x="12" y="16" text-anchor="middle" font-size="9" font-weight="700" fill="#92400e" font-family="sans-serif">F$</text></svg>';
    return c;
}

export const FX = {
    // Chuva de moedas voando para cima quando entra dinheiro (silenciosa:
    // o som de moeda já existente toca em quem chama, com moderação).
    // Versão leve automática (coinsLight) para TVs antigas.
    coins(amount, label) {
        var light = coinsLight();
        var n = light ? 4 : Math.min(16, 6 + Math.floor((amount || 0) / 5000));
        var box = document.createElement('div');
        box.className = 'fx-coins' + (light ? ' fx-coins-light' : '');
        if (label) {
            var t = document.createElement('div');
            t.className = 'fx-coins-label';
            t.textContent = label;
            box.appendChild(t);
        }
        document.body.appendChild(box);
        for (var i = 0; i < n; i++) {
            var c = coinEl(light);
            c.style.left = (light ? 35 + i * 10 : 15 + Math.random() * 70) + '%';
            c.style.top = '75%';
            if (!light) {
                c.style.webkitAnimationDelay = c.style.animationDelay = (Math.random() * 0.5) + 's';
                c.style.webkitAnimationDuration = c.style.animationDuration = (1.1 + Math.random() * 0.7) + 's';
            }
            box.appendChild(c);
        }
        if (light) {
            // Só transição de top/opacidade (funciona em WebKit antigo).
            setTimeout(function () { box.className += ' go'; }, 30);
        }
        setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, light ? 1600 : 2600);
    },

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
        const n = coinsLight() ? 12 : 36; // TV antiga (modo leve): bem menos confete
        for (let i = 0; i < n; i++) {
            const p = document.createElement('div');
            p.className = 'fx-confetti-piece';
            p.style.left = (Math.random() * 100) + 'vw';
            p.style.background = colors[Math.floor(Math.random() * colors.length)];
            p.style.animationDelay = (Math.random() * 0.9) + 's';
            p.style.animationDuration = (2 + Math.random() * 1.6) + 's';
            p.style.width = p.style.height = (6 + Math.random() * 6) + 'px';
            container.appendChild(p);
        }
        setTimeout(() => { if (container.parentNode) container.parentNode.removeChild(container); }, durationMs + 2200);
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
