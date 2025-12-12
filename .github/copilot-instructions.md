# TUGLORDS AI Coding Agent Instructions

## Project Overview

TUGLORDS is a **strategic maritime board game** (v19.0 Mobile First Edition) built with vanilla JavaScript, HTML5, CSS3, and Tone.js. Single-file architecture with ~4000 lines of code covering game logic, UI, audio, and persistence. Target: 2-6 players competing in a Monopoly-like game centered on Brazilian maritime tugboat operations.

**Key metaphor**: Game mechanics mirror real tugboat operations (maneuvers, financial management, crew certification).

## Architecture Principles

### Monolithic Single-File Design
All code lives in `TUGLORDS_IBS_v19_0_SPRINT4_OCEAN_EVENTS.html` (~4009 lines):
- **Lines 1-500**: CSS (mobile-first responsive design)
- **Lines 600-1200**: HTML structure (setup screen, game board, bottom nav panels)
- **Lines 1200+**: JavaScript (game state, logic, event system)

This is intentional. When modifying game logic, keep related functions together and reference line numbers in comments.

### Mobile-First Responsive Layout
Three breakpoints:
- **Mobile** (default): Fixed bottom nav (4-button grid), sliding bottom sheets for panels
- **Tablet** (768px+): Side panels, relative bottom nav
- **Desktop** (1024px+): CSS Grid layout (left sidebar | board center | right sidebar)

Use CSS Grid + Flexbox. Media queries add/hide elements via `display: none` and reorder via `order` property. Avoid JavaScript layout calculations—leverage CSS.

### Centralized Game State
Single `gameState` object holds all game data:
```javascript
gameState = {
  players: [],           // Player objects with name, position, balance, properties
  currentPlayerIndex: 0,
  currentRound: 1,
  phase: 'setup' | 'playing',
  playerOrder: [],
  diceRolled: false,
  houses: [...]          // 20 board positions with types: port, fuel, workshop, bank, event
}
```
Changes flow: user action → update `gameState` → call `renderUI()` to reflect changes. **Never mutate directly without calling the render function.**

## Key Data Structures

### Player Object
```javascript
{
  name: 'João',
  position: 3,                 // Board position (0-19)
  balance: 2500,               // Current funds
  properties: [0, 2, 5],       // Array of owned house indices
  certificates: ['fire'],      // Training certifications acquired
  debts: 5000,                 // Outstanding loans
  fleet: { porto: 1, oceanico: 0, tuglord: 0 }
}
```

### House (Board Position) Object
```javascript
{
  name: 'Porto de Santos',
  type: 'port|fuel|workshop|bank|event|surprise|start',
  price: 7000,                 // Purchase price (undefined for non-buyable)
  actions: ['buy', 'pay_rent'],
  owner: null,                 // Player index who owns it (null if unowned)
  rentLevel: 1                 // 1-5 multiplier for rent (upgraded with fleet upgrades)
}
```

## Event System Patterns

### Ocean Events (Randomized)
Located in `OCEAN_EVENTS` array. Each event has:
- `id`, `name`, `icon`, `description`, `type` (enum)
- `effect`: Human-readable description
- Type-specific fields (`amount`, `spaces`, `skipRent`, etc.)

When landing on "Evento Oceânico" house, call `triggerOceanEvent()` which:
1. Selects random event from array
2. Applies effect based on `type` field
3. Triggers UI notification + optional Tone.js sound

### Luck Cards
Similar structure but accessed via `LUCK_CARDS` array (implement similarly to ocean events).

## Audio System (Tone.js)

Tone.js (v14.7.77) via CDN. Pattern:
```javascript
// Initialize synthesizer once (on game start)
const synth = new Tone.Synth().toDestination();

// Play notes
synth.triggerAttackRelease('C4', '8n');  // Quarter note
synth.triggerAttackRelease('G4', '16n'); // Sixteenth note
```

Current usage:
- Dice roll sound: ascending tone sequence
- Victory/loss: chord progressions
- UI feedback: short blips for button presses

Add sounds sparingly—test performance on mobile. Wrap Tone calls in try-catch to gracefully degrade on restricted audio contexts.

## UI Component Patterns

### Bottom Sheet Panels (Mobile)
```html
<div class="sliding-panel" id="panelName">
  <div class="panel-handle"></div>
  <div class="panel-header"><h2 class="panel-title">Title</h2><button class="panel-close">✕</button></div>
  <div class="panel-content"><!-- Content here --></div>
</div>
```

