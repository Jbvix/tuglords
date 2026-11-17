import { gameState, TRAINING_QUESTIONS, CERTIFICATES, CERT_LABELS, CERTIFIED_FEE_MULTIPLIER, CARD_DECK, WORKSHOP_STAFF_PAY, WORKSHOP_SERVICE_FEE, DOCKING_HOUSE_COST, DOCKING_HOUSE_SKIP_TURN, CARD_TUG_CASH, BANK_OWNER_LABEL, REGRAS, INSPECTION_QUESTIONS, UNISALVAGE_QUESTIONS, OCEAN_EVENTS, playerColors, playerIcons } from './state.js';
import * as UI from './ui.js';
import { Audio } from './audio.js';
import { FX } from './effects.js';
import { pickComment } from './commentary.js';
import * as Engage from './engagement.js';

import { fm, coinIcon } from './money.js';
// Narrador: mostra uma fala humorada do evento no banner do topo.
function commentate(event, ctx) {
    UI.showCommentary(pickComment(event, ctx));
}

// ========== TEMPOS DE ANIMAÇÃO ==========
// Centralizados para ajuste fácil do ritmo do turno. Pensados para dar tempo
// ao usuário de perceber cada etapa (dados → peão → popup) sem pressa.
const TIMING = {
    diceFrame: 130,     // intervalo entre quadros da rolagem dos dados (ms)
    diceFrames: 16,     // quantos quadros a rolagem dura antes de parar
    diceSettle: 1200,   // pausa para o jogador ver o resultado antes de mover
    moveStep: 1000,     // intervalo entre cada casa percorrida pelo peão (ms)
    arrivalPopup: 1300  // pausa após chegar à casa antes de abrir o popup (ms)
};

// ========== HELPERS ==========

// Casas compráveis que geram aluguel. No state.js os portos usam type 'port';
// aceitamos também 'property' para retrocompatibilidade.
export function isProperty(house) {
    return !!house && (house.type === 'port' || house.type === 'property') && !!house.price;
}

// Frota OPERACIONAL do jogador (desconta rebocadores em docagem).
export function operationalTugs(player) {
    const port = player.portTugs - player.dockedTugs.port;
    const ocean = player.hasOceanTug && !player.dockedTugs.ocean;
    const tuglord = player.hasTuglord && !player.dockedTugs.tuglord;
    return { port, ocean, tuglord, total: port + (ocean ? 1 : 0) + (tuglord ? 1 : 0) };
}

// Formatação monetária pt-BR consistente (ex: 30000 -> "30.000").
export function fmt(n) {
    return Number(n || 0).toLocaleString('pt-BR');
}

// ========== EXPORTED LOGIC FUNCTIONS ==========

export function addPlayer() {
    const playerNum = gameState.players.length + 1;
    if (playerNum > 6) {
        UI.showNotification('Máximo de 6 jogadores!');
        return;
    }

    const player = {
        id: playerNum,
        name: `Jogador ${playerNum}`,
        icon: playerIcons[playerNum - 1],
        color: playerColors[playerNum - 1],
        money: REGRAS.DINHEIRO_INICIAL, // F$ 30 mi inicial
        position: 0,
        properties: [],
        rolled: false,
        rollValue: 0,
        portTugs: 0,
        hasOceanTug: false,
        hasTuglord: false,
        dockedTugs: { port: 0, ocean: false, tuglord: false, turnsRemaining: 0, inYard: false, retest: false },
        workshopVisits: {},
        workshopBonusPaid: {},
        tugCoupon: false,
        unisalvageStep: 0,       // etapas da UNISALVAGE aprovadas (0 a REGRAS.UNISALVAGE_ETAPAS)
        certTuglords: false,     // Certificado Tuglords (libera Oceânico e Reboque Oceânico)
        certificates: [],
        loans: [],
        stocks: {},
        bankruptcyStage: 0,
        isEliminated: false,
        skipNextTurn: false,
        skipNextRent: false
    };

    gameState.players.push(player);
    UI.renderPlayerSetupList();

    if (gameState.players.length >= 2) {
        const btn = document.getElementById('startOrderBtn');
        if (btn) btn.disabled = false;
    }
}

export function updatePlayerName(playerId, newName) {
    const player = gameState.players.find(p => p.id === playerId);
    if (player) {
        player.name = newName || `Jogador ${playerId}`;
    }
}

export function removePlayer(playerId) {
    gameState.players = gameState.players.filter(p => p.id !== playerId);
    UI.renderPlayerSetupList();

    if (gameState.players.length < 2) {
        const btn = document.getElementById('startOrderBtn');
        if (btn) btn.disabled = true;
    }
}

export function startOrderRolls() {
    let currentPlayerIndex = 0;
    const rollInterval = setInterval(() => {
        if (currentPlayerIndex >= gameState.players.length) {
            clearInterval(rollInterval);
            determineOrder();
            return;
        }

        const player = gameState.players[currentPlayerIndex];
        const rollValue = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
        player.rolled = true;
        player.rollValue = rollValue;

        // Animate dice
        const rollElement = document.getElementById(`roll-${player.id}`);
        if (rollElement) {
            let animCount = 0;
            const animInterval = setInterval(() => {
                const rand = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
                rollElement.textContent = `🎲 ${rand}`;
                Audio.playDice(); // som de dados rolando, como na jogada normal
                animCount++;

                if (animCount > 10) {
                    clearInterval(animInterval);
                    rollElement.textContent = `🎲 ${rollValue}`;
                    rollElement.style.animation = 'pulse 0.5s';
                    Audio.playMoney(); // valor fixado para este jogador
                }
            }, 100);
        }

        currentPlayerIndex++;
    }, 1500);
}

export function determineOrder() {
    gameState.playerOrder = [...gameState.players].sort((a, b) => b.rollValue - a.rollValue);

    const orderList = document.getElementById('orderList');
    if (orderList) {
        orderList.innerHTML = gameState.playerOrder.map((player, index) => `
            <div class="order-item" style="border-left: 4px solid ${player.color};">
                <span style="font-size: 1.5rem; width: 40px;">${index + 1}º</span>
                <span style="font-size: 1.5rem;">${player.icon}</span>
                <span style="flex: 1; font-weight: 600;">${player.name}</span>
                <span style="font-weight: 700; color: var(--accent-gold);">🎲 ${player.rollValue}</span>
            </div>
        `).join('');
    }

    const orderResults = document.getElementById('orderResults');
    const setupActions = document.querySelector('.setup-actions');
    if (orderResults) orderResults.style.display = 'block';
    if (setupActions) setupActions.style.display = 'none';
}

export function startGame() {
    gameState.players = gameState.playerOrder;
    gameState.phase = 'playing';

    // Regra: o dono inicial de TODO ativo (portos, oficinas, serviços e o
    // Estaleiro) é sempre o Banco (owner undefined = Banco). Zera qualquer dono
    // ou ação remanescente antes da partida.
    gameState.houses.forEach(h => {
        h.owner = undefined; if (h.stocks) h.stocks = 0;
        // Regras v2: preços das lojas vêm da config central REGRAS.
        if (h.type === 'tug_purchase') h.price = h.tugType === 'ocean' ? REGRAS.PRECO_OCEANICO : REGRAS.PRECO_PORTUARIO;
        // Aluguel/arrendamento a partir da tabela original x ALUGUEL_MULT (sem acumular entre partidas).
        if (h.rent) {
            if (!h.baseRent) h.baseRent = h.rent.slice();
            h.rent = h.baseRent.map(v => Math.round(v * REGRAS.ALUGUEL_MULT));
        }
    });
    gameState.currentRound = 1;
    gameState.currentPlayerIndex = 0;

    const setupScreen = document.getElementById('setupScreen');
    const gameScreen = document.getElementById('gameScreen');
    if (setupScreen) setupScreen.style.display = 'none';
    if (gameScreen) gameScreen.style.display = 'block';

    UI.renderBoard();
    UI.renderPlayersPanel();
    UI.updateTurnDisplay();

    UI.showNotification(`${gameState.players[0].icon} ${gameState.players[0].name} começa!`);

    // Som de início de partida (arpejo de sucesso).
    Audio.playSuccess();

    // Garante o fundo musical (idempotente — já deve estar tocando desde a
    // tela inicial, mas reforça caso o áudio só inicialize agora).
    Audio.startMusic();

    commentate('start');
}

export function rollDice() {
    if (gameState.diceRolled) return;

    const diceDisplay = document.getElementById('diceDisplay');

    // Ao lançar, o tabuleiro JÁ entra em modo 3D (inclina) e os dados 3D
    // rolam no centro do tabuleiro.
    UI.enterCinematic(true);
    UI.renderDice3D(diceDisplay, 1, 1, true); // dois cubos girando
    FX.haptic(15);

    let frames = 0;
    const interval = setInterval(() => {
        Audio.playDice();
        frames++;

        if (frames > TIMING.diceFrames) {
            clearInterval(interval);
            const final1 = Math.floor(Math.random() * 6) + 1;
            const final2 = Math.floor(Math.random() * 6) + 1;
            const total = final1 + final2;
            const isDouble = final1 === final2;

            // Os dados "pousam" no resultado.
            UI.settleDice3D(diceDisplay, final1, final2, total, isDouble);
            FX.haptic(isDouble ? [40, 40, 40] : 35);

            const roller = gameState.players[gameState.currentPlayerIndex];
            commentate(isDouble ? 'double' : 'roll', { player: roller.name });
            console.log(`🎲 Dados: ${final1} + ${final2} = ${total}`);

            // Trava a rolagem e o botão imediatamente, mas dá uma pausa para o
            // jogador enxergar o resultado antes de o peão começar a andar.
            gameState.diceRolled = true;
            const btn = document.getElementById('rollDiceBtn');
            if (btn) {
                btn.disabled = true;
                btn.style.opacity = '0.5';
            }

            setTimeout(() => movePlayer(total), TIMING.diceSettle);
        }
    }, TIMING.diceFrame);
}

export function movePlayer(spaces) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.isEliminated) return; // Proteção
    if (!spaces) return; // 0 casas: nada a fazer

    const len = gameState.houses.length;
    const direction = spaces >= 0 ? 1 : -1; // suporta retroceder (eventos)
    const totalSteps = Math.abs(spaces);
    const startPosition = currentPlayer.position;
    let currentStep = 0;

    const rollBtn = document.getElementById('rollDiceBtn');
    const endBtn = document.getElementById('endTurnBtn');
    if (rollBtn) rollBtn.disabled = true;
    if (endBtn) endBtn.disabled = true;

    // Modo cinematográfico: tabuleiro inclina, aproxima e a câmera segue o pino.
    const cine = UI.enterCinematic();
    const ORBIT_MS = 1400; // duração do zoom-in 360° no peão

    // A sequência de pulos pelas casas (zoom-out mostrando o tabuleiro).
    const beginStepping = () => {
        const moveInterval = setInterval(stepTick, TIMING.moveStep);
        function stepTick() {
            if (currentStep >= totalSteps) {
                clearInterval(moveInterval);

                const finalPosition = currentPlayer.position;
                const house = gameState.houses[finalPosition];

                const currentHouseName = document.getElementById('currentHouseName');
                if (currentHouseName) currentHouseName.textContent = house.name;

                // Clímax da chegada: pulso na casa de destino + vibração.
                UI.highlightLanding(finalPosition);
                FX.haptic(30);
                UI.showNotification(`${currentPlayer.icon} chegou em ${house.name}!`);
                // P3: parar na Largada (avançando) também paga o frete do oceânico.
                if (direction === 1 && finalPosition === 0 && totalSteps > 0) payOceanFreight(currentPlayer);

                // Deixa a câmera repousar no destino e então volta à vista normal.
                if (cine) setTimeout(() => UI.exitCinematic(), 750);

                if (endBtn) endBtn.disabled = false;

                setTimeout(() => showContextualActions(house), TIMING.arrivalPopup);
                return;
            }

            currentStep++;
            // Módulo seguro para posições negativas ao retroceder.
            currentPlayer.position = (((startPosition + direction * currentStep) % len) + len) % len;
            Audio.playMove();
            FX.haptic(8); // tique sutil a cada casa

            const stepHouse = gameState.houses[currentPlayer.position];

            // Passagem pela partida (apenas avançando)
            if (direction === 1 && currentPlayer.position === 0 && currentStep < totalSteps) {
                credit(currentPlayer, REGRAS.SALARIO_PARTIDA, 'Salário');
                FX.flash('rgba(34,197,94,0.25)', 300);
                UI.showNotification(`🏁 ${currentPlayer.name} passou pela Partida! +${fm(REGRAS.SALARIO_PARTIDA)}`);
                chargeShipyardLapFee(currentPlayer);
                payOceanFreight(currentPlayer);
                commentate('pass', { player: currentPlayer.name });
                UI.renderPlayersPanel();
            }

            UI.updatePlayerPositions();

            // Câmera segue o pino e ele pula a casa.
            if (cine) {
                UI.cameraFollow(currentPlayer.position);
                UI.hopActivePawn();
            }

            const currentHouseName = document.getElementById('currentHouseName');
            if (currentHouseName) currentHouseName.textContent = `→ ${stepHouse.name}`;
        }

        setTimeout(() => {
            UI.renderPlayersPanel();
        }, totalSteps * TIMING.moveStep + 500);
    };

    if (cine) {
        // 1) Zoom-in com giro de 360° no peão...
        UI.cameraOrbit(startPosition);
        // 2) ...depois zoom-out para a vista do tabuleiro e começa a pular as casas.
        setTimeout(() => {
            UI.endOrbit();
            UI.cameraFollow(startPosition);
            beginStepping();
        }, ORBIT_MS);
    } else {
        beginStepping();
    }
}

