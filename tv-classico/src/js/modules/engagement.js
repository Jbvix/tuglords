// ========== ENGAJAMENTO (Regras v2 TV) ==========
// Placar com "Virada!", eventos de rodada, reta final, leilão relâmpago,
// desafio de quiz e conquistas. Todos os números vivem em REGRAS (state.js).
import { gameState, REGRAS, TRAINING_QUESTIONS } from './state.js';
import * as UI from './ui.js';
import { FX, coinsLight } from './effects.js';
import { Audio } from './audio.js';
import { fm } from './money.js';
import { pickComment } from './commentary.js';
import { netWorth, handleMandatoryPayment } from './logic.js';

function say(ev, ctx) { UI.showCommentary(pickComment(ev, ctx || {})); }
function cur() { return gameState.players[gameState.currentPlayerIndex]; }
function byId(id) { return gameState.players.find(p => p.id === id); }
function active() { return gameState.players.filter(p => !p.isEliminated); }

// ---------- Ícones desenhados em código ----------
const BADGE_COLORS = { primeira_manobra: '#3b82f6', frota5: '#10b981', salvamento_epico: '#ef4444', formado: '#fbbf24', arrematador: '#8b5cf6', duelista: '#ec4899' };
export function medalSVG(color, size) {
    const s = size || 28;
    return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true" style="vertical-align:middle"><path d="M7 2h4l1 5-3 1zM17 2h-4l-1 5 3 1z" fill="#94a3b8"/><circle cx="12" cy="14" r="7" fill="${color}" stroke="#fff" stroke-width="1.5"/><path d="M12 9.8l1.3 2.7 3 .4-2.2 2 .6 3-2.7-1.5-2.7 1.5.6-3-2.2-2 3-.4z" fill="#fff"/></svg>`;
}
function eventSVG(color) {
    return `<svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="${color}"/><path d="M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0v3c-2 2-4 2-6 0s-4-2-6 0-4 2-6 0z" fill="#fff"/><path d="M12 4l1.6 4.4H18l-3.6 2.6 1.4 4.3L12 12.6 8.2 15.3l1.4-4.3L6 8.4h4.4z" fill="#fff" opacity=".9"/></svg>`;
}
function clockSVG() {
    return `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" style="vertical-align:-5px"><circle cx="12" cy="13" r="8" fill="none" stroke="#fff" stroke-width="2.2"/><path d="M12 8v5l3 2M9 2h6" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>`;
}
function hammerSVG() {
    return `<svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true"><rect x="3" y="18" width="12" height="3" rx="1" fill="#94a3b8"/><rect x="9" y="3" width="9" height="5" rx="1" transform="rotate(35 13 5)" fill="#fbbf24"/><rect x="11.5" y="7" width="2.6" height="12" rx="1" transform="rotate(-55 12.8 13)" fill="#b45309"/></svg>`;
}
function duelSVG() {
    return `<svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#ec4899"/><text x="12" y="16.5" text-anchor="middle" font-size="12" font-weight="900" fill="#fff" font-family="sans-serif">VS</text></svg>`;
}

// ---------- 1. Placar ao vivo / Virada ----------
let lastOrder = null;
let busy = false;
export function resetTracking() { lastOrder = null; }
export function afterRender() {
    if (busy || gameState.phase !== 'playing') return;
    busy = true;
    try {
        const order = active().slice().sort((a, b) => netWorth(b) - netWorth(a)).map(p => p.id);
        if (lastOrder && lastOrder.length === order.length) {
            for (let i = 0; i < order.length; i++) {
                const prev = lastOrder.indexOf(order[i]);
                if (prev > i) {
                    const up = byId(order[i]), down = byId(lastOrder[i]);
                    if (up && down && up !== down) {
                        gameState.lastOvertake = { up: up.name, down: down.name };
                        FX.turnBanner(`Virada! ${up.name} passou ${down.name}`, up.color);
                        if (i === 0) say('lead', { player: up.name, owner: down.name });
                    }
                    break;
                }
            }
        }
        lastOrder = order;
        active().forEach(p => {
            if (p.money < REGRAS.NARRADOR_QUASE_FALENCIA && !p._lowWarned) { p._lowWarned = true; say('nearbroke', { player: p.name }); }
            else if (p.money >= REGRAS.NARRADOR_QUASE_FALENCIA * 2) p._lowWarned = false;
            const frota = (p.portTugs || 0) + (p.hasOceanTug ? 1 : 0) + (p.hasTuglord ? 1 : 0);
            if (frota >= REGRAS.CONQUISTA_FROTA) award(p, 'frota5');
        });
        renderHud();
    } finally { busy = false; }
}

