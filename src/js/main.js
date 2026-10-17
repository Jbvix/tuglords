import * as Logic from './modules/logic.js';
import * as UI from './modules/ui.js';
import { gameState } from './modules/state.js';
import { Audio } from './modules/audio.js';
import { FX } from './modules/effects.js';

// Attach Logic functions to window for HTML onclick handlers
window.addPlayer = Logic.addPlayer;
// ... (rest of imports)

// Inicializa o áudio e começa o fundo musical no primeiro clique do usuário.
// Esse primeiro gesto (ex.: já na tela de apresentação) é exigido pela
// Web Audio API para iniciar o contexto de som — então a música ambiente
// passa a tocar desde a tela inicial.
document.body.addEventListener('click', () => {
    Audio.init();
    Audio.startMusic();
}, { once: true });


window.updatePlayerName = Logic.updatePlayerName;
window.removePlayer = Logic.removePlayer;
window.startOrderRolls = Logic.startOrderRolls;
window.startGame = Logic.startGame;
window.rollDice = Logic.rollDice;
window.endTurn = Logic.endTurn;
window.buyProperty = Logic.buyProperty;
window.buyTug = Logic.buyTug;
window.showLoanOptions = Logic.showLoanOptions;
window.checkDockingStatus = Logic.checkDockingStatus;
window.handleShipyard = Logic.handleShipyard;
window.executeDocking = Logic.executeDocking;
window.triggerOceanEvent = Logic.triggerOceanEvent;
window.acceptSalvage = Logic.acceptSalvage;
window.chooseRoute = Logic.chooseRoute;
window.buyTraining = Logic.buyTraining;
window.presentExam = Logic.presentExam;
window.handleExamAnswer = Logic.handleExamAnswer;
window.commissionTugLord = Logic.commissionTugLord;
window.executeContract = Logic.executeContract;
window.visitUniversity = Logic.visitUniversity;
window.checkTugLordCertificate = Logic.checkTugLordCertificate;
window.payTax = Logic.payTax;
window.performManeuver = Logic.performManeuver;
window.openStockExchange = Logic.openStockExchange;
window.buyStock = Logic.buyStock;
window.openBankTerminal = Logic.openBankTerminal;
window.takeLoan = Logic.takeLoan;
window.payLoan = Logic.payLoan;
window.liquidateAsset = Logic.liquidateAsset;
window.drawCard = Logic.drawCard;
window.showCardPicker = Logic.showCardPicker;
window.pickCard = Logic.pickCard;
window.handleMandatoryPayment = Logic.handleMandatoryPayment;
window.initiateArrest = Logic.initiateArrest;
window.checkTugLordCertificate = Logic.checkTugLordCertificate; // Ensure this is definitely here

// Menu & Persistence (Sprint 4)
window.saveGame = Logic.saveGame;
window.loadGame = Logic.loadGame;
window.showStatistics = Logic.showStatistics;
window.showVictoryInfo = Logic.showVictoryInfo;
window.exitGame = Logic.exitGame;
window.toggleAudio = Logic.toggleAudio;
window.showManualModal = UI.showManualModal;
window.shareGame = Logic.shareGame;
window.copyShareLink = Logic.copyShareLink;
window.showOnlineRanking = Logic.showOnlineRanking;
window.promptSubmitScore = Logic.promptSubmitScore;
window.submitMyScore = Logic.submitMyScore;

// Navigation
window.showManual = UI.showManual;
window.hideManual = UI.hideManual;
window.goToSetup = UI.goToSetup;

// Attach UI functions to window if needed (some close buttons might use them)
window.UI = UI; // Critical for inline onclicks like "UI.closeModal()"
window.closeModal = UI.closeModal;
window.switchTab = UI.switchTab;
window.toggleBoard = UI.toggleBoard;
window.selectHouse = UI.selectHouse;
window.openPanel = UI.openPanel; // For bottom nav
window.closePanel = UI.closePanel;
window.closeAllPanels = UI.closeAllPanels;