// ========== GAME LOGIC ACTIONS ==========

export function showLoanOptions() {
    if (!REGRAS.EMPRESTIMO_ATIVO) { UI.showNotification('🚫 Empréstimos desativados nesta versão'); return; }
    UI.openPanel('panelBank');
    UI.showNotification('💳 Escolha o valor do empréstimo');
}

// Avança o índice para o próximo jogador ATIVO (pulando eliminados),
// incrementando a rodada ao dar a volta. Protegido contra loop infinito.
function advanceToNextActivePlayer() {
    const total = gameState.players.length;
    let guard = 0;
    do {
        gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % total;
        if (gameState.currentPlayerIndex === 0) gameState.currentRound++;
        guard++;
    } while (gameState.players[gameState.currentPlayerIndex].isEliminated && guard <= total);
}

export function endTurn() {
    if (!gameState.diceRolled) {
        UI.showNotification('⚠️ Role os dados primeiro!');
        return;
    }

    // Vitória "TugLord Supremo" pode ter sido atingida durante o turno.
    if (checkVictory()) return;

    const actionsDiv = document.getElementById('contextualActions');
    if (actionsDiv) actionsDiv.style.display = 'none';

    advanceToNextActivePlayer();
    if (checkRoundLimit()) return;
    Engage.onRoundStart();
    let currentPlayer = gameState.players[gameState.currentPlayerIndex];

    // Empréstimos vencendo no início do turno (pode liquidar/eliminar o jogador).
    processLoans(currentPlayer);
    if (gameState.phase === 'ended') return;

    // Se o jogador faliu por inadimplência, passa ao próximo ativo.
    let guard = 0;
    while (currentPlayer.isEliminated && guard < gameState.players.length) {
        advanceToNextActivePlayer();
        currentPlayer = gameState.players[gameState.currentPlayerIndex];
        processLoans(currentPlayer);
        if (gameState.phase === 'ended') return;
        guard++;
    }

    // Skip Turn Check
    if (currentPlayer.skipNextTurn) {
        currentPlayer.skipNextTurn = false;

        // Atualiza a UI primeiro (updateTurnDisplay reseta diceRolled = false)...
        UI.updateTurnDisplay();
        UI.updatePlayerPositions();
        UI.renderPlayersPanel();

        // ...e SÓ DEPOIS bloqueia a jogada, senão o reset acima reativaria os dados.
        gameState.diceRolled = true;
        const rollBtn = document.getElementById('rollDiceBtn');
        if (rollBtn) {
            rollBtn.disabled = true;
            rollBtn.style.opacity = '0.5';
        }

        UI.showNotification(`⏸️ ${currentPlayer.name} perdeu o turno! Clique em Finalizar Turno.`);
        return;
    }

    // Dividends
    if (currentPlayer.properties.length > 0 && !currentPlayer.isEliminated) {
        payDividends(currentPlayer);
    }

    // Docking Check
    checkDockingStatus();

    UI.updateTurnDisplay();
    UI.updatePlayerPositions();
    UI.renderPlayersPanel();
}

export function checkDockingStatus() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const d = currentPlayer.dockedTugs;

    if (d.turnsRemaining > 0) {
        d.turnsRemaining--;

        if (d.turnsRemaining === 0) {
            if (d.inYard) {
                // Segue no dique: só sai ao cair num porto próprio.
                UI.showNotification(`🏗️ ${currentPlayer.name}: rebocador segue no dique do Estaleiro`);
            } else if (d.retest) {
                // Regras v2: depois de 3 turnos preso, refaz a vistoria LOYDS TUGSTER.
                setTimeout(() => presentInspection('retest'), 600);
            } else {
                releaseDockedTugs(currentPlayer);
                UI.showNotification(`✅ ${currentPlayer.name}: Rebocadores liberados!`);
            }
        } else {
            UI.showNotification(`⚓ ${currentPlayer.name}: rebocador preso (${d.turnsRemaining} turnos)`);
        }
    } else if (d.inYard) {
        UI.showNotification(`🏗️ ${currentPlayer.name}: rebocador no dique (sai ao cair num porto seu)`);
    }
}

// ========== REGRAS v2 ==========

// Entrada de dinheiro com moedas voando (som de moeda com moderação).
export function credit(player, amount, label) {
    if (!player || !amount) return;
    amount = Math.round(amount * Engage.payoutMult(label));
    player.money += amount;
    Engage.onCredit(player, amount, label);
    FX.coins(amount, `${label ? label + ' ' : ''}+${fm(amount)}`);
    Audio.playCoin();
    UI.renderPlayersPanel();
}

// Economia P3: frete do Rebocador Oceânico ao passar ou parar na Largada.
// Passa por credit(), então ganha o bônus da reta final.
export function payOceanFreight(player) {
    const v = REGRAS.OCEANICO_FRETE_LARGADA;
    if (!v || !player || !player.hasOceanTug) return;
    credit(player, v, 'Frete');
    setTimeout(() => UI.showNotification(`🌊 Frete do Rebocador Oceânico: ${player.name} recebeu ${fm(Math.round(v * Engage.payoutMult('Frete')))}`), 700);
}

function hasSafetyCerts(player) {
    return CERTIFICATES.every(c => player.certificates.includes(c));
}

function dockedCount(player) {
    const d = player.dockedTugs;
    return (d.port || 0) + (d.ocean ? 1 : 0) + (d.tuglord ? 1 : 0);
}

export function releaseDockedTugs(player) {
    const d = player.dockedTugs;
    d.port = 0; d.ocean = false; d.tuglord = false;
    d.turnsRemaining = 0; d.inYard = false; d.retest = false;
    UI.renderPlayersPanel();
}

function shipyardOwner(player) {
    const yard = gameState.houses.find(h => h.name.includes('Estaleiro'));
    const owner = yard && yard.owner !== undefined ? gameState.players.find(p => p.id === yard.owner) : null;
    return owner && owner.id !== player.id ? owner : null;
}

// Estadia no dique: cobrada a cada volta, por rebocador docado.
function chargeShipyardLapFee(player) {
    if (!player.dockedTugs.inYard) return;
    const n = dockedCount(player);
    if (n <= 0) return;
    let fee = REGRAS.ESTALEIRO_ESTADIA_VOLTA * n;
    const owner = shipyardOwner(player);
    const isOwnYard = !owner && gameState.houses.some(h => h.name.includes('Estaleiro') && h.owner === player.id);
    if (isOwnYard) return; // dique próprio: sem estadia
    if (!owner) fee = bankCap(player, fee);
    player.money -= fee;
    if (owner) { owner.money += fee; FX.coins(fee, `${owner.name} +${fm(fee)}`); }
    setTimeout(() => UI.showNotification(`🏗️ Estadia no dique: ${player.name} pagou ${fm(fee)} (${n} rebocador${n > 1 ? 'es' : ''})`), 900);
    UI.renderPlayersPanel();
}

// Manobra do Porto: valor base x nº de portuários operacionais.
// Manobra só rende com REGRAS.MANOBRA_CERTS_SEGURANCA certificado(s) de segurança.
function safetyCount(player) {
    return CERTIFICATES.filter(c => player.certificates.includes(c)).length;
}
export function canManeuver(player) {
    return !REGRAS.MANOBRA_EXIGE_CERTIFICADOS || safetyCount(player) >= REGRAS.MANOBRA_CERTS_SEGURANCA;
}

// Oceânico exige o Certificado Tuglords (UNISALVAGE).
export function canHaveOcean(player) {
    return REGRAS.OCEANICO_EXIGE_CERT_TUGLORDS ? !!player.certTuglords : hasSafetyCerts(player);
}

// Reboque Oceânico grande: Oceânico operacional + Certificado Tuglords.
export function canOceanSalvage(player) {
    return operationalTugs(player).ocean && !!player.certTuglords;
}

const NO_CERT_MANEUVER = REGRAS.MANOBRA_CERTS_SEGURANCA === 1 ? 'Sem certificado de segurança, sem manobra.' : 'Sem os ' + REGRAS.MANOBRA_CERTS_SEGURANCA + ' certificados de segurança, sem manobra.';

export function maneuverPayout(player) {
    if (!canManeuver(player)) return 0;
    const n = Math.min(Math.max(0, operationalTugs(player).port), REGRAS.MANOBRA_MAX_PORTUARIOS);
    return Math.round(REGRAS.MANOBRA_BASE * n * Engage.eventMult('manobraMult'));
}

function salvagePrize() {
    const p = REGRAS.SALVATAGEM_PREMIOS;
    return Math.round(p[Math.floor(Math.random() * p.length)] * Engage.eventMult('salvamentoMult'));
}

// Rebocador oceânico: só com os 4 certificados de segurança (sem TugLord).
function giveOceanTug(player) {
    if (player.hasOceanTug || !canHaveOcean(player)) {
        const why = player.hasOceanTug ? 'já tem Oceânico' : 'sem o Certificado Tuglords';
        UI.showNotification(`🌊 ${player.name} ${why}: recebeu ${fm(CARD_TUG_CASH.ocean_tug)}`);
        credit(player, CARD_TUG_CASH.ocean_tug, 'Oceânico em dinheiro');
        return false;
    }
    player.hasOceanTug = true;
    return true;
}

// UNISALVAGE: etapa 1 = quiz de acesso; etapas 2 e 3 = mais um quiz cada.
// Reprovou: a mesma etapa é refeita na próxima visita (o progresso não se perde).
const UNISALVAGE_STEP_LABEL = ['Quiz de acesso', 'Quiz de formação 1', 'Quiz de formação 2'];

export function presentUnisalvage() {
    const player = gameState.players[gameState.currentPlayerIndex];
    const total = REGRAS.UNISALVAGE_ETAPAS;
    const step = Math.min(player.unisalvageStep || 0, total - 1);
    const pool = UNISALVAGE_QUESTIONS[Math.min(step, UNISALVAGE_QUESTIONS.length - 1)];
    const q = pool[Math.floor(Math.random() * pool.length)];
    // Taxa da prova: paga antes do quiz, aprovado ou não (ao Banco).
    const fee = REGRAS.UNISALVAGE_TAXA_PROVA;
    if (fee > 0 && !handleMandatoryPayment(player, fee, 'Taxa de prova UNISALVAGE')) return;
    gameState._unisalvage = { correct: q.correct, options: [...q.options].sort(() => Math.random() - 0.5) };
    const dots = Array.from({ length: total }, (_, i) => `<span style="display:inline-block; width:1.4rem; height:1.4rem; line-height:1.4rem; border-radius:50%; margin:0 0.2rem; font-weight:800; background:${i < step ? '#22c55e' : (i === step ? '#fbbf24' : 'rgba(255,255,255,0.1)')}; color:#0f172a;">${i + 1}</span>`).join('');
    const body = `
        <p style="color:#94a3b8;">Escola de salvatagem: passe nas ${total} etapas (uma por visita) para ganhar o <strong style="color: var(--accent-gold);">Certificado Tuglords</strong>.</p>
        <div style="text-align:center; margin:0.5rem 0;">${dots}</div>
        <p style="font-weight:700; color:#fbbf24;">Etapa ${step + 1} de ${total}: ${UNISALVAGE_STEP_LABEL[step] || 'Quiz'}</p>
        <p style="color:#94a3b8; font-size:0.85rem;">Taxa da prova paga: ${fm(fee)}</p>
        <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;"><p>${q.question}</p></div>
        <div style="display:grid; gap:0.5rem;">
            ${gameState._unisalvage.options.map((opt, i) => `<button class="btn-secondary" onclick="handleUnisalvageAnswer(${i})">${opt}</button>`).join('')}
        </div>`;
    UI.showModal('🛟 UNISALVAGE', body, [], false);
}

// Formatura UNISALVAGE: confete (leve em TV antiga) + um único som de certificado.
function showGraduation(player, ganhouOceanico) {
    FX.confetti(3000);
    Audio.playCertificate();
    commentate('win', { player: player.name });
    UI.showModal('🎓 Formatura UNISALVAGE', `
        <div style="text-align:center;">
            <div class="fx-trophy" style="font-size:4rem;">🎓</div>
            <h2 style="color: var(--accent-gold); margin:0.25rem 0;">${player.icon} ${player.name}</h2>
            <p style="font-size:1.15rem; font-weight:800; color:#fbbf24;">CERTIFICADO TUGLORDS</p>
            ${ganhouOceanico ? `<div class="fx-trophy" style="font-size:3rem; margin-top:0.5rem;">🌊🚢</div><p style="font-size:1.1rem; font-weight:800; color:#38bdf8;">Presente da formatura: um Rebocador Oceânico grátis!</p>` : ''}
            <p style="color:#94a3b8;">Autorizado para Rebocadores Oceânicos. Agora o Reboque Oceânico paga de ${fm(Math.min.apply(null, REGRAS.SALVATAGEM_PREMIOS))} a ${fm(Math.max.apply(null, REGRAS.SALVATAGEM_PREMIOS))}!</p>
            <button class="btn-primary" style="width:100%; margin-top:1rem;" onclick="closeModal()">⚓ Partiu oceano!</button>
        </div>`, [], false);
    UI.showNotification(`🛟 ${player.name} conquistou o Certificado Tuglords!`);
}

