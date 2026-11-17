/*
 * TUGLORDS TV: camada para LG webOS (controle remoto, foco, layout 10 pés).
 * Não altera regras do jogo: só navega e dispara os mesmos cliques.
 */
(function () {
    'use strict';
    var EU = document.currentScript && document.currentScript.src || '';
    var PIN_V = (EU.match(/[?&]v=(\w+)/) || [0, '1'])[1];

    var KEY = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, OK: 13, BACK: 461, ESC: 27,
        RED: 403, GREEN: 404, YELLOW: 405, BLUE: 406 };
    // 20261111f · Voltar/Início: aberto pela TugLife FM TV (?origem=fmtv), "Sair" volta à TugLife FM em #tuglords
    // (location.replace, sem splash), em vez de fechar o app da TV. Aberto direto, nada muda.
    var FM = (function () {
        var OK = /^https:\/\/([a-z0-9-]+--)?tuglife-fm-tv\.netlify\.app\/$/, s = location.search, v = '';
        var fm = /[?&]origem=fmtv(&|$)/.test(s), m = /[?&]volta=([^&#]*)/.exec(s);
        try { v = m ? decodeURIComponent(m[1]) : ''; } catch (x) {}
        try {
            if (fm) { sessionStorage.setItem('fmtv_origem', '1'); if (OK.test(v)) sessionStorage.setItem('fmtv_volta', v); }
            else if (sessionStorage.getItem('fmtv_origem') === '1') { fm = true; v = sessionStorage.getItem('fmtv_volta') || ''; }
        } catch (x) {}
        if (!fm) return '';
        return OK.test(v) ? v : 'https://tuglife-fm-tv.netlify.app/';
    })();
    function voltarFM() { location.replace(FM + '#tuglords'); }
    // Ícones SVG inline: a fonte do webOS não tem ☰ 🎥 🔔 🎵 (viravam quadradinhos).
    function svg(d) { return '<svg class="tv-ico" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path fill="currentColor" d="' + d + '"/></svg>'; }
    var ICO = {
        menu: svg('M3 5h18v3H3zm0 5.5h18v3H3zM3 16h18v3H3z'),
        camera: svg('M4 6h11a2 2 0 0 1 2 2v1.5l4-2.5v10l-4-2.5V16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z'),
        sino: svg('M12 22a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22zm7-6V11a7 7 0 0 0-5.5-6.8V3a1.5 1.5 0 0 0-3 0v1.2A7 7 0 0 0 5 11v5l-2 2v1h18v-1z'),
        musica: svg('M9 3v12.3A3.5 3.5 0 1 0 11 18.5V8h8V3z')
    };
    var FOCUSABLE = 'button, a[href], input, select, textarea, [onclick], [tabindex]:not([tabindex="-1"]), .tv-focusable';

    // ---------- Nomes marítimos aleatórios ----------
    var TITULOS = ['Capitão', 'Comandante', 'Almirante', 'Mestre', 'Contramestre', 'Prático', 'Marujo', 'Imediato', 'Timoneiro', 'Lobo do Mar'];
    var NOMES = ['Joleous', 'Bigodão', 'Ancoreta', 'Cracassú', 'Bujarrona', 'Mexilhão', 'Cabrestante', 'Gaivotino', 'Pirarucu', 'Bombordildo',
        'Estibordo', 'Calafate', 'Maresio', 'Lagostão', 'Polvildo', 'Bitácula', 'Escotilho', 'Tainha Brava', 'Croquete', 'Sardinhão',
        'Popeyone', 'Moitão', 'Guindaste', 'Ostrálio', 'Barbatana', 'Cavalinho', 'Rebocildo', 'Espadarte', 'Marolinha', 'Sirizão'];
    function rand(a) { return a[Math.floor(Math.random() * a.length)]; }
    function nomeMaritimo(usados) {
        for (var i = 0; i < 40; i++) {
            var n = rand(TITULOS) + ' ' + rand(NOMES);
            if (usados.indexOf(n) < 0) return n;
        }
        return rand(TITULOS) + ' ' + rand(NOMES) + ' ' + (usados.length + 1);
    }
    function gs() { return window.gameState; }

    function nomearPadroes() {
        var g = gs(); if (!g || !g.players) return;
        var usados = g.players.map(function (p) { return p.name; });
        var mudou = false;
        g.players.forEach(function (p) {
            if (/^Jogador \d+$/.test(p.name)) { p.name = nomeMaritimo(usados); usados.push(p.name); mudou = true; }
        });
        var cards = document.querySelectorAll('#playerSetupList .player-setup-card');
        cards.forEach(function (card, i) {
            var p = g.players[i]; if (!p) return;
            var inp = card.querySelector('input.player-name-input');
            if (inp && inp.value !== p.name && document.activeElement !== inp) inp.value = p.name;
            if (!card.querySelector('.tv-reroll')) {
                var b = document.createElement('button');
                b.type = 'button'; b.className = 'tv-reroll btn-secondary';
                b.textContent = '🔀 Sortear';
                b.addEventListener('click', function (e) {
                    e.stopPropagation();
                    var outros = g.players.map(function (x) { return x.name; });
                    p.name = nomeMaritimo(outros);
                    if (inp) inp.value = p.name;
                });
                var rm = card.querySelector('.btn-remove');
                card.insertBefore(b, rm || null);
            }
        });
        return mudou;
    }

    // ---------- Layout: move os controles do turno para a coluna direita ----------
    function montarLayout() {
        var gc = document.querySelector('.game-container');
        var board = document.getElementById('visualBoard');
        if (!gc || !board || document.getElementById('tvSide')) return;
        var controls = board.nextElementSibling;
        var side = document.createElement('aside');
        side.id = 'tvSide';
        side.className = 'tv-side';
        if (controls) { controls.classList.add('tv-turn'); side.appendChild(controls); }
        var legend = document.createElement('div');
        legend.className = 'tv-legend';
        legend.innerHTML =
            '<button type="button" class="tv-key k-red" data-k="red"><i></i>Dados</button>' +
            '<button type="button" class="tv-key k-green" data-k="green"><i></i>Passar a vez</button>' +
            '<button type="button" class="tv-key k-yellow" data-k="yellow"><i></i>Banco</button>' +
            '<button type="button" class="tv-key k-blue" data-k="blue"><i></i>Câmera</button>' +
            '<button type="button" class="tv-key k-menu" data-k="menu"><i>' + ICO.menu + '</i>Menu</button>';
        legend.addEventListener('click', function (e) {
            var b = e.target.closest('.tv-key'); if (!b) return;
            if (b.getAttribute('data-k') === 'menu') { if (window.openPanel) window.openPanel('panelMenu'); return; }
            teclaCor(b.getAttribute('data-k'));
        });
        side.appendChild(legend);
        gc.appendChild(side);
    }

    // ---------- Trilha sonora (Menu) ----------
    var TRILHAS = ['tema-1', 'tema-2', 'tema-3', 'tema-4', 'tema-4-estendido', 'tema-7', 'tema-5', 'tema-6', 'original'];
    var ROTULO = { 'tema-1': 'Tema 1', 'tema-2': 'Tema 2', 'tema-3': 'Tema 3', 'tema-4': 'Tema 4', 'tema-4-estendido': 'Tema 4 Estendido', 'tema-5': 'Tema 5', 'tema-6': 'Tema 6', 'tema-7': 'Tema 7', 'original': 'Original' };
    function montarTrilha() {
        var aud = document.getElementById('btnToggleAudio');
        if (!aud || document.getElementById('btnTrilha') || !window.TugAudio) return;
        var b = document.createElement('button');
        b.type = 'button'; b.id = 'btnTrilha'; b.className = 'btn-secondary';
        function rot() { b.innerHTML = ICO.musica + ' Trilha: ' + ROTULO[TugAudio.getTrack()]; }
        rot();
        b.addEventListener('click', function (e) {
            e.stopPropagation();
            var i = TRILHAS.indexOf(TugAudio.getTrack());
            var t = TRILHAS[(i + 1) % TRILHAS.length];
            TugAudio.setTrack(t);
            rot();
        });
        aud.parentNode.insertBefore(b, aud.nextSibling);
        montarCamera(b);
    }

    // ---------- Câmera: Drone / Vista de cima / 2D fixo (localStorage tvCamMode) ----------
    var CAMS = ['drone', 'top', '2d'];
    var CAM_ROT = { drone: 'Drone', top: 'Vista de cima', '2d': '2D fixo' };
    function camAtual() { var m = 'drone'; try { m = localStorage.getItem('tvCamMode') || 'drone'; } catch (x) {} return CAMS.indexOf(m) < 0 ? 'drone' : m; }
    function rotCam() { var b = document.getElementById('btnCamera'); if (b) b.innerHTML = ICO.camera + ' Câmera: ' + CAM_ROT[camAtual()]; }
    function trocarCamera(avisar) {
        var t = CAMS[(CAMS.indexOf(camAtual()) + 1) % CAMS.length];
        try { localStorage.setItem('tvCamMode', t); } catch (x) {}
        rotCam();
        if (window.TVApplyCamera) try { TVApplyCamera(); } catch (x) {}
        if (avisar) avisoCam(CAM_ROT[t], true);
    }
    var avisoT = null;
    function avisoCam(txt) {
        var a = document.getElementById('tvCamAviso');
        if (!a) { a = document.createElement('div'); a.id = 'tvCamAviso'; a.className = 'tv-cam-aviso'; document.body.appendChild(a); }
        a.innerHTML = ICO.camera + ' ' + txt; a.classList.add('on');
        clearTimeout(avisoT); avisoT = setTimeout(function () { a.classList.remove('on'); }, 1400);
    }
    function montarCamera(depois) {
        if (document.getElementById('btnCamera')) return;
        var b = document.createElement('button');
        b.type = 'button'; b.id = 'btnCamera'; b.className = 'btn-secondary';
        b.addEventListener('click', function (e) { e.stopPropagation(); trocarCamera(false); });
        depois.parentNode.insertBefore(b, depois.nextSibling);
        rotCam();
        // Efeitos sonoros liga/desliga (localStorage tvSfx)
        var f = document.createElement('button');
        f.type = 'button'; f.id = 'btnSfx'; f.className = 'btn-secondary';
        function rotSfx() { f.innerHTML = ICO.sino + ' Efeitos: ' + (TugAudio.sfxOn() ? 'Ligados' : 'Desligados'); }
        f.addEventListener('click', function (e) { e.stopPropagation(); TugAudio.setSfx(!TugAudio.sfxOn()); rotSfx(); if (TugAudio.sfxOn()) TugAudio.playBuy(); });
        b.parentNode.insertBefore(f, b.nextSibling);
        rotSfx();
        // Testar efeitos: toca cada efeito em sequência e mostra se carregou (Web Audio) ou não
        var tst = document.createElement('button');
        tst.type = 'button'; tst.id = 'btnTesteSfx'; tst.className = 'btn-secondary';
        var ROT_T = { dado: 'Dados', pulo: 'Pulo', compra: 'Compra', certificado: 'Certificado', azar: 'Azar', moeda: 'Moedas' };
        function rotT(txt) { tst.innerHTML = ICO.sino + ' ' + (txt || 'Testar efeitos'); }
        var testando = false;
        tst.addEventListener('click', function (e) {
            e.stopPropagation(); if (testando) return; testando = true;
            try { TugAudio.unlockSfx(); } catch (x) {}
            var ns = ['dado', 'pulo', 'compra', 'moeda', 'certificado', 'azar'], i = 0;
            (function prox() {
                if (i >= ns.length) { testando = false; rotT(TugAudio.sfxOn() ? 'Testar efeitos (ok)' : 'Testar efeitos (efeitos desligados)'); return; }
                var n = ns[i++], st = TugAudio.sfxStatus(n);
                rotT('Tocando: ' + ROT_T[n] + ' (' + st + ')');
                TugAudio.playSfx(n, n === 'pulo' ? 0.7 : 1.0, true);
                setTimeout(prox, 1800);
            })();
        });
        f.parentNode.insertBefore(tst, f.nextSibling);
        rotT();
    }
    window.TVCamera = { get: camAtual, trocar: trocarCamera };

    // ---------- Visibilidade e escopo do foco ----------
    function visivel(el) {
        if (!el || el.disabled) return false;
        if (el.closest('[aria-hidden="true"]') && !el.closest('.modal-overlay')) return false;
        var r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return false;
        var cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.pointerEvents === 'none') return false;
        if (r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) {
            // fora da tela: aceita só se estiver num contêiner rolável (rola até ele)
            return !!rolavelDe(el);
        }
        return true;
    }
    function modalAberto() {
        var m = document.getElementById('tvExit');
        if (m) return m;
        m = document.getElementById('gameModal');
        if (m && m.classList.contains('open')) return m;
        var outros = document.querySelectorAll('.modal-overlay, [role="dialog"], [aria-modal="true"]');
        for (var i = outros.length - 1; i >= 0; i--) {
            var o = outros[i];
            if (o.id === 'gameModal') continue;
            var r = o.getBoundingClientRect();
            if (r.width > 0 && r.height > 0 && getComputedStyle(o).display !== 'none' && getComputedStyle(o).visibility !== 'hidden') return o;
        }
        return null;
    }
    function painelAberto() {
        return document.querySelector('#panelMenu.active, #panelBank.active, .sliding-panel.active.tv-overlay');
    }
    function escopo() {
        var m = modalAberto(); if (m) return m;
        var p = painelAberto(); if (p) return p;
        var telas = ['splashScreen', 'manualScreen', 'presentationScreen', 'setupScreen', 'gameScreen'];
        for (var i = 0; i < telas.length; i++) {
            var t = document.getElementById(telas[i]);
            if (t && getComputedStyle(t).display !== 'none' && t.getBoundingClientRect().height > 0) return t;
        }
        return document.body;
    }
    function focaveis(sc) {
        var list = Array.prototype.slice.call(sc.querySelectorAll(FOCUSABLE));
        return list.filter(function (el) {
            if (el.id === 'panelOverlay') return false;
            if (el.classList.contains('modal-overlay')) return false;
            // não foca um contêiner com onclick que tem botões dentro
            if (el.tagName !== 'BUTTON' && el.tagName !== 'INPUT' && el.querySelector('button, input')) return false;
            return visivel(el);
        });
    }
    function rolavelDe(el) {
        var p = el.parentElement;
        while (p && p !== document.body) {
            var cs = getComputedStyle(p);
            if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && p.scrollHeight > p.clientHeight + 4) return p;
            p = p.parentElement;
        }
        return null;
    }

    // ---------- Foco ----------
    var atual = null;
    function ehCampo(el) {
        return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable) && el.type !== 'button' && el.type !== 'checkbox' && el.type !== 'radio';
    }
    function travarCampo(el) {
        if (!el || el.isContentEditable) return;
        el.setAttribute('readonly', 'readonly'); el.setAttribute('inputmode', 'none');
    }
    function liberarCampo(el) {
        if (!el || el.isContentEditable) return;
        el.removeAttribute('readonly'); el.removeAttribute('inputmode');
    }
    function travarCampos() {
        var cs = document.querySelectorAll('input:not([type=button]):not([type=checkbox]):not([type=radio]):not(.tv-editing), textarea:not(.tv-editing)');
        for (var i = 0; i < cs.length; i++) if (!cs[i].hasAttribute('readonly')) travarCampo(cs[i]);
    }
    window.TVTravarCampos = travarCampos;
    function focar(el) {
        if (!el) return;
        var velhos = document.querySelectorAll('.tv-focus');
        for (var i = 0; i < velhos.length; i++) if (velhos[i] !== el) velhos[i].classList.remove('tv-focus');
        atual = el;
        if (!el.hasAttribute('tabindex') && !/^(BUTTON|INPUT|A|SELECT|TEXTAREA)$/.test(el.tagName)) el.setAttribute('tabindex', '-1');
        el.classList.add('tv-focus');
        // Campos de texto NÃO recebem foco real pela navegação: no webOS focar um
        // <input> abre o teclado virtual. Só destaca; o OK é que abre a edição.
        var ae = document.activeElement;
        if (ehCampo(el)) {
            if (ae && ae !== document.body && ae !== el && ae.blur) ae.blur();
            if (ae === el && !el.classList.contains('tv-editing')) el.blur();
        } else {
            if (ae && ehCampo(ae) && ae.blur) { ae.classList.remove('tv-editing'); travarCampo(ae); ae.blur(); }
            try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); }
        }
        var sc = rolavelDe(el);
        if (sc) {
            var r = el.getBoundingClientRect(), s = sc.getBoundingClientRect();
            if (r.top < s.top + 10) sc.scrollTop -= (s.top - r.top) + 40;
            else if (r.bottom > s.bottom - 10) sc.scrollTop += (r.bottom - s.bottom) + 40;
        }
    }
    function padrao(sc, estrito) {
        var l = focaveis(sc);
        if (!l.length) return null;
        if (sc.classList && (sc.classList.contains('modal-overlay') || sc.id === 'gameModal')) {
            var semX = l.filter(function (e) { return !e.matches('.modal-close-x, .modal-close, .panel-close'); });
            if (semX.length) l = semX;
        }
        var pref = ['#tvExit .tv-exit-no', '#rollDiceBtn', '#contextualActions button', '#endTurnBtn', '.splash-skip', '#btnStartGame', '.modal-actions .btn-primary', '.btn-primary'];
        if (sc.id === 'gameScreen') pref = pref.slice(0, 4);
        for (var i = 0; i < pref.length; i++) {
            for (var j = 0; j < l.length; j++) if (l[j].matches(pref[i])) return l[j];
        }
        if (estrito && sc.id === 'gameScreen') return null; // aguardando o jogo: não pula pro painel
        return l[0];
    }
    var autoFoco = true, ultimoEscopo = null;
    function focoValido() {
        var sc = escopo();
        if (sc !== ultimoEscopo) { ultimoEscopo = sc; autoFoco = true; atual = null; return false; }
        if (atual && document.body.contains(atual) && sc.contains(atual) && visivel(atual)) return true;
        var velhos = document.querySelectorAll('.tv-focus');
        for (var i = 0; i < velhos.length; i++) velhos[i].classList.remove('tv-focus');
        atual = null;
        var a = document.activeElement;
        if (a && a !== document.body && sc.contains(a) && a.matches(FOCUSABLE) && visivel(a)) { focar(a); return true; }
        return false;
    }
    var GRUPOS = '.tv-turn, .tv-legend, .sliding-panel, .modal-content, .tv-exit-box, #panelPlayers, .board-game, .player-setup-list';
    function mover(dir) {
        var sc = escopo();
        if (!focoValido()) { focar(padrao(sc)); return; }
        var r = atual.getBoundingClientRect();
        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var melhor = null, nota = Infinity;
        var todos = focaveis(sc).filter(function (el) { return !el.disabled; });
        // ↑/↓ primeiro dentro do grupo atual (painel do turno, legenda, painel lateral,
        // modal…), em ordem vertical; só sai do grupo se não houver ninguém acima/abaixo.
        if (dir === 'up' || dir === 'down') {
            var g = atual.closest(GRUPOS);
            if (g && sc.contains(g)) {
                todos.forEach(function (el) {
                    if (el === atual || el.contains(atual) || atual.contains(el) || el.closest(GRUPOS) !== g) return;
                    var q = el.getBoundingClientRect(), y = q.top + q.height / 2, x = q.left + q.width / 2;
                    var p = dir === 'up' ? cy - y : y - cy;
                    if (p < 8 || (dir === 'up' ? q.top >= r.top - 4 : q.bottom <= r.bottom + 4)) return;
                    var n = p + Math.abs(x - cx) * 0.5;
                    if (n < nota) { nota = n; melhor = el; }
                });
                if (!melhor) {
                    // painel do turno ↔ legenda (ficam empilhados na coluna da direita)
                    var lado = null;
                    if (dir === 'down' && g.classList.contains('tv-turn')) lado = sc.querySelector('.tv-legend');
                    if (dir === 'up' && g.classList.contains('tv-legend')) lado = sc.querySelector('.tv-turn');
                    if (lado) {
                        var cands = todos.filter(function (el) { return lado.contains(el); });
                        if (cands.length) {
                            if (dir === 'down') {
                                cands.forEach(function (el) { var q = el.getBoundingClientRect(); var n = q.top * 10 + Math.abs(q.left + q.width / 2 - cx); if (n < nota) { nota = n; melhor = el; } });
                            } else {
                                cands.forEach(function (el) { var q = el.getBoundingClientRect(); var n = -q.bottom * 10 + Math.abs(q.left + q.width / 2 - cx); if (n < nota) { nota = n; melhor = el; } });
                            }
                        }
                    }
                }
                if (melhor) { autoFoco = false; focar(melhor); return; }
                // grupo isolado (painel/modal): fica no limite em vez de pular de coluna
                if (g.matches('.tv-turn, .sliding-panel, .modal-content, .tv-exit-box, #panelPlayers')) {
                    var rol0 = rolavelDe(atual);
                    if (rol0) rol0.scrollTop += dir === 'down' ? 260 : -260;
                    return;
                }
            }
        }
        todos.forEach(function (el) {
            if (el === atual || el.contains(atual) || atual.contains(el)) return;
            var q = el.getBoundingClientRect();
            var x = q.left + q.width / 2, y = q.top + q.height / 2;
            var dx = x - cx, dy = y - cy, prim, orto;
            if (dir === 'left') { if (q.right > r.left + 4 && dx > -4) return; prim = -dx; orto = Math.abs(dy); }
            if (dir === 'right') { if (q.left < r.right - 4 && dx < 4) return; prim = dx; orto = Math.abs(dy); }
            if (dir === 'up') { if (q.bottom > r.top + 4 && dy > -4) return; prim = -dy; orto = Math.abs(dx); }
            if (dir === 'down') { if (q.top < r.bottom - 4 && dy < 4) return; prim = dy; orto = Math.abs(dx); }
            if (prim <= 0) return;
            var n = prim + orto * 2.2;
            if (n < nota) { nota = n; melhor = el; }
        });
        if (melhor) { autoFoco = false; focar(melhor); return; }
        // sem alvo: rola o conteúdo (ex.: manual)
        var rol = rolavelDe(atual) || sc.querySelector('.manual-content, .modal-body');
        if (rol && (dir === 'up' || dir === 'down')) rol.scrollTop += dir === 'down' ? 260 : -260;
    }

    // ---------- Back / saída ----------
    function sairApp() {
        if (FM) { voltarFM(); return; }
        try { if (window.webOSSystem && webOSSystem.platformBack) { webOSSystem.platformBack(); return; } } catch (e) {}
        try { if (window.PalmSystem && PalmSystem.platformBack) { PalmSystem.platformBack(); return; } } catch (e) {}
        try { window.close(); } catch (e) {}
    }
    function confirmarSaida() {
        if (document.getElementById('tvExit')) return;
        var emJogo = gs() && gs().phase === 'playing';
        var d = document.createElement('div');
        d.id = 'tvExit'; d.className = 'tv-exit'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true');
        d.innerHTML = '<div class="tv-exit-box"><h2>⚓ Sair do TugLords?</h2>' +
            (emJogo ? '<p>Dá pra salvar a partida antes de sair.</p>' : '<p>Até a próxima maré!</p>') +
            '<div class="tv-exit-actions">' +
            (emJogo ? '<button type="button" class="btn-primary tv-exit-save">💾 Salvar e sair</button>' : '') +
            (FM ? '<button type="button" class="btn-secondary tv-exit-yes">↩️ Voltar à TugLife FM</button>' : '<button type="button" class="btn-secondary tv-exit-yes">🚪 Sair</button>') +
            '<button type="button" class="btn-primary tv-exit-no">↩️ Continuar</button></div></div>';
        document.body.appendChild(d);
        d.querySelector('.tv-exit-no').addEventListener('click', fecharSaida);
        d.querySelector('.tv-exit-yes').addEventListener('click', sairApp);
        var sv = d.querySelector('.tv-exit-save');
        if (sv) sv.addEventListener('click', function () { try { window.saveGame(); } catch (e) {} setTimeout(sairApp, 400); });
        focar(d.querySelector('.tv-exit-no'));
    }
    function fecharSaida() { var d = document.getElementById('tvExit'); if (d) d.remove(); atual = null; focoValido() || focar(padrao(escopo())); }

    function voltar() {
        if (document.getElementById('tvExit')) { fecharSaida(); return; }
        var gm = document.getElementById('gameModal');
        if (gm && gm.classList.contains('open')) {
            if (gm.dataset.dismissible === 'true' && window.closeModal) window.closeModal();
            else if (gm.dataset.dismissible === 'true') gm.remove();
            return; // modal obrigatório: precisa escolher uma opção
        }
        var outro = modalAberto();
        if (outro) {
            var x = outro.querySelector('.modal-close, [aria-label="Fechar"], .btn-close');
            if (x) x.click();
            return;
        }
        if (painelAberto()) { window.closeAllPanels && window.closeAllPanels(); return; }
        var splash = document.getElementById('splashScreen');
        if (splash && getComputedStyle(splash).display !== 'none' && splash.getBoundingClientRect().height > 0) {
            var sk = document.getElementById('splashSkip'); if (sk) sk.click(); return;
        }
        var man = document.getElementById('manualScreen');
        if (man && getComputedStyle(man).display !== 'none') { var c = document.getElementById('btnCloseManual'); if (c) { c.click(); return; } }
        var setup = document.getElementById('setupScreen'), pres = document.getElementById('presentationScreen');
        if (setup && pres && getComputedStyle(setup).display !== 'none' && !(gs() && gs().phase === 'playing')) {
            setup.style.display = 'none'; pres.style.display = 'flex'; atual = null; return;
        }
        confirmarSaida();
    }

    // ---------- Teclas coloridas ----------
    function clicarSe(sel) {
        var b = document.querySelector(sel);
        if (b && !b.disabled && b.getBoundingClientRect().width > 0) { b.click(); return true; }
        return false;
    }
    function teclaCor(k) {
        var g = gs();
        if (!g || g.phase !== 'playing' || modalAberto()) return;
        if (k === 'red') clicarSe('#rollDiceBtn');
        if (k === 'green') clicarSe('#endTurnBtn');
        if (k === 'yellow' && window.openBankTerminal) window.openBankTerminal();
        if (k === 'blue') {
            // Azul troca a câmera (Drone > Vista de cima > 2D). O Menu segue no botão ☰ da tela;
            // com algum painel aberto, o azul só fecha o painel.
            if (painelAberto() && window.closeAllPanels) { window.closeAllPanels(); }
            else trocarCamera(true);
        }
        atual = null;
    }

    if (FM) {
        var fmCss = document.createElement('style');
        fmCss.textContent = '#tvVoltarFM{position:fixed;left:40px;top:40px;z-index:9000;font:700 26px/1.2 Inter,Segoe UI,Arial,sans-serif;color:#fff;background:#123a5a;border:3px solid #5dade2;border-radius:14px;padding:12px 24px;cursor:pointer}#tvVoltarFM:hover,#tvVoltarFM:focus{background:#f1c40f;color:#06192a;border-color:#fff}';
        document.head.appendChild(fmCss);
        var fmBt = document.createElement('button'); fmBt.id = 'tvVoltarFM'; fmBt.type = 'button'; fmBt.textContent = '\u2190 Voltar à TugLife FM';
        fmBt.addEventListener('click', voltarFM);
        var fmPinta = function () { var p = document.getElementById('presentationScreen'); fmBt.style.display = p && getComputedStyle(p).display !== 'none' ? '' : 'none'; };
        var fmLiga = function () { document.body.appendChild(fmBt); fmPinta(); setInterval(fmPinta, 500); };
        if (document.body) fmLiga(); else document.addEventListener('DOMContentLoaded', fmLiga);
    }
    // ---------- Teclado ----------
    function digitando() {
        var a = document.activeElement;
        return a && ehCampo(a) && a.classList.contains('tv-editing');
    }
    var somLiberado = false;
    window.addEventListener('keydown', function (e) {
        var k = e.keyCode;
        if (!somLiberado && window.TugAudio) {
            somLiberado = true; // primeiro botão do controle libera o som (gesto do usuário)
            try { TugAudio.init(); TugAudio.startMusic(); } catch (x) {}
            try { TugAudio.unlockSfx(); } catch (x) {}
        }
        if (digitando()) {
            if (k === KEY.OK || k === KEY.BACK || k === KEY.ESC || k === KEY.UP || k === KEY.DOWN) {
                var inp = document.activeElement;
                inp.classList.remove('tv-editing');
                inp.dispatchEvent(new Event('change', { bubbles: true }));
                travarCampo(inp); inp.blur(); focar(inp);
                e.preventDefault(); e.stopImmediatePropagation();
                if (k === KEY.UP || k === KEY.DOWN) mover(k === KEY.UP ? 'up' : 'down');
            }
            return;
        }
        var trat = true;
        switch (k) {
            case KEY.LEFT: mover('left'); break;
            case KEY.RIGHT: mover('right'); break;
            case KEY.UP: mover('up'); break;
            case KEY.DOWN: mover('down'); break;
            case KEY.OK:
                if (!focoValido()) { focar(padrao(escopo())); break; }
                if (ehCampo(atual)) { atual.classList.add('tv-editing'); liberarCampo(atual); atual.focus(); try { atual.select(); } catch (x) {} break; }
                var alvo = atual;
                alvo.click();
                // continua no mesmo botão se ele segue visível (ex.: Trilha no menu)
                autoFoco = !(document.body.contains(alvo) && escopo().contains(alvo) && visivel(alvo) && (alvo.id === 'btnTrilha' || alvo.id === 'btnCamera' || alvo.id === 'btnSfx'));
                break;
            case KEY.BACK: case KEY.ESC: case 10009: voltar(); break;
            case KEY.RED: teclaCor('red'); break;
            case KEY.GREEN: teclaCor('green'); break;
            case KEY.YELLOW: teclaCor('yellow'); break;
            case KEY.BLUE: teclaCor('blue'); break;
            default: trat = false;
        }
        if (trat) { e.preventDefault(); e.stopImmediatePropagation(); }
    }, true);

    // Mouse do Magic Remote: o ponteiro também move o foco.
    document.addEventListener('mouseover', function (e) {
        var el = e.target.closest && e.target.closest(FOCUSABLE);
        if (el && escopo().contains(el) && visivel(el)) focar(el);
    });

    // ---------- Observa mudanças de tela ----------
    var agendado = false;
    var mo = new MutationObserver(function () {
        if (agendado) return; agendado = true;
        setTimeout(function () {
            agendado = false;
            nomearPadroes();
            travarCampos();
            montarLayout();
            if (window.TVTrava) TVTrava();
            var or = document.getElementById('orderResults'), sa = document.querySelector('#setupScreen .setup-actions');
            if (or && sa && or.style.display === 'block' && sa.style.display !== 'none') {
                sa.style.display = 'none';
                var go = or.querySelector('button'); if (go) { focar(go); go.scrollIntoView({ block: 'center' }); }
            }
            var ok = focoValido();
            if (!ok || autoFoco) { var p = padrao(escopo(), true); if (p && p !== atual) focar(p); }
        }, 120);
    });
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    travarCampos();
    montarLayout();
    montarTrilha();
    // Ponteiro do Magic Remote clicou direto no campo: entra em modo edição de verdade.
    document.addEventListener('mousedown', function (e) {
        var c = e.target;
        if (ehCampo(c) && !c.classList.contains('tv-editing')) { c.classList.add('tv-editing'); liberarCampo(c); focar(c); setTimeout(function () { c.focus(); }, 0); }
    }, true);
    // Campo perdeu o foco por outro motivo: salva e trava de novo.
    document.addEventListener('focusout', function (e) {
        var c = e.target;
        if (ehCampo(c) && c.classList.contains('tv-editing')) {
            c.classList.remove('tv-editing'); travarCampo(c);
            c.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }, true);
    (function credito() {
        var c = document.createElement('div');
        c.id = 'tvCredito'; c.className = 'tv-credito'; c.setAttribute('aria-hidden', 'true');
        c.textContent = '\u00A9 2026 Jossian Brito';
        document.body.appendChild(c);
    })();

    // ---------- Pinos 3D (Three.js) com volta para SVG ----------
    // ---------- Diagnóstico dos pinos ----------
    window.TVPinsStatus = 'verificando...';
    function statusPinos(txt) {
        window.TVPinsStatus = txt;
        var el = document.getElementById('tvPinsStatus');
        if (!el) {
            var menu = document.querySelector('#panelMenu .panel-content');
            if (!menu) return;
            el = document.createElement('p');
            el.id = 'tvPinsStatus'; el.className = 'tv-diag';
            menu.appendChild(el);
        }
        el.textContent = 'Pinos: ' + txt + '  |  tela ' + innerWidth + 'x' + innerHeight + ' @' + (window.devicePixelRatio || 1) + 'x';
    }
    window.TVStatusPinos = statusPinos;
    function testaWebGL() {
        if (/[?&]pins=svg/.test(location.search)) return 'forçado por ?pins=svg';
        if (!window.WebGLRenderingContext) return 'navegador sem WebGLRenderingContext';
        var opts = { failIfMajorPerformanceCaveat: false, alpha: true, antialias: false };
        var nomes = ['webgl', 'experimental-webgl'], erro = '';
        for (var i = 0; i < nomes.length; i++) {
            try {
                var c = document.createElement('canvas');
                var gl = c.getContext(nomes[i], opts);
                if (gl) { window.TVGLName = nomes[i]; return ''; }
            } catch (e) { erro = e && e.message; }
        }
        return 'getContext falhou' + (erro ? ' (' + erro + ')' : ' (sem contexto)');
    }
    var motivo = testaWebGL();
    if (!motivo) {
        var s1 = document.createElement('script');
        s1.src = 'tv/vendor/three.min.js?v=' + PIN_V;
        s1.onerror = function () { statusPinos('SVG (three.min.js não carregou)'); };
        s1.onload = function () {
            if (!window.THREE) { statusPinos('SVG (Three.js não iniciou neste navegador)'); return; }
            var s2 = document.createElement('script');
            s2.src = 'tv/pins3d.js?v=' + PIN_V;
            s2.onerror = function () { statusPinos('SVG (pins3d.js não carregou)'); };
            document.head.appendChild(s2);
        };
        document.head.appendChild(s1);
    } else {
        statusPinos('SVG (' + motivo + ')');
    }
    window.addEventListener('error', function (e) {
        if (e && e.filename && /three|pins3d/.test(e.filename)) statusPinos('SVG (erro JS: ' + (e.message || '') + ')');
    });
    setTimeout(function () { statusPinos(window.TVPinsStatus); }, 1500);

    // ---------- Escala: desenha em 1920x1080 e encaixa na tela real ----------
    function escalar() {
        var k = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
        var b = document.body;
        b.style.webkitTransformOrigin = '0 0'; b.style.transformOrigin = '0 0';
        // centraliza o quadro 1920x1080 escalado na tela real (margens iguais)
        var dx = Math.max(0, (window.innerWidth - 1920 * k) / 2), dy = Math.max(0, (window.innerHeight - 1080 * k) / 2);
        var t = 'translate(' + dx + 'px,' + dy + 'px) scale(' + k + ')';
        b.style.position = 'absolute'; b.style.left = '0px'; b.style.top = '0px'; b.style.margin = '0px';
        b.style.webkitTransform = t; b.style.transform = t;
        document.documentElement.style.setProperty('--tv-k', k);
        window.TVScale = k;
    }
    window.addEventListener('resize', escalar);
    // O body escalado ainda tem 1080px de layout: trava a rolagem da janela em 0.
    function travaRolagem() {
        if (window.scrollX || window.scrollY) window.scrollTo(0, 0);
        if (document.documentElement.scrollTop) document.documentElement.scrollTop = 0;
        if (document.body.scrollTop) document.body.scrollTop = 0;
        var g = document.getElementById('gameScreen'); if (g && g.scrollTop) g.scrollTop = 0;
        var gc = document.querySelector('.game-container'); if (gc && gc.scrollTop) gc.scrollTop = 0;
    }
    window.addEventListener('scroll', travaRolagem);
    window.TVTrava = travaRolagem;
    escalar();

    window.TV = { sairApp: sairApp, nomeMaritimo: nomeMaritimo };
})();
