import * as Logic from './modules/logic.js';
import * as UI from './modules/ui.js';
import { gameState } from './modules/state.js';
import { Audio } from './modules/audio.js';

// Attach Logic functions to window for HTML onclick handlers
window.addPlayer = Logic.addPlayer;
// ... (rest of imports)

// Initialize Audio on first interaction
document.body.addEventListener('click', () => {
    Audio.init();
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
window.handleExamAnswer = Logic.handleExamAnswer;
window.receiveCertificate = Logic.receiveCertificate;
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
window.handleMandatoryPayment = Logic.handleMandatoryPayment;
window.initiateArrest = Logic.initiateArrest;
window.checkTugLordCertificate = Logic.checkTugLordCertificate; // Ensure this is definitely here

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
document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 [MAIN] DOMContentLoaded fired");

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