export function handleUnisalvageAnswer(i) {
    const u = gameState._unisalvage;
    if (!u) return;
    gameState._unisalvage = null;
    UI.closeModal();
    const player = gameState.players[gameState.currentPlayerIndex];
    const total = REGRAS.UNISALVAGE_ETAPAS;
    if (u.options[i] === u.correct) {
        player.unisalvageStep = (player.unisalvageStep || 0) + 1;
        if (player.unisalvageStep >= total) {
            player.unisalvageStep = total;
            player.certTuglords = true;
            let ganhouOceanico = false;
            if (REGRAS.OCEANICO_NA_FORMATURA && !player.hasOceanTug) { player.hasOceanTug = true; ganhouOceanico = true; }
            showGraduation(player, ganhouOceanico);
            Engage.award(player, 'formado');
        } else {
            Audio.playSuccess();
            UI.showNotification(`✅ UNISALVAGE: etapa ${player.unisalvageStep}/${total} aprovada! Volte para a próxima.`);
        }
    } else {
        Audio.playError();
        UI.showNotification(`❌ UNISALVAGE: reprovado. Refaça a etapa ${(player.unisalvageStep || 0) + 1} na próxima visita. Resposta: ${u.correct}`);
    }
    UI.renderPlayersPanel();
}

// Vistoria LOYDS TUGSTER. mode: 'square' (casa), 'yard' (saída do estaleiro),
// 'retest' (refaz depois de 3 turnos preso).
export function presentInspection(mode) {
    const q = INSPECTION_QUESTIONS[Math.floor(Math.random() * INSPECTION_QUESTIONS.length)];
    gameState._inspection = { mode, correct: q.correct, options: [...q.options].sort(() => Math.random() - 0.5) };
    const intro = mode === 'square'
        ? 'O classificador LOYDS TUGSTER vai vistoriar seu rebocador.'
        : mode === 'yard' ? 'Saída do Estaleiro: vistoria de classe obrigatória antes de voltar ao porto.'
            : 'Fim dos 3 turnos: o rebocador refaz a vistoria LOYDS TUGSTER.';
    const body = `
        <p style="color:#94a3b8;">${intro}</p>
        <div style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
            <p>${q.question}</p>
        </div>
        <div style="display:grid; gap:0.5rem;">
            ${gameState._inspection.options.map((opt, i) => `<button class="btn-secondary" onclick="handleInspectionAnswer(${i})">${opt}</button>`).join('')}
        </div>`;
    UI.showModal('📋 Vistoria LOYDS TUGSTER', body, [], false);
}

export function handleInspectionAnswer(i) {
    const insp = gameState._inspection;
    if (!insp) return;
    gameState._inspection = null;
    UI.closeModal();
    const player = gameState.players[gameState.currentPlayerIndex];
    const d = player.dockedTugs;
    const ok = insp.options[i] === insp.correct;
    const turns = REGRAS.VISTORIA_TURNOS_PRESO;

    if (insp.mode === 'square') {
        if (ok) {
            UI.showNotification(`✅ Vistoria aprovada! Rebocador em classe.`);
            credit(player, REGRAS.VISTORIA_PREMIO, 'Vistoria');
        } else {
            // Prende 1 rebocador operacional (prioridade: portuário).
            const op = operationalTugs(player);
            if (op.port > 0) d.port++;
            else if (op.ocean) d.ocean = true;
            else if (op.tuglord) d.tuglord = true;
            if (!d.inYard) d.turnsRemaining = turns;
            Audio.playError();
            UI.showNotification(`❌ Reprovado! Rebocador preso por ${turns} turnos. Resposta: ${insp.correct}`);
        }
    } else {
        if (ok) {
            const port = gameState.houses[player.position];
            releaseDockedTugs(player);
            UI.showNotification(`✅ Vistoria aprovada! Rebocador liberado${port && port.type === 'port' ? ' para o ' + port.name : ''}.`);
            Audio.playSuccess();
        } else {
            d.inYard = false;
            d.retest = true;
            d.turnsRemaining = turns;
            Audio.playError();
            UI.showNotification(`❌ Reprovado! Preso ${turns} turnos e depois refaz a vistoria. Resposta: ${insp.correct}`);
        }
    }
    UI.renderPlayersPanel();
}

export function handleShipyard(space) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const owner = space.owner !== undefined ? gameState.players.find(p => p.id === space.owner) : null;
    const op = operationalTugs(currentPlayer);
    if (op.total <= 0) return;

    // Regras v2: taxa ao cair (dique próprio não paga) e estadia por volta.
    const ownYard = owner && owner.id === currentPlayer.id;
    const dockingCost = ownYard ? 0 : REGRAS.ESTALEIRO_TAXA;

    let tugOptions = [];
    if (op.port > 0) tugOptions.push({ label: `⚓ Portuário (${op.port})`, value: 'port' });
    if (op.ocean) tugOptions.push({ label: `🌊 Oceânico`, value: 'ocean' });
    if (op.tuglord) tugOptions.push({ label: `⭐ TugLord`, value: 'tuglord' });

    const modalBody = `
        <div style="background: rgba(239, 68, 68, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #ef4444;">
            <p style="color: #f87171; font-weight: 600; margin: 0;">⚠️ DOCAGEM NO ESTALEIRO</p>
        </div>
        <p style="color: #e0e0e0;">Taxa: ${fm(dockingCost)} (${ownYard ? 'dique próprio' : (owner ? owner.name : 'Banco')})</p>
        <p style="color: #94a3b8; font-size: 0.9rem;">O rebocador fica no dique e paga ${fm(REGRAS.ESTALEIRO_ESTADIA_VOLTA)} por volta. Só sai quando você cair num porto seu, depois da vistoria LOYDS TUGSTER.</p>
        <div style="display: grid; gap: 0.75rem; margin-top: 1rem;">
            ${tugOptions.map(tug => `
                <button class="btn-secondary" onclick="executeDocking('${tug.value}', ${dockingCost}, ${owner && !ownYard ? owner.id : 'null'})">
                    ${tug.label}
                </button>
            `).join('')}
        </div>
    `;

    UI.showModal('🏭 Estaleiro', modalBody, [], false);
}

export function executeDocking(tugType, cost, ownerId) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const owner = ownerId ? gameState.players.find(p => p.id === ownerId) : null;

    if (cost > 0 && !handleMandatoryPayment(currentPlayer, cost, "Docagem", owner)) {
        UI.closeModal();
        return;
    }

    const d = currentPlayer.dockedTugs;
    if (tugType === 'port') d.port = (d.port || 0) + 1;
    else if (tugType === 'ocean') d.ocean = true;
    else if (tugType === 'tuglord') d.tuglord = true;
    d.inYard = true;
    d.retest = false;
    d.turnsRemaining = 0;

    UI.showNotification(`🏗️ Rebocador no dique! Sai ao cair num porto seu.`);
    UI.renderPlayersPanel();
    UI.closeModal();
}

export function buyProperty(space) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.money < space.price) {
        UI.showNotification('❌ Saldo insuficiente!');
        Audio.playError();
        return;
    }

    currentPlayer.money -= space.price;
    space.owner = currentPlayer.id;
    currentPlayer.properties.push(space.name);

    UI.showNotification(`✅ ${space.name} adquirido!`);
    Audio.playBuy();
    commentate('buy', { player: currentPlayer.name, porto: space.name });
    Audio.playSuccess();
    FX.flash('rgba(34,197,94,0.22)', 300);
    FX.haptic([25, 30]);
    UI.renderPlayersPanel();
    UI.updatePlayerPositions(); // Updates ownership view

    // Oficinas: ao adquirir, o novo dono já presta o exame técnico da área
    // para emitir (e receber) o certificado. Sem aprovação não há certificado;
    // se reprovar, pode refazer o exame numa próxima visita.
    if (space.type === 'workshop' && space.certificate && !currentPlayer.certificates.includes(space.certificate)) {
        presentExam(space.certificate, space.name, true);
        return;
    }

    UI.closeModal();

    const actionsDiv = document.getElementById('contextualActions');
    if (actionsDiv) actionsDiv.style.display = 'none';
}

export function buyTug(space) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const tugType = space.tugType;
    const price = space.price;
    const needed = tugType === 'port' && currentPlayer.tugCoupon ? Math.round(price * (1 - REGRAS.CUPOM_DESCONTO)) : price;

    if (currentPlayer.money < needed) {
        UI.showNotification('❌ Saldo insuficiente!');
        return;
    }

    if (tugType === 'ocean') {
        if (currentPlayer.hasOceanTug) {
            UI.showNotification('⚠️ Já possui Rebocador Oceânico!');
            return;
        }

        // Regras v2: Oceânico só com o Certificado Tuglords (UNISALVAGE).
        if (!canHaveOcean(currentPlayer)) {
            UI.showNotification('⚠️ Requer o Certificado Tuglords (passe 3x na UNISALVAGE)!');
            return;
        }

    }

    // Regras v2: cupom de 50% no próximo portuário.
    let finalPrice = price;
    if (tugType === 'port' && currentPlayer.tugCoupon) {
        finalPrice = Math.round(price * (1 - REGRAS.CUPOM_DESCONTO));
        currentPlayer.tugCoupon = false;
        UI.showNotification(`🎟️ Cupom aplicado: ${fm(finalPrice)}`);
    }
    currentPlayer.money -= finalPrice;

    if (tugType === 'port') currentPlayer.portTugs++;
    else if (tugType === 'ocean') currentPlayer.hasOceanTug = true;

    UI.showNotification(`⚓ Rebocador adquirido!`);
    UI.renderPlayersPanel();
    const actionsDiv = document.getElementById('contextualActions');
    if (actionsDiv) actionsDiv.style.display = 'none';
}

// Economia P2: pagamento ao Banco limitado a TETO_PAGTO_BANCO_PCT_CAIXA do caixa atual.
// Não vale para aluguel, desafio entre jogadores, compras nem empréstimo.
export function bankCap(player, amount) {
    const pct = REGRAS.TETO_PAGTO_BANCO_PCT_CAIXA;
    if (!pct) return amount;
    return Math.min(amount, Math.max(0, Math.floor(player.money * pct)));
}

export function handleMandatoryPayment(player, amount, reason, recipient = null) {
    if (!recipient && /imposto|taxa/i.test(reason || '')) amount = Math.round(amount * Engage.eventMult('taxaMult'));
    if (!recipient && !/empr[ée]stimo|desafio/i.test(reason || '')) {
        const capped = bankCap(player, amount);
        // Captura o valor original já formatado: `amount` é reatribuído logo abaixo
        // e o setTimeout leria o valor com teto (bug "F$ 2 mi em vez de F$ 2 mi").
        if (capped < amount) {
            const msgTeto = `🛡️ Teto do Banco: ${player.name} paga no máximo ${Math.round(REGRAS.TETO_PAGTO_BANCO_PCT_CAIXA * 100)}% do caixa (${fm(capped)} em vez de ${fm(amount)})`;
            setTimeout(() => UI.showNotification(msgTeto), 1200);
        }
        amount = capped;
    }
    if (player.money >= amount) {
        player.money -= amount;
        if (recipient) recipient.money += amount;
        if (recipient) FX.coins(amount, `${recipient.name} +${fm(amount)}`);
        UI.showNotification(`💸 ${player.name} pagou ${fm(amount)} (${reason})`);
        Audio.playCoin();

        // Narrador: comenta conforme o motivo do pagamento.
        const r = (reason || '').toLowerCase();
        if (r.includes('aluguel')) commentate('rent', { player: player.name, owner: recipient ? recipient.name : 'o dono' });
        else if (r.includes('imposto') || r.includes('taxa')) commentate('tax', { player: player.name });
        else if (r.includes('docagem')) commentate('dock', { player: player.name });

        // Drama proporcional: pagamentos pesados (>=2k ou >=25% do caixa) sacodem a tela.
        const heavy = amount >= 2000 || amount >= player.money * 0.25;
        if (heavy) {
            FX.shake();
            FX.flash('rgba(239,68,68,0.28)', 350);
            FX.haptic([30, 40, 30]);
        } else {
            FX.haptic(20);
        }

        // Alerta de maré baixa no caixa.
        if (player.money < 3000) commentate('lowcash', { player: player.name });

        UI.renderPlayersPanel();
        return true;
    } else {
        initiateArrest(player, amount, reason, recipient);
        return false;
    }
}

// Economia P2: venda ao Banco paga LIQUIDACAO_TAXA do preço de loja.
export function liqValue(type, prop) {
    const t = REGRAS.LIQUIDACAO_TAXA;
    if (type === 'property') return Math.floor(prop.price * t);
    if (type === 'port_tug') return Math.floor(REGRAS.PRECO_PORTUARIO * t);
    if (type === 'ocean_tug') return Math.floor(REGRAS.PRECO_OCEANICO * t);
    if (type === 'tuglord') return Math.floor(tuglordStorePrice() * t);
    return 0;
}

// Preço de loja do TugLord: custo de comissionamento no Estaleiro (tuglordBuildCost).
export function tuglordStorePrice() {
    const h = gameState.houses.find(x => x.tuglordBuildCost);
    return h ? h.tuglordBuildCost : 0;
}