// ---------- 2. Eventos de rodada ----------
export function activeEvent() {
    const e = gameState.roundEvent;
    return e && e.round === gameState.currentRound ? REGRAS.EVENTOS_RODADA.find(x => x.id === e.id) : null;
}
export function eventMult(key) {
    const e = activeEvent();
    return e && typeof e[key] === 'number' ? e[key] : 1;
}
export function onRoundStart() {
    const r = gameState.currentRound;
    if (gameState._lastRoundSeen === r) return;
    gameState._lastRoundSeen = r;
    if (isFinalStretch() && !gameState._finalAnnounced) {
        gameState._finalAnnounced = true;
        FX.turnBanner(`Reta final! Pagamentos x${String(REGRAS.RETA_FINAL_MULT).replace('.', ',')}`, '#ef4444');
        say('final', {});
    }
    const n = REGRAS.EVENTOS_RODADA_A_CADA;
    if (!n || r % n !== 0) return;
    const prev = gameState.roundEvent && gameState.roundEvent.id;
    const pool = REGRAS.EVENTOS_RODADA.filter(x => x.id !== prev);
    const ev = pool[Math.floor(Math.random() * pool.length)];
    gameState.roundEvent = { id: ev.id, round: r };
    say('roundevent', { valor: ev.nome });
    UI.showModal(`Evento da rodada ${r}`, `
        <div style="text-align:center;">${eventSVG(ev.cor)}
            <h2 style="color:${ev.cor}; margin:0.4rem 0;">${ev.nome}</h2>
            <p style="font-size:1.1rem;">${ev.texto}.</p>
            <p style="color:#94a3b8; font-size:0.85rem;">Vale só para a rodada ${r}. Novo evento a cada ${n} rodadas.</p>
        </div>`, [{ text: 'Entendi', onClick: 'closeModal()', class: 'btn-primary' }], false);
    renderHud();
}

// ---------- 3. Reta final ----------
export function isFinalStretch() {
    const lim = REGRAS.LIMITE_RODADAS;
    return !!lim && gameState.phase === 'playing' && gameState.currentRound > lim - REGRAS.RETA_FINAL_RODADAS;
}
export function payoutMult(label) {
    if (!isFinalStretch() || /sal[áa]rio/i.test(label || '')) return 1;
    return REGRAS.RETA_FINAL_MULT;
}

function renderHud() {
    let hud = document.getElementById('tlEngageHud');
    if (!hud) {
        hud = document.createElement('div');
        hud.id = 'tlEngageHud';
        hud.style.cssText = 'position:fixed; top:0.4rem; left:50%; transform:translateX(-50%); z-index:60; display:flex; gap:0.5rem; pointer-events:none; font-weight:800; font-size:0.9rem;';
        document.body.appendChild(hud);
    }
    let html = '';
    if (isFinalStretch()) {
        const left = REGRAS.LIMITE_RODADAS - gameState.currentRound + 1;
        html += `<div id="finalCountdown" style="background:#b91c1c; color:#fff; padding:0.3rem 0.8rem; border-radius:999px; box-shadow:0 0 0 2px #fca5a5;">${clockSVG()} Reta final: ${left === 1 ? 'última rodada' : 'faltam ' + left + ' rodadas'} | pagamentos x${String(REGRAS.RETA_FINAL_MULT).replace('.', ',')}</div>`;
    }
    const ev = activeEvent();
    if (ev) html += `<div id="roundEventPill" style="background:${ev.cor}; color:#0f172a; padding:0.3rem 0.8rem; border-radius:999px;">${ev.nome}: ${ev.texto}</div>`;
    hud.innerHTML = html;
    hud.style.display = html ? 'flex' : 'none';
}

