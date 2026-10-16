import { gameState, CERTIFICATES, TECH_CERTIFICATES, CERT_LABELS, REGION_COLORS } from './state.js';
import { FX } from './effects.js';

// SVG de rebocador colorido (mantido para compatibilidade/uso avulso).
export function tugboatSVG(color) {
    return `<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true">
        <path d="M2 15h20l-2 4H4z" fill="${color}"/>
        <rect x="6" y="9" width="10" height="5" rx="1" fill="${color}"/>
        <rect x="9" y="5" width="5" height="4" rx="1" fill="${color}"/>
        <rect x="15.5" y="6" width="1.6" height="7" rx="0.6" fill="${color}"/>
        <circle cx="11.5" cy="11" r="1" fill="rgba(255,255,255,0.85)"/>
    </svg>`;
}

let _pinSeq = 0;
// Pino de tabuleiro tradicional (cabeça esférica + corpo flangeado + base),
// sombreado com gradiente vertical para leitura em 3D. viewBox alto (pino em pé).
export function pinSVG(color) {
    const id = 'pin' + (_pinSeq++);
    return `<svg viewBox="0 0 40 72" width="100%" height="100%" aria-hidden="true" style="overflow:visible;">
        <defs>
            <linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#ffffff" stop-opacity="0.6"/>
                <stop offset="0.4" stop-color="${color}"/>
                <stop offset="1" stop-color="#000000" stop-opacity="0.45"/>
            </linearGradient>
        </defs>
        <ellipse cx="20" cy="68" rx="13" ry="3.5" fill="rgba(0,0,0,0.35)"/>
        <path d="M9 66 Q7 52 15 46 Q8 41 11 31 Q13 25 20 25 Q27 25 29 31 Q32 41 25 46 Q33 52 31 66 Z" fill="${color}"/>
        <circle cx="20" cy="16" r="11" fill="${color}"/>
        <path d="M9 66 Q7 52 15 46 Q8 41 11 31 Q13 25 20 25 Q27 25 29 31 Q32 41 25 46 Q33 52 31 66 Z" fill="url(#${id})"/>
        <circle cx="20" cy="16" r="11" fill="url(#${id})"/>
        <ellipse cx="16" cy="12" rx="3.2" ry="4.2" fill="#ffffff" opacity="0.55"/>
    </svg>`;
}

function reducedMotionUI() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ========== CÂMERA CINEMATOGRÁFICA (Sprint 7) ==========
// Durante o movimento, inclina o tabuleiro quase na horizontal, aproxima e faz
// a "câmera" seguir o pino que pula casa a casa. Puro CSS 3D (sem engine).

export function enterCinematic() {
    if (reducedMotionUI()) return false;
    const board = document.querySelector('.board-game');
    if (!board) return false;
    // Lente da câmera = só o #visualBoard (recorta o tabuleiro inclinado sem
    // afetar os controles abaixo).
    const vb = board.parentElement;
    if (vb) vb.classList.add('cine-view');
    board.classList.add('cinematic');
    return true;
}

export function exitCinematic() {
    const board = document.querySelector('.board-game');
    if (!board) return;
    board.classList.remove('cinematic');
    board.style.removeProperty('--cam-x');
    board.style.removeProperty('--cam-y');
    const vb = board.parentElement;
    if (vb) vb.classList.remove('cine-view');
}

// Centraliza a "câmera" na casa indicada (translada o tabuleiro).
export function cameraFollow(position) {
    const board = document.querySelector('.board-game');
    const cell = getCellElement(position);
    if (!board || !cell) return;
    const bw = board.clientWidth, bh = board.clientHeight;
    const cx = cell.offsetLeft + cell.offsetWidth / 2;
    const cy = cell.offsetTop + cell.offsetHeight / 2;
    board.style.setProperty('--cam-x', (cx - bw / 2) + 'px');
    board.style.setProperty('--cam-y', (cy - bh / 2) + 'px');
}

// Zoom-in com órbita 360° no peão (após rolar os dados, antes de andar).
export function cameraOrbit(position) {
    const board = document.querySelector('.board-game');
    if (!board) return;
    cameraFollow(position);      // centraliza no peão
    board.classList.add('orbiting');
}

export function endOrbit() {
    const board = document.querySelector('.board-game');
    if (board) board.classList.remove('orbiting');
}