export function initiateArrest(player, debtAmount, reason, creditor) {
    player.bankruptcyStage = 1;

    let totalAssetValue = 0;
    let assetsList = [];

    player.properties.forEach(propName => {
        const prop = gameState.houses.find(h => h.name === propName);
        const val = Math.floor(prop.price * REGRAS.LIQUIDACAO_TAXA);
        totalAssetValue += val;
        assetsList.push({ type: 'property', name: propName, value: val, asset: prop });
    });

    for (let i = 0; i < player.portTugs; i++) {
        totalAssetValue += liqValue('port_tug');
        assetsList.push({ type: 'port_tug', name: 'Reb. Portuário', value: liqValue('port_tug') });
    }
    if (player.hasOceanTug && REGRAS.LIQUIDACAO_INCLUI_OCEANICO) {
        totalAssetValue += liqValue('ocean_tug');
        assetsList.push({ type: 'ocean_tug', name: 'Reb. Oceânico', value: liqValue('ocean_tug') });
    }
    if (player.hasTuglord) {
        totalAssetValue += liqValue('tuglord');
        assetsList.push({ type: 'tuglord', name: 'TugLord', value: liqValue('tuglord') });
    }

    const totalAvailable = player.money + totalAssetValue;

    if (totalAvailable >= debtAmount) {
        forceLiquidation(player, debtAmount, assetsList, creditor);
    } else {
        declareBankruptcy(player, creditor);
    }
}

export function forceLiquidation(player, debtAmount, assetsList, creditor) {
    UI.showModal('⚖️ Liquidação Forçada', `
        <p>Seus ativos serão liquidados para cobrir a dívida de ${fm(debtAmount)}.</p>
    `);

    let amountRaised = player.money;

    for (let asset of assetsList) {
        if (amountRaised >= debtAmount) break;

        if (asset.type === 'property') {
            asset.asset.owner = undefined;
            asset.asset.stocks = 0;
            player.properties = player.properties.filter(p => p !== asset.name);
            if (player.stocks[asset.name]) delete player.stocks[asset.name];
        } else if (asset.type === 'port_tug') {
            player.portTugs--;
        } else if (asset.type === 'ocean_tug') {
            player.hasOceanTug = false;
        } else if (asset.type === 'tuglord') {
            player.hasTuglord = false;
        }
        amountRaised += asset.value;
    }

    const cashUsed = Math.min(player.money, debtAmount);
    player.money -= cashUsed;

    if (creditor) creditor.money += debtAmount;

    const surplus = amountRaised - debtAmount;
    if (surplus > 0) player.money += surplus;

    player.bankruptcyStage = 0;

    setTimeout(() => {
        UI.showNotification(`🔨 Dívida quitada via liquidação!`);
        UI.updatePlayerPositions();
        UI.renderPlayersPanel();
        UI.closeModal();
    }, 2000);
}

export function declareBankruptcy(player, creditor) {
    player.bankruptcyStage = 2;
    player.isEliminated = true;

    player.properties.forEach(propName => {
        const prop = gameState.houses.find(h => h.name === propName);
        prop.owner = undefined;
        prop.stocks = 0;
    });

    player.money = 0;
    player.properties = [];
    player.portTugs = 0;
    player.hasOceanTug = false;
    player.hasTuglord = false;
    player.loans = [];
    player.stocks = {};

    FX.shake();
    FX.flash('rgba(239,68,68,0.45)', 500);
    FX.haptic([60, 50, 60, 50, 120]);
    commentate('bankrupt', { player: player.name });
    UI.showModal('💔 Falência', `
        <div style="text-align:center;">
            <div style="font-size:3.5rem; margin-bottom:0.5rem;">💔⚓</div>
            <p style="font-size:1.1rem;"><strong>${player.name}</strong> afundou!</p>
            <p style="color:#94a3b8;">Eliminado da disputa pelo domínio portuário.</p>
        </div>
    `);

    UI.updatePlayerPositions();
    UI.renderPlayersPanel();

    const activePlayers = gameState.players.filter(p => !p.isEliminated);
    if (activePlayers.length === 1) {
        gameState.phase = 'ended';
        setTimeout(() => declareWinner(activePlayers[0]), 3000);
    }
}

export function declareWinner(winner) {
    gameState.phase = 'ended';
    FX.confetti(3000);
    FX.flash('rgba(251,191,36,0.3)', 450);
    FX.haptic([40, 60, 40, 60, 200]);
    Audio.playSuccess();
    commentate('win', { player: winner.name });
    UI.showModal('🏆 Vitória!', `
        <div style="text-align: center;">
            <div class="fx-trophy" style="font-size: 4.5rem; margin-bottom: 0.5rem;">🏆</div>
            <h1 style="color: var(--accent-gold); margin: 0;">${winner.icon} ${winner.name}</h1>
            <p style="font-size: 1.15rem; font-weight: 800; color:#fbbf24; letter-spacing:0.5px;">TUGLORD SUPREMO!</p>
            <p style="color:#94a3b8;">Dominou os mares e o mercado portuário. 👑</p>
            <button class="btn-primary" style="width:100%; margin-top:1rem;" onclick="location.reload()">⚓ Nova Partida</button>
        </div>
    `, [], false);
}

export function calculateRent(space, owner) {
    if (!space.rent) return 0;
    let level = 0;
    const portTugs = owner.portTugs - owner.dockedTugs.port;
    if (portTugs >= 1) level = 1;
    if (portTugs >= 2) level = 2;
    if (portTugs >= 3) level = 3;
    if (owner.hasOceanTug && !owner.dockedTugs.ocean) level = 4;
    if (owner.hasTuglord && !owner.dockedTugs.tuglord) level = 5;

    return Math.round(space.rent[level] * Engage.eventMult('aluguelMult'));
}

export function triggerOceanEvent() {
    commentate('ocean', { player: gameState.players[gameState.currentPlayerIndex].name });
    const event = OCEAN_EVENTS[Math.floor(Math.random() * OCEAN_EVENTS.length)];

    let buttons = [];
    if (event.type === 'choice_salvage') {
        buttons = [
            { text: '✅ Aceitar', onClick: `acceptSalvage()` },
            { text: '❌ Recusar', onClick: `closeModal()` }
        ];
    } else if (event.type === 'choice_route') {
        buttons = [
            { text: '🧭 Norte (+3 casas)', onClick: `chooseRoute('north')` },
            { text: '🧭 Sul (+F$ 250 mil)', onClick: `chooseRoute('south')` }
        ];
    } else {
        buttons = [{ text: 'Continuar', onClick: `closeModal()` }];
    }

    UI.showModal(`${event.icon} ${event.name}`, `
        <p>${event.description}</p>
        <p style="color: #94a3b8">${event.effect}</p>
    `, buttons, false);

    if (event.type !== 'choice_salvage' && event.type !== 'choice_route') {
        applyOceanEventEffect(event);
    }
    const actionsDiv = document.getElementById('contextualActions');
    if (actionsDiv) actionsDiv.style.display = 'none';
}

export function applyOceanEventEffect(event) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    if (event.type === 'money') {
        if (event.amount > 0) currentPlayer.money += event.amount;
        if (event.amount > 0) Audio.playCoin();
        else handleMandatoryPayment(currentPlayer, Math.abs(event.amount), event.name);
    } else if (event.type === 'move') {
        setTimeout(() => movePlayer(event.spaces), 1000);
    } else if (event.type === 'advance_to_property') {
        advanceToNextProperty(event.skipRent);
    } else if (event.type === 'return_to_last_property') {
        returnToLastProperty();
    } else if (event.type === 'skip_turn') {
        currentPlayer.skipNextTurn = true;
    } else if (event.type === 'inspection') {
        const hasAll = CERTIFICATES.every(c => currentPlayer.certificates.includes(c));
        if (hasAll) currentPlayer.money += 200;
        if (hasAll) Audio.playCoin();
        else handleMandatoryPayment(currentPlayer, 150, "Multa Inspeção");
    }
    UI.renderPlayersPanel();
}

export function advanceToNextProperty(skipRent) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    let spaces = 0;
    const len = gameState.houses.length;
    for (let i = 1; i <= len; i++) {
        const pos = (currentPlayer.position + i) % len;
        if (isProperty(gameState.houses[pos])) {
            spaces = i;
            break;
        }
    }
    if (spaces > 0) {
        if (skipRent) currentPlayer.skipNextRent = true;
        movePlayer(spaces);
    }
}

export function returnToLastProperty() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    let spaces = 0;
    const len = gameState.houses.length;
    for (let i = 1; i <= len; i++) {
        const pos = (currentPlayer.position - i + len) % len;
        if (isProperty(gameState.houses[pos])) {
            spaces = -i;
            break;
        }
    }
    if (spaces !== 0) movePlayer(spaces);
}

export function acceptSalvage() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    currentPlayer.money += 400;
    Audio.playCoin();
    currentPlayer.skipNextTurn = true;
    UI.renderPlayersPanel();
    UI.closeModal();
}

export function chooseRoute(route) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (route === 'north') {
        UI.closeModal();
        setTimeout(() => movePlayer(3), 500);
    } else {
        currentPlayer.money += 250;
        Audio.playCoin();
        UI.renderPlayersPanel();
        UI.closeModal();
    }
}

export function buyTraining(name, price, certificate) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.money < price) {
        UI.showNotification('Saldo insuficiente!');
        return;
    }
    currentPlayer.money -= bankCap(currentPlayer, price);
    UI.renderPlayersPanel();

    presentExam(certificate, name, false);
}

export function presentExam(certificate, trainingName, isFree) {
    commentate('cert', { player: gameState.players[gameState.currentPlayerIndex].name });
    const questions = TRAINING_QUESTIONS[certificate];
    const exam = questions[Math.floor(Math.random() * questions.length)];
    const shuffledOptions = [...exam.options].sort(() => Math.random() - 0.5);

    const modalBody = `
        <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
            <p>${exam.question}</p>
        </div>
        <div style="display: grid; gap: 0.5rem;">
            ${shuffledOptions.map(opt => `
                <button class="btn-secondary" onclick="handleExamAnswer('${opt.replace(/'/g, "\\'")}', '${exam.correct.replace(/'/g, "\\'")}', '${certificate}', '${trainingName}', ${isFree})">
                    ${opt}
                </button>
            `).join('')}
        </div>
    `;
    UI.showModal(`Exame: ${trainingName}`, modalBody, [], false);
}

export function handleExamAnswer(submitted, correct, certificate, name, isFree) {
    UI.closeModal();
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    if (submitted === correct) {
        if (!currentPlayer.certificates.includes(certificate)) {
            currentPlayer.certificates.push(certificate);
        }
        UI.showNotification(`✅ Aprovado em ${name}! Certificado: ${CERT_LABELS[certificate] || certificate}`);
        Audio.playCertificate();
    } else {
        UI.showNotification(`❌ Reprovado em ${name}! Tente novamente.`);
    }
    UI.renderPlayersPanel();
    if (gameState._examSession) setTimeout(nextSafetyExam, 400);
}

export function commissionTugLord(cost) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.money < cost) {
        UI.showNotification('Saldo insuficiente!');
        return;
    }
    currentPlayer.money -= cost;
    currentPlayer.hasTuglord = true;
    UI.showNotification('⭐ TugLord comissionado!');
    Audio.playCertificate();
    UI.renderPlayersPanel();
}

export function executeContract(name, amount) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    credit(currentPlayer, amount, 'Contrato');
    UI.showNotification(`Executado: ${name} (+${fm(amount)})`);
    UI.renderPlayersPanel();
    document.getElementById('contextualActions').style.display = 'none';
}

// v3.3: até REGRAS.UNIVERSIDADE_PROVAS_POR_VISITA provas de segurança por visita.
// Universidade: grátis. Treinamento: REGRAS.TREINAMENTO_CUSTO_PROVA por prova, pago antes.
export function visitUniversity() { startSafetyExams('univ'); }
export function startTrainingSafety() { startSafetyExams('trein'); }
function startSafetyExams(source) {
    gameState._examSession = { source, left: REGRAS.UNIVERSIDADE_PROVAS_POR_VISITA, n: 0 };
    nextSafetyExam();
}
function nextSafetyExam() {
    const s = gameState._examSession;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const missing = CERTIFICATES.filter(c => !currentPlayer.certificates.includes(c));
    if (!s || s.left <= 0 || missing.length === 0) {
        if (s && missing.length === 0 && s.n === 0) UI.showNotification('Já possui todos os certificados!');
        gameState._examSession = null;
        return false;
    }
    if (s.source === 'trein') {
        const fee = REGRAS.TREINAMENTO_CUSTO_PROVA;
        if (currentPlayer.money < fee) { UI.showNotification('Saldo insuficiente para a prova do Treinamento.'); gameState._examSession = null; return false; }
        currentPlayer.money -= bankCap(currentPlayer, fee);
        UI.renderPlayersPanel();
    }
    s.left--; s.n++;
    const total = REGRAS.UNIVERSIDADE_PROVAS_POR_VISITA;
    const selected = missing[Math.floor(Math.random() * missing.length)];
    presentExam(selected, `${CERT_LABELS[selected]} (prova ${s.n}/${total})`, s.source === 'univ');
    return true;
}

