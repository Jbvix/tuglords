import { gameState } from './state.js';

// ========== UI FUNCTIONS ==========

export function openPanel(panelId, button) {
    closeAllPanels();

    const panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.add('active');
        document.getElementById('panelOverlay').classList.add('active');
    }

    if (button) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }
}

export function showManual() {
    document.getElementById('presentationScreen').style.display = 'none';
    document.getElementById('manualScreen').style.display = 'flex';
}

export function hideManual() {
    document.getElementById('manualScreen').style.display = 'none';
    document.getElementById('presentationScreen').style.display = 'flex';
}

export function goToSetup() {
    document.getElementById('presentationScreen').style.display = 'none';
    document.getElementById('setupScreen').style.display = 'flex';

    // Initialize default players only when entering setup
    if (gameState.players.length === 0) {
        window.addPlayer(); // Add player 1
        window.addPlayer(); // Add player 2
    }
}

export function closePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.remove('active');
    }

    const anyPanelOpen = document.querySelector('.sliding-panel.active');
    if (!anyPanelOpen) {
        document.getElementById('panelOverlay').classList.remove('active');
    }
}

export function closeAllPanels() {
    document.querySelectorAll('.sliding-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    const overlay = document.getElementById('panelOverlay');
    if (overlay) overlay.classList.remove('active');
}

export function toggleBoard(button) {
    // On mobile, board is already visible
    closeAllPanels();
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if (button) button.classList.add('active');
}

export function switchTab(button, tabId) {
    const card = button.closest('.player-card');

    card.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    card.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

export function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: ${gameState.phase === 'setup' ? '20px' : '80px'};
        left: 50%;
        transform: translateX(-50%);
        background: rgba(251, 191, 36, 0.95);
        color: #1a2942;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        font-weight: 700;
        z-index: 1000;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        animation: slideDown 0.3s ease;
        max-width: 90%;
        text-align: center;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

export function showModal(title, body, buttons = [], closeBtn = true) {
    // Check if modal exists
    let modal = document.getElementById('gameModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'gameModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            padding: 1.5rem;
            backdrop-filter: blur(5px);
            opacity: 0;
            transition: opacity 0.3s;
        `;
        document.body.appendChild(modal);
    }

    const buttonsHTML = buttons.map(btn => `
        <button class="btn-primary" onclick="${btn.onClick}" style="width: 100%;">
            ${btn.text}
        </button>
    `).join('');

    modal.innerHTML = `
        <div style="background: #1e293b; border-radius: 1rem; max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); border: 1px solid rgba(255,255,255,0.1); transform: scale(0.95); transition: transform 0.3s;">
            <div style="padding: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: #1e293b; z-index: 10;">
                <h3 style="margin: 0; font-size: 1.25rem; color: #fbbf24; font-weight: 700;">${title}</h3>
                ${closeBtn ? '<button onclick="closeModal()" style="background: transparent; border: none; color: #94a3b8; font-size: 1.5rem; cursor: pointer;">✕</button>' : ''}
            </div>
            <div style="padding: 1.5rem;">
                ${body}
                ${buttonsHTML ? `<div style="margin-top: 1.5rem; display: grid; gap: 0.75rem;">${buttonsHTML}</div>` : ''}
            </div>
        </div>
    `;

    // Animation
    requestAnimationFrame(() => {
        modal.style.opacity = '1';
        modal.querySelector('div').style.transform = 'scale(1)';
    });
}

export function closeModal() {
    const modal = document.getElementById('gameModal');
    if (modal) {
        modal.style.opacity = '0';
        modal.querySelector('div').style.transform = 'scale(0.95)';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// ========== RENDER FUNCTIONS ==========

export function renderBoard() {
    const boardDiv = document.getElementById('visualBoard');
    const boardLayout = gameState.houses;

    let boardHTML = '<div class="board-game">';

    // Canto inferior direito (PARTIDA - posição 0)
    boardHTML += '<div class="board-corner" style="grid-column: 10; grid-row: 10;"><span>🏁</span></div>';

    // Lado INFERIOR (posições 1-8) - grid-row: 10, colunas 9-2
    for (let i = 1; i <= 8; i++) {
        const house = boardLayout[i];
        const col = 10 - i; // Colunas 9, 8, 7, 6, 5, 4, 3, 2
        boardHTML += `<div class="board-house" data-position="${house.pos}" style="grid-column: ${col}; grid-row: 10;" onclick="selectHouse(${house.pos})">`;
        boardHTML += `<div class="house-icon">${house.icon}</div>`;
        boardHTML += `<div class="house-name">${house.name}</div>`;
        if (house.price) boardHTML += `<div class="house-price">R$ ${house.price}</div>`;
        boardHTML += '<div class="house-players"></div></div>';
    }

    // Canto inferior esquerdo (SORTE - posição 9)
    boardHTML += '<div class="board-corner" style="grid-column: 1; grid-row: 10;"><span>🍀</span></div>';

    // Lado ESQUERDO (posições 10-17) - grid-column: 1, linhas 9-2
    for (let i = 10; i <= 17; i++) {
        const house = boardLayout[i];
        const row = 10 - (i - 9); // Linhas 9, 8, 7, 6, 5, 4, 3, 2
        boardHTML += `<div class="board-house" data-position="${house.pos}" style="grid-column: 1; grid-row: ${row};" onclick="selectHouse(${house.pos})">`;
        boardHTML += `<div class="house-icon">${house.icon}</div>`;
        boardHTML += `<div class="house-name">${house.name}</div>`;
        if (house.price) boardHTML += `<div class="house-price">R$ ${house.price}</div>`;
        boardHTML += '<div class="house-players"></div></div>';
    }

    // Canto superior esquerdo (CERTIFICADO TUGLORD - posição 18)
    boardHTML += '<div class="board-corner" style="grid-column: 1; grid-row: 1;"><span>🎖️</span></div>';

    // Lado SUPERIOR (posições 19-26) - grid-row: 1, colunas 2-9
    for (let i = 19; i <= 26; i++) {
        const house = boardLayout[i];
        const col = (i - 18) + 1; // Colunas 2, 3, 4, 5, 6, 7, 8, 9
        boardHTML += `<div class="board-house" data-position="${house.pos}" style="grid-column: ${col}; grid-row: 1;" onclick="selectHouse(${house.pos})">`;
        boardHTML += `<div class="house-icon">${house.icon}</div>`;
        boardHTML += `<div class="house-name">${house.name}</div>`;
        if (house.price) boardHTML += `<div class="house-price">R$ ${house.price}</div>`;
        boardHTML += '<div class="house-players"></div></div>';
    }

    // Canto superior direito (BANCO - posição 27)
    boardHTML += '<div class="board-corner" style="grid-column: 10; grid-row: 1;"><span>🏛️</span></div>';

    // Lado DIREITO (posições 28-35) - grid-column: 10, linhas 2-9
    for (let i = 28; i <= 35; i++) {
        const house = boardLayout[i];
        const row = (i - 27) + 1; // Linhas 2, 3, 4, 5, 6, 7, 8, 9
        boardHTML += `<div class="board-house" data-position="${house.pos}" style="grid-column: 10; grid-row: ${row};" onclick="selectHouse(${house.pos})">`;
        boardHTML += `<div class="house-icon">${house.icon}</div>`;
        boardHTML += `<div class="house-name">${house.name}</div>`;
        if (house.price) boardHTML += `<div class="house-price">R$ ${house.price}</div>`;
        boardHTML += '<div class="house-players"></div></div>';
    }

    // Centro - Branding
    boardHTML += '<div class="board-center">';
    boardHTML += '<div class="board-center-icon">⚓</div>';
    boardHTML += '<h3>TUGLORDS</h3>';
    boardHTML += '<p style="font-size: 0.7rem; color: #94a3b8; margin: 0.5rem 0 0 0;">Domínio Portuário</p>';
    boardHTML += '</div>';

    boardHTML += '</div>';

    boardDiv.innerHTML = boardHTML;

    updatePlayerPositions();
}

export function updatePlayerPositions() {
    // Clear all player pawns
    document.querySelectorAll('.house-players').forEach(el => el.innerHTML = '');

    // Remove active class from all houses
    document.querySelectorAll('.board-house').forEach(house => house.classList.remove('active'));
    document.querySelectorAll('.board-corner').forEach(corner => corner.classList.remove('active'));

    // Adicionar indicadores de ownership
    document.querySelectorAll('.board-house').forEach(houseEl => {
        const position = parseInt(houseEl.getAttribute('data-position'));
        const house = gameState.houses[position];

        // Remover ownership anterior
        const oldOwnerBar = houseEl.querySelector('.owner-bar');
        if (oldOwnerBar) oldOwnerBar.remove();

        // Se tem dono, adicionar indicador
        if (house && house.owner !== undefined) {
            const owner = gameState.players.find(p => p.id === house.owner);
            if (owner) {
                const ownerBar = document.createElement('div');
                ownerBar.className = 'owner-bar';
                ownerBar.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: ${owner.color};
                    box-shadow: 0 0 8px ${owner.color};
                `;
                ownerBar.title = `Dono: ${owner.name}`;
                houseEl.style.position = 'relative';
                houseEl.insertBefore(ownerBar, houseEl.firstChild);
            }
        }
    });

    // Place players on their positions
    gameState.players.forEach(player => {
        let houseEl = document.querySelector(`[data-position="${player.position}"] .house-players`);

        if (!houseEl) {
            // Corners handling
            const allHousePlayers = document.querySelectorAll('.house-players');
            allHousePlayers.forEach(el => {
                const parent = el.closest('.board-corner');
                if (parent) {
                    const gridCol = parent.style.gridColumn;
                    const gridRow = parent.style.gridRow;

                    if (gridCol === '10' && gridRow === '10' && player.position === 0) houseEl = el;
                    if (gridCol === '1' && gridRow === '10' && player.position === 9) houseEl = el;
                    if (gridCol === '1' && gridRow === '1' && player.position === 18) houseEl = el;
                    if (gridCol === '10' && gridRow === '1' && player.position === 27) houseEl = el;
                }
            });
        }

        if (houseEl) {
            const pawn = document.createElement('div');
            pawn.className = 'player-pawn';
            pawn.style.background = player.color;
            pawn.textContent = player.icon;
            pawn.title = player.name;
            houseEl.appendChild(pawn);
        }

        // Highlight current player's position
        if (player === gameState.players[gameState.currentPlayerIndex]) {
            const currentHouse = document.querySelector(`[data-position="${player.position}"]`);
            if (currentHouse) {
                currentHouse.classList.add('active');
            } else {
                const allCorners = document.querySelectorAll('.board-corner');
                allCorners.forEach(corner => {
                    const gridCol = corner.style.gridColumn;
                    const gridRow = corner.style.gridRow;
                    // Corner 0 (Start): Col 10, Row 10
                    if (gridCol === '10' && gridRow === '10' && player.position === 0) corner.classList.add('active');
                    // Corner 18 (TugLord): Col 1, Row 1
                    if (gridCol === '1' && gridRow === '1' && player.position === 18) corner.classList.add('active');
                    // Corner 9 (Luck): Col 1, Row 10
                    if (gridCol === '1' && gridRow === '10' && player.position === 9) corner.classList.add('active');
                    // Corner 27 (Bank): Col 10, Row 1
                    if (gridCol === '10' && gridRow === '1' && player.position === 27) corner.classList.add('active');
                });
            }
        }
    });
}