// Faz o pino do jogador da vez dar um pulo (um salto por casa).
export function hopActivePawn() {
    const lift = document.querySelector('.player-pawn.pawn-active .pawn-lift');
    if (!lift) return;
    lift.classList.remove('hop');
    void lift.offsetWidth;
    lift.classList.add('hop');
    setTimeout(() => lift.classList.remove('hop'), 520);
}

// ========== DADOS 3D (cubos no centro do tabuleiro) ==========

// Rotação que traz a face N para frente.
function dieShow(n) {
    return ({
        1: 'rotateX(0deg) rotateY(0deg)',
        2: 'rotateX(-90deg)',
        3: 'rotateY(-90deg)',
        4: 'rotateY(90deg)',
        5: 'rotateX(90deg)',
        6: 'rotateY(180deg)'
    })[n] || 'rotateX(0deg) rotateY(0deg)';
}

// Células (grade 3x3, 0..8) com ponto para cada valor.
function diePips(n) {
    const map = {
        1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8],
        5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8]
    };
    const on = map[n] || [];
    let s = '';
    for (let i = 0; i < 9; i++) s += `<span class="die-pip${on.includes(i) ? ' on' : ''}"></span>`;
    return s;
}

function dieHTML(value, rolling) {
    const faces = [1, 2, 3, 4, 5, 6].map(f => `<div class="die-face f${f}">${diePips(f)}</div>`).join('');
    const style = rolling ? '' : ` style="transform:${dieShow(value)}"`;
    return `<div class="die-scene"><div class="die-tilt"><div class="die-cube${rolling ? ' rolling' : ''}"${style}>${faces}</div></div></div>`;
}

// Renderiza dois dados 3D no contêiner (normalmente #diceDisplay, no HUD central).
export function renderDice3D(container, d1 = 1, d2 = 1, rolling = false) {
    if (!container) return;
    container.innerHTML = `<div class="dice3d-wrap">${dieHTML(d1, rolling)}${dieHTML(d2, rolling)}</div>`;
}

// Faz os dados "pousarem" no resultado e mostra o total.
export function settleDice3D(container, v1, v2, total, isDouble) {
    if (!container) return;
    const cubes = container.querySelectorAll('.die-cube');
    if (cubes[0]) { cubes[0].classList.remove('rolling'); cubes[0].style.transform = dieShow(v1); }
    if (cubes[1]) { cubes[1].classList.remove('rolling'); cubes[1].style.transform = dieShow(v2); }
    const wrap = container.querySelector('.dice3d-wrap');
    if (wrap) wrap.insertAdjacentHTML('beforeend',
        `<span class="dice-total">= ${total}${isDouble ? ' <b>DUPLA! 🎉</b>' : ''}</span>`);
}

// Retorna o elemento da célula (casa ou canto) para uma posição do tabuleiro.
// Casas e cantos possuem data-position, então uma única busca resolve ambos.
function getCellElement(position) {
    return document.querySelector(`[data-position="${position}"]`);
}

// Pulso de "aterrissagem" na casa de destino após o movimento.
export function highlightLanding(position) {
    const cell = getCellElement(position);
    if (!cell) return;
    cell.classList.remove('just-arrived');
    void cell.offsetWidth;
    cell.classList.add('just-arrived');
    setTimeout(() => cell.classList.remove('just-arrived'), 1100);
}

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

// Exibe uma fala do narrador/comentarista no banner do topo.
export function showCommentary(text) {
    if (!text) return;
    const el = document.getElementById('commentaryText');
    const banner = document.getElementById('commentaryBanner');
    if (!el) return;
    el.textContent = text;
    if (banner) {
        banner.classList.remove('pop');
        void banner.offsetWidth; // reinicia a animação
        banner.classList.add('pop');
    }
}

export function showManual() {
    document.getElementById('presentationScreen').style.display = 'none';
    document.getElementById('manualScreen').style.display = 'flex';
}