export function openStockExchange() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    // Available properties to buy stocks (not owned by current player, has owner, < 5 stocks)
    const availableProperties = gameState.houses.filter(h =>
        isProperty(h) &&
        h.owner !== undefined &&
        h.owner !== currentPlayer.id &&
        (h.stocks || 0) < 5
    );

    // Player's current stocks
    const playerStocksList = Object.keys(currentPlayer.stocks).map(propName => {
        const quantity = currentPlayer.stocks[propName];
        const property = gameState.houses.find(h => h.name === propName);
        const dividendValue = Math.floor(property.rent[0] * 0.5);
        return {
            name: propName,
            quantity: quantity,
            dividend: dividendValue,
            totalDividend: dividendValue * quantity
        };
    });

    const totalDividends = playerStocksList.reduce((sum, s) => sum + s.totalDividend, 0);

    const modalBody = `
        <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
            <p style="font-weight: 600; color: #60a5fa;">${coinIcon()} Saldo: ${fm(currentPlayer.money)}</p>
            <p style="font-size: 0.85rem; color: #94a3b8;">Suas ações: ${playerStocksList.length} | Dividendos: ${fm(totalDividends)}/turno</p>
        </div>

        ${playerStocksList.length > 0 ? `
        <div style="margin-bottom: 1rem;">
            <p style="font-weight: 600; color: #22c55e;">📊 Suas Ações</p>
            <div style="display: grid; gap: 0.5rem;">
                ${playerStocksList.map(stock => `
                    <div style="padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 0.5rem;">
                        <span style="display: block; color: #e0e0e0;">${stock.name}</span>
                        <span style="font-size: 0.85rem; color: #94a3b8;">${stock.quantity}× | Div: ${fm(stock.totalDividend)}</span>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}

        <div>
            <p style="font-weight: 600; color: #e0e0e0;">🛒 Comprar Ações</p>
            ${availableProperties.length > 0 ? `
            <div style="display: grid; gap: 0.5rem; max-height: 200px; overflow-y: auto;">
                ${availableProperties.map(prop => {
        const price = Math.floor(prop.price * 0.3);
        const owner = gameState.players.find(p => p.id === prop.owner);
        return `
                    <button class="btn-secondary" onclick="buyStock('${prop.name.replace(/'/g, "\\'")}', ${price})" style="text-align: left;">
                        ${prop.name}<br>
                        <small style="color: #94a3b8;">${fm(price)} | Dono: ${owner.name} | Disp: ${5 - (prop.stocks || 0)}</small>
                    </button>
                    `;
    }).join('')}
            </div>
            ` : '<p style="font-size: 0.9rem; color: #f87171;">Nenhuma ação disponível.</p>'}
        </div>
    `;

    UI.showModal('📈 Bolsa de Valores', modalBody, [], true);
}

export function buyStock(propName, price) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const property = gameState.houses.find(h => h.name === propName);

    if (currentPlayer.money < price) { UI.showNotification('Saldo insuficiente'); return; }
    if (!property.stocks) property.stocks = 0;
    if (property.stocks >= 5) { UI.showNotification('Limite atingido'); return; }

    currentPlayer.money -= price;
    if (!currentPlayer.stocks[propName]) currentPlayer.stocks[propName] = 0;
    currentPlayer.stocks[propName]++;
    property.stocks++;

    const owner = gameState.players.find(p => p.id === property.owner);
    owner.money += price;

    UI.showNotification(`✅ Ação de ${propName} comprada!`);
    Audio.playBuy();
    UI.renderPlayersPanel();
    UI.closeModal(); // Fecha o popup após a compra (sem reabrir).
}

export function payDividends(propertyOwner) {
    let totalPaid = 0;
    gameState.players.forEach(player => {
        if (player.id === propertyOwner.id || player.isEliminated) return;

        propertyOwner.properties.forEach(propName => {
            if (player.stocks[propName]) {
                const qty = player.stocks[propName];
                const prop = gameState.houses.find(h => h.name === propName);
                const val = Math.floor(prop.rent[0] * 0.5) * qty;

                propertyOwner.money -= val;
                player.money += val;
                totalPaid += val;
            }
        });
    });
    if (totalPaid > 0) UI.showNotification(`💰 Pagou ${fm(totalPaid)} em dividendos`);
}

export function openBankTerminal() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const modalBody = `
        <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
             <p style="font-weight: 600; color: #60a5fa;">${coinIcon()} Saldo: ${fm(currentPlayer.money)}</p>
             ${REGRAS.EMPRESTIMO_ATIVO ? `<p style="font-size: 0.85rem; color: #94a3b8;">Empréstimos ativos: ${currentPlayer.loans.length}</p>` : ''}
        </div>

        ${REGRAS.EMPRESTIMO_ATIVO ? `<div style="margin-bottom: 1rem;">
             <p style="font-weight: 600; color: #e0e0e0; margin-bottom: 0.5rem;">📋 Empréstimos Disponíveis</p>
             <div style="display: grid; gap: 0.5rem;">
                 <button class="btn-secondary" onclick="takeLoan(5000, 0.10)">💵 F$ 5 mi (Juros 10% • paga F$ 5,5 mi em 5 turnos)</button>
                 <button class="btn-secondary" onclick="takeLoan(10000, 0.15)">💵 F$ 10 mi (Juros 15% • paga F$ 11,5 mi em 5 turnos)</button>
                 <button class="btn-secondary" onclick="takeLoan(20000, 0.20)">💵 F$ 20 mi (Juros 20% • paga F$ 24 mi em 5 turnos)</button>
             </div>
        </div>` : ''}

        ${currentPlayer.loans.length > 0 ? `
        <div style="margin-bottom: 1rem;">
             <p style="font-weight: 600; color: #f87171; margin-bottom: 0.5rem;">💳 Seus Empréstimos</p>
             <div style="display: grid; gap: 0.5rem;">
                 ${currentPlayer.loans.map((l, i) => `
                    <button class="btn-secondary" onclick="payLoan(${i})">
                        💸 Pagar ${fm(l.totalDue)} (vence em ${l.turnsRemaining} ${l.turnsRemaining === 1 ? 'turno' : 'turnos'})
                    </button>
                 `).join('')}
             </div>
        </div>
        ` : ''}
        
        ${(currentPlayer.properties.length > 0 || currentPlayer.portTugs > 0 || (currentPlayer.hasOceanTug && REGRAS.LIQUIDACAO_INCLUI_OCEANICO) || currentPlayer.hasTuglord) ? `
        <div>
             <p style="font-weight: 600; color: #fbbf24; margin-bottom: 0.5rem;">🔨 Venda ao Banco (${Math.round(REGRAS.LIQUIDACAO_TAXA * 100)}%)</p>
             <div style="display: grid; gap: 0.5rem; max-height: 150px; overflow-y: auto;">
                 ${currentPlayer.properties.map(p => `
                    <button class="btn-secondary" onclick="liquidateAsset('property', '${p.replace(/'/g, "\\'")}')">
                        🏢 ${p} (${fm(liqValue('property', gameState.houses.find(h => h.name === p)))})
                    </button>
                 `).join('')}
                 ${currentPlayer.portTugs > 0 ? `<button class="btn-secondary" onclick="liquidateAsset('port_tug', null)">⚓ Rebocador Portuário (${fm(liqValue('port_tug'))})</button>` : ''}
                 ${currentPlayer.hasOceanTug && REGRAS.LIQUIDACAO_INCLUI_OCEANICO ? `<button class="btn-secondary" onclick="liquidateAsset('ocean_tug', null)">🌊 Rebocador Oceânico (${fm(liqValue('ocean_tug'))})</button>` : ''}
                 ${currentPlayer.hasTuglord ? `<button class="btn-secondary" onclick="liquidateAsset('tuglord', null)">⭐ TugLord (${fm(liqValue('tuglord'))})</button>` : ''}
             </div>
        </div>
        ` : ''}
    `;
    UI.showModal('🏦 Terminal Bancário', modalBody, [], true);
}

export function takeLoan(amount, rate = 0.10) {
    if (!REGRAS.EMPRESTIMO_ATIVO) { UI.showNotification('🚫 Empréstimos desativados nesta versão'); return; }
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const totalDue = Math.floor(amount * (1 + rate));
    currentPlayer.loans.push({ principal: amount, totalDue, turnsRemaining: 5, rate });
    currentPlayer.money += amount;
    UI.showNotification(`Empréstimo de ${fm(amount)} realizado!`);
    Audio.playBuy();
    UI.renderPlayersPanel();
    UI.closeModal();
}

// Vence o prazo dos empréstimos do jogador no início do seu turno e cobra os
// vencidos automaticamente (dispara liquidação/falência se faltar saldo).
export function processLoans(player) {
    if (!player.loans || player.loans.length === 0 || player.isEliminated) return;

    for (let i = player.loans.length - 1; i >= 0; i--) {
        const loan = player.loans[i];
        loan.turnsRemaining--;

        if (loan.turnsRemaining <= 0) {
            // Remove antes de cobrar para evitar dupla contagem caso a cobrança
            // dispare liquidação forçada (que reavalia ativos, não dívidas).
            player.loans.splice(i, 1);
            handleMandatoryPayment(player, loan.totalDue, 'Empréstimo vencido');
            if (player.isEliminated) return;
        }
    }
}

// ========== VICTORY ==========

// Critério "TugLord Supremo": 4 certificados + status TugLord +
// Rebocador Oceânico + ao menos 5 portos.
export function meetsSupremeVictory(player) {
    if (!player || player.isEliminated) return false;
    const hasAllCerts = CERTIFICATES.every(c => player.certificates.includes(c));
    const portsOwned = gameState.houses.filter(h => isProperty(h) && h.owner === player.id).length;
    return hasAllCerts && player.hasTuglord && player.hasOceanTug && portsOwned >= 5;
}

// Fim por limite de rodadas (REGRAS.LIMITE_RODADAS; 0 = desligado).
// Vencedor pelo critério REGRAS.CRITERIO_VENCEDOR. Fácil de trocar depois.
export function scoreForVictory(player) {
    return REGRAS.CRITERIO_VENCEDOR === 'dinheiro' ? player.money : netWorth(player);
}

export function checkRoundLimit() {
    const lim = REGRAS.LIMITE_RODADAS;
    if (!lim || gameState.phase !== 'playing' || gameState.currentRound <= lim) return false;
    gameState.currentRound = lim;
    endByRoundLimit();
    return true;
}

export function endByRoundLimit() {
    gameState.phase = 'ended';
    const ranked = gameState.players.filter(p => !p.isEliminated).sort((a, b) => scoreForVictory(b) - scoreForVictory(a));
    const winner = ranked[0];
    const label = REGRAS.CRITERIO_VENCEDOR === 'dinheiro' ? 'dinheiro em caixa' : 'patrimônio líquido';
    FX.confetti(3000);
    Audio.playSuccess();
    commentate('win', { player: winner.name });
    UI.showModal('🏁 Fim das ' + REGRAS.LIMITE_RODADAS + ' rodadas!', `
        <div style="text-align: center;">
            <div class="fx-trophy" style="font-size: 4rem;">🏆</div>
            <h1 style="color: var(--accent-gold); margin: 0;">${winner.icon} ${winner.name}</h1>
            <p style="color:#94a3b8;">Vence pelo maior ${label}.</p>
            ${ranked.map((p, i) => `<p style="margin:0.25rem 0;">${i + 1}º ${p.icon} ${p.name}: <strong>${fm(scoreForVictory(p))}</strong></p>`).join('')}
            <button class="btn-primary" style="width:100%; margin-top:1rem;" onclick="location.reload()">⚓ Nova Partida</button>
        </div>
    `, [], false);
}

export function checkVictory() {
    if (gameState.phase !== 'playing') return false;
    const winner = REGRAS.VITORIA_SUPREMA_ATIVA ? gameState.players.find(p => meetsSupremeVictory(p)) : null;
    if (winner) {
        gameState.phase = 'ended';
        declareWinner(winner);
        return true;
    }
    return false;
}

export function payLoan(index) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const loan = currentPlayer.loans[index];
    if (currentPlayer.money < loan.totalDue) { UI.showNotification('Saldo insuficiente'); return; }
    currentPlayer.money -= loan.totalDue;
    currentPlayer.loans.splice(index, 1);
    UI.showNotification('Empréstimo pago!');
    UI.renderPlayersPanel();
    UI.closeModal();
    setTimeout(openBankTerminal, 300);
}

export function liquidateAsset(type, id) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    let val = 0;
    if (type === 'property') {
        const prop = gameState.houses.find(h => h.name === id);
        val = liqValue('property', prop);
        prop.owner = undefined;
        prop.stocks = 0;
        currentPlayer.properties = currentPlayer.properties.filter(p => p !== id);
        if (currentPlayer.stocks[id]) delete currentPlayer.stocks[id];
    } else if (type === 'port_tug') {
        val = liqValue('port_tug');
        currentPlayer.portTugs--;
    } else if (type === 'ocean_tug') {
        val = liqValue('ocean_tug');
        currentPlayer.hasOceanTug = false;
    } else if (type === 'tuglord') {
        if (!currentPlayer.hasTuglord) return;
        val = liqValue('tuglord');
        currentPlayer.hasTuglord = false;
    }

    currentPlayer.money += val;
    UI.showNotification(`Ativo liquidado (+${fm(val)})`);
    UI.renderPlayersPanel();
    UI.updatePlayerPositions();
    UI.closeModal();
    setTimeout(openBankTerminal, 300);
}

export function checkTugLordCertificate() {
    UI.showNotification('🎖️ Certificado TugLord Ativo!');
}

export function payTax(amount) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    handleMandatoryPayment(currentPlayer, amount, "Imposto");
    const actionsDiv = document.getElementById('contextualActions');
    if (actionsDiv) actionsDiv.style.display = 'none';
}

