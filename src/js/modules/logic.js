import { gameState, TRAINING_QUESTIONS, CERTIFICATES, TECH_CERTIFICATES, CERT_LABELS, CERTIFIED_FEE_MULTIPLIER, CARD_DECK, OCEAN_EVENTS, playerColors, playerIcons } from './state.js';
import * as UI from './ui.js';
import { Audio } from './audio.js';

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
        money: 30000, // R$30.000 inicial (High Stakes)
        position: 0,
        properties: [],
        rolled: false,
        rollValue: 0,
        portTugs: 0,
        hasOceanTug: false,
        hasTuglord: false,
        dockedTugs: { port: 0, ocean: false, tuglord: false, turnsRemaining: 0 },
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
}

export function rollDice() {
    if (gameState.diceRolled) return;

    const diceDisplay = document.getElementById('diceDisplay');
    const dice = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

    let rolls = 0;
    const interval = setInterval(() => {
        const rand1 = Math.floor(Math.random() * 6);
        const rand2 = Math.floor(Math.random() * 6);
        if (diceDisplay) diceDisplay.innerHTML = `${dice[rand1]} ${dice[rand2]}`;
        Audio.playDice();
        rolls++;

        if (rolls > TIMING.diceFrames) {
            clearInterval(interval);
            const final1 = Math.floor(Math.random() * 6) + 1;
            const final2 = Math.floor(Math.random() * 6) + 1;
            const total = final1 + final2;

            if (diceDisplay) {
                diceDisplay.innerHTML = `
                    <div style="display: flex; gap: 0.5rem; align-items: center; justify-content: center; flex-wrap: wrap;">
                        <span>${dice[final1 - 1]}</span>
                        <span>${dice[final2 - 1]}</span>
                        <span style="font-size: 2rem; color: var(--accent-gold);">= ${total}</span>
                    </div>
                `;
            }

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

    UI.showNotification(`🎲 ${direction === 1 ? 'Avançando' : 'Retrocedendo'} ${totalSteps} casas...`);

    const moveInterval = setInterval(() => {
        if (currentStep >= totalSteps) {
            clearInterval(moveInterval);

            const finalPosition = currentPlayer.position;
            const house = gameState.houses[finalPosition];

            const currentHouseName = document.getElementById('currentHouseName');
            if (currentHouseName) currentHouseName.textContent = house.name;

            UI.showNotification(`✅ ${currentPlayer.icon} chegou em ${house.name}!`);

            if (endBtn) endBtn.disabled = false;

            setTimeout(() => showContextualActions(house), TIMING.arrivalPopup);
            return;
        }

        currentStep++;
        // Módulo seguro para posições negativas ao retroceder.
        currentPlayer.position = (((startPosition + direction * currentStep) % len) + len) % len;
        Audio.playMove();

        const stepHouse = gameState.houses[currentPlayer.position];

        // Passagem pela partida (apenas avançando)
        if (direction === 1 && currentPlayer.position === 0 && currentStep < totalSteps) {
            currentPlayer.money += 4000;
            UI.showNotification(`🏁 ${currentPlayer.name} passou pela Partida! +R$4000`);
            UI.renderPlayersPanel();
        }

        UI.updatePlayerPositions();

        const currentHouseName = document.getElementById('currentHouseName');
        if (currentHouseName) currentHouseName.textContent = `→ ${stepHouse.name}`;

    }, TIMING.moveStep);

    setTimeout(() => {
        UI.renderPlayersPanel();
    }, totalSteps * TIMING.moveStep + 500);
}

// ========== GAME LOGIC ACTIONS ==========

export function showLoanOptions() {
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

    if (currentPlayer.dockedTugs.turnsRemaining > 0) {
        currentPlayer.dockedTugs.turnsRemaining--;

        if (currentPlayer.dockedTugs.turnsRemaining === 0) {
            if (currentPlayer.dockedTugs.port > 0) currentPlayer.dockedTugs.port = 0;
            if (currentPlayer.dockedTugs.ocean) currentPlayer.dockedTugs.ocean = false;
            if (currentPlayer.dockedTugs.tuglord) currentPlayer.dockedTugs.tuglord = false;

            UI.showNotification(`✅ ${currentPlayer.name}: Rebocadores liberados!`);
        } else {
            UI.showNotification(`⚓ ${currentPlayer.name}: Em docagem (${currentPlayer.dockedTugs.turnsRemaining} turnos)`);
        }
    }
}

export function handleShipyard(space) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const owner = space.owner !== undefined ? gameState.players.find(p => p.id === space.owner) : null;

    const operationalPortTugs = currentPlayer.portTugs - currentPlayer.dockedTugs.port;
    const operationalOceanTug = currentPlayer.hasOceanTug && !currentPlayer.dockedTugs.ocean;
    const operationalTuglord = currentPlayer.hasTuglord && !currentPlayer.dockedTugs.tuglord;

    const hasOperationalTugs = operationalPortTugs > 0 || operationalOceanTug || operationalTuglord;

    if (!hasOperationalTugs) return;

    const dockingCost = space.repairCost || 75;

    let tugOptions = [];
    if (operationalPortTugs > 0) tugOptions.push({ label: `⚓ Portuário (${operationalPortTugs})`, value: 'port' });
    if (operationalOceanTug) tugOptions.push({ label: `🌊 Oceânico`, value: 'ocean' });
    if (operationalTuglord) tugOptions.push({ label: `⭐ TugLord`, value: 'tuglord' });

    const modalBody = `
        <div style="background: rgba(239, 68, 68, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #ef4444;">
            <p style="color: #f87171; font-weight: 600; margin: 0;">⚠️ DOCAGEM OBRIGATÓRIA</p>
        </div>
        <p style="color: #e0e0e0; margin-bottom: 1rem;">Custo: R$${dockingCost} (${owner ? owner.name : 'Banco'})</p>
        <div style="display: grid; gap: 0.75rem;">
            ${tugOptions.map(tug => `
                <button class="btn-secondary" onclick="executeDocking('${tug.value}', ${dockingCost}, ${owner ? owner.id : 'null'})">
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

    if (!handleMandatoryPayment(currentPlayer, cost, "Docagem", owner)) {
        UI.closeModal();
        return;
    }

    if (tugType === 'port') currentPlayer.dockedTugs.port = 1;
    else if (tugType === 'ocean') currentPlayer.dockedTugs.ocean = true;
    else if (tugType === 'tuglord') currentPlayer.dockedTugs.tuglord = true;

    currentPlayer.dockedTugs.turnsRemaining = 3;

    UI.showNotification(`⚓ Rebocador docado por 3 turnos!`);
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
    Audio.playSuccess();
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

    if (currentPlayer.money < price) {
        UI.showNotification('❌ Saldo insuficiente!');
        return;
    }

    if (tugType === 'ocean') {
        if (currentPlayer.hasOceanTug) {
            UI.showNotification('⚠️ Já possui Rebocador Oceânico!');
            return;
        }

        // Ocean Tug Requirements: All Certs + TugLord (University Master)
        const hasAllCerts = CERTIFICATES.every(c => currentPlayer.certificates.includes(c));

        if (!hasAllCerts) {
            UI.showNotification('⚠️ Requer todos os certificados!');
            return;
        }

        if (!currentPlayer.hasTuglord) {
            UI.showNotification('⚠️ Requer status TugMaster (TugLord)!');
            return;
        }
    }

    currentPlayer.money -= price;

    if (tugType === 'port') currentPlayer.portTugs++;
    else if (tugType === 'ocean') currentPlayer.hasOceanTug = true;

    UI.showNotification(`⚓ Rebocador adquirido!`);
    UI.renderPlayersPanel();
    const actionsDiv = document.getElementById('contextualActions');
    if (actionsDiv) actionsDiv.style.display = 'none';
}

export function handleMandatoryPayment(player, amount, reason, recipient = null) {
    if (player.money >= amount) {
        player.money -= amount;
        if (recipient) recipient.money += amount;
        UI.showNotification(`💸 ${player.name} pagou R$${fmt(amount)} (${reason})`);
        Audio.playMoney();
        UI.renderPlayersPanel();
        return true;
    } else {
        initiateArrest(player, amount, reason, recipient);
        return false;
    }
}

export function initiateArrest(player, debtAmount, reason, creditor) {
    player.bankruptcyStage = 1;

    let totalAssetValue = 0;
    let assetsList = [];

    player.properties.forEach(propName => {
        const prop = gameState.houses.find(h => h.name === propName);
        const val = Math.floor(prop.price * 0.5);
        totalAssetValue += val;
        assetsList.push({ type: 'property', name: propName, value: val, asset: prop });
    });

    for (let i = 0; i < player.portTugs; i++) {
        totalAssetValue += 100;
        assetsList.push({ type: 'port_tug', name: 'Reb. Portuário', value: 100 });
    }
    if (player.hasOceanTug) {
        totalAssetValue += 250;
        assetsList.push({ type: 'ocean_tug', name: 'Reb. Oceânico', value: 250 });
    }
    if (player.hasTuglord) {
        totalAssetValue += 375;
        assetsList.push({ type: 'tuglord', name: 'TugLord', value: 375 });
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
        <p>Seus ativos serão liquidados para cobrir a dívida de R$${debtAmount}.</p>
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

    UI.showModal('💔 Falência', `<p>${player.name} foi eliminado!</p>`);

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
    UI.showModal('🏆 Vitória!', `
        <div style="text-align: center;">
            <h1>${winner.icon} ${winner.name} Venceu!</h1>
            <p>TugLord Supremo!</p>
            <button class="btn-primary" onclick="location.reload()">Nova Partida</button>
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

    return space.rent[level];
}

export function triggerOceanEvent() {
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
            { text: '🧭 Sul (+R$250)', onClick: `chooseRoute('south')` }
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
    currentPlayer.money -= price;
    UI.renderPlayersPanel();

    presentExam(certificate, name, false);
}

export function presentExam(certificate, trainingName, isFree) {
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
    } else {
        UI.showNotification(`❌ Reprovado em ${name}! Tente novamente.`);
    }
    UI.renderPlayersPanel();
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
    UI.renderPlayersPanel();
}

export function executeContract(name, amount) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    currentPlayer.money += amount;
    UI.showNotification(`Executado: ${name} (+R$${amount})`);
    UI.renderPlayersPanel();
    document.getElementById('contextualActions').style.display = 'none';
}

export function visitUniversity() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const missing = CERTIFICATES.filter(c => !currentPlayer.certificates.includes(c));

    if (missing.length === 0) {
        UI.showNotification('Já possui todos os certificados!');
        return;
    }

    const selected = missing[Math.floor(Math.random() * missing.length)];
    presentExam(selected, CERT_LABELS[selected], true);
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
            <p style="font-weight: 600; color: #60a5fa;">💰 Saldo: R$${currentPlayer.money}</p>
            <p style="font-size: 0.85rem; color: #94a3b8;">Suas ações: ${playerStocksList.length} | Dividendos: R$${totalDividends}/turno</p>
        </div>

        ${playerStocksList.length > 0 ? `
        <div style="margin-bottom: 1rem;">
            <p style="font-weight: 600; color: #22c55e;">📊 Suas Ações</p>
            <div style="display: grid; gap: 0.5rem;">
                ${playerStocksList.map(stock => `
                    <div style="padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 0.5rem;">
                        <span style="display: block; color: #e0e0e0;">${stock.name}</span>
                        <span style="font-size: 0.85rem; color: #94a3b8;">${stock.quantity}× | Div: R$${stock.totalDividend}</span>
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
                        <small style="color: #94a3b8;">R$${price} | Dono: ${owner.name} | Disp: ${5 - (prop.stocks || 0)}</small>
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
    if (totalPaid > 0) UI.showNotification(`💰 Pagou R$${totalPaid} em dividendos`);
}

export function openBankTerminal() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    // Terminal completo (ao CAIR na casa do Banco): status + botões de empréstimo.
    const modalBody = bankStatusHTML(currentPlayer) + bankLoanActionsHTML(currentPlayer);
    UI.showModal('🏦 Terminal Bancário', modalBody, [], true);
}

// Acesso SOB DEMANDA (botão 🏦): mostra o STATUS do jogador como um painel —
// saldo, ativos e a Bolsa de Valores que ele administra. SEM botões de
// empréstimo (esses só aparecem ao cair na casa do Banco, em openBankTerminal).
export function openBankStatus() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const note = `<p style="text-align:center; font-size:0.8rem; color:#94a3b8; margin-top:1rem;">
        ℹ️ Empréstimos só podem ser contratados/pagos ao <strong>cair na casa do Banco</strong>.</p>`;
    UI.showModal(`🏦 ${currentPlayer.icon} ${currentPlayer.name} — Status`, bankStatusHTML(currentPlayer) + note, [], true);
}

// Bloco de STATUS do jogador (saldo, ativos, frota, certificados, ações).
function bankStatusHTML(p) {
    const money = p.money.toLocaleString('pt-BR');
    const loansCount = (p.loans || []).length;

    // Portos e oficinas administrados pelo jogador.
    const ports = gameState.houses.filter(h => (h.type === 'port' || h.type === 'property') && h.price && h.owner === p.id);
    const workshops = gameState.houses.filter(h => h.type === 'workshop' && h.owner === p.id);

    // Frota.
    const fleet = [];
    if (p.portTugs > 0) fleet.push(`⚓ Portuários: ${p.portTugs}`);
    if (p.hasOceanTug) fleet.push('🌊 Oceânico');
    if (p.hasTuglord) fleet.push('⭐ Classe TugLord');

    // Certificados.
    const safety = CERTIFICATES.filter(c => p.certificates.includes(c));
    const tech = TECH_CERTIFICATES.filter(c => p.certificates.includes(c));

    // Bolsa de Valores: ações que o jogador administra (possui).
    const stocks = p.stocks || {};
    const stockNames = Object.keys(stocks).filter(n => stocks[n] > 0);
    let stocksHTML = '';
    if (stockNames.length > 0) {
        let totalDiv = 0;
        const rows = stockNames.map(name => {
            const prop = gameState.houses.find(h => h.name === name);
            const div = prop && prop.rent ? Math.floor(prop.rent[0] * 0.5) * stocks[name] : 0;
            totalDiv += div;
            return `<div style="display:flex; justify-content:space-between; font-size:0.85rem; color:#cbd5e1;">
                        <span>${name}</span><span>${stocks[name]}× • R$${div.toLocaleString('pt-BR')}/turno</span>
                    </div>`;
        }).join('');
        stocksHTML = `<div class="bank-section">
            <p class="bank-section-title" style="color:#60a5fa;">📈 Bolsa de Valores (você administra)</p>
            ${rows}
            <div style="border-top:1px solid rgba(255,255,255,0.1); margin-top:0.4rem; padding-top:0.4rem; font-weight:700; color:#22c55e; display:flex; justify-content:space-between;">
                <span>Dividendos/turno</span><span>R$${totalDiv.toLocaleString('pt-BR')}</span>
            </div>
        </div>`;
    } else {
        stocksHTML = `<div class="bank-section">
            <p class="bank-section-title" style="color:#60a5fa;">📈 Bolsa de Valores</p>
            <p style="font-size:0.85rem; color:#94a3b8;">Nenhuma ação administrada.</p>
        </div>`;
    }

    // Empréstimos ativos (apenas informativo no status).
    let loansHTML = '';
    if (loansCount > 0) {
        loansHTML = `<div class="bank-section">
            <p class="bank-section-title" style="color:#f87171;">💳 Empréstimos Ativos</p>
            ${p.loans.map(l => `<div style="font-size:0.85rem; color:#cbd5e1; display:flex; justify-content:space-between;">
                <span>Devido</span><span>R$${l.totalDue.toLocaleString('pt-BR')} • vence em ${l.turnsRemaining} ${l.turnsRemaining === 1 ? 'turno' : 'turnos'}</span>
            </div>`).join('')}
        </div>`;
    }

    return `
        <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem; border-left: 4px solid #3b82f6;">
            <p style="font-weight: 700; color: #60a5fa; font-size:1.1rem;">💰 Saldo: R$${money}</p>
            <p style="font-size: 0.85rem; color: #94a3b8;">Empréstimos ativos: ${loansCount}</p>
        </div>

        <div class="bank-section">
            <p class="bank-section-title">📦 Portos (${ports.length})</p>
            <p style="font-size:0.85rem; color:#94a3b8;">${ports.length ? ports.map(h => h.name).join(', ') : 'Nenhum porto.'}</p>
        </div>

        ${workshops.length ? `<div class="bank-section">
            <p class="bank-section-title">🛠️ Oficinas (${workshops.length})</p>
            <p style="font-size:0.85rem; color:#94a3b8;">${workshops.map(h => h.name).join(', ')}</p>
        </div>` : ''}

        <div class="bank-section">
            <p class="bank-section-title">⚓ Frota</p>
            <p style="font-size:0.85rem; color:#94a3b8;">${fleet.length ? fleet.join(' • ') : 'Sem rebocadores.'}</p>
        </div>

        <div class="bank-section">
            <p class="bank-section-title" style="color:#fbbf24;">🎓 Certificados de Segurança (${safety.length}/4)</p>
            <p style="font-size:0.85rem; color:#94a3b8;">${safety.length ? safety.map(c => CERT_LABELS[c] || c).join(', ') : 'Nenhum.'}</p>
            <p class="bank-section-title" style="color:#60a5fa; margin-top:0.5rem;">🔧 Certificados Técnicos (${tech.length}/4)</p>
            <p style="font-size:0.85rem; color:#94a3b8;">${tech.length ? tech.map(c => CERT_LABELS[c] || c).join(', ') : 'Nenhum.'}</p>
        </div>

        ${stocksHTML}
        ${loansHTML}
    `;
}

// Bloco de AÇÕES de empréstimo (só no terminal ao cair na casa do Banco).
function bankLoanActionsHTML(currentPlayer) {
    return `
        <div class="bank-section" style="margin-top:1rem; border-top:2px solid rgba(255,255,255,0.1); padding-top:1rem;">
             <p style="font-weight: 600; color: #e0e0e0; margin-bottom: 0.5rem;">📋 Empréstimos Disponíveis</p>
             <div style="display: grid; gap: 0.5rem;">
                 <button class="btn-secondary" onclick="takeLoan(5000, 0.10)">💵 R$5.000 (Juros 10% • paga R$5.500 em 5 turnos)</button>
                 <button class="btn-secondary" onclick="takeLoan(10000, 0.15)">💵 R$10.000 (Juros 15% • paga R$11.500 em 5 turnos)</button>
                 <button class="btn-secondary" onclick="takeLoan(20000, 0.20)">💵 R$20.000 (Juros 20% • paga R$24.000 em 5 turnos)</button>
             </div>
        </div>

        ${currentPlayer.loans.length > 0 ? `
        <div class="bank-section">
             <p style="font-weight: 600; color: #f87171; margin-bottom: 0.5rem;">💳 Pagar Empréstimos</p>
             <div style="display: grid; gap: 0.5rem;">
                 ${currentPlayer.loans.map((l, i) => `
                    <button class="btn-secondary" onclick="payLoan(${i})">
                        💸 Pagar R$${l.totalDue.toLocaleString('pt-BR')} (vence em ${l.turnsRemaining} ${l.turnsRemaining === 1 ? 'turno' : 'turnos'})
                    </button>
                 `).join('')}
             </div>
        </div>
        ` : ''}

        ${(currentPlayer.properties.length > 0 || currentPlayer.portTugs > 0) ? `
        <div class="bank-section">
             <p style="font-weight: 600; color: #fbbf24; margin-bottom: 0.5rem;">🔨 Liquidação Voluntária (50%)</p>
             <div style="display: grid; gap: 0.5rem; max-height: 150px; overflow-y: auto;">
                 ${currentPlayer.properties.map(p => `
                    <button class="btn-secondary" onclick="liquidateAsset('property', '${p.replace(/'/g, "\\'")}')">
                        🏢 ${p}
                    </button>
                 `).join('')}
                 ${currentPlayer.portTugs > 0 ? `<button class="btn-secondary" onclick="liquidateAsset('port_tug', null)">⚓ Rebocador Portuário (R$100)</button>` : ''}
                 ${currentPlayer.hasOceanTug ? `<button class="btn-secondary" onclick="liquidateAsset('ocean_tug', null)">🌊 Rebocador Oceânico (R$250)</button>` : ''}
             </div>
        </div>
        ` : ''}
    `;
}

export function takeLoan(amount, rate = 0.10) {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const totalDue = Math.floor(amount * (1 + rate));
    currentPlayer.loans.push({ principal: amount, totalDue, turnsRemaining: 5, rate });
    currentPlayer.money += amount;
    UI.showNotification(`Empréstimo de R$${amount.toLocaleString('pt-BR')} realizado!`);
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

export function checkVictory() {
    if (gameState.phase !== 'playing') return false;
    const winner = gameState.players.find(p => meetsSupremeVictory(p));
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
        val = Math.floor(prop.price * 0.5);
        prop.owner = undefined;
        prop.stocks = 0;
        currentPlayer.properties = currentPlayer.properties.filter(p => p !== id);
        if (currentPlayer.stocks[id]) delete currentPlayer.stocks[id];
    } else if (type === 'port_tug') {
        val = 100;
        currentPlayer.portTugs--;
    } else if (type === 'ocean_tug') {
        val = 250;
        currentPlayer.hasOceanTug = false;
    }

    currentPlayer.money += val;
    UI.showNotification(`Ativo liquidado (+R$${val})`);
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
        { msg: 'Encontrou carga perdida! +R$100', val: 100 },
        { msg: 'Multa ambiental! -R$100', val: -100 },
        { msg: 'Manutenção extra! -R$50', val: -50 },
        { msg: 'Bonificação contratual! +R$150', val: 150 }
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
    const NUM_CARDS = 5;
    gameState._cardDraw = Array.from({ length: NUM_CARDS },
        () => CARD_DECK[Math.floor(Math.random() * CARD_DECK.length)]);
    gameState._cardPicked = false;

    const label = type === 'surprise' ? 'Carta Surpresa' : 'Sorte ou Azar';
    let cards = '';
    for (let i = 0; i < NUM_CARDS; i++) {
        const c = gameState._cardDraw[i];
        const good = c.val >= 0;
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

    // Diagnóstico no console (DevTools): status de abertura e validação visual.
    console.log(`%c[CARTAS] 🎴 Seletor aberto — "${label}" (${NUM_CARDS} cartas)`,
        'color:#fbbf24;font-weight:bold');
    console.table(gameState._cardDraw.map((c, i) => ({
        carta: i, tipo: c.val >= 0 ? 'SORTE' : 'AZAR', valor: c.val, efeito: c.msg
    })));
    requestAnimationFrame(() => validateCardVisibility('Status de visualização', type));
}

// Validação de console (Chrome DevTools): reporta se as cartas de Sorte/Azar
// estão de fato renderizadas e visíveis no DOM. Útil para depurar a exibição.
function validateCardVisibility(stage, type) {
    try {
        console.group(`%c[CARTAS] ${stage} — tipo: ${type}`, 'color:#fbbf24;font-weight:bold');

        const modal = document.getElementById('gameModal');
        const overlay = document.querySelector('.modal-overlay');
        const cards = modal ? modal.querySelectorAll('.game-card') : [];

        console.log('#gameModal presente:', !!modal);
        console.log('.modal-overlay presente:', !!overlay,
            overlay ? `(z-index ${getComputedStyle(overlay).zIndex})` : '');
        console.log('Cartas no DOM (#gameModal .game-card):', cards.length, '(esperado 5)');

        if (cards.length) {
            const first = cards[0];
            const cs = getComputedStyle(first);
            const r = first.getBoundingClientRect();
            const inView = r.width > 0 && r.height > 0 &&
                r.bottom > 0 && r.right > 0 &&
                r.top < window.innerHeight && r.left < window.innerWidth;
            console.table({
                display: cs.display, visibility: cs.visibility, opacity: cs.opacity,
                largura_px: Math.round(r.width), altura_px: Math.round(r.height),
                x: Math.round(r.x), y: Math.round(r.y), naViewport: inView
            });
            const ok = cs.display !== 'none' && cs.visibility !== 'hidden' &&
                parseFloat(cs.opacity) > 0 && r.width > 0 && r.height > 0 && inView;
            console.log(`%c${ok ? '✅ CARTAS VISÍVEIS — renderização OK' : '❌ CARTAS NÃO VISÍVEIS — verifique CSS/layout/z-index'}`,
                `color:${ok ? '#22c55e' : '#ef4444'};font-weight:bold;font-size:13px`);
        } else {
            console.log('%c❌ Nenhuma carta no DOM — showCardPicker não renderizou as cartas',
                'color:#ef4444;font-weight:bold;font-size:13px');
        }
        console.groupEnd();
    } catch (e) {
        console.warn('[CARTAS] Falha na validação de console:', e);
    }
}

// Revela a carta escolhida (vira com animação), aplica o efeito e fecha o modal.
export function pickCard(index, type) {
    if (gameState._cardPicked) return; // só uma escolha por rodada
    const draw = gameState._cardDraw;
    if (!draw) return;
    gameState._cardPicked = true;

    const effect = draw[index];
    console.log(`%c[CARTAS] 👆 Carta escolhida: índice ${index} → ${effect.val >= 0 ? 'SORTE' : 'AZAR'} (${effect.msg})`,
        'color:#fbbf24;font-weight:bold');
    const modal = document.getElementById('gameModal');
    const cards = modal ? modal.querySelectorAll('.game-card') : [];
    console.log(`[CARTAS] Cartas no modal para revelar: ${cards.length}`);
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
    const saldoAntes = currentPlayer.money;
    setTimeout(() => {
        if (effect.val > 0) {
            currentPlayer.money += effect.val;
            UI.showNotification(`🍀 ${effect.msg}`);
            Audio.playSuccess();
        } else if (effect.val < 0) {
            handleMandatoryPayment(currentPlayer, Math.abs(effect.val), 'Carta');
        } else {
            UI.showNotification(effect.msg);
        }
        console.log(`%c[CARTAS] 💰 Efeito aplicado: ${effect.msg} | saldo ${saldoAntes} → ${currentPlayer.money}`,
            'color:#22c55e;font-weight:bold');
        UI.renderPlayersPanel();
    }, 650);

    // Fecha o modal das cartas após o jogador ver o resultado.
    setTimeout(() => {
        UI.closeModal();
        gameState._cardDraw = null;
        const actionsDiv = document.getElementById('contextualActions');
        if (actionsDiv) actionsDiv.style.display = 'none';
        console.log('%c[CARTAS] ✔️ Modal fechado — fluxo concluído', 'color:#fbbf24');
    }, 2800);
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
            body = `<p>Este porto está à venda por <strong style="color: var(--accent-gold);">R$ ${fmt(house.price)}</strong>.</p>`;
            buttons.push({
                text: `Comprar (R$ ${fmt(house.price)})`,
                onClick: `buyProperty(gameState.houses[${house.pos}])`,
                class: 'btn-primary'
            });
            buttons.push({
                text: 'Passar',
                onClick: `closeModal()`,
                class: 'btn-secondary'
            });
        } else if (owner.id === currentPlayer.id) {
            body = `<p style="color: #22c55e;">✅ Você é o dono deste porto!</p>`;
            buttons.push({ text: 'Continuar', onClick: `closeModal()`, class: 'btn-primary' });
        } else {
            if (currentPlayer.skipNextRent) {
                body = `<p style="color: #10b981;">⛵ <strong>Vento Favorável!</strong><br>Aluguel dispensado nesta rodada.</p>`;
                currentPlayer.skipNextRent = false;
                buttons.push({ text: 'Ótimo!', onClick: `closeModal()`, class: 'btn-primary' });
            } else {
                const rent = calculateRent(house, owner);
                body = `
                    <p>Propriedade de <strong>${owner.name}</strong>.</p>
                    <p style="color: #ef4444; font-size: 1.2rem;">Aluguel: R$ ${fmt(rent)}</p>
                `;
                // Auto-pay logic wrapped in a "Pay" button for user agency (or auto after delay)
                // User requested "popup", implying interaction. Let's make it manual click to close/pay.
                buttons.push({
                    text: `Pagar R$ ${fmt(rent)}`,
                    onClick: `handleMandatoryPayment(gameState.players[${gameState.currentPlayerIndex}], ${rent}, 'Aluguel (${house.name})', gameState.players.find(p => p.id === ${owner.id})); UI.closeModal();`,
                    class: 'btn-primary'
                });
            }
        }
    }

    // ========== WORKSHOP (Oficina) ==========
    else if (house.type === 'workshop' && house.price) {
        const owner = house.owner !== undefined ? gameState.players.find(p => p.id === house.owner) : null;

        if (!owner) {
            body = `<p>Esta oficina está à venda por <strong style="color: var(--accent-gold);">R$ ${fmt(house.price)}</strong>.</p>
                <p style="color: #94a3b8; font-size: 0.9rem;">📝 Após a compra, você fará o <strong>exame técnico</strong> de ${CERT_LABELS[house.certificate] || house.certificate} para emitir o certificado.</p>`;
            buttons.push({
                text: `Comprar (R$ ${fmt(house.price)})`,
                onClick: `buyProperty(gameState.houses[${house.pos}])`,
                class: 'btn-primary'
            });
            buttons.push({ text: 'Passar', onClick: `closeModal()`, class: 'btn-secondary' });
        } else if (owner.id === currentPlayer.id) {
            if (!currentPlayer.certificates.includes(house.certificate)) {
                body = `<p>Como dono, você pode emitir o certificado <strong>${CERT_LABELS[house.certificate] || house.certificate}</strong> — mas precisa conhecer a área: faça o exame técnico (gratuito).</p>`;
                buttons.push({
                    text: '📝 Fazer Exame Técnico',
                    onClick: `presentExam('${house.certificate}', '${house.name}', true);`,
                    class: 'btn-primary'
                });
            } else {
                body = `<p style="color: #22c55e;">✅ Oficina sob sua gestão.</p>`;
                buttons.push({ text: 'Continuar', onClick: `closeModal()`, class: 'btn-primary' });
            }
        } else {
            // Oficina certificada (dono tem o certificado técnico da área) cobra
            // serviço premium — renda extra para quem investiu no certificado.
            const certified = owner.certificates.includes(house.certificate);
            const serviceFee = certified
                ? Math.round(house.serviceFee * CERTIFIED_FEE_MULTIPLIER)
                : house.serviceFee;
            body = `
                <p>Propriedade de <strong>${owner.name}</strong>.</p>
                ${certified ? `<p style="color: var(--accent-gold);">🎓 Oficina certificada em ${CERT_LABELS[house.certificate] || house.certificate} — serviço premium (+${Math.round((CERTIFIED_FEE_MULTIPLIER - 1) * 100)}%).</p>` : ''}
                <p style="color: #ef4444;">Taxa de Serviço: R$ ${fmt(serviceFee)}</p>
            `;
            buttons.push({
                text: `Pagar R$ ${fmt(serviceFee)}`,
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
            body = `<p>Este serviço está à venda por <strong style="color: var(--accent-gold);">R$ ${fmt(house.price)}</strong>.</p>`;
            buttons.push({
                text: `Comprar (R$ ${fmt(house.price)})`,
                onClick: `buyProperty(gameState.houses[${house.pos}])`,
                class: 'btn-primary'
            });
            buttons.push({ text: 'Passar', onClick: `closeModal()`, class: 'btn-secondary' });
        } else if (owner.id === currentPlayer.id) {
            body = `<p style="color: #22c55e;">✅ Você possui este serviço.</p>`;
            if (house.name.includes('Estaleiro') && !currentPlayer.hasTuglord && currentPlayer.money >= house.tuglordBuildCost) {
                buttons.push({
                    text: `Comissionar TugLord (R$ ${fmt(house.tuglordBuildCost)})`,
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
            text: `Comprar (R$ ${fmt(house.price)})`,
            onClick: `buyTug(gameState.houses[${house.pos}]); UI.closeModal();`,
            class: 'btn-primary'
        });
        buttons.push({ text: 'Não agora', onClick: `closeModal()`, class: 'btn-secondary' });
    }

    // ========== TRAINING ==========
    else if (house.type === 'training' && house.price) {
        if (!currentPlayer.certificates.includes(house.certificate)) {
            body = `<p>Treinamento disponível: <strong>${house.certificate.toUpperCase()}</strong>.</p>`;
            buttons.push({
                text: `Fazer Treinamento (R$ ${fmt(house.price)})`,
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
        body = `<p>🎓 Universidade do Mar — faça exames dos <strong>certificados de segurança obrigatórios</strong> (Incêndio, Homem ao Mar, Colisão, Abandono). Exame gratuito!</p>`;
        buttons.push({
            text: 'Acessar Universidade',
            onClick: `visitUniversity();`, // Opens exam modal
            class: 'btn-primary'
        });
        buttons.push({ text: 'Passar', onClick: `closeModal()`, class: 'btn-secondary' });
    }

    // ========== BANK ==========
    else if (house.type === 'bank') {
        body = `<p>Acesse o terminal bancário para empréstimos e pagamentos.</p>`;
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
            text: `Pagar R$ ${fmt(house.price)}`,
            onClick: `payTax(${house.price}); UI.closeModal();`,
            class: 'btn-primary'
        });
    }

    // ========== LUCK/SURPRISE ==========
    else if (house.type === 'luck' || house.type === 'surprise') {
        // Abre o modal com a fileira de cartas para o jogador escolher.
        showCardPicker(house.type);
        return;
    }

    // ========== EVENTS (Ocean) ==========
    else if (house.type === 'ocean_event' || house.type === 'event') {
        if (operationalTugs(currentPlayer).total === 0) {
            body = `<p style="color: #ef4444;">⚠️ Navegação Perigosa!</p>
                     <p>Você precisa de pelo menos um <strong>rebocador operacional</strong> para enfrentar estes mares.</p>`;
            buttons.push({ text: 'Recuar', onClick: `closeModal()`, class: 'btn-secondary' });
        } else {
            // triggerOceanEvent handles its own modal, so we just call it.
            triggerOceanEvent();
            return;
        }
    }

    // Specific Contracts
    else if (house.type === 'contract' && house.price) {
        const hasTug = currentPlayer.portTugs > 0 || currentPlayer.hasOceanTug || currentPlayer.hasTuglord;

        if (hasTug) {
            body = `<p>Contrato disponível para execução.</p>`;
            buttons.push({
                text: `Executar (+R$ ${fmt(house.price)})`,
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

const SAVE_KEY = 'tuglords_save_v1';

export function saveGame() {
    if (gameState.phase === 'setup') {
        UI.showNotification('⚠️ Inicie uma partida para salvar.');
        return;
    }
    try {
        const data = {
            version: 1,
            savedAt: new Date().toISOString(),
            players: gameState.players,
            currentPlayerIndex: gameState.currentPlayerIndex,
            currentRound: gameState.currentRound,
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
        UI.showNotification('⚠️ Nenhum jogo salvo encontrado.');
        return;
    }
    try {
        const data = JSON.parse(raw);
        gameState.players = data.players;
        gameState.currentPlayerIndex = data.currentPlayerIndex;
        gameState.currentRound = data.currentRound;
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
    total += player.portTugs * 100;
    if (player.hasOceanTug) total += 250;
    if (player.hasTuglord) total += 375;
    (player.loans || []).forEach(l => { total -= l.totalDue; });
    return total;
}

export function showStatistics() {
    const ranked = [...gameState.players].sort((a, b) => netWorth(b) - netWorth(a));
    const rows = ranked.map((p, i) => {
        const ports = gameState.houses.filter(h => isProperty(h) && h.owner === p.id).length;
        const status = p.isEliminated ? '💀 Eliminado' : `R$ ${fmt(netWorth(p))}`;
        return `
            <div style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem; border-radius:0.5rem; background:rgba(255,255,255,0.05); border-left:4px solid ${p.color}; margin-bottom:0.5rem; ${p.isEliminated ? 'opacity:0.55;' : ''}">
                <span style="font-weight:900; width:24px; color:var(--accent-gold);">${i + 1}º</span>
                <span style="font-size:1.3rem;">${p.icon}</span>
                <div style="flex:1; min-width:0;">
                    <div style="font-weight:700;">${p.name}</div>
                    <div style="font-size:0.78rem; color:#94a3b8;">⚓ ${ports} portos · 🎓 ${p.certificates.length}/4 · 💰 R$ ${fmt(p.money)}</div>
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

