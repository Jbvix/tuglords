/*
 * Pinos 3D do TugLords TV (Three.js r128, malha feita no código).
 * Os pinos SVG continuam no DOM como "âncoras" (posição, pulo, balanço);
 * esta camada desenha um pino 3D por cima de cada um. Se o WebGL falhar,
 * a camada some e o SVG volta a aparecer.
 */
(function () {
    'use strict';
    var THREE = window.THREE;
    if (!THREE) return;

    var renderer, scene, camera, canvas;
    try {
        canvas = document.createElement('canvas');
        canvas.id = 'pins3d';
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false, alpha: true, powerPreference: 'low-power', failIfMajorPerformanceCaveat: false });
        renderer.setPixelRatio(1);
        renderer.setClearColor(0x000000, 0);
    } catch (e) {
        console.warn('Pinos 3D: WebGL indisponível, usando SVG', e);
        if (window.TVStatusPinos) TVStatusPinos('SVG (Three.js: ' + (e && e.message || 'erro ao criar renderer') + ')');
        return;
    }
    document.documentElement.appendChild(canvas); // fora do body escalado

    var W = 0, H = 0;
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(0, 1, 0, -1, -2000, 2000);
    function resize() {
        W = window.innerWidth; H = window.innerHeight;
        renderer.setSize(W, H, false);
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
        camera.left = 0; camera.right = W; camera.top = 0; camera.bottom = -H;
        camera.updateProjectionMatrix();
        sujo = true;
        if (typeof acordar === 'function') acordar();
    }

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    var sol = new THREE.DirectionalLight(0xffffff, 0.85);
    sol.position.set(-0.6, 1, 0.9);
    scene.add(sol);

    // ---- Geometria compartilhada (unidade = largura da base) ----
    // Perfil do corpo (lathe): base larga, cintura fina, gola sob a cabeça.
    var perfil = [
        [0.0, 0.0], [0.5, 0.0], [0.5, 0.1], [0.42, 0.14], [0.3, 0.3], [0.2, 0.62], [0.17, 0.8],
        [0.27, 0.86], [0.27, 0.92], [0.0, 0.92]
    ].map(function (p) { return new THREE.Vector2(p[0], p[1]); });
    var gCorpo = new THREE.LatheGeometry(perfil, 16);
    var gCabeca = new THREE.SphereGeometry(0.3, 14, 10);
    var gSombra = new THREE.CircleGeometry(0.62, 18);
    var mSombra = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.38, depthWrite: false });

    var TILT = 0.42; // inclina o pino em direção ao espectador

    function criarPino() {
        var mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        var grupo = new THREE.Group();
        var corpo = new THREE.Mesh(gCorpo, mat);
        var cabeca = new THREE.Mesh(gCabeca, mat);
        cabeca.position.y = 1.15;
        var pino = new THREE.Group();
        pino.add(corpo); pino.add(cabeca);
        pino.rotation.x = TILT;
        grupo.add(pino);
        var sombra = new THREE.Mesh(gSombra, mSombra);
        sombra.renderOrder = -1;
        scene.add(sombra);
        scene.add(grupo);
        return { grupo: grupo, pino: pino, mat: mat, sombra: sombra, cor: '', giro: 0 };
    }
    var pool = [];

    var sujo = true, ultimo = '', tUlt = 0, ativo = false;
    document.body.classList.add('pins3d');

    function falhar(motivo) {
        ativo = false;
        if (window.TVStatusPinos) TVStatusPinos('SVG (' + (typeof motivo === 'string' ? motivo : 'contexto WebGL perdido') + ')');
        document.body.classList.remove('pins3d');
        if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); falhar(); });

    // Loop sob demanda: só roda enquanto algo se mexe; para sozinho quando fica parado.
    var rodando = false, parados = 0, renders = 0, ultimaPos = [];
    function acordar() {
        parados = 0;
        if (!rodando && document.body.classList.contains('pins3d')) { rodando = true; requestAnimationFrame(quadro); }
    }
    function quadro(t) {
        if (!document.body.classList.contains('pins3d')) { rodando = false; return; }
        var cine = !!document.querySelector('.board-game.cinematic');
        // tabuleiro 3D: segue cada quadro e só dorme após ~2 s sem nenhuma mudança
        if (parados > (cine ? 60 : 20)) { rodando = false; return; }   // ~0,6 s sem mudança: dorme
        requestAnimationFrame(quadro);
        if (!cine && t - tUlt < 33) return; // ~30 fps parado; durante o 3D do tabuleiro, todo quadro
        tUlt = t;

        var tampa = document.querySelector('#gameModal.open, #panelMenu.active, #tvExit, .modal-overlay.open');
        var tela = document.getElementById('gameScreen');
        var pawns = (tela && tela.style.display !== 'none' && !tampa) ? document.querySelectorAll('#visualBoard .player-pawn') : [];
        var vb = document.getElementById('visualBoard');
        var orb = !!document.querySelector('.board-game.orbiting');
        var assin = W + 'x' + H + (orb ? 'o' : '') + (tampa ? 't' : '');
        var dados = [];
        for (var i = 0; i < pawns.length; i++) {
            var p = pawns[i];
            var lift = p.querySelector('.pawn-lift') || p;
            var rp = p.getBoundingClientRect(), rl = lift.getBoundingClientRect();
            var path = p.querySelector('path');
            var d = {
                x: rp.left + rp.width / 2, chao: rp.bottom, base: rl.bottom, s: rp.width,
                cor: path ? path.getAttribute('fill') : '#ffffff', at: p.classList.contains('pawn-active')
            };
            dados.push(d);
            assin += '|' + Math.round(d.x) + ',' + Math.round(d.base) + ',' + Math.round(d.chao) + ',' + Math.round(d.s) + d.cor + (d.at ? 1 : 0);
        }
        if (!sujo && assin === ultimo && !orb) { parados++; return; }
        parados = 0; renders++;
        ultimo = assin; sujo = false;
        ultimaPos = dados.map(function (d) { return [Math.round(d.x), Math.round(d.base)]; });

        while (pool.length < dados.length) pool.push(criarPino());
        for (var j = 0; j < pool.length; j++) {
            var o = pool[j], dd = dados[j];
            o.grupo.visible = o.sombra.visible = !!dd;
            if (!dd) continue;
            if (o.cor !== dd.cor) { o.mat.color.set(dd.cor); o.cor = dd.cor; }
            o.mat.emissive.setHex(dd.at ? 0x6b4f00 : 0x000000);
            var esc = dd.s * 1.15;
            o.grupo.position.set(dd.x, -dd.base, dd.chao); // z pelo chão: quem está mais embaixo fica na frente
            o.grupo.scale.set(esc, esc, esc);
            if (dd.at && orb) o.giro += 0.22; else o.giro = 0;
            o.pino.rotation.y = o.giro;
            var alt = Math.max(0, dd.chao - dd.base);          // altura do pulo
            var k = Math.max(0.45, 1 - alt / (dd.s * 2.5));    // sombra encolhe no ar
            o.sombra.position.set(dd.x, -dd.chao + esc * 0.05, dd.chao - 1);
            o.sombra.scale.set(esc * k, esc * k * 0.32, 1);
            o.sombra.material.opacity = 0.38 * k;
        }

        renderer.setScissorTest(false);
        renderer.clear();
        if (vb && dados.length) {
            var r = vb.getBoundingClientRect();
            renderer.setScissorTest(true);
            renderer.setScissor(r.left, H - r.bottom, r.width, r.height);
            renderer.render(scene, camera);
        }
    }

    window.addEventListener('resize', resize);
    resize();
    try {
        renderer.render(scene, camera);
        ativo = true;
    } catch (e) { console.warn('Pinos 3D: falhou, voltando ao SVG', e); falhar('render falhou: ' + (e && e.message)); return; }
    var mo3 = new MutationObserver(acordar);
    mo3.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
    window.addEventListener('resize', acordar);
    document.addEventListener('transitionrun', acordar, true);
    document.addEventListener('animationstart', acordar, true);
    acordar();
    window.TVPins3D = { ativo: function () { return ativo; }, desligar: falhar, info: function () { return { rodando: rodando, renders: renders, pos: ultimaPos }; } };
    console.log('🎯 Pinos 3D ativos');
    if (window.TVStatusPinos) TVStatusPinos('3D (' + (window.TVGLName || 'webgl') + ', ' + (renderer.capabilities.isWebGL2 ? 'WebGL2' : 'WebGL1') + ')');
})();