export function performManeuver() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    const portTugs = currentPlayer.portTugs - currentPlayer.dockedTugs.port;
    const oceanTug = currentPlayer.hasOceanTug && !currentPlayer.dockedTugs.ocean;
    const tuglord = currentPlayer.hasTuglord && !currentPlayer.dockedTugs.tuglord;
    const totalTugs = portTugs + (oceanTug ? 1 : 0) + (tuglord ? 1 : 0);

    if (totalTugs === 0) {
        UI.showNotification('✅ Sem rebocadores, sem penalidade!');
    } else {
        const opponentsWithTugs = gameState.players.filter(p => {
            if (p.id === currentPlayer.id) return false;
            const pPort = p.portTugs - p.dockedTugs.port;
            const pOcean = p.hasOceanTug && !p.dockedTugs.ocean;
            const pTuglord = p.hasTuglord && !p.dockedTugs.tuglord;
            return (pPort + (pOcean ? 1 : 0) + (pTuglord ? 1 : 0)) > 0;
        });

        const count = opponentsWithTugs.length;
        if (count > 0) {
            const penalty = count * 100;
            handleMandatoryPayment(currentPlayer, penalty, `Manobra (${count} adv.)`);
        } else {
            UI.showNotification('✅ Nenhum adversário com rebocadores!');
        }
    }

    const actionsDiv = document.getElementById('contextualActions');
    if (actionsDiv) actionsDiv.style.display = 'none';
}

export function drawCard(type) {
    const effects = [
        { msg: 'Encontrou carga perdida! +F$ 100 mil', val: 100 },
        { msg: 'Multa ambiental! -F$ 100 mil', val: -100 },
        { msg: 'Manutenção extra! -F$ 50 mil', val: -50 },
        { msg: 'Bonificação contratual! +F$ 150 mil', val: 150 }
    ];

    const effect = effects[Math.floor(Math.random() * effects.length)];
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];

    if (effect.val > 0) {
        currentPlayer.money += effect.val;
        UI.showNotification(`🍀 ${effect.msg}`);
    } else {
        handleMandatoryPayment(currentPlayer, Math.abs(effect.val), "Carta Sorte");
    }

    UI.renderPlayersPanel();
    const actionsDiv = document.getElementById('contextualActions');
    if (actionsDiv) actionsDiv.style.display = 'none';
}

// Dispõe uma fileira de cartas viradas para baixo no centro do tabuleiro para o
// jogador escolher. Cada carta recebe um sorteio do baralho (Sorte/Azar).
// As cartas são exibidas num MODAL (sempre visível, sobre o tabuleiro) para
// garantir que apareçam em qualquer layout/tema/navegador.
export function showCardPicker(type) {
    commentate('luck', { player: gameState.players[gameState.currentPlayerIndex].name });
    const NUM_CARDS = 5;
    gameState._cardDraw = Array.from({ length: NUM_CARDS },
        () => CARD_DECK[Math.floor(Math.random() * CARD_DECK.length)]);
    gameState._cardPicked = false;

    const label = type === 'surprise' ? 'Carta Surpresa' : 'Sorte ou Azar';
    let cards = '';
    for (let i = 0; i < NUM_CARDS; i++) {
        const c = gameState._cardDraw[i];
        const good = c.good || c.val >= 0;
        cards += `
            <div class="game-card" onclick="pickCard(${i}, '${type}')">
                <div class="game-card-inner">
                    <div class="game-card-face game-card-back">⚓</div>
                    <div class="game-card-face game-card-front ${good ? 'good' : 'bad'}">
                        <div class="gc-icon">${good ? '🍀' : '⚠️'}</div>
                        <div class="gc-msg">${c.msg}</div>
                    </div>
                </div>
            </div>`;
    }
    const body = `
        <p style="text-align: center; margin-bottom: 1rem; color: #cbd5e1;">Escolha uma carta para revelar sua sorte!</p>
        <div class="card-row">${cards}</div>`;
    UI.showModal(`🎴 ${label}`, body, [], false);
}

// Revela a carta escolhida (vira com animação), aplica o efeito e fecha o modal.
export function pickCard(index, type) {
    if (gameState._cardPicked) return; // só uma escolha por rodada
    const draw = gameState._cardDraw;
    if (!draw) return;
    gameState._cardPicked = true;

    const effect = draw[index];
    const modal = document.getElementById('gameModal');
    const cards = modal ? modal.querySelectorAll('.game-card') : [];
    cards.forEach((card, i) => {
        card.style.pointerEvents = 'none';
        if (i === index) {
            card.classList.add('chosen');
            const inner = card.querySelector('.game-card-inner');
            if (inner) inner.classList.add('flipped');
        } else {
            card.classList.add('dimmed');
        }
    });

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    setTimeout(() => {
        if (effect.asset) {
            grantTugFromCard(currentPlayer, effect.asset);
        } else if (effect.val > 0) {
            UI.showNotification(`🍀 ${effect.msg}`);
            credit(currentPlayer, effect.val, 'Sorte');
        } else if (effect.val < 0) {
            Audio.playBadLuck();
            handleMandatoryPayment(currentPlayer, Math.abs(effect.val), 'Carta');
        } else {
            UI.showNotification(effect.msg);
        }
        UI.renderPlayersPanel();
    }, 650);

    // Fecha o modal das cartas após o jogador ver o resultado.
    setTimeout(() => {
        UI.closeModal();
        gameState._cardDraw = null;
        const actionsDiv = document.getElementById('contextualActions');
        if (actionsDiv) actionsDiv.style.display = 'none';
    }, 2800);
}

// Nome do dono de uma casa; sem dono de jogador, o dono é o Banco.
export function ownerName(house) {
    const p = house && house.owner !== undefined ? gameState.players.find(x => x.id === house.owner) : null;
    return p ? p.name : BANK_OWNER_LABEL;
}

// Carta que entrega um rebocador (mesmo modelo de ativos de buyTug: portTugs++ /
// hasOceanTug). Se já tiver o Oceânico, recebe CARD_TUG_CASH em dinheiro.
export function grantTugFromCard(player, asset) {
    if (asset === 'port_tug') {
        player.portTugs++;
        UI.showNotification(`⚓ ${player.name} ganhou um Rebocador Portuário!`);
    } else if (asset === 'port_kit') {
        player.portTugs += 2;
        UI.showNotification(`⚓⚓ Kit Porto: ${player.name} ganhou 2 Rebocadores Portuários!`);
    } else if (asset === 'special_kit') {
        player.portTugs++;
        if (giveOceanTug(player)) UI.showNotification(`⚓🌊 Kit Especial: ${player.name} ganhou 1 Portuário + 1 Oceânico!`);
    } else if (asset === 'ocean_tug') {
        if (giveOceanTug(player)) UI.showNotification(`🌊 ${player.name} ganhou um Rebocador Oceânico!`);
    } else if (asset === 'tug_coupon') {
        player.tugCoupon = true;
        UI.showNotification(`🎟️ ${player.name}: cupom de ${Math.round(REGRAS.CUPOM_DESCONTO * 100)}% no próximo Portuário!`);
    } else if (asset === 'maneuver') {
        const pay = maneuverPayout(player) * REGRAS.CARTA_MANOBRA_MULT;
        if (operationalTugs(player).port > 0 && !canManeuver(player)) UI.showNotification(`⚓ Manobra de Porto: ${NO_CERT_MANEUVER}`);
        else if (pay > 0) {
            UI.showNotification(`⚓ Manobra de Porto: ${REGRAS.CARTA_MANOBRA_MULT} x ${fm(REGRAS.MANOBRA_BASE)} x ${Math.min(operationalTugs(player).port, REGRAS.MANOBRA_MAX_PORTUARIOS)} portuário(s)`);
            credit(player, pay, 'Manobra');
        } else UI.showNotification(`⚓ Manobra de Porto: sem portuário operacional, sem manobra.`);
        UI.renderPlayersPanel();
        return;
    } else if (asset === 'salvage') {
        if (canOceanSalvage(player)) {
            const prize = salvagePrize();
            UI.showNotification(`🌊 Reboque Oceânico concluído!`);
            credit(player, prize, 'Reboque Oceânico');
        } else UI.showNotification(`🌊 Reboque Oceânico: só com Oceânico operacional e Certificado Tuglords.`);
        UI.renderPlayersPanel();
        return;
    }
    Audio.playSuccess();
    UI.renderPlayersPanel();
}

// Casa de Docagem Obrigatória: paga DOCKING_HOUSE_COST ao dono do Estaleiro
// (ou ao Banco) e perde a próxima rodada.
export function handleDrydockHouse() {
    const player = gameState.players[gameState.currentPlayerIndex];
    const yard = gameState.houses.find(h => h.name.includes('Estaleiro'));
    const yardOwner = yard && yard.owner !== undefined ? gameState.players.find(p => p.id === yard.owner) : null;
    const recipient = yardOwner && yardOwner.id !== player.id ? yardOwner : null;
    if (!handleMandatoryPayment(player, DOCKING_HOUSE_COST, 'Docagem obrigatória', recipient)) return false;
    if (DOCKING_HOUSE_SKIP_TURN) player.skipNextTurn = true;
    return true;
}