// Manual acessível durante a partida, via modal (menu).
export function showManualModal() {
    closeAllPanels();
    showModal('📖 Manual do Jogo', `
        <div style="line-height:1.6; color:#e2e8f0;">
            <h4 style="color:var(--accent-gold); margin:0 0 0.25rem;">Objetivo</h4>
            <p style="margin:0 0 0.75rem;">Torne-se o <strong>TugLord Supremo</strong>: domine portos, monte sua frota de rebocadores e conquiste certificações.</p>
            <h4 style="color:var(--accent-gold); margin:0 0 0.25rem;">Como jogar</h4>
            <ul style="padding-left:1.1rem; margin:0 0 0.75rem;">
                <li>Role os dados para mover seu peão.</li>
                <li>Compre <strong>portos</strong> e cobre aluguel de quem cair neles.</li>
                <li><strong>Rebocadores</strong> aumentam o nível do aluguel.</li>
                <li><strong>Eventos Oceânicos</strong> exigem um rebocador operacional.</li>
                <li>No <strong>Estaleiro</strong> pode haver docagem obrigatória (3 turnos).</li>
                <li>Faça <strong>certificações</strong> para evitar multas e habilitar a frota oceânica.</li>
            </ul>
            <h4 style="color:var(--accent-gold); margin:0 0 0.25rem;">Vitória</h4>
            <p style="margin:0;">4 certificados + TugLord + Rebocador Oceânico + 5 portos — ou seja o último não-falido.</p>
        </div>
    `, [{ text: 'Fechar', onClick: 'closeModal()', class: 'btn-primary' }], true);
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
    // Container único e empilhável — evita que múltiplas notificações se
    // sobreponham no mesmo ponto da tela.
    let stack = document.getElementById('notificationStack');
    if (!stack) {
        stack = document.createElement('div');
        stack.id = 'notificationStack';
        document.body.appendChild(stack);
    }
    // Reposiciona conforme a fase (na setup o header não existe).
    stack.style.cssText = `
        position: fixed;
        top: ${gameState.phase === 'setup' ? '20px' : '80px'};
        left: 50%;
        transform: translateX(-50%);
        z-index: 3000; /* acima do modal (2000) — antes ficava atrás e borrado */
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        max-width: 90%;
        width: max-content;
        pointer-events: none;
    `;

    // Limita o empilhamento para não cobrir a tela (remove as mais antigas).
    while (stack.children.length >= 3) {
        stack.removeChild(stack.firstChild);
    }

    const notification = document.createElement('div');
    notification.style.cssText = `
        background: rgba(251, 191, 36, 0.95);
        color: #1a2942;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        font-weight: 700;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        animation: slideDown 0.3s ease;
        text-align: center;
        pointer-events: none;
        max-width: 100%;
    `;
    notification.textContent = message;
    stack.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => {
            notification.remove();
            if (stack && !stack.hasChildNodes()) stack.remove();
        }, 300);
    }, 2000);
}

export function showModal(title, body, buttons = [], closeBtn = true) {
    let modal = document.getElementById('gameModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'gameModal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);

        // Clique no fundo fecha (apenas modais dispensáveis).
        modal.addEventListener('click', (e) => {
            if (e.target === modal && modal.dataset.dismissible === 'true') closeModal();
        });
    }

    modal.dataset.dismissible = closeBtn ? 'true' : 'false';

    const buttonsHTML = buttons.map(btn => `
        <button class="${btn.class || 'btn-primary'}" onclick="${btn.onClick}" style="width: 100%;">
            ${btn.text}
        </button>
    `).join('');

    modal.innerHTML = `
        <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
            <div class="modal-header">
                <h3 id="modalTitle">${title}</h3>
                ${closeBtn ? '<button class="modal-close-x" onclick="closeModal()" aria-label="Fechar">✕</button>' : ''}
            </div>
            <div class="modal-body">
                ${body}
                ${buttonsHTML ? `<div class="modal-actions">${buttonsHTML}</div>` : ''}
            </div>
        </div>
    `;

    requestAnimationFrame(() => {
        modal.classList.add('open');
        // Move o foco para a primeira ação (acessibilidade de teclado).
        const focusTarget = modal.querySelector('.modal-actions button') || modal.querySelector('.modal-close-x');
        if (focusTarget) focusTarget.focus();
    });
}

export function closeModal() {
    const modal = document.getElementById('gameModal');
    if (modal) {
        modal.classList.remove('open');
        setTimeout(() => modal.remove(), 300);
    }
}

// Fecha modais dispensáveis com a tecla Esc.
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('gameModal');
        if (modal && modal.dataset.dismissible === 'true') closeModal();
    }
});

// ========== RENDER FUNCTIONS ==========

