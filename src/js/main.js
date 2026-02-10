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

// Initial Render
Logic.addPlayer(); // Add player 1
Logic.addPlayer(); // Add player 2 by default
UI.renderBoard();
window.addPlayer = Logic.addPlayer;
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

// Attach UI functions to window if needed (some close buttons might use them)
window.closeModal = UI.closeModal;
window.switchTab = UI.switchTab;
window.toggleBoard = UI.toggleBoard;
window.selectHouse = UI.selectHouse;
window.openPanel = UI.openPanel; // For bottom nav
window.closePanel = UI.closePanel;
window.closeAllPanels = UI.closeAllPanels;

// Initialize
// Initialize
// Initial Render
Logic.addPlayer(); // Add player 1
Logic.addPlayer(); // Add player 2 by default
UI.renderBoard();

// Expose gameState for debugging if needed
window.gameState = gameState;