export function selectHouse(position) {
    const house = gameState.houses[position];
    if (!house) return;

    const owner = house.owner ? gameState.players.find(p => p.id === house.owner) : null;

    // Calculate current rent if it's a property
    let rentInfo = '';
    if (house.type === 'property' && house.rent) {
        rentInfo = `<div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 0.5rem;">
            <p style="margin: 0; color: #94a3b8; font-size: 0.85rem;">Aluguel Base: R$${house.rent[0]}</p>
        </div>`;
    }

    const modalBody = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">${house.icon}</div>
            <h2 style="color: var(--accent-gold); margin: 0 0 0.5rem 0;">${house.name}</h2>
            ${house.price ? `<p style="font-size: 1.25rem; font-weight: 700; color: #e0e0e0;">R$ ${house.price}</p>` : ''}
            <p style="color: #94a3b8; font-style: italic;">${getHouseTypeLabel(house.type)}</p>
        </div>

        ${owner ? `
            <div style="background: ${owner.color}20; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid ${owner.color}; margin-bottom: 1rem;">
                <p style="margin: 0; font-weight: 600; color: #e0e0e0;">Proprietário: ${owner.icon} ${owner.name}</p>
            </div>
        ` : ''}

        ${rentInfo}
    `;

    showModal('Detalhes', modalBody, [{ text: 'Fechar', onClick: 'closeModal()' }], true);
}

function getHouseTypeLabel(type) {
    const types = {
        'start': 'Início',
        'port': 'Porto Comercial',
        'event': 'Evento Oceânico',
        'fuel': 'Posto de Combustível',
        'bank': 'Banco',
        'surprise': 'Surpresa',
        'workshop': 'Oficina/Estaleiro',
        'corner': 'Canto',
        'luck': 'Sorte ou Azar',
        'stock': 'Bolsa de Valores',
        'training': 'Centro de Treinamento',
        'tax': 'Taxa',
        'tuglord': 'Certificação TugLord'
    };
    return types[type] || 'Local';
}

export function renderPlayersPanel() {
    const container = document.getElementById('playersContainer');
    if (!container) return;

    container.innerHTML = gameState.players.map((player, index) => {
        const portTugsOperational = player.portTugs - player.dockedTugs.port;
        const oceanTugOperational = player.hasOceanTug && !player.dockedTugs.ocean;
        const tuglordOperational = player.hasTuglord && !player.dockedTugs.tuglord;

        let assetsList = '';
        if (player.properties.length > 0) {
            assetsList += `<p class="text-sm text-slate-300" style="margin: 0.5rem 0;">
                📦 <strong>Propriedades (${player.properties.length}):</strong><br>
                <span style="color: #94a3b8; font-size: 0.85rem;">${player.properties.join(', ')}</span>
            </p>`;
        }

        let fleetInfo = '';
        if (player.portTugs > 0 || player.hasOceanTug || player.hasTuglord) {
            fleetInfo += `<p class="text-sm text-slate-300" style="margin: 0.5rem 0;">
                ⚓ <strong>Frota:</strong><br>`;

            if (player.portTugs > 0) {
                fleetInfo += `<span style="color: ${portTugsOperational > 0 ? '#22c55e' : '#ef4444'}; font-size: 0.85rem;">
                    • Portuários: ${portTugsOperational}/${player.portTugs} operacionais
                </span><br>`;
            }

            if (player.hasOceanTug) {
                fleetInfo += `<span style="color: ${oceanTugOperational ? '#22c55e' : '#ef4444'}; font-size: 0.85rem;">
                    • Oceânico: ${oceanTugOperational ? 'Operacional' : 'Docado'}
                </span><br>`;
            }

            if (player.hasTuglord) {
                fleetInfo += `<span style="color: ${tuglordOperational ? '#fbbf24' : '#ef4444'}; font-size: 0.85rem;">
                    • Classe TugLord: ${tuglordOperational ? 'Operacional' : 'Docado'}
                </span>`;
            }

            fleetInfo += `</p>`;
        }

        let certsInfo = '';
        if (player.certificates.length > 0) {
            certsInfo += `<p class="text-sm text-slate-300" style="margin: 0.5rem 0;">
                🎓 <strong>Certificados (${player.certificates.length}):</strong><br>
                <span style="color: #94a3b8; font-size: 0.85rem;">${player.certificates.join(', ')}</span>
            </p>`;
        }

        const assetsContent = assetsList || fleetInfo || certsInfo
            ? assetsList + fleetInfo + certsInfo
            : '<p class="text-sm text-slate-400">Nenhum ativo ainda</p>';

        return `
        <div class="player-card ${index === gameState.currentPlayerIndex ? 'active' : ''}" 
             style="border-left: 4px solid ${player.color};">
            <div class="player-header">
                <span class="player-name">${player.icon} ${player.name}</span>
                <span class="player-money">R$ ${player.money.toLocaleString('pt-BR')}</span>
            </div>
            <div class="tabs-container">
                <button class="tab-btn active" onclick="switchTab(this, 'fin-${player.id}')">Finanças</button>
                <button class="tab-btn" onclick="switchTab(this, 'assets-${player.id}')">Ativos</button>
            </div>
            <div class="tab-content active" id="fin-${player.id}">
                <div class="badge">
                    <span class="dot" style="background: ${player.color};"></span>
                    <span>Posição: ${player.position}</span>
                </div>
            </div>
            <div class="tab-content" id="assets-${player.id}">
                ${assetsContent}
            </div>
        </div>
    `;
    }).join('');
}

export function updateTurnDisplay() {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const nameEl = document.getElementById('currentPlayerName');
    const turnEl = document.getElementById('currentTurnPlayer');
    const roundEl = document.getElementById('currentRound');

    if (nameEl) nameEl.textContent = `${currentPlayer.icon} ${currentPlayer.name}`;
    if (turnEl) turnEl.textContent = currentPlayer.name;
    if (roundEl) roundEl.textContent = `Rodada ${gameState.currentRound}`;

    document.getElementById('diceDisplay').innerHTML = '⚀ ⚀';

    gameState.diceRolled = false;
    const rollBtn = document.getElementById('rollDiceBtn');
    const endBtn = document.getElementById('endTurnBtn');

    if (rollBtn) {
        rollBtn.disabled = false;
        rollBtn.style.opacity = '1';
    }
    if (endBtn) endBtn.disabled = false;
}

export function renderPlayerSetupList() {
    const container = document.getElementById('playerSetupList');
    if (!container) return;

    container.innerHTML = gameState.players.map(player => `
        <div class="player-setup-card" style="border-left: 4px solid ${player.color};">
            <div class="player-setup-info">
                <span style="font-size: 2rem;">${player.icon}</span>
                <input 
                    type="text" 
                    value="${player.name}" 
                    onchange="updatePlayerName(${player.id}, this.value)"
                    class="player-name-input"
                    placeholder="Nome do jogador"
                />
            </div>
            <div id="roll-${player.id}" class="player-roll-result">
                ${player.rolled ? `🎲 ${player.rollValue}` : ''}
            </div>
            <button class="btn-remove" onclick="removePlayer(${player.id})">✕</button>
        </div>
    `).join('');
}

// Inject CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-20px); opacity: 0; }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);