// Escapa aspas/sinais para uso seguro em atributos HTML (title/aria-label).
function escapeAttr(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Monta uma célula de casa. Inclui title/aria-label (tooltip no desktop e
// leitura por leitores de tela), já que as labels visuais ficam ocultas.
function houseCell(house, col, row) {
    const priceLabel = house.price ? ` — R$ ${house.price.toLocaleString('pt-BR')}` : '';
    const regionLabel = house.region ? ` (${house.region})` : '';
    const label = escapeAttr(`${house.name}${priceLabel}${regionLabel}`);
    let h = `<div class="board-house" data-position="${house.pos}" style="grid-column: ${col}; grid-row: ${row};" onclick="selectHouse(${house.pos})" title="${label}" aria-label="${label}">`;
    // Faixa de cor da região (agrupamento estilo "bairro" para portos).
    if (house.region && REGION_COLORS[house.region]) {
        h += `<div class="region-band" style="background: ${REGION_COLORS[house.region]};"></div>`;
    }
    h += `<div class="house-icon">${house.icon}</div>`;
    h += `<div class="house-name">${house.name}</div>`;
    if (house.price) h += `<div class="house-price">R$ ${house.price}</div>`;
    h += '<div class="house-players"></div></div>';
    return h;
}

// Monta uma célula de CANTO. Igual ao canto antigo, mas agora interativa:
// inclui data-position (para peão/realce), onclick (abre info) e o contêiner
// de peões — corrigindo a ausência de informação e o sumiço do peão nos cantos.
function cornerCell(house, col, row) {
    const label = escapeAttr(house.name);
    return `<div class="board-corner" data-position="${house.pos}" style="grid-column: ${col}; grid-row: ${row};" onclick="selectHouse(${house.pos})" title="${label}" aria-label="${label}">`
        + `<span class="corner-icon">${house.icon}</span>`
        + `<div class="house-players"></div>`
        + `</div>`;
}

export function renderBoard() {
    const boardDiv = document.getElementById('visualBoard');
    const boardLayout = gameState.houses;

    let boardHTML = '<div class="board-game">';

    // Canto inferior direito (PARTIDA - posição 0)
    boardHTML += cornerCell(boardLayout[0], 10, 10);

    // Lado INFERIOR (posições 1-8) - grid-row: 10, colunas 9-2
    for (let i = 1; i <= 8; i++) {
        boardHTML += houseCell(boardLayout[i], 10 - i, 10);
    }

    // Canto inferior esquerdo (SORTE - posição 9)
    boardHTML += cornerCell(boardLayout[9], 1, 10);

    // Lado ESQUERDO (posições 10-17) - grid-column: 1, linhas 9-2
    for (let i = 10; i <= 17; i++) {
        boardHTML += houseCell(boardLayout[i], 1, 10 - (i - 9));
    }

    // Canto superior esquerdo (CERTIFICADO TUGLORD - posição 18)
    boardHTML += cornerCell(boardLayout[18], 1, 1);

    // Lado SUPERIOR (posições 19-26) - grid-row: 1, colunas 2-9
    for (let i = 19; i <= 26; i++) {
        boardHTML += houseCell(boardLayout[i], (i - 18) + 1, 1);
    }

    // Canto superior direito (BANCO - posição 27)
    boardHTML += cornerCell(boardLayout[27], 10, 1);

    // Lado DIREITO (posições 28-35) - grid-column: 10, linhas 2-9
    for (let i = 28; i <= 35; i++) {
        boardHTML += houseCell(boardLayout[i], 10, (i - 27) + 1);
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
        houseEl.classList.remove('owned');
        houseEl.style.removeProperty('--owner-color');

        // Se tem dono: barra + pintura da célula na cor do dono
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
                    z-index: 2;
                `;
                ownerBar.title = `Dono: ${owner.name}`;
                houseEl.style.position = 'relative';
                houseEl.style.setProperty('--owner-color', owner.color);
                houseEl.classList.add('owned');
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
            // Camadas: stand (fica em pé no 3D) > lift (pulo) > pino.
            pawn.innerHTML = `<div class="pawn-stand"><div class="pawn-lift">${pinSVG(player.color)}</div></div>`;
            pawn.title = player.name; // Mantém o tooltip com o nome
            // Destaca o pino do jogador da vez.
            if (player === gameState.players[gameState.currentPlayerIndex]) {
                pawn.classList.add('pawn-active');
            }
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

    const owner = house.owner !== undefined ? gameState.players.find(p => p.id === house.owner) : null;

    // Calculate current rent if it's a property
    let rentInfo = '';
    if ((house.type === 'property' || house.type === 'port') && house.rent) {
        rentInfo = `<div style="margin-top: 0.5rem; padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 0.5rem;">
            <p style="margin: 0; color: #94a3b8; font-size: 0.85rem;">Aluguel Base: R$ ${house.rent[0].toLocaleString('pt-BR')}</p>
        </div>`;
    }

    const modalBody = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">${house.icon}</div>
            <h2 style="color: var(--accent-gold); margin: 0 0 0.5rem 0;">${house.name}</h2>
            ${house.price ? `<p style="font-size: 1.25rem; font-weight: 700; color: #e0e0e0;">R$ ${house.price.toLocaleString('pt-BR')}</p>` : ''}
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
        'start': 'Partida',
        'port': 'Porto Comercial',
        'event': 'Evento Oceânico',
        'ocean_event': 'Evento Oceânico',
        'fuel': 'Posto de Combustível',
        'service': 'Serviço Portuário',
        'bank': 'Banco',
        'surprise': 'Carta Surpresa',
        'workshop': 'Oficina',
        'corner': 'Canto da Sorte',
        'luck': 'Sorte ou Azar',
        'stock': 'Bolsa de Valores',
        'stock_exchange': 'Bolsa de Valores',
        'training': 'Centro de Treinamento',
        'university': 'Universidade',
        'tug_purchase': 'Loja de Rebocadores',
        'tax': 'Taxa Portuária',
        'tuglord': 'Certificação TugLord',
        'tuglord_certificate': 'Certificação TugLord'
    };
    return types[type] || 'Local';
}

export function renderPlayersPanel() {
    const container = document.getElementById('playersContainer');
    if (!container) { renderStandings(); return; }

    // Líder (maior patrimônio entre os ativos) para o selo de liderança.
    const activePlayers = gameState.players.filter(p => !p.isEliminated);
    let leaderId = null;
    if (activePlayers.length > 1) {
        leaderId = activePlayers.reduce((a, b) => netWorthUI(b) > netWorthUI(a) ? b : a).id;
    }

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
        // Separa certificados de segurança (obrigatórios) dos técnicos (bônus).
        const safetyCerts = CERTIFICATES.filter(c => player.certificates.includes(c));
        const techCerts = TECH_CERTIFICATES.filter(c => player.certificates.includes(c));
        if (safetyCerts.length > 0) {
            certsInfo += `<p class="text-sm text-slate-300" style="margin: 0.5rem 0;">
                🎓 <strong>Certificados de Segurança (${safetyCerts.length}/4):</strong><br>
                <span style="color: #94a3b8; font-size: 0.85rem;">${safetyCerts.map(c => CERT_LABELS[c] || c).join(', ')}</span>
            </p>`;
        }
        if (techCerts.length > 0) {
            certsInfo += `<p class="text-sm text-slate-300" style="margin: 0.5rem 0;">
                🔧 <strong>Certificados Técnicos (${techCerts.length}/4):</strong><br>
                <span style="color: #94a3b8; font-size: 0.85rem;">${techCerts.map(c => CERT_LABELS[c] || c).join(', ')}</span>
            </p>`;
        }

        const assetsContent = assetsList || fleetInfo || certsInfo
            ? assetsList + fleetInfo + certsInfo
            : '<p class="text-sm text-slate-400">Nenhum ativo ainda</p>';

        // Casa atual (nome em vez do índice cru).
        const houseHere = gameState.houses[player.position];
        const positionLabel = houseHere ? `${houseHere.icon} ${houseHere.name}` : `Casa ${player.position}`;

        // Progresso rumo ao "TugLord Supremo".
        const certCount = CERTIFICATES.filter(c => player.certificates.includes(c)).length;
        const portsOwned = gameState.houses.filter(h =>
            (h.type === 'port' || h.type === 'property') && h.price && h.owner === player.id).length;
        const techCount = TECH_CERTIFICATES.filter(c => player.certificates.includes(c)).length;
        // Certificados de segurança são obrigatórios; os técnicos são bônus (não entram na meta).
        const goalMet = certCount === 4 && player.hasTuglord && player.hasOceanTug && portsOwned >= 5;
        const chip = (ok, label) => `<span style="font-size:0.7rem; padding:0.1rem 0.4rem; border-radius:0.4rem; background:${ok ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.06)'}; color:${ok ? '#22c55e' : '#94a3b8'};">${ok ? '✅' : '⬜'} ${label}</span>`;
        const victoryProgress = `
            <div style="margin-top:0.5rem;">
                <div style="font-size:0.72rem; color:#fbbf24; font-weight:700; margin-bottom:0.3rem;">🏆 TugLord Supremo ${goalMet ? '— COMPLETO!' : ''}</div>
                <div style="display:flex; flex-wrap:wrap; gap:0.25rem;">
                    ${chip(certCount === 4, `Segurança ${certCount}/4`)}
                    ${chip(player.hasTuglord, 'TugLord')}
                    ${chip(player.hasOceanTug, 'Oceânico')}
                    ${chip(portsOwned >= 5, `Portos ${portsOwned}/5`)}
                    <span style="font-size:0.7rem; padding:0.1rem 0.4rem; border-radius:0.4rem; background:rgba(59,130,246,0.15); color:#60a5fa;">🔧 Técnicos ${techCount}/4 (bônus)</span>
                </div>
            </div>`;

        // Tensão: saldo baixo (perigo) e selo de liderança.
        const isDanger = !player.isEliminated && player.money < 3000;
        const isLeader = player.id === leaderId;
        const cardClasses = ['player-card'];
        if (index === gameState.currentPlayerIndex) cardClasses.push('active');
        if (isDanger) cardClasses.push('danger');
        if (isLeader) cardClasses.push('leader');
        if (player.isEliminated) cardClasses.push('eliminated');

        return `
        <div class="${cardClasses.join(' ')}"
             style="border-left: 4px solid ${player.color};">
            <div class="player-header">
                <span class="player-name">${isLeader ? '👑 ' : ''}${player.icon} ${player.name}</span>
                <span class="player-money">${isDanger ? '⚠️ ' : ''}R$ ${player.money.toLocaleString('pt-BR')}</span>
            </div>
            <div class="tabs-container">
                <button class="tab-btn active" onclick="switchTab(this, 'fin-${player.id}')">Finanças</button>
                <button class="tab-btn" onclick="switchTab(this, 'assets-${player.id}')">Ativos</button>
            </div>
            <div class="tab-content active" id="fin-${player.id}">
                <div class="badge">
                    <span class="dot" style="background: ${player.color};"></span>
                    <span>${positionLabel}</span>
                </div>
                ${victoryProgress}
            </div>
            <div class="tab-content" id="assets-${player.id}">
                ${assetsContent}
            </div>
        </div>
    `;
    }).join('');

    renderStandings();
}

// Patrimônio líquido aproximado (caixa + 50% dos ativos − dívidas).
function netWorthUI(player) {
    let total = player.money;
    gameState.houses.forEach(h => {
        if ((h.type === 'port' || h.type === 'property') && h.price && h.owner === player.id) {
            total += Math.floor(h.price * 0.5);
        }
    });
    total += (player.portTugs || 0) * 100;
    if (player.hasOceanTug) total += 250;
    if (player.hasTuglord) total += 375;
    (player.loans || []).forEach(l => { total -= l.totalDue; });
    return total;
}

// Placar ao vivo: ranking por patrimônio, líder destacado.
export function renderStandings() {
    const strip = document.getElementById('standingsStrip');
    if (!strip) return;
    if (gameState.phase !== 'playing' || gameState.players.length === 0) {
        strip.innerHTML = '';
        return;
    }
    const ranked = [...gameState.players].sort((a, b) => netWorthUI(b) - netWorthUI(a));
    const leaderId = ranked[0] && !ranked[0].isEliminated ? ranked[0].id : null;
    const activeCount = gameState.players.filter(p => !p.isEliminated).length;

    strip.innerHTML = ranked.map((p, i) => {
        const isLeader = p.id === leaderId && activeCount > 1;
        const cls = ['standings-item'];
        if (isLeader) cls.push('is-leader');
        if (p.isEliminated) cls.push('is-out');
        if (p.id === gameState.players[gameState.currentPlayerIndex].id) cls.push('is-turn');
        return `
            <div class="${cls.join(' ')}" style="--pcolor:${p.color};" title="${p.name}: R$ ${netWorthUI(p).toLocaleString('pt-BR')}">
                <span class="standings-rank">${isLeader ? '👑' : (i + 1) + 'º'}</span>
                <span class="standings-icon">${p.icon}</span>
                <span class="standings-money">${p.isEliminated ? '💀' : 'R$ ' + netWorthUI(p).toLocaleString('pt-BR')}</span>
            </div>`;
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

    // Banner épico de troca de turno na cor do jogador + tema da vez.
    if (gameState.phase === 'playing') {
        document.documentElement.style.setProperty('--current-color', currentPlayer.color);
        FX.turnBanner(`${currentPlayer.icon} Vez de ${currentPlayer.name}`, currentPlayer.color);
    }

    renderStandings();

    renderDice3D(document.getElementById('diceDisplay'), 1, 1, false);

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
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideUp {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(-20px); opacity: 0; }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);