// Initialize Game
// Initialize Game
// Splash cinematográfico de abertura: zoom-out do título sobre a âncora,
// ondas agitadas subindo/descendo, o peão dá um 360° e fecha, revelando a
// tela inicial. Pula com clique/botão e respeita prefers-reduced-motion.
function runSplash() {
    const splash = document.getElementById('splashScreen');
    if (!splash) return;

    const pawn = document.getElementById('splashPawn');
    if (pawn && UI.pinSVG) pawn.innerHTML = UI.pinSVG('#fbbf24');

    let closed = false;
    const close = () => {
        if (closed) return;
        closed = true;
        splash.classList.add('hide');
        setTimeout(() => splash.remove(), 650);
    };

    const skip = document.getElementById('splashSkip');
    if (skip) skip.addEventListener('click', (e) => { e.stopPropagation(); close(); });
    splash.addEventListener('click', close);

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { close(); return; }

    setTimeout(close, 5200); // duração total da cena
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 [MAIN] DOMContentLoaded fired");

    runSplash();

    // Only render board background, don't add players yet
    try {
        UI.renderBoard();
        console.log("✅ [MAIN] Board rendered");
    } catch (e) {
        console.error("❌ [MAIN] Error rendering board:", e);
    }

    // Attach Event Listeners
    const btnStart = document.getElementById('btnStartGame');
    if (btnStart) {
        console.log("✅ [MAIN] Found btnStartGame");
        btnStart.addEventListener('click', () => {
            console.log("🖱️ [MAIN] Start Game clicked");
            UI.goToSetup();
        });
    } else {
        console.error("❌ [MAIN] btnStartGame NOT found");
    }

    const btnManual = document.getElementById('btnOpenManual');
    if (btnManual) {
        console.log("✅ [MAIN] Found btnOpenManual");
        btnManual.addEventListener('click', () => {
            console.log("🖱️ [MAIN] Manual clicked");
            UI.showManual();
        });
    } else {
        console.error("❌ [MAIN] btnOpenManual NOT found");
    }

    const btnCloseManual = document.getElementById('btnCloseManual');
    if (btnCloseManual) {
        console.log("✅ [MAIN] Found btnCloseManual");
        btnCloseManual.addEventListener('click', () => {
            console.log("🖱️ [MAIN] Close Manual clicked");
            UI.hideManual();
        });
    } else {
        console.error("❌ [MAIN] btnCloseManual NOT found");
    }
});

// Expose gameState for debugging if needed
window.gameState = gameState;
window.FX = FX; // efeitos visuais/táteis (Sprint 6) — útil para debug

// ========== PWA: Service Worker + instalação ==========

// Registra o service worker (app jogável offline).
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(() => console.log('📲 Service Worker registrado'))
            .catch((e) => console.warn('SW não registrado:', e && e.message));
    });
}

// Captura o evento de instalação e mostra o botão "Instalar App".
let deferredInstallPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    const btn = document.getElementById('btnInstallPWA');
    if (btn) btn.style.display = '';
});

window.installPWA = function installPWA() {
    const btn = document.getElementById('btnInstallPWA');
    if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        if (deferredInstallPrompt.userChoice) {
            deferredInstallPrompt.userChoice.finally(() => {
                deferredInstallPrompt = null;
                if (btn) btn.style.display = 'none';
            });
        }
        return;
    }
    // iOS/Safari (sem beforeinstallprompt) ou já instalado: instruções.
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const msg = isIOS
        ? '<p>Para instalar no iPhone/iPad:</p><ol style="padding-left:1.1rem; line-height:1.7;"><li>Toque no botão <strong>Compartilhar</strong> (ícone de caixa com seta).</li><li>Escolha <strong>Adicionar à Tela de Início</strong>.</li></ol>'
        : '<p>Use o menu do navegador e escolha <strong>Instalar app</strong> / <strong>Adicionar à tela inicial</strong>. Se o app já estiver instalado, abra pelo ícone. ⚓</p>';
    UI.showModal('📲 Instalar TUGLORDS', msg, [{ text: 'Entendi', onClick: 'closeModal()', class: 'btn-primary' }], true);
};

// Esconde o botão depois de instalar.
window.addEventListener('appinstalled', () => {
    const btn = document.getElementById('btnInstallPWA');
    if (btn) btn.style.display = 'none';
    deferredInstallPrompt = null;
});