Functions: `openPanel(id, button)`, `closePanel(id)`, `closeAllPanels()`. Toggle active class and `panel-overlay` to show/hide. On desktop (media query), panels render as sticky sidebars.

### Buttons
Three classes: `btn-primary` (blue, prominent), `btn-secondary` (subtle), `btn-danger` (red, destructive). Buttons have `:active` transform for mobile feedback. Avoid `onclick="javascript:..."` — use `onclick="functionName()"` and define function in `<script>`.

### Dynamic Board Rendering
`visualBoard` div contains CSS Grid with 20 house tiles. Call `renderBoard()` after each move/purchase. Each tile shows icon, name, price, and player pawns currently on that house.

## Developer Workflows

### Testing Game State Changes
Open browser DevTools (F12) → Console:
```javascript
// Check current player
console.log(gameState.players[gameState.currentPlayerIndex]);

// Manually trigger game event
triggerOceanEvent();

// Advance player 5 spaces
movePlayer(5);
```

### Adding New Properties/Events
1. Add house to `gameState.houses` array (keep 20-item length)
2. Add corresponding ocean event to `OCEAN_EVENTS` array
3. Add icon/styling to `.board-house` CSS
4. Call `renderBoard()` to visualize

### Debugging Mobile Layout
- Chrome DevTools → Device Toolbar (Ctrl+Shift+M)
- Test all three breakpoints: 320px, 768px, 1024px
- Check scrolling on `.panel-content` with `max-height` constraints
- Verify touch interactions don't trigger `:hover` states

## Project-Specific Conventions

### Naming
- **Functions**: camelCase, action-oriented: `rollDice()`, `buyProperty()`, `endTurn()`
- **CSS classes**: kebab-case, semantic: `.board-house`, `.panel-overlay`, `.btn-primary`
- **IDs**: kebab-case, prefixed: `#panelPlayers`, `#gameScreen`, `#diceDisplay`
- **Constants**: UPPER_SNAKE_CASE: `OCEAN_EVENTS`, `TRAINING_QUESTIONS`, `LUCK_CARDS`

### Code Organization
Within the single file:
1. **CSS variables** (`:root` block) for theme colors
2. **Global CSS** (animations, layout classes)
3. **Responsive CSS** (media queries at end of style block)
4. **HTML structure** (setup screen, game screen with panels)
5. **Game state** declaration
6. **Game logic functions** (grouped by feature: turn logic, property logic, financial logic)
7. **UI/rendering functions** (grouped by component)
8. **Event listeners** and initialization at bottom

### Comments
Use block comments for major sections (`// ===== SECTION NAME =====`) and inline comments for non-obvious logic. Reference Brazilian maritime concepts in comments to maintain narrative.

## Integration Points

### Browser APIs
- **LocalStorage**: `localStorage.setItem('tuglords_save', JSON.stringify(gameState))` for persistence
- **Math.random()**: For dice rolls and event selection
- **Date**: For tracking game duration (if implementing)

### External Dependencies
- **Tailwind CSS** (v3.x, CDN): Not used currently (infrastructure ready for future adoption)
- **Tone.js** (v14.7.77, CDN): For all audio synthesis
- **Google Fonts (Inter)**: Loaded via link tag in `<head>`

No Node/build step currently. Future enhancement: consider bundler to split single file into modules.

## Common Pitfalls

1. **Forgetting to call `renderUI()` after state changes**: UI won't update. Always render after mutating game state.
2. **Mobile responsiveness**: Test on actual devices or Chrome DevTools device emulation. CSS Grid `order` property breaks on some older Android browsers.
3. **Audio context restrictions**: Modern browsers require user gesture to start audio. Wrap Tone.js initialization in click handler.
4. **Overlapping Z-indexes**: Bottom nav, panels, and overlay all use high z-index. Verify stacking order with DevTools inspector.
5. **Board position calculations**: Houses are indexed 0-19. Moving 12 spaces from position 10 lands on position 2 (wraparound: `(10 + 12) % 20`).

## Documentation References

- **Game Design**: See `README.md` for full game rules, strategy guides, and design philosophy
- **Manual**: `TUGLORDS_MANUAL_DO_JOGO.html` contains interactive game rules (1787 lines)
- **Sprint Info**: Version string references "v19.0 SPRINT4 OCEAN_EVENTS" — check comments for recent changes