export function showContextualActions(house) {
    // Hide old bottom panel just in case
    const actionsDiv = document.getElementById('contextualActions');
    if (actionsDiv) actionsDiv.style.display = 'none';

    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    let title = `${house.icon} ${house.name}`;
    let body = '';
    let buttons = [];

    // ========== PROPERTY (Porto) ==========
    if (isProperty(house)) {
        const owner = house.owner !== undefined ? gameState.players.find(p => p.id === house.owner) : null;

        if (!owner) {
            body = `<p>Este porto está à venda por <strong style="color: var(--accent-gold);">${fm(house.price)}</strong>.</p>`;
            buttons.push({
                text: `Comprar (${fm(house.price)})`,
                onClick: `buyProperty(gameState.houses[${house.pos}])`,
                class: 'btn-primary'
            });
            buttons.push({
                text: 'Passar',
                onClick: REGRAS.LEILAO_ATIVO ? `startAuction(${house.pos})` : `closeModal()`,
                class: 'btn-secondary'
            });
        } else if (owner.id === currentPlayer.id) {
            commentate('own', { player: currentPlayer.name });
            // Regras v2: na própria casa o dono paga impostos.
            const tax = Math.round(house.price * REGRAS.IMPOSTO_PORTO_PROPRIO);
            if (!handleMandatoryPayment(currentPlayer, tax, `Impostos (${house.name})`)) return;
            body = `<p style="color: #22c55e;">✅ Você é o dono deste porto!</p>
                <p style="color:#f59e0b;">🧾 Impostos pagos: ${fm(tax)}</p>`;
            if (currentPlayer.dockedTugs.inYard) {
                body += `<p>🏗️ Seu rebocador pode sair do dique e vir para este porto, após a vistoria LOYDS TUGSTER.</p>`;
                buttons.push({ text: '📋 Fazer Vistoria', onClick: `presentInspection('yard')`, class: 'btn-primary' });
            } else {
                buttons.push({ text: 'Continuar', onClick: `closeModal()`, class: 'btn-primary' });
            }
        } else {
            if (currentPlayer.skipNextRent) {
                body = `<p style="color: #10b981;">⛵ <strong>Vento Favorável!</strong><br>Aluguel dispensado nesta rodada.</p>`;
                currentPlayer.skipNextRent = false;
                buttons.push({ text: 'Ótimo!', onClick: `closeModal()`, class: 'btn-primary' });
            } else {
                const rent = calculateRent(house, owner);
                body = `
                    <p>Propriedade de <strong>${owner.name}</strong>.</p>
                    <p style="color: #ef4444; font-size: 1.2rem;">Arrendamento: ${fm(rent)}</p>
                `;
                // Auto-pay logic wrapped in a "Pay" button for user agency (or auto after delay)
                // User requested "popup", implying interaction. Let's make it manual click to close/pay.
                buttons.push({
                    text: `Pagar ${fm(rent)}`,
                    onClick: `handleMandatoryPayment(gameState.players[${gameState.currentPlayerIndex}], ${rent}, 'Aluguel/arrendamento (${house.name})', gameState.players.find(p => p.id === ${owner.id})); UI.closeModal();`,
                    class: 'btn-primary'
                });
            }
        }
    }

    // ========== WORKSHOP (Oficina) ==========
    else if (house.type === 'workshop' && house.price) {
        const owner = house.owner !== undefined ? gameState.players.find(p => p.id === house.owner) : null;

        if (!owner) {
            body = `<p style="color: #94a3b8;">🏛️ Dono atual: ${BANK_OWNER_LABEL}</p><p>Esta oficina está à venda por <strong style="color: var(--accent-gold);">${fm(house.price)}</strong>.</p>
                <p style="color: #94a3b8; font-size: 0.9rem;">📝 Após a compra, você fará o <strong>exame técnico</strong> de ${CERT_LABELS[house.certificate] || house.certificate} para emitir o certificado.</p>`;
            buttons.push({
                text: `Comprar (${fm(house.price)})`,
                onClick: `buyProperty(gameState.houses[${house.pos}])`,
                class: 'btn-primary'
            });
            buttons.push({ text: 'Passar', onClick: `closeModal()`, class: 'btn-secondary' });
        } else if (owner.id === currentPlayer.id) {
            // Regra: na própria oficina o dono paga PL/bônus aos funcionários.
            // Regras v2: 1ª a 3ª vez paga bônus; na 4ª o Banco devolve 25% dos bônus pagos e zera.
            if (!currentPlayer.workshopVisits) currentPlayer.workshopVisits = {};
            if (!currentPlayer.workshopBonusPaid) currentPlayer.workshopBonusPaid = {};
            const visits = (currentPlayer.workshopVisits[house.name] || 0) + 1;
            let staffNote;
            if (visits >= REGRAS.OFICINA_INCENTIVO_NA_VEZ) {
                const paid = currentPlayer.workshopBonusPaid[house.name] || 0;
                const incentive = Math.round(paid * REGRAS.OFICINA_INCENTIVO_TAXA);
                currentPlayer.workshopVisits[house.name] = 0;
                currentPlayer.workshopBonusPaid[house.name] = 0;
                credit(currentPlayer, incentive, 'Incentivo do Banco');
                staffNote = `<p style="color: #22c55e;">🏦 ${visits}ª visita: o Banco devolveu ${fm(incentive)} de incentivo (25% dos bônus pagos). Contador zerado.</p>`;
            } else {
                if (!handleMandatoryPayment(currentPlayer, WORKSHOP_STAFF_PAY, `PL/bônus dos funcionários (${house.name})`)) return;
                currentPlayer.workshopVisits[house.name] = visits;
                currentPlayer.workshopBonusPaid[house.name] = (currentPlayer.workshopBonusPaid[house.name] || 0) + WORKSHOP_STAFF_PAY;
                staffNote = `<p style="color: #f59e0b;">👷 Você pagou ${fm(WORKSHOP_STAFF_PAY)} de bônus aos funcionários (visita ${visits} de ${REGRAS.OFICINA_INCENTIVO_NA_VEZ - 1}; na ${REGRAS.OFICINA_INCENTIVO_NA_VEZ}ª o Banco paga incentivo).</p>`;
            }
            if (!currentPlayer.certificates.includes(house.certificate)) {
                body = staffNote + `<p>Como dono, você pode emitir o certificado <strong>${CERT_LABELS[house.certificate] || house.certificate}</strong> — mas precisa conhecer a área: faça o exame técnico (gratuito).</p>`;
                buttons.push({
                    text: '📝 Fazer Exame Técnico',
                    onClick: `presentExam('${house.certificate}', '${house.name}', true);`,
                    class: 'btn-primary'
                });
            } else {
                body = staffNote + `<p style="color: #22c55e;">✅ Oficina sob sua gestão.</p>`;
                buttons.push({ text: 'Continuar', onClick: `closeModal()`, class: 'btn-primary' });
            }
        } else {
            // Oficina certificada (dono tem o certificado técnico da área) cobra
            // serviço premium — renda extra para quem investiu no certificado.
            const certified = owner.certificates.includes(house.certificate);
            const serviceFee = certified
                ? Math.round(WORKSHOP_SERVICE_FEE * CERTIFIED_FEE_MULTIPLIER)
                : WORKSHOP_SERVICE_FEE;
            body = `
                <p>Propriedade de <strong>${owner.name}</strong>.</p>
                ${certified ? `<p style="color: var(--accent-gold);">🎓 Oficina certificada em ${CERT_LABELS[house.certificate] || house.certificate} — serviço premium (+${Math.round((CERTIFIED_FEE_MULTIPLIER - 1) * 100)}%).</p>` : ''}
                <p style="color: #ef4444;">Taxa de Serviço: ${fm(serviceFee)}</p>
            `;
            buttons.push({
                text: `Pagar ${fm(serviceFee)}`,
                onClick: `handleMandatoryPayment(gameState.players[${gameState.currentPlayerIndex}], ${serviceFee}, 'Taxa (${house.name})', gameState.players.find(p => p.id === ${owner.id})); UI.closeModal();`,
                class: 'btn-primary'
            });
        }
    }

    // ========== SERVICE (Combustível/Estaleiro) ==========
    else if (house.type === 'service' && house.price) {
        // Docagem obrigatória: ao cair no Estaleiro com frota operacional, abre o
        // fluxo de docagem (handleShipyard cuida do próprio modal).
        if (house.name.includes('Estaleiro') && operationalTugs(currentPlayer).total > 0) {
            handleShipyard(house);
            return;
        }

        const owner = house.owner !== undefined ? gameState.players.find(p => p.id === house.owner) : null;

        if (!owner) {
            body = `<p style="color: #94a3b8;">🏛️ Dono atual: ${BANK_OWNER_LABEL}</p><p>Este serviço está à venda por <strong style="color: var(--accent-gold);">${fm(house.price)}</strong>.</p>`;
            buttons.push({
                text: `Comprar (${fm(house.price)})`,
                onClick: `buyProperty(gameState.houses[${house.pos}])`,
                class: 'btn-primary'
            });
            buttons.push({ text: 'Passar', onClick: `closeModal()`, class: 'btn-secondary' });
        } else if (owner.id === currentPlayer.id) {
            body = `<p style="color: #22c55e;">✅ Você possui este serviço.</p>`;
            if (house.name.includes('Estaleiro') && !currentPlayer.hasTuglord && currentPlayer.money >= house.tuglordBuildCost) {
                buttons.push({
                    text: `Comissionar TugLord (${fm(house.tuglordBuildCost)})`,
                    onClick: `commissionTugLord(${house.tuglordBuildCost}); UI.closeModal();`,
                    class: 'btn-primary'
                });
            }
            buttons.push({ text: 'Continuar', onClick: `closeModal()`, class: 'btn-primary' });
        } else {
            body = `<p>Propriedade de <strong>${owner.name}</strong>.</p>`;
            buttons.push({ text: 'Continuar', onClick: `closeModal()`, class: 'btn-primary' });
        }
    }

    // ========== TUG PURCHASE ==========
    else if (house.type === 'tug_purchase' && house.price) {
        const tugTypeName = house.tugType === 'port' ? 'Portuário' : 'Oceânico';
        body = `<p>Deseja comprar um Rebocador <strong>${tugTypeName}</strong>?</p>`;
        buttons.push({
            text: `Comprar (${fm(house.price)})`,
            onClick: `buyTug(gameState.houses[${house.pos}]); UI.closeModal();`,
            class: 'btn-primary'
        });
        buttons.push({ text: 'Não agora', onClick: `closeModal()`, class: 'btn-secondary' });
    }

    // ========== TRAINING ==========
    else if (house.type === 'training' && house.price) {
        const missingSafety = CERTIFICATES.filter(c => !currentPlayer.certificates.includes(c)).length;
        if (REGRAS.TREINAMENTO_CERT_SEGURANCA && missingSafety > 0) {
            body = `<p>🦺 Treinamento de segurança: até <strong>${REGRAS.UNIVERSIDADE_PROVAS_POR_VISITA} provas</strong> de certificado de segurança, ${fm(REGRAS.TREINAMENTO_CUSTO_PROVA)} cada (pago antes da prova).</p>`;
            buttons.push({ text: `Prova de segurança (${fm(REGRAS.TREINAMENTO_CUSTO_PROVA)})`, onClick: `startTrainingSafety();`, class: 'btn-primary' });
            if (!currentPlayer.certificates.includes(house.certificate)) {
                body += `<p style="color:#94a3b8;">Ou o treinamento técnico: <strong>${house.certificate.toUpperCase()}</strong> (${fm(house.price)}).</p>`;
                buttons.push({ text: `Treinamento técnico (${fm(house.price)})`, onClick: `buyTraining('${house.name}', ${house.price}, '${house.certificate}');`, class: 'btn-secondary' });
            }
            buttons.push({ text: 'Ignorar', onClick: `closeModal()`, class: 'btn-secondary' });
        } else if (!currentPlayer.certificates.includes(house.certificate)) {
            body = `<p>Treinamento disponível: <strong>${house.certificate.toUpperCase()}</strong>.</p>`;
            buttons.push({
                text: `Fazer Treinamento (${fm(house.price)})`,
                onClick: `buyTraining('${house.name}', ${house.price}, '${house.certificate}');`, // buyTraining opens exam modal
                class: 'btn-primary'
            });
            buttons.push({ text: 'Ignorar', onClick: `closeModal()`, class: 'btn-secondary' });
        } else {
            body = `<p style="color: #22c55e;">✅ Você já possui este certificado.</p>`;
            buttons.push({ text: 'Continuar', onClick: `closeModal()`, class: 'btn-primary' });
        }
    }

    // ========== UNIVERSITY ==========
    else if (house.type === 'university') {
        body = `<p>🎓 Universidade do Mar — até <strong>${REGRAS.UNIVERSIDADE_PROVAS_POR_VISITA} provas grátis por visita</strong> dos certificados de segurança (Incêndio, Homem ao Mar, Colisão, Abandono). ${REGRAS.MANOBRA_CERTS_SEGURANCA === 1 ? '1 certificado' : REGRAS.MANOBRA_CERTS_SEGURANCA + ' certificados'} já libera a manobra!</p>`;
        buttons.push({
            text: 'Acessar Universidade',
            onClick: `visitUniversity();`, // Opens exam modal
            class: 'btn-primary'
        });
        buttons.push({ text: 'Passar', onClick: `closeModal()`, class: 'btn-secondary' });
    }

    // ========== BANK ==========
    else if (house.type === 'bank') {
        body = `<p>Acesse o terminal bancário para ${REGRAS.EMPRESTIMO_ATIVO ? 'empréstimos e pagamentos' : 'vender ativos ao Banco'}.</p>`;
        buttons.push({
            text: 'Abrir Terminal',
            onClick: `openBankTerminal();`, // Opens bank modal
            class: 'btn-primary'
        });
        buttons.push({ text: 'Continuar', onClick: `closeModal()`, class: 'btn-secondary' });
    }

    // ========== STOCK EXCHANGE ==========
    else if (house.type === 'stock_exchange') {
        body = `<p>Negocie ações de portos e receba dividendos.</p>`;
        buttons.push({
            text: 'Abrir Bolsa',
            onClick: `openStockExchange();`, // Opens stock modal
            class: 'btn-primary'
        });
        buttons.push({ text: 'Continuar', onClick: `closeModal()`, class: 'btn-secondary' });
    }

    // ========== TUGLORD CERT ==========
    else if (house.type === 'tuglord_certificate') {
        body = `<p>Verificação de status TugLord.</p>`;
        buttons.push({
            text: 'Verificar',
            onClick: `checkTugLordCertificate(); UI.closeModal();`,
            class: 'btn-primary'
        });
    }

    // ========== TAX ==========
    else if (house.type === 'tax' && house.price) {
        body = `<p>Pagamento obrigatório de imposto.</p>`;
        buttons.push({
            text: `Pagar ${fm(house.price)}`,
            onClick: `payTax(${house.price}); UI.closeModal();`,
            class: 'btn-primary'
        });
    }

    // ========== DOCAGEM OBRIGATÓRIA (casa) ==========
    else if (house.type === 'drydock') {
        if (!handleDrydockHouse()) return;
        body = `<p style="color: #f87171; font-weight: 600;">⚠️ DOCAGEM OBRIGATÓRIA</p>
            <p>Docagem periódica de classe: pague ${fm(DOCKING_HOUSE_COST)} (${ownerName(gameState.houses.find(h => h.name.includes('Estaleiro')))})${DOCKING_HOUSE_SKIP_TURN ? ' e fique uma rodada sem jogar' : ''}.</p>`;
        buttons.push({ text: 'Entendido', onClick: `closeModal()`, class: 'btn-primary' });
    }

    // ========== LUCK/SURPRISE ==========
    else if (house.type === 'luck' || house.type === 'surprise') {
        // Abre o modal com a fileira de cartas para o jogador escolher.
        showCardPicker(house.type);
        return;
    }

    // ========== EVENTS (Ocean) ==========
    else if (house.type === 'ocean_event' || house.type === 'event') {
        // Regras v2: Reboque Oceânico só com Oceânico operacional + Certificado Tuglords.
        if (!canOceanSalvage(currentPlayer)) {
            body = `<p style="color: #f59e0b;">🌊 Reboque Oceânico só para quem tem <strong>Rebocador Oceânico</strong> operacional e o <strong>Certificado Tuglords</strong>.</p>
                     <p style="color:#94a3b8;">Até lá, manobre no porto e passe ${REGRAS.UNISALVAGE_ETAPAS} vezes na UNISALVAGE.</p>`;
            buttons.push({ text: 'Continuar', onClick: `closeModal()`, class: 'btn-primary' });
        } else {
            const prize = salvagePrize();
            credit(currentPlayer, prize, 'Salvatagem');
            commentate('ocean', { player: currentPlayer.name });
            FX.confetti(1500);
            body = `<p style="color:#22c55e; font-weight:700;">🛟 Reboque Oceânico concluído!</p>
                     <p>Seu Oceânico rebocou um navio em perigo: <strong style="color: var(--accent-gold);">+${fm(prize)}</strong>.</p>`;
            buttons.push({ text: 'Ótimo!', onClick: `closeModal()`, class: 'btn-primary' });
        }
    }

    // ========== MANOBRA DO PORTO (v2) ==========
    else if (house.type === 'maneuver') {
        const n = operationalTugs(currentPlayer).port;
        if (n > 0 && !canManeuver(currentPlayer)) {
            const c = safetyCount(currentPlayer), need = REGRAS.MANOBRA_CERTS_SEGURANCA;
            body = `<p style="color:#f59e0b; font-weight:700;">⚓ ${NO_CERT_MANEUVER}</p>
                <p style="color:#94a3b8;">Você tem ${n} portuário${n > 1 ? 's' : ''}, mas só começa a ganhar com ${need === 1 ? '1 certificado' : need + ' certificados'} de segurança (${c}/${need}). Faça a prova na Universidade do Mar ou no Treinamento.</p>`;
        } else if (n <= 0) {
            body = `<p style="color:#f59e0b;">⚓ Sem rebocador portuário operacional, sem manobra.</p>
                <p style="color:#94a3b8;">Cada portuário rende ${fm(REGRAS.MANOBRA_BASE)} por manobra. Compre na Loja de Rebocadores (${fm(REGRAS.PRECO_PORTUARIO)}).</p>`;
        } else {
            const pay = maneuverPayout(currentPlayer);
            credit(currentPlayer, pay, 'Manobra');
            body = `<p style="color:#22c55e; font-weight:700;">⚓ Manobra concluída com ${n} portuário${n > 1 ? 's' : ''}!</p>
                <p>${fm(REGRAS.MANOBRA_BASE)} x ${Math.min(n, REGRAS.MANOBRA_MAX_PORTUARIOS)} = <strong style="color: var(--accent-gold);">${fm(pay)}</strong></p>
                ${n > REGRAS.MANOBRA_MAX_PORTUARIOS ? `<p style="color:#94a3b8; font-size:0.85rem;">Teto: só ${REGRAS.MANOBRA_MAX_PORTUARIOS} portuários contam na manobra.</p>` : ''}`;
        }
        buttons.push({ text: 'Continuar', onClick: `closeModal()`, class: 'btn-primary' });
    }

    // ========== UNISALVAGE (v2) ==========
    else if (house.type === 'unisalvage') {
        if (currentPlayer.certTuglords) {
            body = `<p style="color:#22c55e; font-weight:700;">🛟 Você já tem o Certificado Tuglords!</p>
                <p style="color:#94a3b8;">Autorizado para Rebocadores Oceânicos e Reboque Oceânico.</p>`;
            buttons.push({ text: 'Continuar', onClick: `closeModal()`, class: 'btn-primary' });
        } else {
            presentUnisalvage();
            return;
        }
    }

    // ========== VISTORIA LOYDS TUGSTER (v2) ==========
    else if (house.type === 'inspection') {
        if (operationalTugs(currentPlayer).total <= 0) {
            body = `<p style="color:#94a3b8;">📋 Sem rebocador operacional para vistoriar. Siga viagem.</p>`;
            buttons.push({ text: 'Continuar', onClick: `closeModal()`, class: 'btn-primary' });
        } else {
            presentInspection('square');
            return;
        }
    }

    // Specific Contracts
    else if (house.type === 'contract' && house.price) {
        const hasTug = currentPlayer.portTugs > 0 || currentPlayer.hasOceanTug || currentPlayer.hasTuglord;

        if (hasTug) {
            body = `<p>Contrato disponível para execução.</p>`;
            buttons.push({
                text: `Executar (+${fm(house.price)})`,
                onClick: `executeContract('${house.name}', ${house.price}); UI.closeModal();`,
                class: 'btn-primary'
            });
        } else {
            body = `<p style="color: #ef4444;">⚠️ Frota Insuficiente!</p>
                     <p>Você precisa de pelo menos um rebocador operacional para realizar contratos.</p>`;
            buttons.push({ text: 'Entendido', onClick: `UI.closeModal()`, class: 'btn-secondary' });
        }
    }

    // Show the constructed modal if we have content
    if (body) {
        UI.showModal(title, body, buttons, false);
    }
}