// ---------- 4. Leilão relâmpago ----------
let A = null;
export function startAuction(pos) {
    const house = gameState.houses[pos];
    UI.closeModal();
    if (!REGRAS.LEILAO_ATIVO || !house || house.owner !== undefined && house.owner !== null) return;
    const total = gameState.players.length, ids = [];
    for (let k = 1; k <= total; k++) {
        const p = gameState.players[(gameState.currentPlayerIndex + k) % total];
        if (!p.isEliminated) ids.push(p.id);
    }
    A = { pos, bidders: ids, idx: 0, bid: 0, leader: null, start: Math.max(REGRAS.LEILAO_INCREMENTO, Math.round(house.price * REGRAS.LEILAO_LANCE_INICIAL / REGRAS.LEILAO_INCREMENTO) * REGRAS.LEILAO_INCREMENTO) };
    say('auction', { porto: house.name });
    renderAuction();
}
function nextBid() { return A.leader === null ? A.start : A.bid + REGRAS.LEILAO_INCREMENTO; }
function renderAuction() {
    const house = gameState.houses[A.pos];
    if (A.bidders.length === 0 || (A.leader !== null && A.bidders.length === 1 && A.bidders[0] === A.leader)) return finishAuction();
    if (A.bidders[A.idx] === A.leader) A.idx = (A.idx + 1) % A.bidders.length;
    const p = byId(A.bidders[A.idx]);
    const nb = nextBid();
    const can = p.money >= nb;
    const leader = A.leader !== null ? byId(A.leader) : null;
    const buttons = [];
    if (can) buttons.push({ text: `Dar lance ${fm(nb)}`, onClick: 'auctionBid()', class: 'btn-primary' });
    buttons.push({ text: 'Passar', onClick: 'auctionPass()', class: 'btn-secondary' });
    UI.showModal('Leilão relâmpago', `
        <div style="text-align:center;">${hammerSVG()}
            <p style="margin:0.3rem 0;"><strong>${house.name}</strong> (preço de tabela ${fm(house.price)})</p>
            <p style="font-size:1.2rem; color:var(--accent-gold); font-weight:800;">${leader ? 'Lance atual: ' + fm(A.bid) + ' de ' + leader.name : 'Sem lances. Mínimo ' + fm(A.start)}</p>
            <p style="font-size:1.1rem;">Vez de <strong style="color:${p.color};">${p.icon} ${p.name}</strong> (caixa ${fm(p.money)})</p>
            ${can ? '' : '<p style="color:#f59e0b;">Caixa insuficiente para cobrir o lance.</p>'}
            <p style="color:#94a3b8; font-size:0.8rem;">Na disputa: ${A.bidders.map(id => byId(id).name).join(', ')}. Quem passa sai do leilão.</p>
        </div>`, buttons, false);
}
export function auctionBid() {
    if (!A) return;
    const p = byId(A.bidders[A.idx]);
    const nb = nextBid();
    if (p.money < nb) return;
    A.bid = nb; A.leader = p.id;
    Audio.playCoin();
    A.idx = (A.idx + 1) % A.bidders.length;
    renderAuction();
}
export function auctionPass() {
    if (!A) return;
    A.bidders.splice(A.idx, 1);
    if (A.idx >= A.bidders.length) A.idx = 0;
    renderAuction();
}
function finishAuction() {
    const house = gameState.houses[A.pos];
    const w = A.leader !== null ? byId(A.leader) : null;
    const bid = A.bid;
    A = null;
    if (!w) {
        UI.showModal('Leilão relâmpago', `<p style="text-align:center;">Ninguém deu lance. ${house.name} continua à venda.</p>`, [{ text: 'Continuar', onClick: 'closeModal()', class: 'btn-primary' }], false);
        return;
    }
    w.money -= bid;
    house.owner = w.id;
    w.properties.push(house.name);
    gameState.lastAuction = { winner: w.name, bid, porto: house.name };
    Audio.playBuy();
    say('auctionwin', { player: w.name, porto: house.name, valor: fm(bid) });
    UI.showModal('Arrematado!', `<div style="text-align:center;">${hammerSVG()}<p style="font-size:1.15rem;"><strong style="color:${w.color};">${w.icon} ${w.name}</strong> leva <strong>${house.name}</strong> por <strong style="color:var(--accent-gold);">${fm(bid)}</strong>.</p></div>`,
        [{ text: 'Continuar', onClick: 'closeModal()', class: 'btn-primary' }], false);
    UI.renderPlayersPanel();
    UI.updatePlayerPositions();
    award(w, 'arrematador');
}

