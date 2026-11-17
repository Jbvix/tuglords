// Farolin (F$): moeda própria do TugLords. Os valores internos do jogo não
// mudaram; cada unidade interna vale F$ 1.000 (MULT), então o equilíbrio é o
// mesmo e tudo aparece em milhões (salário 4.000 -> F$ 4 mi).
export const MULT = 1000;
const NBSP = '\u00a0';

function num(x, dec) {
    try { return x.toLocaleString('pt-BR', { maximumFractionDigits: dec }); }
    catch (e) { return String(Math.round(x * 100) / 100).replace('.', ','); }
}

// fm(4000) -> "F$ 4 mi"; fm(500) -> "F$ 500 mil"; fm(-250) -> "-F$ 250 mil"
export function fm(n) {
    const v = Number(n || 0) * MULT;
    const a = Math.abs(v);
    let s;
    if (a >= 1e9) s = num(a / 1e9, 2) + NBSP + 'bi';
    else if (a >= 1e6) s = num(a / 1e6, 2) + NBSP + 'mi';
    else if (a >= 1e3) s = num(a / 1e3, 1) + NBSP + 'mil';
    else s = num(a, 0);
    return (v < 0 ? '-' : '') + 'F$' + NBSP + s;
}

// Moedinha com farol desenhada em SVG (não depende de fonte/emoji na TV LG).
export function coinIcon(size) {
    const s = size || '1em';
    return '<svg class="farolin-coin" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align:-0.15em;display:inline-block">' +
        '<circle cx="12" cy="12" r="11" fill="#f5b301" stroke="#a86b00" stroke-width="1.5"/>' +
        '<circle cx="12" cy="12" r="8.3" fill="none" stroke="#ffe27a" stroke-width="0.8"/>' +
        '<path d="M10.2 9.5h3.6l1 9h-5.6z" fill="#ffffff" stroke="#7a4a00" stroke-width="0.6"/>' +
        '<rect x="9.9" y="12.2" width="4.2" height="1.4" fill="#d62828"/>' +
        '<rect x="9.4" y="15.4" width="5.2" height="1.4" fill="#d62828"/>' +
        '<rect x="10.4" y="7.2" width="3.2" height="2.3" fill="#ffe680" stroke="#7a4a00" stroke-width="0.6"/>' +
        '<path d="M9.8 7.2L12 5.2l2.2 2z" fill="#d62828"/>' +
        '<path d="M13.6 8.3l5-2v4z M10.4 8.3l-5-2v4z" fill="#fff6b0" opacity="0.8"/>' +
        '</svg>';
}
// fmi: valor com a moedinha (para placar/saldo)
export function fmi(n) { return coinIcon() + NBSP + fm(n); }

if (typeof window !== 'undefined') { window.fm = fm; window.coinIcon = coinIcon; window.fmi = fmi; }