// ========== PERSISTENCE & MENU (Sprint 4) ==========

const SAVE_KEY = 'tuglords_save_v2'; // v2: regras 26/10 (save v1 é ignorado)
const OLD_SAVE_KEY = 'tuglords_save_v1';

export function saveGame() {
    if (gameState.phase === 'setup') {
        UI.showNotification('⚠️ Inicie uma partida para salvar.');
        return;
    }
    try {
        const data = {
            version: 2,
            savedAt: new Date().toISOString(),
            players: gameState.players,
            currentPlayerIndex: gameState.currentPlayerIndex,
            currentRound: gameState.currentRound,
            roundEvent: gameState.roundEvent || null,
            phase: gameState.phase,
            // Apenas o estado dinâmico das casas (dono/ações); o resto é estático.
            houses: gameState.houses.map(h => ({ pos: h.pos, owner: h.owner ?? null, stocks: h.stocks || 0 }))
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        UI.showNotification('💾 Jogo salvo!');
        UI.closeModal();
    } catch (e) {
        UI.showNotification('❌ Falha ao salvar.');
        console.error('saveGame:', e);
    }
}

export function hasSavedGame() {
    try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; }
}

export function loadGame() {
    let raw;
    try { raw = localStorage.getItem(SAVE_KEY); } catch (e) { raw = null; }
    if (!raw) {
        let old = null;
        try { old = localStorage.getItem(OLD_SAVE_KEY); } catch (e) { old = null; }
        if (old) { UI.showNotification('⚠️ Save antigo (v1) não é compatível com as regras novas.'); return; }
        UI.showNotification('⚠️ Nenhum jogo salvo encontrado.');
        return;
    }
    try {
        const data = JSON.parse(raw);
        if (data.version !== 2) { UI.showNotification('⚠️ Save de versão antiga, ignorado.'); return; }
        gameState.players = data.players;
        gameState.players.forEach(p => {
            const d = p.dockedTugs || (p.dockedTugs = { port: 0, ocean: false, tuglord: false, turnsRemaining: 0 });
            if (d.inYard === undefined) d.inYard = false;
            if (d.retest === undefined) d.retest = false;
            if (!p.workshopVisits) p.workshopVisits = {};
            if (!p.workshopBonusPaid) p.workshopBonusPaid = {};
            if (p.tugCoupon === undefined) p.tugCoupon = false;
            if (p.unisalvageStep === undefined) p.unisalvageStep = 0;
            if (!p.badges) p.badges = [];
            if (p.certTuglords === undefined) p.certTuglords = false;
        });
        gameState.currentPlayerIndex = data.currentPlayerIndex;
        gameState.currentRound = data.currentRound;
        gameState.roundEvent = data.roundEvent || null;
        Engage.resetTracking();
        gameState.phase = data.phase;
        gameState.diceRolled = true; // turno em andamento aguarda "Finalizar"

        // Restaura dono/ações por posição.
        data.houses.forEach(h => {
            const house = gameState.houses[h.pos];
            if (house) {
                house.owner = (h.owner === null || h.owner === undefined) ? undefined : h.owner;
                house.stocks = h.stocks || 0;
            }
        });

        // Vai direto para a tela de jogo.
        ['presentationScreen', 'manualScreen', 'setupScreen'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
        const gameScreen = document.getElementById('gameScreen');
        if (gameScreen) gameScreen.style.display = 'block';

        UI.closeAllPanels();
        UI.renderBoard();
        UI.renderPlayersPanel();
        UI.updateTurnDisplay();
        UI.updatePlayerPositions();

        const current = gameState.players[gameState.currentPlayerIndex];
        const house = gameState.houses[current.position];
        const currentHouseName = document.getElementById('currentHouseName');
        if (currentHouseName && house) currentHouseName.textContent = house.name;

        UI.showNotification('📤 Jogo carregado!');
    } catch (e) {
        UI.showNotification('❌ Save corrompido.');
        console.error('loadGame:', e);
    }
}

// Patrimônio líquido estimado (caixa + 50% dos ativos).
export function netWorth(player) {
    let total = player.money;
    gameState.houses.forEach(h => {
        if (isProperty(h) && h.owner === player.id) total += Math.floor(h.price * 0.5);
    });
    // Rebocadores a 50% do preço de loja (valores antigos 100/250/375 eram de outra escala).
    total += Math.floor(player.portTugs * REGRAS.PRECO_PORTUARIO * 0.5);
    if (player.hasOceanTug) total += Math.floor(REGRAS.PRECO_OCEANICO * 0.5);
    if (player.hasTuglord) total += Math.floor(tuglordStorePrice() * 0.5);
    (player.loans || []).forEach(l => { total -= l.totalDue; });
    return total;
}

export function showStatistics() {
    const ranked = [...gameState.players].sort((a, b) => netWorth(b) - netWorth(a));
    const rows = ranked.map((p, i) => {
        const ports = gameState.houses.filter(h => isProperty(h) && h.owner === p.id).length;
        const status = p.isEliminated ? '💀 Eliminado' : `${fm(netWorth(p))}`;
        return `
            <div style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem; border-radius:0.5rem; background:rgba(255,255,255,0.05); border-left:4px solid ${p.color}; margin-bottom:0.5rem; ${p.isEliminated ? 'opacity:0.55;' : ''}">
                <span style="font-weight:900; width:24px; color:var(--accent-gold);">${i + 1}º</span>
                <span style="font-size:1.3rem;">${p.icon}</span>
                <div style="flex:1; min-width:0;">
                    <div style="font-weight:700;">${p.name}</div>
                    <div style="font-size:0.78rem; color:#94a3b8;">⚓ ${ports} portos · 🎓 ${p.certificates.length}/4 · ${coinIcon()} ${fm(p.money)}</div>
                </div>
                <span style="font-weight:800; color:#22c55e; white-space:nowrap;">${status}</span>
            </div>`;
    }).join('');

    UI.closeAllPanels();
    UI.showModal('📊 Estatísticas', `
        <p style="color:#94a3b8; margin-top:0;">Rodada ${gameState.currentRound} · classificação por patrimônio líquido</p>
        ${rows}
    `, [{ text: 'Fechar', onClick: 'closeModal()', class: 'btn-primary' }], true);
}

export function showVictoryInfo() {
    const current = gameState.players[gameState.currentPlayerIndex];
    const haveCerts = current ? CERTIFICATES.filter(c => current.certificates.includes(c)).length : 0;
    const ports = current ? gameState.houses.filter(h => isProperty(h) && h.owner === current.id).length : 0;
    const chk = (ok) => ok ? '✅' : '⬜';

    UI.closeAllPanels();
    UI.showModal('🏆 Como Vencer', `
        <p>Torne-se o <strong style="color:var(--accent-gold);">TugLord Supremo</strong> completando todos os objetivos:</p>
        <ul style="list-style:none; padding:0; line-height:2;">
            <li>${chk(haveCerts === 4)} 4 Certificados (${haveCerts}/4)</li>
            <li>${chk(current && current.hasTuglord)} Status TugLord</li>
            <li>${chk(current && current.hasOceanTug)} Rebocador Oceânico</li>
            <li>${chk(ports >= 5)} 5+ Portos (${ports}/5)</li>
        </ul>
        <p style="font-size:0.85rem; color:#94a3b8;">Progresso de <strong>${current ? current.name : '-'}</strong>. Também vence quem ficar como único não-falido.</p>
    `, [{ text: 'Entendido', onClick: 'closeModal()', class: 'btn-primary' }], true);
}

export function toggleAudio() {
    const muted = Audio.toggleMute();
    UI.showNotification(muted ? '🔇 Áudio desligado' : '🔊 Áudio ligado');
    const btn = document.getElementById('btnToggleAudio');
    if (btn) btn.textContent = muted ? '🔇 Áudio: Desligado' : '🔊 Áudio: Ligado';
}

export function exitGame() {
    UI.showModal('🚪 Sair da Partida', `
        <p>Tem certeza? O progresso não salvo será perdido.</p>
    `, [
        { text: 'Salvar e Sair', onClick: 'saveGame(); location.reload();', class: 'btn-primary' },
        { text: 'Sair sem Salvar', onClick: 'location.reload();', class: 'btn-secondary' },
        { text: 'Cancelar', onClick: 'closeModal();', class: 'btn-secondary' }
    ], true);
}

// ========== COMPARTILHAMENTO ==========

const SHARE_URL = 'https://tuglords.netlify.app';
const SHARE_TEXT = '⚓ Venha jogar TUGLORDS — domine os mares e o mercado portuário!';

// Usa a API nativa de compartilhamento (celular) quando disponível; senão abre
// um modal com WhatsApp / Telegram / X e opção de copiar o link.
export function shareGame() {
    if (navigator.share) {
        navigator.share({ title: 'TUGLORDS', text: SHARE_TEXT, url: SHARE_URL }).catch(() => {});
        return;
    }
    const enc = encodeURIComponent;
    const wa = `https://wa.me/?text=${enc(SHARE_TEXT + ' ' + SHARE_URL)}`;
    const tg = `https://t.me/share/url?url=${enc(SHARE_URL)}&text=${enc(SHARE_TEXT)}`;
    const tw = `https://twitter.com/intent/tweet?text=${enc(SHARE_TEXT)}&url=${enc(SHARE_URL)}`;
    const body = `
        <p style="color:#cbd5e1; text-align:center; margin-top:0;">Chame a tripulação para jogar! ⚓</p>
        <div style="display:grid; gap:0.5rem;">
            <button class="btn-secondary" onclick="window.open('${wa}','_blank','noopener')">💬 WhatsApp</button>
            <button class="btn-secondary" onclick="window.open('${tg}','_blank','noopener')">✈️ Telegram</button>
            <button class="btn-secondary" onclick="window.open('${tw}','_blank','noopener')">𝕏 Twitter / X</button>
            <button class="btn-primary" onclick="copyShareLink()">🔗 Copiar link</button>
        </div>`;
    UI.showModal('📤 Compartilhar', body, [], true);
}

export function copyShareLink() {
    const done = () => UI.showNotification('🔗 Link copiado!');
    const fallback = () => {
        try {
            const ta = document.createElement('textarea');
            ta.value = SHARE_URL;
            ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            document.execCommand('copy');
            ta.remove();
            done();
        } catch (e) {
            UI.showNotification('Copie: ' + SHARE_URL);
        }
    };
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(SHARE_URL).then(done).catch(fallback);
        } else {
            fallback();
        }
    } catch (e) {
        fallback();
    }
}