// ---------- 5. Desafio de quiz ----------
let D = null;
function turnKey() { return gameState.currentRound + ':' + gameState.currentPlayerIndex; }
export function challengeAvailable() { return gameState.phase === 'playing' && gameState.challengeTurn !== turnKey() && active().length > 1; }
export function openChallenge() {
    if (!challengeAvailable()) { UI.showNotification('Desafio: só 1 por turno.'); return; }
    const me = cur();
    const min = REGRAS.DESAFIO_CAIXA_MIN || 0;
    const opp = active().filter(p => p.id !== me.id);
    if (me.money < min) { UI.showNotification(`⚔️ Desafio exige caixa de ${fm(min)}. ${me.name} tem ${fm(me.money)}.`); return; }
    const ok = opp.filter(p => p.money >= min);
    const fora = opp.filter(p => p.money < min);
    if (!ok.length) { UI.showNotification(`⚔️ Nenhum adversário tem caixa de ${fm(min)} para o desafio.`); return; }
    UI.showModal('Desafio de quiz', `
        <div style="text-align:center;">${duelSVG()}
            <p>${me.name}, escolha quem desafiar. Os dois respondem a mesma pergunta.</p>
            <p style="color:#94a3b8; font-size:0.85rem;">Aposta ${fm(REGRAS.DESAFIO_APOSTA)}: quem erra paga a quem acerta. Dois acertos: empate, ninguém paga. Dois erros: cada um paga ${fm(REGRAS.DESAFIO_MULTA_ERRO_DUPLO)} ao Banco.</p>
            <p style="color:#fbbf24; font-size:0.85rem;">Só desafia quem tem pelo menos ${fm(min)} em caixa (os dois lados).${fora.length ? ` Fora por caixa baixo: ${fora.map(p => p.name).join(', ')}.` : ''}</p>
        </div>`, ok.map(p => ({ text: `${p.icon} ${p.name}`, onClick: `startChallenge(${p.id})`, class: 'btn-primary' })).concat([{ text: 'Cancelar', onClick: 'closeModal()', class: 'btn-secondary' }]), false);
}
export function startChallenge(oppId) {
    const min = REGRAS.DESAFIO_CAIXA_MIN || 0;
    if (cur().money < min || !byId(oppId) || byId(oppId).money < min) { UI.showNotification(`⚔️ Desafio exige caixa de ${fm(min)} dos dois jogadores.`); return; }
    const pools = Object.keys(TRAINING_QUESTIONS).map(k => TRAINING_QUESTIONS[k]).reduce((a, b) => a.concat(b), []);
    const q = pools[Math.floor(Math.random() * pools.length)];
    gameState.challengeTurn = turnKey();
    D = { a: cur().id, b: oppId, q, ans: {} , step: 'a' };
    say('challenge', { player: cur().name, owner: byId(oppId).name });
    renderChallenge();
}
function renderChallenge() {
    const p = byId(D[D.step]);
    UI.showModal(`Desafio: vez de ${p.name}`, `
        <div style="text-align:center;">${duelSVG()}
            <p style="color:${p.color}; font-weight:800;">${p.icon} ${p.name} responde${D.step === 'a' ? ' primeiro (o outro não espia!)' : ''}</p>
            <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 0.5rem; margin: 0.8rem 0;"><p>${D.q.question}</p></div>
        </div>`, D.q.options.map((o, i) => ({ text: o, onClick: `answerChallenge(${i})`, class: 'btn-secondary' })), false);
}
export function answerChallenge(i) {
    if (!D) return;
    D.ans[D.step] = D.q.options[i] === D.q.correct;
    if (D.step === 'a') { D.step = 'b'; renderChallenge(); return; }
    const a = byId(D.a), b = byId(D.b), ra = D.ans.a, rb = D.ans.b;
    const q = D.q; D = null;
    UI.closeModal();
    let msg, ok = true;
    if (ra && !rb) { ok = handleMandatoryPayment(b, REGRAS.DESAFIO_APOSTA, 'Desafio de quiz', a); msg = `${a.name} acertou e ${b.name} errou: ${b.name} paga ${fm(REGRAS.DESAFIO_APOSTA)}.`; award(a, 'duelista'); }
    else if (!ra && rb) { ok = handleMandatoryPayment(a, REGRAS.DESAFIO_APOSTA, 'Desafio de quiz', b); msg = `${b.name} acertou e ${a.name} errou: ${a.name} paga ${fm(REGRAS.DESAFIO_APOSTA)}.`; award(b, 'duelista'); }
    else if (ra && rb) msg = 'Os dois acertaram: empate, ninguém paga.';
    else {
        ok = handleMandatoryPayment(a, REGRAS.DESAFIO_MULTA_ERRO_DUPLO, 'Desafio de quiz (erro duplo)');
        if (ok) ok = handleMandatoryPayment(b, REGRAS.DESAFIO_MULTA_ERRO_DUPLO, 'Desafio de quiz (erro duplo)');
        msg = `Os dois erraram: cada um paga ${fm(REGRAS.DESAFIO_MULTA_ERRO_DUPLO)} ao Banco.`;
    }
    gameState.lastChallenge = { a: ra, b: rb, msg };
    // Se alguém não conseguiu pagar, o fluxo de dívida/falência assume a tela.
    if (!ok || gameState.phase === 'ended') return;
    UI.showModal('Resultado do desafio', `<div style="text-align:center;">${duelSVG()}<p style="font-size:1.1rem;">${msg}</p><p style="color:#94a3b8; font-size:0.85rem;">Resposta certa: ${q.correct}</p></div>`,
        [{ text: 'Continuar', onClick: 'closeModal()', class: 'btn-primary' }], false);
}

// ---------- 6. Conquistas e narrador ----------
export const BADGES = {
    primeira_manobra: 'Primeira manobra',
    frota5: 'Frota de 5',
    salvamento_epico: 'Salvamento épico',
    formado: 'Formado Tuglords',
    arrematador: 'Arrematador',
    duelista: 'Duelista'
};
let lastBadgeSound = 0;
export function award(player, id) {
    if (!player || !BADGES[id]) return;
    if (!player.badges) player.badges = [];
    if (player.badges.indexOf(id) >= 0) return;
    player.badges.push(id);
    const el = document.createElement('div');
    el.className = 'tl-badge-toast';
    el.style.cssText = 'position:fixed; left:50%; bottom:12%; transform:translateX(-50%); z-index:9999; background:#0f172a; border:2px solid ' + BADGE_COLORS[id] + '; color:#fff; padding:0.6rem 1.2rem; border-radius:1rem; font-weight:800; font-size:1.1rem; display:flex; gap:0.6rem; align-items:center; box-shadow:0 8px 24px rgba(0,0,0,.5);' + (coinsLight() ? '' : 'transition:opacity .4s;');
    el.innerHTML = medalSVG(BADGE_COLORS[id], 40) + `<span>Conquista! ${player.name}: ${BADGES[id]}</span>`;
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; }, 2600);
    setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 3100);
    if (!coinsLight()) FX.confetti(900);
    const now = Date.now();
    if (now - lastBadgeSound > 4000) { lastBadgeSound = now; Audio.playSuccess(); }
    say('badge', { player: player.name, valor: BADGES[id] });
}
export function badgesHTML(p) {
    return (p.badges || []).map(id => `<span title="${BADGES[id]}">${medalSVG(BADGE_COLORS[id], 16)}</span>`).join('');
}
export function onCredit(player, amount, label) {
    const l = (label || '').toLowerCase();
    if (l.indexOf('manobra') >= 0) award(player, 'primeira_manobra');
    if ((l.indexOf('salvatagem') >= 0 || l.indexOf('reboque') >= 0) && amount >= REGRAS.CONQUISTA_SALVAMENTO_EPICO) award(player, 'salvamento_epico');
    if (amount >= REGRAS.NARRADOR_PAGAMENTO_GRANDE) say('bigpay', { player: player.name, valor: fm(amount) });
}
