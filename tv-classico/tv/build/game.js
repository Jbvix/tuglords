/* Polyfills mínimos para navegadores ES5 (Samsung Orsay/Maple, TVs antigas). */
if (!Array.prototype.find) { Array.prototype.find = function (f, t) { for (var i = 0; i < this.length; i++) if (f.call(t, this[i], i, this)) return this[i]; }; }
if (!Array.prototype.findIndex) { Array.prototype.findIndex = function (f, t) { for (var i = 0; i < this.length; i++) if (f.call(t, this[i], i, this)) return i; return -1; }; }
if (!Array.prototype.includes) { Array.prototype.includes = function (v) { for (var i = 0; i < this.length; i++) if (this[i] === v || (v !== v && this[i] !== this[i])) return true; return false; }; }
if (!Array.prototype.fill) { Array.prototype.fill = function (v) { for (var i = 0; i < this.length; i++) this[i] = v; return this; }; }
if (!Array.from) { Array.from = function (a, m) { var r = []; for (var i = 0; i < a.length; i++) r.push(m ? m(a[i], i) : a[i]); return r; }; }
if (!String.prototype.includes) { String.prototype.includes = function (s, p) { return this.indexOf(s, p || 0) !== -1; }; }
if (!String.prototype.startsWith) { String.prototype.startsWith = function (s, p) { p = p || 0; return this.substr(p, s.length) === s; }; }
if (!String.prototype.repeat) { String.prototype.repeat = function (n) { var r = ''; for (var i = 0; i < n; i++) r += this; return r; }; }
if (!String.prototype.padStart) { String.prototype.padStart = function (n, c) { var s = String(this); c = c || ' '; while (s.length < n) s = c + s; return s; }; }
if (!Object.assign) { Object.assign = function (t) { for (var i = 1; i < arguments.length; i++) { var s = arguments[i]; if (s) for (var k in s) if (Object.prototype.hasOwnProperty.call(s, k)) t[k] = s[k]; } return t; }; }
if (!Object.values) { Object.values = function (o) { var r = []; for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) r.push(o[k]); return r; }; }
if (!Object.entries) { Object.entries = function (o) { var r = []; for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) r.push([k, o[k]]); return r; }; }
if (!Number.isNaN) { Number.isNaN = function (v) { return v !== v; }; }
if (typeof Symbol === 'undefined') { window.Symbol = function (d) { return '@@' + d; }; window.Symbol.iterator = '@@iterator'; }
function _createForOfIteratorHelperLoose(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (t) return (t = t.call(r)).next.bind(t); if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var o = 0; return function () { return o >= r.length ? { done: !0 } : { done: !1, value: r[o++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
(function () {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = function __defNormalProp(obj, key, value) {
    return key in obj ? __defProp(obj, key, {
      enumerable: true,
      configurable: true,
      writable: true,
      value: value
    }) : obj[key] = value;
  };
  var __spreadValues = function __spreadValues(a, b) {
    for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols) {
      for (var _iterator = _createForOfIteratorHelperLoose(__getOwnPropSymbols(b)), _step; !(_step = _iterator()).done;) {
        var prop = _step.value;
        if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
      }
    }
    return a;
  };
  var __spreadProps = function __spreadProps(a, b) {
    return __defProps(a, __getOwnPropDescs(b));
  };
  var __export = function __export(target, all) {
    for (var name in all) __defProp(target, name, {
      get: all[name],
      enumerable: true
    });
  };

  // src/js/modules/state.js
  var REGION_COLORS = {
    norte: "#10b981",
    // verde
    nordeste: "#f59e0b",
    // âmbar
    sudeste: "#ef4444",
    // vermelho
    sul: "#3b82f6"
    // azul
  };
  var PORT_REGIONS = {
    "Porto de Fortaleza": "nordeste",
    "Porto de Salvador": "nordeste",
    "Porto de Suape": "nordeste",
    "Porto de Santos": "sudeste",
    "Porto de Vitória": "sudeste",
    "Porto de Macaé": "sudeste",
    "Porto do Açu": "sudeste",
    "Porto de Itajaí": "sul",
    "Porto de Rio Grande": "sul",
    "Porto de Paranaguá": "sul",
    "Porto de Manaus": "norte",
    "Porto de Belém": "norte",
    "Porto de São Luís": "norte",
    "Porto de Vila do Conde": "norte"
  };
  var gameState = {
    players: [],
    currentPlayerIndex: 0,
    currentRound: 1,
    phase: "setup",
    // setup, playing
    playerOrder: [],
    diceRolled: false,
    houses: [{
      name: "Casa Inicial",
      type: "start",
      icon: "🏁",
      actions: []
    }, {
      name: "Porto de Fortaleza",
      type: "port",
      price: 8e3,
      rent: [800, 1600, 3e3, 5e3, 7500, 1e4],
      icon: "⚓",
      actions: ["buy"]
    }, {
      name: "Manobra do Porto",
      type: "maneuver",
      icon: "⚓",
      actions: []
    },
    // Regras v2 (antes: Evento Oceânico)
    {
      name: "Porto de Santos",
      type: "port",
      price: 12e3,
      rent: [1200, 2400, 4500, 7e3, 1e4, 14e3],
      icon: "🚢",
      actions: ["buy"]
    }, {
      name: "Posto de Combustível",
      type: "service",
      price: 6e3,
      icon: "⛽",
      actions: ["buy"]
    }, {
      name: "Banco",
      type: "bank",
      icon: "🏦",
      actions: ["loan"]
    }, {
      name: "Loja de Rebocadores",
      type: "tug_purchase",
      price: 7e3,
      tugType: "port",
      icon: "🛒",
      actions: ["buy"]
    },
    // Added Shop
    {
      name: "Carta Surpresa",
      type: "surprise",
      icon: "🎁",
      actions: []
    }, {
      name: "SCHOREL",
      type: "workshop",
      price: 8e3,
      serviceFee: 1500,
      certificate: "azimuth",
      icon: "🛠️",
      actions: ["buy"]
    }, {
      name: "Docagem Obrigatória",
      type: "drydock",
      icon: "🛠️",
      actions: []
    },
    // Index 9 (antes: Canto Sorte, casa sem efeito)
    // Side 2 (Left)
    {
      name: "Porto de Salvador",
      type: "port",
      price: 9e3,
      rent: [900, 1800, 3500, 5500, 8e3, 11e3],
      icon: "⛵",
      actions: ["buy"]
    }, {
      name: "Salvatagem Oceânica",
      type: "event",
      icon: "🌊",
      actions: []
    },
    // Regras v2: só para quem tem Oceânico
    {
      name: "KAT",
      type: "workshop",
      price: 9e3,
      serviceFee: 1800,
      certificate: "diesel",
      icon: "🏭",
      actions: ["buy"]
    }, {
      name: "Porto de Vitória",
      type: "port",
      price: 8500,
      rent: [850, 1700, 3200, 5200, 7800, 10500],
      icon: "🚤",
      actions: ["buy"]
    }, {
      name: "Universidade do Mar",
      type: "university",
      icon: "🎓",
      actions: []
    }, {
      name: "Porto de Macaé",
      type: "port",
      price: 11e3,
      rent: [1100, 2200, 4e3, 6500, 9500, 13e3],
      icon: "⛴️",
      actions: ["buy"]
    }, {
      name: "Carta Sorte",
      type: "luck",
      icon: "🎲",
      actions: []
    }, {
      name: "Porto do Açu",
      type: "port",
      price: 14e3,
      rent: [1400, 2800, 5e3, 8e3, 12e3, 16e3],
      icon: "🛳️",
      actions: ["buy"]
    },
    // Corner 18
    {
      name: "Certificação TugLord",
      type: "tuglord_certificate",
      icon: "🎖️",
      actions: []
    },
    // Side 3 (Top)
    {
      name: "Porto de Itajaí",
      type: "port",
      price: 9500,
      rent: [950, 1900, 3600, 5800, 8500, 11500],
      icon: "🛥️",
      actions: ["buy"]
    }, {
      name: "Manobra do Porto",
      type: "maneuver",
      icon: "⚓",
      actions: []
    },
    // Regras v2 (antes: Evento Oceânico)
    {
      name: "MDU",
      type: "workshop",
      price: 8500,
      serviceFee: 1600,
      certificate: "highspeed",
      icon: "🔧",
      actions: ["buy"]
    }, {
      name: "Porto de Rio Grande",
      type: "port",
      price: 9e3,
      rent: [900, 1800, 3500, 5500, 8e3, 11e3],
      icon: "🚤",
      actions: ["buy"]
    }, {
      name: "Bolsa de Valores",
      type: "stock_exchange",
      icon: "📈",
      actions: ["invest"]
    }, {
      name: "Porto de Paranaguá",
      type: "port",
      price: 10500,
      rent: [1050, 2100, 3900, 6200, 9e3, 12500],
      icon: "⛴️",
      actions: ["buy"]
    }, {
      name: "Treinamento",
      type: "training",
      price: 3e3,
      certificate: "maneuver",
      icon: "🎓",
      actions: ["buy"]
    }, {
      name: "Porto de Suape",
      type: "port",
      price: 11500,
      rent: [1150, 2300, 4200, 6800, 9800, 13500],
      icon: "🚢",
      actions: ["buy"]
    },
    // Corner 27
    {
      name: "UNISALVAGE",
      type: "unisalvage",
      icon: "🛟",
      actions: []
    },
    // Regras v2 (antes: Banco Central; o Banco da casa 5 segue com empréstimos)
    // Side 4 (Right)
    {
      name: "Porto de Manaus",
      type: "port",
      price: 8e3,
      rent: [800, 1600, 3e3, 5e3, 7500, 1e4],
      icon: "⛴️",
      actions: ["buy"]
    }, {
      name: "Carta Azar",
      type: "luck",
      icon: "⚠️",
      actions: []
    }, {
      name: "Estaleiro Naval",
      type: "service",
      price: 12e3,
      tuglordBuildCost: 2e4,
      icon: "🏗️",
      actions: ["buy"]
    }, {
      name: "Porto de Belém",
      type: "port",
      price: 8500,
      rent: [850, 1700, 3200, 5200, 7800, 10500],
      icon: "⛵",
      actions: ["buy"]
    }, {
      name: "Loja de Rebocadores (Oceânico)",
      type: "tug_purchase",
      price: 15e3,
      tugType: "ocean",
      icon: "🛒",
      actions: ["buy"]
    },
    // Added Shop
    {
      name: "Porto de São Luís",
      type: "port",
      price: 1e4,
      rent: [1e3, 2e3, 3800, 6e3, 8800, 12e3],
      icon: "🚤",
      actions: ["buy"]
    }, {
      name: "Vistoria LOYDS TUGSTER",
      type: "inspection",
      icon: "📋",
      actions: []
    },
    // Regras v2 (antes: Taxa Portuária)
    {
      name: "Porto de Vila do Conde",
      type: "port",
      price: 9500,
      rent: [950, 1900, 3600, 5800, 8500, 11500],
      icon: "🚢",
      actions: ["buy"]
    }].map(function (h, i) {
      return __spreadProps(__spreadValues({}, h), {
        pos: i,
        region: PORT_REGIONS[h.name]
      });
    })
  };
  var CERTIFICATES = ["fire", "rescue", "collision", "abandon"];
  var TECH_CERTIFICATES = ["azimuth", "diesel", "highspeed", "maneuver"];
  var CERTIFIED_FEE_MULTIPLIER = 1.5;
  var REGRAS = {
    // Balanceamento Dr. Fintech (26/10/2026, aprovado pelo Jossian).
    DINHEIRO_INICIAL: 3e4,
    SALARIO_PARTIDA: 2500,
    ALUGUEL_MULT: 0.6,
    // aluguel/arrendamento = tabela rent[] x 0,6 (Santos: 720, 1440, 2700...)
    // Rebocadores
    PRECO_PORTUARIO: 7e3,
    // antes F$ 10 mi: portuário mais barato (manobra é o motor do jogo)
    PRECO_OCEANICO: 15e3,
    CUPOM_DESCONTO: 0.5,
    // carta de cupom: 50% na próxima compra de portuário
    CARTA_TUG_DINHEIRO: {
      port_tug: 5e3,
      ocean_tug: 15e3
    },
    // sem requisito ou já tem: recebe em dinheiro
    // Portos
    IMPOSTO_PORTO_PROPRIO: 0.1,
    // própria casa: paga 10% do preço do porto em impostos
    // Oficinas
    OFICINA_SERVICO: 5e3,
    // adversário paga ao dono (x1,5 se certificada)
    OFICINA_BONUS: 1e3,
    // dono paga aos funcionários (1ª a 3ª vez)
    OFICINA_INCENTIVO_TAXA: 0.25,
    // na 4ª vez o Banco devolve 25% dos bônus pagos e zera
    OFICINA_INCENTIVO_NA_VEZ: 4,
    // Estaleiro
    ESTALEIRO_TAXA: 3e3,
    // ao cair (ao dono do Estaleiro ou ao Banco)
    ESTALEIRO_ESTADIA_VOLTA: 1e3,
    // por volta, por rebocador docado
    // Manobra do Porto: valor base x nº de portuários operacionais
    MANOBRA_BASE: 1e4,
    // por portuário operacional
    MANOBRA_MAX_PORTUARIOS: 4,
    // teto: no máximo 4 portuários contam na manobra (99 = sem teto)
    CARTA_MANOBRA_MULT: 2,
    // carta Manobra de Porto paga 2 x base x portuários
    // Salvatagem (só com Oceânico operacional)
    // Reboque Oceânico / Salvatagem (casa 11 e cartas): o evento de dinheiro grande.
    // Só com Rebocador Oceânico operacional + Certificado Tuglords.
    SALVATAGEM_PREMIOS: [4e4, 45e3, 5e4, 55e3, 6e4],
    // Manobra só rende com MANOBRA_CERTS_SEGURANCA certificado(s) de segurança (v3.3: 1).
    MANOBRA_EXIGE_CERTIFICADOS: true,
    MANOBRA_CERTS_SEGURANCA: 1,
    // v3.3: 1 certificado de segurança basta para manobrar (antes 4)
    UNIVERSIDADE_PROVAS_POR_VISITA: 2,
    // v3.3: provas de segurança por visita (Universidade e Treinamento)
    TREINAMENTO_CERT_SEGURANCA: true,
    // v3.3: casa 25 Treinamento também dá certificado de segurança
    TREINAMENTO_CUSTO_PROVA: 3e3,
    // v3.3: custo por prova de segurança no Treinamento (F$ 3 mi)
    // UNISALVAGE: cair 3x (1 quiz de acesso + 2 quizzes). Reprovou: refaz a mesma etapa na próxima visita.
    UNISALVAGE_ETAPAS: 2,
    // v3.3: 2 aprovações na UNISALVAGE dão o Certificado Tuglords (antes 3)
    // ===== Engajamento (TV) =====
    EVENTOS_RODADA_A_CADA: 5,
    // a cada N rodadas sorteia um evento global (vale só naquela rodada)
    EVENTOS_RODADA: [{
      id: "safra",
      nome: "Safra recorde",
      texto: "manobras pagam em dobro nesta rodada",
      cor: "#22c55e",
      manobraMult: 2
    }, {
      id: "ressaca",
      nome: "Ressaca no porto",
      texto: "sem manobra nesta rodada",
      cor: "#64748b",
      manobraMult: 0
    }, {
      id: "aluguel_alta",
      nome: "Aluguel em alta",
      texto: "arrendamentos +50% nesta rodada",
      cor: "#f97316",
      aluguelMult: 1.5
    }, {
      id: "taxa_reduzida",
      nome: "Taxa reduzida",
      texto: "impostos e taxas pela metade nesta rodada",
      cor: "#38bdf8",
      taxaMult: 0.5
    }, {
      id: "mar_calmo",
      nome: "Mar calmo",
      texto: "Reboque Oceânico paga +50% nesta rodada",
      cor: "#a78bfa",
      salvamentoMult: 1.5
    }],
    RETA_FINAL_RODADAS: 5,
    // últimas N rodadas do LIMITE_RODADAS
    RETA_FINAL_MULT: 1.5,
    // multiplicador de pagamentos recebidos (exceto salário)
    LEILAO_ATIVO: true,
    LEILAO_LANCE_INICIAL: 0.5,
    // lance mínimo = 50% do preço do porto
    LEILAO_INCREMENTO: 1e3,
    // cada lance sobe F$ 1 mi
    // Economia P2 (v3e, sem empréstimo)
    OCEANICO_NA_FORMATURA: true,
    // formatura UNISALVAGE dá um Rebocador Oceânico grátis
    DESAFIO_CAIXA_MIN: 1e4,
    // desafio só se os dois tiverem caixa >= F$ 10 mi
    LIQUIDACAO_TAXA: 0.7,
    // venda forçada/voluntária ao Banco paga 70% (antes 50%)
    LIQUIDACAO_INCLUI_OCEANICO: true,
    // o Rebocador Oceânico também pode ser vendido ao Banco
    TETO_PAGTO_BANCO_PCT_CAIXA: 0.5,
    // pagamentos ao Banco limitados a 50% do caixa atual
    EMPRESTIMO_ATIVO: false,
    // false: sem empréstimos (botões ocultos, takeLoan bloqueado); true traz de volta
    OCEANICO_FRETE_LARGADA: 3e3,
    // P3: frete de F$ 3 mi por volta para quem tem Rebocador Oceânico (via credit)
    DESAFIO_APOSTA: 3e3,
    // quem erra paga a quem acerta (F$ 3 mi)
    DESAFIO_MULTA_ERRO_DUPLO: 500,
    // dois erros: cada um paga ao Banco
    CONQUISTA_FROTA: 5,
    CONQUISTA_SALVAMENTO_EPICO: 5e4,
    NARRADOR_PAGAMENTO_GRANDE: 3e4,
    NARRADOR_QUASE_FALENCIA: 2e3,
    UNISALVAGE_TAXA_PROVA: 2e3,
    // taxa por tentativa de prova (paga antes do quiz, passe ou não)
    // Rebocador Oceânico (loja, kits e brindes) exige o Certificado Tuglords.
    OCEANICO_EXIGE_CERT_TUGLORDS: true,
    // Vistoria LOYDS TUGSTER
    VISTORIA_PREMIO: 2e3,
    VISTORIA_TURNOS_PRESO: 3,
    // Casa Docagem Obrigatória (regras 24/10)
    DOCAGEM_CASA: 2e3,
    DOCAGEM_CASA_PERDE_TURNO: true,
    // Fim de jogo (Jossian ainda decide a condição de vitória: ajuste aqui).
    LIMITE_RODADAS: 40,
    // 0 = sem limite
    CRITERIO_VENCEDOR: "patrimonio",
    // 'patrimonio' (netWorth) ou 'dinheiro' (só caixa)
    VITORIA_SUPREMA_ATIVA: true
    // TugLord Supremo continua encerrando antes do limite
  };
  var WORKSHOP_STAFF_PAY = REGRAS.OFICINA_BONUS;
  var WORKSHOP_SERVICE_FEE = REGRAS.OFICINA_SERVICO;
  var DOCKING_HOUSE_COST = REGRAS.DOCAGEM_CASA;
  var DOCKING_HOUSE_SKIP_TURN = REGRAS.DOCAGEM_CASA_PERDE_TURNO;
  var CARD_TUG_CASH = REGRAS.CARTA_TUG_DINHEIRO;
  var BANK_OWNER_LABEL = "Banco";
  var CARD_DECK = [{
    msg: "Salvatagem de petroleiro! +F$ 10,8 mi",
    val: 10800
  }, {
    msg: "Contrato anual de porto! +F$ 9,6 mi",
    val: 9600
  }, {
    msg: "Resgate offshore! +F$ 9 mi",
    val: 9e3
  }, {
    msg: "Reboque de plataforma! +F$ 10,2 mi",
    val: 10200
  }, {
    msg: "Salvamento de graneleiro! +F$ 8,4 mi",
    val: 8400
  }, {
    msg: "Contrato com terminal de contêineres! +F$ 9,6 mi",
    val: 9600
  }, {
    msg: "Assistência a navio encalhado! +F$ 7,8 mi",
    val: 7800
  }, {
    msg: "Frota contratada por estatal de energia! +F$ 10,8 mi",
    val: 10800
  }, {
    msg: "Escolta de navio gaseiro! +F$ 8,4 mi",
    val: 8400
  }, {
    msg: "Prêmio de segurança do ano! +F$ 7,2 mi",
    val: 7200
  }, {
    msg: "Kit Porto! 2 Rebocadores Portuários",
    val: 0,
    asset: "port_kit",
    good: true
  }, {
    msg: "Kit Porto! 2 Rebocadores Portuários",
    val: 0,
    asset: "port_kit",
    good: true
  }, {
    msg: "Kit Especial! 1 Portuário + 1 Oceânico",
    val: 0,
    asset: "special_kit",
    good: true
  }, {
    msg: "Você ganhou um Rebocador Portuário!",
    val: 0,
    asset: "port_tug",
    good: true
  }, {
    msg: "Você ganhou um Rebocador Portuário!",
    val: 0,
    asset: "port_tug",
    good: true
  }, {
    msg: "Você ganhou um Rebocador Oceânico!",
    val: 0,
    asset: "ocean_tug",
    good: true
  }, {
    msg: "Cupom do estaleiro! 50% no próximo Portuário",
    val: 0,
    asset: "tug_coupon",
    good: true
  }, {
    msg: "Manobra de Porto! Atracação de navio",
    val: 0,
    asset: "maneuver",
    good: true
  }, {
    msg: "Manobra de Porto! Desatracação noturna",
    val: 0,
    asset: "maneuver",
    good: true
  }, {
    msg: "Manobra de Porto! Giro na bacia",
    val: 0,
    asset: "maneuver",
    good: true
  }, {
    msg: "Manobra de Porto! Navio de cruzeiro",
    val: 0,
    asset: "maneuver",
    good: true
  }, {
    msg: "Reboque Oceânico! Navio à deriva",
    val: 0,
    asset: "salvage",
    good: true
  }, {
    msg: "Reboque Oceânico! Plataforma em tempestade",
    val: 0,
    asset: "salvage",
    good: true
  }, {
    msg: "Reboque Oceânico! Resgate de cargueiro",
    val: 0,
    asset: "salvage",
    good: true
  }, {
    msg: "Multa ambiental! -F$ 2 mi",
    val: -2e3
  }, {
    msg: "Avaria no motor! -F$ 4 mi",
    val: -4e3
  }, {
    msg: "Manutenção emergencial! -F$ 3 mi",
    val: -3e3
  }, {
    msg: "Avaria grave no guincho! -F$ 6 mi",
    val: -6e3
  }, {
    msg: "Multa da Capitania dos Portos! -F$ 8 mi",
    val: -8e3
  }, {
    msg: "Colisão no cais! -F$ 10 mi",
    val: -1e4
  }, {
    msg: "Derramamento de óleo! -F$ 15 mi",
    val: -15e3
  }, {
    msg: "Greve no porto! -F$ 7 mi",
    val: -7e3
  }];
  var UNISALVAGE_QUESTIONS = [[{
    question: "Antes de uma salvatagem, a prioridade número 1 é:",
    options: ["Salvar vidas", "Salvar a carga e o casco antes de tudo", "Calcular o prêmio da salvatagem", "Chamar a imprensa"],
    correct: "Salvar vidas"
  }, {
    question: "Ao avistar náufragos, o primeiro passo do rebocador é:",
    options: ["Avisar pelo rádio e prestar socorro", "Seguir viagem", "Fotografar a cena", "Esperar o fim do turno"],
    correct: "Avisar pelo rádio e prestar socorro"
  }, {
    question: "O canal VHF de socorro e chamada é o:",
    options: ["Canal 16", "Canal 2", "Canal 99", "Canal 44"],
    correct: "Canal 16"
  }], [{
    question: 'O contrato padrão de salvatagem "sem cura, sem pagamento" é o:',
    options: ["Lloyd's Open Form (LOF)", "Contrato de frete por viagem redonda", "Carta-partida a tempo", "Conhecimento de embarque"],
    correct: "Lloyd's Open Form (LOF)"
  }, {
    question: "Em reboque oceânico, o cabo deve ter uma catenária para:",
    options: ["Absorver os trancos", "Economizar cabo no convés", "Aumentar a velocidade", "Ficar bonito"],
    correct: "Absorver os trancos"
  }, {
    question: "Antes de conectar o reboque num navio à deriva, faça:",
    options: ["Avaliação de risco e plano de conexão", "Aproximação em velocidade máxima", "Nada, é rotina", "Desligar o rádio"],
    correct: "Avaliação de risco e plano de conexão"
  }]];
  var INSPECTION_QUESTIONS = [{
    question: "Na vistoria de casco, o que o classificador verifica primeiro?",
    options: ["Espessura das chapas e corrosão", "A cor da pintura", "O nome do comandante", "O modelo e a marca do rádio VHF da ponte"],
    correct: "Espessura das chapas e corrosão"
  }, {
    question: "O gato de reboque precisa ter qual teste em dia?",
    options: ["Teste de liberação de emergência", "Teste de pintura", "Teste de velocidade máxima em mar aberto", "Nenhum teste"],
    correct: "Teste de liberação de emergência"
  }, {
    question: "O que indica o Bollard Pull no certificado do rebocador?",
    options: ["Força de tração estática", "Velocidade máxima", "Consumo de combustível por hora de máquina", "Calado do navio"],
    correct: "Força de tração estática"
  }, {
    question: "Qual documento comprova que o rebocador está em classe?",
    options: ["Certificado de Classe válido", "Nota fiscal do motor", "Carteira de habilitação do marinheiro de convés", "Licença de pesca"],
    correct: "Certificado de Classe válido"
  }, {
    question: "O cabo de reboque deve ser inspecionado quanto a:",
    options: ["Fios rompidos, desgaste e corrosão", "Somente o comprimento total e o diâmetro nominal", "A cor do cabo", "A marca do fabricante"],
    correct: "Fios rompidos, desgaste e corrosão"
  }, {
    question: "Qual equipamento de salvatagem é obrigatório a bordo?",
    options: ["Balsas e coletes salva-vidas", "Ar-condicionado em todos os camarotes", "Televisão", "Máquina de café"],
    correct: "Balsas e coletes salva-vidas"
  }, {
    question: "O guincho de reboque deve ter freio:",
    options: ["Testado e com capacidade certificada", "Desligado", "Só manual, sem teste e sem certificado", "Opcional"],
    correct: "Testado e com capacidade certificada"
  }, {
    question: "Antes de sair do dique, o que precisa ser conferido?",
    options: ["Válvulas de fundo e estanqueidade", "O cardápio da semana e o estoque da cozinha", "A música do rádio", "Nada"],
    correct: "Válvulas de fundo e estanqueidade"
  }, {
    question: "Extintores a bordo devem estar:",
    options: ["Carregados e com inspeção em dia", "Guardados no porão, longe do uso diário", "Vazios para não pesar", "Só no camarote"],
    correct: "Carregados e com inspeção em dia"
  }, {
    question: "O que é a borda livre (linha de carga)?",
    options: ["Distância entre a linha d'água e o convés", "A altura do mastro acima da casaria", "O tamanho da hélice", "A largura do cais"],
    correct: "Distância entre a linha d'água e o convés"
  }, {
    question: "A propulsão azimutal deve ser vistoriada quanto a:",
    options: ["Vedações, folgas e resposta do comando", "A cor do propulsor", "O peso total da tripulação embarcada", "Nada, é automática"],
    correct: "Vedações, folgas e resposta do comando"
  }, {
    question: "O alarme geral do rebocador deve ser:",
    options: ["Audível em todos os compartimentos", "Desligado sempre que estiver em porto", "Só na ponte", "Opcional"],
    correct: "Audível em todos os compartimentos"
  }];
  var CERT_LABELS = {
    // Segurança (obrigatórios)
    fire: "Incêndio",
    rescue: "Homem ao Mar",
    collision: "Colisão",
    abandon: "Abandono",
    // Técnicos (opcionais)
    azimuth: "Propulsão Azimutal",
    diesel: "Motores Diesel",
    highspeed: "Diesel de Alta Rotação",
    maneuver: "Manobra de Rebocador"
  };
  var TRAINING_QUESTIONS = {
    // ===== CERTIFICADOS DE SEGURANÇA (Universidade) — OBRIGATÓRIOS =====
    fire: [{
      question: "Qual é a primeira ação ao descobrir um incêndio a bordo?",
      options: ["Abandonar o navio", "Jogar água do mar no fogo", "Soar o alarme geral", "Contatar o armador"],
      correct: "Soar o alarme geral"
    }, {
      question: "Qual classe de incêndio envolve líquidos inflamáveis?",
      options: ["Classe A", "Classe B", "Classe C", "Classe D"],
      correct: "Classe B"
    }],
    rescue: [{
      question: "Homem ao mar com ação imediata: qual manobra leva o navio de volta à própria esteira, em rumo oposto?",
      options: ["Manobra de Scharnow", "Manobra de Williamson", "Manobra de Anderson", "Manobra de Boutakov"],
      correct: "Manobra de Williamson"
    }, {
      question: "Qual equipamento deve ser lançado primeiro para homem ao mar?",
      options: ["Colete salva-vidas", "Boia circular", "Corda com nó", "Escada de embarque pelo costado"],
      correct: "Boia circular"
    }],
    collision: [{
      question: "Qual é a regra de ouro para evitar colisões no mar?",
      options: ["Máquinas sempre prontas", "Vigília constante", "Velocidade reduzida", "Sinais sonoros contínuos e repetidos"],
      correct: "Vigília constante"
    }, {
      question: "Duas embarcações a motor em rumos cruzados (Regra 15 do RIPEAM): qual deve manobrar?",
      options: ["A de menor porte", "A que avistou primeiro", "A que tem o outro por bombordo", "A que tem o outro por boreste"],
      correct: "A que tem o outro por boreste"
    }],
    abandon: [{
      question: "Qual sinal sonoro é o alarme geral de emergência a bordo?",
      options: ["Um apito longo", "Três apitos curtos", "Sete curtos e um longo", "Dois apitos longos"],
      correct: "Sete curtos e um longo"
    }, {
      question: "O que é EPIRB?",
      options: ["Equipamento de primeiros socorros", "Radiobaliza de localização de sinistros", "Equipamento de proteção individual", "Extintor portátil de incêndio"],
      correct: "Radiobaliza de localização de sinistros"
    }],
    // ===== CERTIFICADOS TÉCNICOS (Oficinas/Treinamento) — OPCIONAIS =====
    // SCHOREL — Propulsão Azimutal (Rudderpropeller / Z-drive)
    azimuth: [{
      question: "O que é um propulsor azimutal (Rudderpropeller), especialidade da SCHOREL?",
      options: ["Uma hélice de passo fixo montada em eixo único e reto", "Um propulsor que gira 360° fornecendo empuxo em qualquer direção", "Um leme convencional sem hélice", "Um motor de propulsão a vapor"],
      correct: "Um propulsor que gira 360° fornecendo empuxo em qualquer direção"
    }, {
      question: "Qual é a principal vantagem do propulsor azimutal em um rebocador?",
      options: ["Elimina a necessidade de motor principal a bordo", "Permite navegar sem combustível", "Alta manobrabilidade, dispensando leme convencional", "Reduz a tripulação a zero"],
      correct: "Alta manobrabilidade, dispensando leme convencional"
    }, {
      question: "Em um rebocador ASD (Azimuth Stern Drive), onde ficam os propulsores azimutais?",
      options: ["Na popa", "No topo do mastro", "Acima da linha d'água, presos no costado", "Fixos na proa"],
      correct: "Na popa"
    }],
    // KAT — Motores Diesel marítimos
    diesel: [{
      question: "Qual é o ciclo de funcionamento dos motores marítimos KAT?",
      options: ["Ciclo Otto (ignição por vela e faísca)", "Ciclo diesel (ignição por compressão)", "Ciclo a vapor", "Propulsão eólica"],
      correct: "Ciclo diesel (ignição por compressão)"
    }, {
      question: "No motor diesel, como ocorre a ignição do combustível?",
      options: ["Por uma vela de ignição", "Pela alta temperatura do ar comprimido", "Por chama piloto externa ao cilindro, ligada sempre", "Por descarga da bateria no cilindro"],
      correct: "Pela alta temperatura do ar comprimido"
    }, {
      question: "Qual sistema é essencial para evitar o superaquecimento de um motor diesel marítimo?",
      options: ["Circuito de arrefecimento (água)", "Sistema de velas de ignição e bobinas", "Vela de proa", "Âncora flutuante"],
      correct: "Circuito de arrefecimento (água)"
    }],
    // MDU — Motores diesel de alta rotação (Series 2000/4000)
    highspeed: [{
      question: "Os motores MDU (Series 2000/4000) são classificados como diesel de qual categoria?",
      options: ["Baixa rotação a vapor", "Alta rotação (high-speed)", "Combustão externa com caldeira auxiliar", "Propulsão a vela"],
      correct: "Alta rotação (high-speed)"
    }, {
      question: "Para que serve o turbocompressor em um motor diesel de alta rotação?",
      options: ["Aproveita os gases de escape para aumentar a admissão de ar", "Gera a ignição por faísca dentro de cada cilindro", "Funciona como leme auxiliar", "Substitui o óleo lubrificante"],
      correct: "Aproveita os gases de escape para aumentar a admissão de ar"
    }, {
      question: "Por que motores diesel de alta rotação são usados em embarcações de trabalho?",
      options: ["Alta potência com menor peso e volume", "Por dispensarem combustível", "Por não exigirem lubrificação", "Por funcionarem sem ar"],
      correct: "Alta potência com menor peso e volume"
    }],
    // Treinamento — Manobra e operação de rebocador
    maneuver: [{
      question: "O que mede o 'bollard pull' de um rebocador?",
      options: ["A força de tração estática que ele consegue exercer", "A velocidade máxima do rebocador", "O peso da âncora", "O volume do tanque de combustível"],
      correct: "A força de tração estática que ele consegue exercer"
    }, {
      question: "Em uma manobra de atracação, qual é a função típica do rebocador?",
      options: ["Empurrar ou puxar o navio para posicioná-lo no berço", "Transportar a carga do navio", "Substituir o motor do navio", "Içar os contêineres"],
      correct: "Empurrar ou puxar o navio para posicioná-lo no berço"
    }, {
      question: "O que caracteriza uma manobra de 'escort towing'?",
      options: ["Acompanhar o navio pronto para controlá-lo em emergência", "Rebocar apenas a âncora", "Limpar o casco do navio", "Abastecer o navio em alto-mar"],
      correct: "Acompanhar o navio pronto para controlá-lo em emergência"
    }]
  };
  var OCEAN_EVENTS = [
  // EVENTOS POSITIVOS (4)
  {
    id: 1,
    name: "Vento Favorável",
    icon: "⛵",
    description: "As correntes estão a seu favor!",
    effect: "Avance até a próxima propriedade sem pagar aluguel",
    type: "advance_to_property",
    skipRent: true
  }, {
    id: 2,
    name: "Avistamento de Baleias",
    icon: "🐋",
    description: "Contrato de pesquisa oceanográfica!",
    effect: "Receba F$ 300 mil de contrato científico",
    type: "money",
    amount: 300
  }, {
    id: 3,
    name: "Corrente do Brasil",
    icon: "🌊",
    description: "Corrente oceânica acelera sua navegação!",
    effect: "Avance 5 casas",
    type: "move",
    spaces: 5
  }, {
    id: 4,
    name: "Contrato de Emergência",
    icon: "📡",
    description: "Reboque emergencial bem remunerado!",
    effect: "Receba F$ 500 mil imediatamente",
    type: "money",
    amount: 500
  },
  // EVENTOS NEGATIVOS (3)
  {
    id: 5,
    name: "Tempestade Tropical",
    icon: "🌀",
    description: "Condições adversas forçam retorno!",
    effect: "Volte à última propriedade visitada",
    type: "return_to_last_property"
  }, {
    id: 6,
    name: "Avaria no Motor",
    icon: "⚠️",
    description: "Reparo emergencial necessário!",
    effect: "Pague F$ 200 mil de manutenção",
    type: "money",
    amount: -200
  }, {
    id: 7,
    name: "Zona de Risco",
    icon: "🦈",
    description: "Navegação perigosa! Docagem preventiva.",
    effect: "Perca o próximo turno",
    type: "skip_turn"
  },
  // EVENTOS NEUTROS/MISTOS (3)
  {
    id: 8,
    name: "Inspeção de Segurança",
    icon: "🏴‍☠️",
    description: "Fiscalização de segurança marítima",
    effect: "Certificados completos = F$ 200 mil | Incompleto = F$ 150 mil multa",
    type: "inspection"
  }, {
    id: 9,
    name: "Oportunidade de Salvamento",
    icon: "🎣",
    description: "Embarcação em perigo solicita auxílio",
    effect: "Aceitar: +F$ 400 mil mas perca turno | Recusar: continue",
    type: "choice_salvage"
  }, {
    id: 10,
    name: "Escolha de Rota",
    icon: "🌅",
    description: "Duas rotas disponíveis para seu destino",
    effect: "Rota Norte: +3 casas | Rota Sul: +F$ 250 mil",
    type: "choice_route"
  }];
  var playerColors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
  var playerIcons = ["⚓", "🚢", "⛵", "🛟", "🎣", "🏴‍☠️"];

  // src/js/modules/ui.js
  var ui_exports = {};
  __export(ui_exports, {
    applyCameraMode: function applyCameraMode() {
      return _applyCameraMode;
    },
    cameraFollow: function cameraFollow() {
      return _cameraFollow;
    },
    cameraMode: function cameraMode() {
      return _cameraMode;
    },
    cameraOrbit: function cameraOrbit() {
      return _cameraOrbit;
    },
    closeAllPanels: function closeAllPanels() {
      return _closeAllPanels;
    },
    closeModal: function closeModal() {
      return _closeModal;
    },
    closePanel: function closePanel() {
      return _closePanel;
    },
    endOrbit: function endOrbit() {
      return _endOrbit;
    },
    enterCinematic: function enterCinematic() {
      return _enterCinematic;
    },
    exitCinematic: function exitCinematic() {
      return _exitCinematic;
    },
    goToSetup: function goToSetup() {
      return _goToSetup;
    },
    hideManual: function hideManual() {
      return _hideManual;
    },
    highlightLanding: function highlightLanding() {
      return _highlightLanding;
    },
    hopActivePawn: function hopActivePawn() {
      return _hopActivePawn;
    },
    houseIconHTML: function houseIconHTML() {
      return _houseIconHTML;
    },
    openPanel: function openPanel() {
      return _openPanel;
    },
    pinSVG: function pinSVG() {
      return _pinSVG;
    },
    renderBoard: function renderBoard() {
      return _renderBoard;
    },
    renderDice3D: function renderDice3D() {
      return _renderDice3D;
    },
    renderPlayerSetupList: function renderPlayerSetupList() {
      return _renderPlayerSetupList;
    },
    renderPlayersPanel: function renderPlayersPanel() {
      return _renderPlayersPanel;
    },
    renderStandings: function renderStandings() {
      return _renderStandings;
    },
    selectHouse: function selectHouse() {
      return _selectHouse;
    },
    settleDice3D: function settleDice3D() {
      return _settleDice3D;
    },
    showCommentary: function showCommentary() {
      return _showCommentary;
    },
    showManual: function showManual() {
      return _showManual;
    },
    showManualModal: function showManualModal() {
      return _showManualModal;
    },
    showModal: function showModal() {
      return _showModal;
    },
    showNotification: function showNotification() {
      return _showNotification;
    },
    switchTab: function switchTab() {
      return _switchTab;
    },
    toggleBoard: function toggleBoard() {
      return _toggleBoard;
    },
    tugboatSVG: function tugboatSVG() {
      return _tugboatSVG;
    },
    updatePlayerPositions: function updatePlayerPositions() {
      return _updatePlayerPositions;
    },
    updateTurnDisplay: function updateTurnDisplay() {
      return _updateTurnDisplay;
    }
  });

  // src/js/modules/effects.js
  function reducedMotion() {
    return false;
  }
  function coinsLight() {
    try {
      var q = location.search || "";
      if (/[?&](leve|antiga)=1/.test(q)) return true;
      if (/[?&]leve=0/.test(q)) return false;
      var ua = navigator.userAgent || "";
      if (/Maple|SMART-TV.*Safari\/53[0-7]|Orsay/i.test(ua)) return true;
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return true;
    } catch (e) {}
    return false;
  }
  function coinEl(light) {
    var c = document.createElement("div");
    c.className = "fx-coin" + (light ? " fx-coin-light" : "");
    c.innerHTML = '<svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#b45309"/><circle cx="12" cy="12" r="9" fill="#fbbf24"/><circle cx="12" cy="12" r="7" fill="none" stroke="#f59e0b" stroke-width="1"/><text x="12" y="16" text-anchor="middle" font-size="9" font-weight="700" fill="#92400e" font-family="sans-serif">F$</text></svg>';
    return c;
  }
  var FX = {
    // Chuva de moedas voando para cima quando entra dinheiro (silenciosa:
    // o som de moeda já existente toca em quem chama, com moderação).
    // Versão leve automática (coinsLight) para TVs antigas.
    coins: function coins(amount, label) {
      var light = coinsLight();
      var n = light ? 4 : Math.min(16, 6 + Math.floor((amount || 0) / 5e3));
      var box = document.createElement("div");
      box.className = "fx-coins" + (light ? " fx-coins-light" : "");
      if (label) {
        var t = document.createElement("div");
        t.className = "fx-coins-label";
        t.textContent = label;
        box.appendChild(t);
      }
      document.body.appendChild(box);
      for (var i = 0; i < n; i++) {
        var c = coinEl(light);
        c.style.left = (light ? 35 + i * 10 : 15 + Math.random() * 70) + "%";
        c.style.top = "75%";
        if (!light) {
          c.style.webkitAnimationDelay = c.style.animationDelay = Math.random() * 0.5 + "s";
          c.style.webkitAnimationDuration = c.style.animationDuration = 1.1 + Math.random() * 0.7 + "s";
        }
        box.appendChild(c);
      }
      if (light) {
        setTimeout(function () {
          box.className += " go";
        }, 30);
      }
      setTimeout(function () {
        if (box.parentNode) box.parentNode.removeChild(box);
      }, light ? 1600 : 2600);
    },
    // Vibração tátil (celular). Silenciosamente ignorada onde não há suporte.
    haptic: function haptic(pattern) {
      try {
        if (navigator.vibrate) navigator.vibrate(pattern);
      } catch (e) {}
    },
    // Flash de cor em tela cheia (vermelho = perigo, dourado = conquista).
    flash: function flash(color, duration) {
      if (color === void 0) {
        color = "rgba(239,68,68,0.35)";
      }
      if (duration === void 0) {
        duration = 350;
      }
      if (reducedMotion()) return;
      var el = document.createElement("div");
      el.className = "fx-flash";
      el.style.background = color;
      document.body.appendChild(el);
      requestAnimationFrame(function () {
        return el.classList.add("show");
      });
      setTimeout(function () {
        el.classList.remove("show");
        setTimeout(function () {
          return el.remove();
        }, 320);
      }, duration);
    },
    // Treme a tela (pagamento pesado, falência).
    shake: function shake() {
      if (reducedMotion()) return;
      var screen = document.getElementById("gameScreen") || document.body;
      screen.classList.remove("fx-shake");
      void screen.offsetWidth;
      screen.classList.add("fx-shake");
      setTimeout(function () {
        return screen.classList.remove("fx-shake");
      }, 600);
    },
    // Chuva de confetes (vitória).
    confetti: function confetti(durationMs) {
      if (durationMs === void 0) {
        durationMs = 2600;
      }
      if (reducedMotion()) return;
      var colors = ["#fbbf24", "#3b82f6", "#ef4444", "#10b981", "#8b5cf6", "#ec4899", "#f8fafc"];
      var container = document.createElement("div");
      container.className = "fx-confetti";
      document.body.appendChild(container);
      var n = coinsLight() ? 12 : 36;
      for (var i = 0; i < n; i++) {
        var p = document.createElement("div");
        p.className = "fx-confetti-piece";
        p.style.left = Math.random() * 100 + "vw";
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDelay = Math.random() * 0.9 + "s";
        p.style.animationDuration = 2 + Math.random() * 1.6 + "s";
        p.style.width = p.style.height = 6 + Math.random() * 6 + "px";
        container.appendChild(p);
      }
      setTimeout(function () {
        if (container.parentNode) container.parentNode.removeChild(container);
      }, durationMs + 2200);
    },
    // Banner central de troca de turno na cor do jogador.
    turnBanner: function turnBanner(text, color) {
      if (reducedMotion()) return;
      var banner = document.getElementById("fxTurnBanner");
      if (!banner) {
        banner = document.createElement("div");
        banner.id = "fxTurnBanner";
        banner.className = "fx-turn-banner";
        document.body.appendChild(banner);
      }
      banner.style.setProperty("--banner-color", color || "#fbbf24");
      banner.textContent = text;
      banner.classList.remove("show");
      void banner.offsetWidth;
      banner.classList.add("show");
      setTimeout(function () {
        return banner.classList.remove("show");
      }, 1700);
    }
  };

  // src/js/modules/money.js
  var MULT = 1e3;
  var NBSP = " ";
  function num(x, dec) {
    try {
      return x.toLocaleString("pt-BR", {
        maximumFractionDigits: dec
      });
    } catch (e) {
      return String(Math.round(x * 100) / 100).replace(".", ",");
    }
  }
  function fm(n) {
    var v = Number(n || 0) * MULT;
    var a = Math.abs(v);
    var s;
    if (a >= 1e9) s = num(a / 1e9, 2) + NBSP + "bi";else if (a >= 1e6) s = num(a / 1e6, 2) + NBSP + "mi";else if (a >= 1e3) s = num(a / 1e3, 1) + NBSP + "mil";else s = num(a, 0);
    return (v < 0 ? "-" : "") + "F$" + NBSP + s;
  }
  function coinIcon(size) {
    var s = size || "1em";
    return '<svg class="farolin-coin" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" aria-hidden="true" style="vertical-align:-0.15em;display:inline-block"><circle cx="12" cy="12" r="11" fill="#f5b301" stroke="#a86b00" stroke-width="1.5"/><circle cx="12" cy="12" r="8.3" fill="none" stroke="#ffe27a" stroke-width="0.8"/><path d="M10.2 9.5h3.6l1 9h-5.6z" fill="#ffffff" stroke="#7a4a00" stroke-width="0.6"/><rect x="9.9" y="12.2" width="4.2" height="1.4" fill="#d62828"/><rect x="9.4" y="15.4" width="5.2" height="1.4" fill="#d62828"/><rect x="10.4" y="7.2" width="3.2" height="2.3" fill="#ffe680" stroke="#7a4a00" stroke-width="0.6"/><path d="M9.8 7.2L12 5.2l2.2 2z" fill="#d62828"/><path d="M13.6 8.3l5-2v4z M10.4 8.3l-5-2v4z" fill="#fff6b0" opacity="0.8"/></svg>';
  }
  function fmi(n) {
    return coinIcon() + NBSP + fm(n);
  }
  if (typeof window !== "undefined") {
    window.fm = fm;
    window.coinIcon = coinIcon;
    window.fmi = fmi;
  }

  // src/js/modules/ui.js
  function _tugboatSVG(color) {
    return "<svg viewBox=\"0 0 24 24\" width=\"100%\" height=\"100%\" aria-hidden=\"true\">\n        <path d=\"M2 15h20l-2 4H4z\" fill=\"" + color + "\"/>\n        <rect x=\"6\" y=\"9\" width=\"10\" height=\"5\" rx=\"1\" fill=\"" + color + "\"/>\n        <rect x=\"9\" y=\"5\" width=\"5\" height=\"4\" rx=\"1\" fill=\"" + color + "\"/>\n        <rect x=\"15.5\" y=\"6\" width=\"1.6\" height=\"7\" rx=\"0.6\" fill=\"" + color + "\"/>\n        <circle cx=\"11.5\" cy=\"11\" r=\"1\" fill=\"rgba(255,255,255,0.85)\"/>\n    </svg>";
  }
  var _pinSeq = 0;
  function _pinSVG(color) {
    var id = "pin" + _pinSeq++;
    return "<svg viewBox=\"0 0 40 72\" width=\"100%\" height=\"100%\" aria-hidden=\"true\" style=\"overflow:visible;\">\n        <defs>\n            <linearGradient id=\"" + id + "\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n                <stop offset=\"0\" stop-color=\"#ffffff\" stop-opacity=\"0.6\"/>\n                <stop offset=\"0.4\" stop-color=\"" + color + "\"/>\n                <stop offset=\"1\" stop-color=\"#000000\" stop-opacity=\"0.45\"/>\n            </linearGradient>\n        </defs>\n        <ellipse cx=\"20\" cy=\"68\" rx=\"13\" ry=\"3.5\" fill=\"rgba(0,0,0,0.35)\"/>\n        <path d=\"M9 66 Q7 52 15 46 Q8 41 11 31 Q13 25 20 25 Q27 25 29 31 Q32 41 25 46 Q33 52 31 66 Z\" fill=\"" + color + "\"/>\n        <circle cx=\"20\" cy=\"16\" r=\"11\" fill=\"" + color + "\"/>\n        <path d=\"M9 66 Q7 52 15 46 Q8 41 11 31 Q13 25 20 25 Q27 25 29 31 Q32 41 25 46 Q33 52 31 66 Z\" fill=\"url(#" + id + ")\"/>\n        <circle cx=\"20\" cy=\"16\" r=\"11\" fill=\"url(#" + id + ")\"/>\n        <ellipse cx=\"16\" cy=\"12\" rx=\"3.2\" ry=\"4.2\" fill=\"#ffffff\" opacity=\"0.55\"/>\n    </svg>";
  }
  var HOUSE_SVG = {
    // Manobra do Porto: dois rebocadores empurrando o casco de um navio.
    maneuver: '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><path d="M3 6h18l-2 5H5z" fill="#94a3b8"/><rect x="9" y="3" width="6" height="3" fill="#cbd5e1"/><path d="M2 18h8l-1 3H3z" fill="#f59e0b"/><rect x="4" y="15" width="4" height="3" fill="#f59e0b"/><path d="M14 18h8l-1 3h-6z" fill="#f59e0b"/><rect x="16" y="15" width="4" height="3" fill="#f59e0b"/><path d="M6 14V12M18 14V12" stroke="#38bdf8" stroke-width="1.6" stroke-linecap="round"/></svg>',
    // Vistoria LOYDS TUGSTER: prancheta com visto.
    inspection: '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><rect x="5" y="4" width="14" height="18" rx="2" fill="#e2e8f0"/><rect x="9" y="2" width="6" height="4" rx="1" fill="#64748b"/><path d="M8 13l3 3 5-6" fill="none" stroke="#16a34a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 19h8" stroke="#94a3b8" stroke-width="1.4"/></svg>',
    // UNISALVAGE: boia salva-vidas com capelo de formatura.
    unisalvage: '<svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true"><circle cx="12" cy="14" r="7.5" fill="#ef4444"/><circle cx="12" cy="14" r="3.6" fill="#0f172a"/><path d="M6.7 8.7l2.6 2.6M17.3 8.7l-2.6 2.6M6.7 19.3l2.6-2.6M17.3 19.3l-2.6-2.6" stroke="#f8fafc" stroke-width="2.4"/><path d="M12 1.5l7 3-7 3-7-3z" fill="#fbbf24"/><path d="M18 5v3" stroke="#fbbf24" stroke-width="1.2"/></svg>'
  };
  function _houseIconHTML(house) {
    return house && HOUSE_SVG[house.type] || (house ? house.icon : "");
  }
  function reducedMotionUI() {
    return false;
  }
  function _cameraMode() {
    var m = "drone";
    try {
      m = localStorage.getItem("tvCamMode") || "drone";
    } catch (e) {}
    return m === "top" || m === "2d" ? m : "drone";
  }
  var CAM_CLASSES = ["cam-drone", "cam-top", "cam-intro"];
  function _enterCinematic(intro) {
    if (reducedMotionUI()) return false;
    var mode = _cameraMode();
    if (mode === "2d") return false;
    var board = document.querySelector(".board-game");
    if (!board) return false;
    var vb = board.parentElement;
    if (vb) vb.classList.add("cine-view");
    CAM_CLASSES.forEach(function (c) {
      return board.classList.remove(c);
    });
    board.classList.add("cam-" + mode);
    if (intro) board.classList.add("cam-intro");else board.classList.remove("cam-intro");
    board.classList.add("cinematic");
    return true;
  }
  function _exitCinematic() {
    var board = document.querySelector(".board-game");
    if (!board) return;
    board.classList.remove("cinematic");
    board.classList.remove("orbiting");
    delete board.dataset.camPos;
    CAM_CLASSES.forEach(function (c) {
      return board.classList.remove(c);
    });
    board.style.removeProperty("--cam-x");
    board.style.removeProperty("--cam-y");
    var vb = board.parentElement;
    if (vb) vb.classList.remove("cine-view");
  }
  function _applyCameraMode() {
    var board = document.querySelector(".board-game");
    if (!board || !board.classList.contains("cinematic")) return;
    var mode = _cameraMode();
    if (mode === "2d") {
      _exitCinematic();
      return;
    }
    CAM_CLASSES.forEach(function (c) {
      return board.classList.remove(c);
    });
    board.classList.add("cam-" + mode);
    if (mode === "drone" && !board.dataset.camPos) board.classList.add("cam-intro");
    if (mode === "top" || !board.dataset.camPos) {
      board.style.setProperty("--cam-x", "0px");
      board.style.setProperty("--cam-y", "0px");
    } else if (board.dataset.camPos) _cameraFollow(+board.dataset.camPos);
  }
  function _cameraFollow(position) {
    var board = document.querySelector(".board-game");
    var cell = getCellElement(position);
    if (!board || !cell) return;
    board.dataset.camPos = position;
    board.classList.remove("cam-intro");
    if (board.classList.contains("cam-top")) {
      board.style.setProperty("--cam-x", "0px");
      board.style.setProperty("--cam-y", "0px");
      return;
    }
    var bw = board.clientWidth,
      bh = board.clientHeight;
    var cx = cell.offsetLeft + cell.offsetWidth / 2;
    var cy = cell.offsetTop + cell.offsetHeight / 2;
    var next = getCellElement(position + 1) || getCellElement(0);
    if (next && next !== cell) {
      var nx = next.offsetLeft + next.offsetWidth / 2,
        ny = next.offsetTop + next.offsetHeight / 2;
      var dx = nx - cx,
        dy = ny - cy,
        d = Math.sqrt(dx * dx + dy * dy) || 1;
      var look = Math.min(d, cell.offsetWidth) * 0.6;
      cx += dx / d * look;
      cy += dy / d * look;
    }
    cy -= bh * 0.04;
    var lim = 0.5;
    cx = Math.max(bw * (0.5 - lim), Math.min(bw * (0.5 + lim), cx));
    board.style.setProperty("--cam-x", (cx - bw / 2).toFixed(1) + "px");
    board.style.setProperty("--cam-y", (cy - bh / 2).toFixed(1) + "px");
  }
  function _cameraOrbit(position) {
    var board = document.querySelector(".board-game");
    if (!board) return;
    _cameraFollow(position);
    board.classList.add("orbiting");
  }
  function _endOrbit() {
    var board = document.querySelector(".board-game");
    if (board) board.classList.remove("orbiting");
  }
  function _hopActivePawn() {
    var lift = document.querySelector(".player-pawn.pawn-active .pawn-lift");
    if (!lift) return;
    lift.classList.remove("hop");
    void lift.offsetWidth;
    lift.classList.add("hop");
    setTimeout(function () {
      return lift.classList.remove("hop");
    }, 520);
  }
  function dieShow(n) {
    return {
      1: "rotateX(0deg) rotateY(0deg)",
      2: "rotateX(-90deg)",
      3: "rotateY(-90deg)",
      4: "rotateY(90deg)",
      5: "rotateX(90deg)",
      6: "rotateY(180deg)"
    }[n] || "rotateX(0deg) rotateY(0deg)";
  }
  function diePips(n) {
    var map = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8]
    };
    var on = map[n] || [];
    var s = "";
    for (var i = 0; i < 9; i++) s += "<span class=\"die-pip" + (on.includes(i) ? " on" : "") + "\"></span>";
    return s;
  }
  function dieHTML(value, rolling) {
    var faces = [1, 2, 3, 4, 5, 6].map(function (f) {
      return "<div class=\"die-face f" + f + "\">" + diePips(f) + "</div>";
    }).join("");
    var style2 = rolling ? "" : " style=\"transform:" + dieShow(value) + "\"";
    return "<div class=\"die-scene\"><div class=\"die-tilt\"><div class=\"die-cube" + (rolling ? " rolling" : "") + "\"" + style2 + ">" + faces + "</div></div></div>";
  }
  function _renderDice3D(container, d1, d2, rolling) {
    if (d1 === void 0) {
      d1 = 1;
    }
    if (d2 === void 0) {
      d2 = 1;
    }
    if (rolling === void 0) {
      rolling = false;
    }
    if (!container) return;
    container.innerHTML = "<div class=\"dice3d-wrap\">" + dieHTML(d1, rolling) + dieHTML(d2, rolling) + "</div>";
  }
  function _settleDice3D(container, v1, v2, total, isDouble) {
    if (!container) return;
    var cubes = container.querySelectorAll(".die-cube");
    if (cubes[0]) {
      cubes[0].classList.remove("rolling");
      cubes[0].style.transform = dieShow(v1);
    }
    if (cubes[1]) {
      cubes[1].classList.remove("rolling");
      cubes[1].style.transform = dieShow(v2);
    }
    var wrap = container.querySelector(".dice3d-wrap");
    if (wrap) wrap.insertAdjacentHTML("beforeend", "<span class=\"dice-total\">= " + total + (isDouble ? " <b>DUPLA! 🎉</b>" : "") + "</span>");
  }
  function getCellElement(position) {
    return document.querySelector("[data-position=\"" + position + "\"]");
  }
  function _highlightLanding(position) {
    var cell = getCellElement(position);
    if (!cell) return;
    cell.classList.remove("just-arrived");
    void cell.offsetWidth;
    cell.classList.add("just-arrived");
    setTimeout(function () {
      return cell.classList.remove("just-arrived");
    }, 1100);
  }
  function _openPanel(panelId, button) {
    _closeAllPanels();
    var panel = document.getElementById(panelId);
    if (panel) {
      panel.classList.add("active");
      document.getElementById("panelOverlay").classList.add("active");
    }
    if (button) {
      document.querySelectorAll(".nav-btn").forEach(function (btn) {
        return btn.classList.remove("active");
      });
      button.classList.add("active");
    }
  }
  function _showCommentary(text) {
    if (!text) return;
    var el = document.getElementById("commentaryText");
    var banner = document.getElementById("commentaryBanner");
    if (!el) return;
    el.textContent = text;
    if (banner) {
      banner.classList.remove("pop");
      void banner.offsetWidth;
      banner.classList.add("pop");
    }
  }
  function _showManual() {
    document.getElementById("presentationScreen").style.display = "none";
    document.getElementById("manualScreen").style.display = "flex";
  }
  function _showManualModal() {
    _closeAllPanels();
    _showModal("📖 Manual do Jogo", "\n        <div style=\"line-height:1.6; color:#e2e8f0;\">\n            <h4 style=\"color:var(--accent-gold); margin:0 0 0.25rem;\">Objetivo</h4>\n            <p style=\"margin:0 0 0.75rem;\">Torne-se o <strong>TugLord Supremo</strong>: domine portos, monte sua frota de rebocadores e conquiste certifica\xE7\xF5es.</p>\n            <h4 style=\"color:var(--accent-gold); margin:0 0 0.25rem;\">Como jogar</h4>\n            <ul style=\"padding-left:1.1rem; margin:0 0 0.75rem;\">\n                <li>Role os dados para mover seu pe\xE3o.</li>\n                <li>Compre <strong>portos</strong> e cobre aluguel de quem cair neles.</li>\n                <li><strong>Rebocadores</strong> aumentam o n\xEDvel do aluguel.</li>\n                <li><strong>Manobra do Porto</strong> s\xF3 rende com " + REGRAS.MANOBRA_CERTS_SEGURANCA + " certificado de seguran\xE7a (Universidade: " + REGRAS.UNIVERSIDADE_PROVAS_POR_VISITA + " provas gr\xE1tis por visita; Treinamento: " + REGRAS.UNIVERSIDADE_PROVAS_POR_VISITA + " provas de " + fm(REGRAS.TREINAMENTO_CUSTO_PROVA) + ").</li>\n                <li><strong>UNISALVAGE</strong>: passe " + REGRAS.UNISALVAGE_ETAPAS + " vezes nos quizzes para ganhar o <strong>Certificado Tuglords</strong>. Reprovou: refaz a mesma etapa na pr\xF3xima visita.</li>\n                <li><strong>Economia</strong>: a formatura na UNISALVAGE d\xE1 um Rebocador Oce\xE2nico gr\xE1tis. Pagamentos ao Banco (multas, Azar, impostos, provas, Treinamento, docagem e Estaleiro) s\xE3o limitados a " + Math.round(REGRAS.TETO_PAGTO_BANCO_PCT_CAIXA * 100) + "% do caixa. Venda ao Banco paga " + Math.round(REGRAS.LIQUIDACAO_TAXA * 100) + "%. Desafio s\xF3 com " + fm(REGRAS.DESAFIO_CAIXA_MIN) + " em caixa dos dois lados.</li>\n                <li><strong>Frete do Oce\xE2nico</strong>: quem tem Rebocador Oce\xE2nico recebe " + fm(REGRAS.OCEANICO_FRETE_LARGADA) + " cada vez que passa ou para na Largada (" + fm(Math.round(REGRAS.OCEANICO_FRETE_LARGADA * REGRAS.RETA_FINAL_MULT)) + " na reta final).</li>\n                <li><strong>Rebocador Oce\xE2nico</strong> e <strong>Reboque Oce\xE2nico</strong> (o grande pr\xEAmio) exigem o Certificado Tuglords.</li>\n                <li>No <strong>Estaleiro</strong> pode haver docagem obrigat\xF3ria (3 turnos).</li>\n                <li>Fa\xE7a <strong>certifica\xE7\xF5es</strong> para evitar multas e habilitar a frota oce\xE2nica.</li>\n            </ul>\n            <h4 style=\"color:var(--accent-gold); margin:0 0 0.25rem;\">Vit\xF3ria</h4>\n            <p style=\"margin:0;\">4 certificados + TugLord + Rebocador Oce\xE2nico + 5 portos \u2014 ou seja o \xFAltimo n\xE3o-falido.</p>\n        </div>\n    ", [{
      text: "Fechar",
      onClick: "closeModal()",
      class: "btn-primary"
    }], true);
  }
  function _hideManual() {
    document.getElementById("manualScreen").style.display = "none";
    document.getElementById("presentationScreen").style.display = "flex";
  }
  function _goToSetup() {
    document.getElementById("presentationScreen").style.display = "none";
    document.getElementById("setupScreen").style.display = "flex";
    if (gameState.players.length === 0) {
      window.addPlayer();
      window.addPlayer();
    }
  }
  function _closePanel(panelId) {
    var panel = document.getElementById(panelId);
    if (panel) {
      panel.classList.remove("active");
    }
    var anyPanelOpen = document.querySelector(".sliding-panel.active");
    if (!anyPanelOpen) {
      document.getElementById("panelOverlay").classList.remove("active");
    }
  }
  function _closeAllPanels() {
    document.querySelectorAll(".sliding-panel").forEach(function (panel) {
      panel.classList.remove("active");
    });
    var overlay = document.getElementById("panelOverlay");
    if (overlay) overlay.classList.remove("active");
  }
  function _toggleBoard(button) {
    _closeAllPanels();
    document.querySelectorAll(".nav-btn").forEach(function (btn) {
      return btn.classList.remove("active");
    });
    if (button) button.classList.add("active");
  }
  function _switchTab(button, tabId) {
    var card = button.closest(".player-card");
    card.querySelectorAll(".tab-btn").forEach(function (btn) {
      return btn.classList.remove("active");
    });
    button.classList.add("active");
    card.querySelectorAll(".tab-content").forEach(function (content) {
      return content.classList.remove("active");
    });
    document.getElementById(tabId).classList.add("active");
  }
  function _showNotification(message) {
    var stack = document.getElementById("notificationStack");
    if (!stack) {
      stack = document.createElement("div");
      stack.id = "notificationStack";
      document.body.appendChild(stack);
    }
    stack.style.cssText = "\n        position: fixed;\n        top: " + (gameState.phase === "setup" ? "20px" : "80px") + ";\n        left: 50%;\n        transform: translateX(-50%);\n        z-index: 3000; /* acima do modal (2000) \u2014 antes ficava atr\xE1s e borrado */\n        display: flex;\n        flex-direction: column;\n        align-items: center;\n        gap: 0.5rem;\n        max-width: 90%;\n        width: max-content;\n        pointer-events: none;\n    ";
    while (stack.children.length >= 3) {
      stack.removeChild(stack.firstChild);
    }
    var notification = document.createElement("div");
    notification.style.cssText = "\n        background: rgba(251, 191, 36, 0.95);\n        color: #1a2942;\n        padding: 1rem 1.5rem;\n        border-radius: 0.75rem;\n        font-weight: 700;\n        box-shadow: 0 4px 20px rgba(0,0,0,0.3);\n        animation: slideDown 0.3s ease;\n        text-align: center;\n        pointer-events: none;\n        max-width: 100%;\n    ";
    notification.textContent = message;
    stack.appendChild(notification);
    setTimeout(function () {
      notification.style.animation = "slideUp 0.3s ease";
      setTimeout(function () {
        notification.remove();
        if (stack && !stack.hasChildNodes()) stack.remove();
      }, 300);
    }, 2e3);
  }
  function _showModal(title, body, buttons, closeBtn) {
    if (buttons === void 0) {
      buttons = [];
    }
    if (closeBtn === void 0) {
      closeBtn = true;
    }
    var modal = document.getElementById("gameModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "gameModal";
      modal.className = "modal-overlay";
      document.body.appendChild(modal);
      modal.addEventListener("click", function (e) {
        if (e.target === modal && modal.dataset.dismissible === "true") _closeModal();
      });
    }
    modal.dataset.dismissible = closeBtn ? "true" : "false";
    var buttonsHTML = buttons.map(function (btn) {
      return "\n        <button class=\"" + (btn.class || "btn-primary") + "\" onclick=\"" + btn.onClick + "\" style=\"width: 100%;\">\n            " + btn.text + "\n        </button>\n    ";
    }).join("");
    modal.innerHTML = "\n        <div class=\"modal-box\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"modalTitle\">\n            <div class=\"modal-header\">\n                <h3 id=\"modalTitle\">" + title + "</h3>\n                " + (closeBtn ? '<button class="modal-close-x" onclick="closeModal()" aria-label="Fechar">✕</button>' : "") + "\n            </div>\n            <div class=\"modal-body\">\n                " + body + "\n                " + (buttonsHTML ? "<div class=\"modal-actions\">" + buttonsHTML + "</div>" : "") + "\n            </div>\n        </div>\n    ";
    requestAnimationFrame(function () {
      modal.classList.add("open");
      var focusTarget = modal.querySelector(".modal-actions button") || modal.querySelector(".modal-close-x");
      if (focusTarget) focusTarget.focus();
    });
  }
  function _closeModal() {
    var modal = document.getElementById("gameModal");
    if (modal) {
      modal.classList.remove("open");
      setTimeout(function () {
        if (!modal.classList.contains("open") && modal.parentNode) modal.parentNode.removeChild(modal);
      }, 300);
    }
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      var modal = document.getElementById("gameModal");
      if (modal && modal.dataset.dismissible === "true") _closeModal();
    }
  });
  function escapeAttr(str) {
    return String(str).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function houseCell(house, col, row) {
    var priceLabel = house.price ? " \u2014 " + fm(house.price) : "";
    var regionLabel = house.region ? " (" + house.region + ")" : "";
    var label = escapeAttr("" + house.name + priceLabel + regionLabel);
    var h = "<div class=\"board-house\" data-position=\"" + house.pos + "\" style=\"grid-column: " + col + "; grid-row: " + row + ";\" onclick=\"selectHouse(" + house.pos + ")\" title=\"" + label + "\" aria-label=\"" + label + "\">";
    if (house.region && REGION_COLORS[house.region]) {
      h += "<div class=\"region-band\" style=\"background: " + REGION_COLORS[house.region] + ";\"></div>";
    }
    h += "<div class=\"house-icon\">" + _houseIconHTML(house) + "</div>";
    h += "<div class=\"house-name\">" + house.name + "</div>";
    if (house.price) h += "<div class=\"house-price\">" + fm(house.price) + "</div>";
    h += '<div class="house-players"></div></div>';
    return h;
  }
  function cornerCell(house, col, row) {
    var label = escapeAttr(house.name);
    return "<div class=\"board-corner\" data-position=\"" + house.pos + "\" style=\"grid-column: " + col + "; grid-row: " + row + ";\" onclick=\"selectHouse(" + house.pos + ")\" title=\"" + label + "\" aria-label=\"" + label + "\"><span class=\"corner-icon\">" + house.icon + "</span><div class=\"house-players\"></div></div>";
  }
  function _renderBoard() {
    var boardDiv = document.getElementById("visualBoard");
    var boardLayout = gameState.houses;
    var boardHTML = '<div class="board-game">';
    boardHTML += cornerCell(boardLayout[0], 10, 10);
    for (var i = 1; i <= 8; i++) {
      boardHTML += houseCell(boardLayout[i], 10 - i, 10);
    }
    boardHTML += cornerCell(boardLayout[9], 1, 10);
    for (var _i = 10; _i <= 17; _i++) {
      boardHTML += houseCell(boardLayout[_i], 1, 10 - (_i - 9));
    }
    boardHTML += cornerCell(boardLayout[18], 1, 1);
    for (var _i2 = 19; _i2 <= 26; _i2++) {
      boardHTML += houseCell(boardLayout[_i2], _i2 - 18 + 1, 1);
    }
    boardHTML += cornerCell(boardLayout[27], 10, 1);
    for (var _i3 = 28; _i3 <= 35; _i3++) {
      boardHTML += houseCell(boardLayout[_i3], 10, _i3 - 27 + 1);
    }
    boardHTML += '<div class="board-center">';
    boardHTML += '<div class="board-center-icon">⚓</div>';
    boardHTML += "<h3>TUGLORDS</h3>";
    boardHTML += '<p style="font-size: 0.7rem; color: #94a3b8; margin: 0.5rem 0 0 0;">Domínio Portuário</p>';
    boardHTML += "</div>";
    boardHTML += "</div>";
    boardDiv.innerHTML = boardHTML;
    _updatePlayerPositions();
  }
  function _updatePlayerPositions() {
    document.querySelectorAll(".house-players").forEach(function (el) {
      return el.innerHTML = "";
    });
    document.querySelectorAll(".board-house").forEach(function (house) {
      return house.classList.remove("active");
    });
    document.querySelectorAll(".board-corner").forEach(function (corner) {
      return corner.classList.remove("active");
    });
    document.querySelectorAll(".board-house").forEach(function (houseEl) {
      var position = parseInt(houseEl.getAttribute("data-position"));
      var house = gameState.houses[position];
      var oldOwnerBar = houseEl.querySelector(".owner-bar");
      if (oldOwnerBar) oldOwnerBar.remove();
      houseEl.classList.remove("owned");
      houseEl.style.removeProperty("--owner-color");
      if (house && house.owner !== void 0) {
        var owner = gameState.players.find(function (p) {
          return p.id === house.owner;
        });
        if (owner) {
          var ownerBar = document.createElement("div");
          ownerBar.className = "owner-bar";
          ownerBar.style.cssText = "\n                    position: absolute;\n                    top: 0;\n                    left: 0;\n                    right: 0;\n                    height: 4px;\n                    background: " + owner.color + ";\n                    box-shadow: 0 0 8px " + owner.color + ";\n                    z-index: 2;\n                ";
          ownerBar.title = "Dono: " + owner.name;
          houseEl.style.position = "relative";
          houseEl.style.setProperty("--owner-color", owner.color);
          houseEl.classList.add("owned");
          houseEl.insertBefore(ownerBar, houseEl.firstChild);
        }
      }
    });
    gameState.players.forEach(function (player) {
      var houseEl = document.querySelector("[data-position=\"" + player.position + "\"] .house-players");
      if (!houseEl) {
        var allHousePlayers = document.querySelectorAll(".house-players");
        allHousePlayers.forEach(function (el) {
          var parent = el.closest(".board-corner");
          if (parent) {
            var gridCol = parent.style.gridColumn;
            var gridRow = parent.style.gridRow;
            if (gridCol === "10" && gridRow === "10" && player.position === 0) houseEl = el;
            if (gridCol === "1" && gridRow === "10" && player.position === 9) houseEl = el;
            if (gridCol === "1" && gridRow === "1" && player.position === 18) houseEl = el;
            if (gridCol === "10" && gridRow === "1" && player.position === 27) houseEl = el;
          }
        });
      }
      if (houseEl) {
        var pawn = document.createElement("div");
        pawn.className = "player-pawn";
        pawn.innerHTML = "<div class=\"pawn-stand\"><div class=\"pawn-lift\">" + _pinSVG(player.color) + "</div></div>";
        pawn.title = player.name;
        if (player === gameState.players[gameState.currentPlayerIndex]) {
          pawn.classList.add("pawn-active");
        }
        houseEl.appendChild(pawn);
      }
      if (player === gameState.players[gameState.currentPlayerIndex]) {
        var currentHouse = document.querySelector("[data-position=\"" + player.position + "\"]");
        if (currentHouse) {
          currentHouse.classList.add("active");
        } else {
          var allCorners = document.querySelectorAll(".board-corner");
          allCorners.forEach(function (corner) {
            var gridCol = corner.style.gridColumn;
            var gridRow = corner.style.gridRow;
            if (gridCol === "10" && gridRow === "10" && player.position === 0) corner.classList.add("active");
            if (gridCol === "1" && gridRow === "1" && player.position === 18) corner.classList.add("active");
            if (gridCol === "1" && gridRow === "10" && player.position === 9) corner.classList.add("active");
            if (gridCol === "10" && gridRow === "1" && player.position === 27) corner.classList.add("active");
          });
        }
      }
    });
  }
  function _selectHouse(position) {
    var house = gameState.houses[position];
    if (!house) return;
    var owner = house.owner !== void 0 ? gameState.players.find(function (p) {
      return p.id === house.owner;
    }) : null;
    var rentInfo = "";
    if ((house.type === "property" || house.type === "port") && house.rent) {
      rentInfo = "<div style=\"margin-top: 0.5rem; padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 0.5rem;\">\n            <p style=\"margin: 0; color: #94a3b8; font-size: 0.85rem;\">Aluguel Base: " + fm(house.rent[0]) + "</p>\n        </div>";
    }
    var modalBody = "\n        <div style=\"text-align: center; margin-bottom: 1.5rem;\">\n            <div style=\"font-size: 4rem; margin-bottom: 1rem;\">" + house.icon + "</div>\n            <h2 style=\"color: var(--accent-gold); margin: 0 0 0.5rem 0;\">" + house.name + "</h2>\n            " + (house.price ? "<p style=\"font-size: 1.25rem; font-weight: 700; color: #e0e0e0;\">" + fm(house.price) + "</p>" : "") + "\n            <p style=\"color: #94a3b8; font-style: italic;\">" + getHouseTypeLabel(house.type) + "</p>\n        </div>\n\n        " + (owner ? "\n            <div style=\"background: " + owner.color + "20; padding: 1rem; border-radius: 0.5rem; border-left: 4px solid " + owner.color + "; margin-bottom: 1rem;\">\n                <p style=\"margin: 0; font-weight: 600; color: #e0e0e0;\">Propriet\xE1rio: " + owner.icon + " " + owner.name + "</p>\n            </div>\n        " : "") + "\n\n        " + rentInfo + "\n    ";
    _showModal("Detalhes", modalBody, [{
      text: "Fechar",
      onClick: "closeModal()"
    }], true);
  }
  function getHouseTypeLabel(type) {
    var types = {
      "start": "Partida",
      "port": "Porto Comercial",
      "event": "Evento Oceânico",
      "ocean_event": "Evento Oceânico",
      "fuel": "Posto de Combustível",
      "service": "Serviço Portuário",
      "bank": "Banco",
      "surprise": "Carta Surpresa",
      "workshop": "Oficina",
      "corner": "Canto da Sorte",
      "drydock": "Docagem Obrigatória",
      "luck": "Sorte ou Azar",
      "stock": "Bolsa de Valores",
      "stock_exchange": "Bolsa de Valores",
      "training": "Centro de Treinamento",
      "university": "Universidade",
      "tug_purchase": "Loja de Rebocadores",
      "tax": "Taxa Portuária",
      "maneuver": "Manobra do Porto",
      "inspection": "Vistoria LOYDS TUGSTER",
      "unisalvage": "UNISALVAGE",
      "tuglord": "Certificação TugLord",
      "tuglord_certificate": "Certificação TugLord"
    };
    return types[type] || "Local";
  }
  function _renderPlayersPanel() {
    var container = document.getElementById("playersContainer");
    if (!container) {
      _renderStandings();
      return;
    }
    var activePlayers = gameState.players.filter(function (p) {
      return !p.isEliminated;
    });
    var leaderId = null;
    if (activePlayers.length > 1) {
      leaderId = activePlayers.reduce(function (a, b) {
        return netWorthUI(b) > netWorthUI(a) ? b : a;
      }).id;
    }
    container.innerHTML = gameState.players.map(function (player, index) {
      var portTugsOperational = player.portTugs - player.dockedTugs.port;
      var oceanTugOperational = player.hasOceanTug && !player.dockedTugs.ocean;
      var tuglordOperational = player.hasTuglord && !player.dockedTugs.tuglord;
      var assetsList = "";
      if (player.properties.length > 0) {
        assetsList += "<p class=\"text-sm text-slate-300\" style=\"margin: 0.5rem 0;\">\n                \uD83D\uDCE6 <strong>Propriedades (" + player.properties.length + "):</strong><br>\n                <span style=\"color: #94a3b8; font-size: 0.85rem;\">" + player.properties.join(", ") + "</span>\n            </p>";
      }
      var fleetInfo = "";
      if (player.portTugs > 0 || player.hasOceanTug || player.hasTuglord) {
        fleetInfo += "<p class=\"text-sm text-slate-300\" style=\"margin: 0.5rem 0;\">\n                \u2693 <strong>Frota:</strong><br>";
        if (player.portTugs > 0) {
          fleetInfo += "<span style=\"color: " + (portTugsOperational > 0 ? "#22c55e" : "#ef4444") + "; font-size: 0.85rem;\">\n                    \u2022 Portu\xE1rios: " + portTugsOperational + "/" + player.portTugs + " operacionais\n                </span><br>";
        }
        if (player.hasOceanTug) {
          fleetInfo += "<span style=\"color: " + (oceanTugOperational ? "#22c55e" : "#ef4444") + "; font-size: 0.85rem;\">\n                    \u2022 Oce\xE2nico: " + (oceanTugOperational ? "Operacional" : "Docado") + "\n                </span><br>";
        }
        if (player.hasTuglord) {
          fleetInfo += "<span style=\"color: " + (tuglordOperational ? "#fbbf24" : "#ef4444") + "; font-size: 0.85rem;\">\n                    \u2022 Classe TugLord: " + (tuglordOperational ? "Operacional" : "Docado") + "\n                </span>";
        }
        fleetInfo += "</p>";
      }
      var certsInfo = "";
      var safetyCerts = CERTIFICATES.filter(function (c) {
        return player.certificates.includes(c);
      });
      var techCerts = TECH_CERTIFICATES.filter(function (c) {
        return player.certificates.includes(c);
      });
      if (safetyCerts.length > 0) {
        certsInfo += "<p class=\"text-sm text-slate-300\" style=\"margin: 0.5rem 0;\">\n                \uD83C\uDF93 <strong>Certificados de Seguran\xE7a (" + safetyCerts.length + "/4):</strong><br>\n                <span style=\"color: #94a3b8; font-size: 0.85rem;\">" + safetyCerts.map(function (c) {
          return CERT_LABELS[c] || c;
        }).join(", ") + "</span>\n            </p>";
      }
      if (techCerts.length > 0) {
        certsInfo += "<p class=\"text-sm text-slate-300\" style=\"margin: 0.5rem 0;\">\n                \uD83D\uDD27 <strong>Certificados T\xE9cnicos (" + techCerts.length + "/4):</strong><br>\n                <span style=\"color: #94a3b8; font-size: 0.85rem;\">" + techCerts.map(function (c) {
          return CERT_LABELS[c] || c;
        }).join(", ") + "</span>\n            </p>";
      }
      var assetsContent = assetsList || fleetInfo || certsInfo ? assetsList + fleetInfo + certsInfo : '<p class="text-sm text-slate-400">Nenhum ativo ainda</p>';
      var houseHere = gameState.houses[player.position];
      var positionLabel = houseHere ? houseHere.icon + " " + houseHere.name : "Casa " + player.position;
      var certCount = CERTIFICATES.filter(function (c) {
        return player.certificates.includes(c);
      }).length;
      var portsOwned = gameState.houses.filter(function (h) {
        return (h.type === "port" || h.type === "property") && h.price && h.owner === player.id;
      }).length;
      var techCount = TECH_CERTIFICATES.filter(function (c) {
        return player.certificates.includes(c);
      }).length;
      var goalMet = certCount === 4 && player.hasTuglord && player.hasOceanTug && portsOwned >= 5;
      var chip = function chip(ok, label) {
        return "<span style=\"font-size:0.7rem; padding:0.1rem 0.4rem; border-radius:0.4rem; background:" + (ok ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)") + "; color:" + (ok ? "#22c55e" : "#94a3b8") + ";\">" + (ok ? "✅" : "⬜") + " " + label + "</span>";
      };
      var victoryProgress = "\n            <div style=\"margin-top:0.5rem;\">\n                <div style=\"font-size:0.72rem; color:#fbbf24; font-weight:700; margin-bottom:0.3rem;\">\uD83C\uDFC6 TugLord Supremo " + (goalMet ? "— COMPLETO!" : "") + "</div>\n                <div style=\"display:flex; flex-wrap:wrap; gap:0.25rem;\">\n                    " + chip(certCount >= REGRAS.MANOBRA_CERTS_SEGURANCA, "Seguran\xE7a " + certCount + "/4") + "\n                    " + chip(player.hasTuglord, "TugLord") + "\n                    " + chip(player.certTuglords, "Cert. Tuglords " + (player.unisalvageStep || 0) + "/" + REGRAS.UNISALVAGE_ETAPAS) + "\n                    " + chip(player.hasOceanTug, "Oceânico") + "\n                    " + chip(portsOwned >= 5, "Portos " + portsOwned + "/5") + "\n                    <span style=\"font-size:0.7rem; padding:0.1rem 0.4rem; border-radius:0.4rem; background:rgba(59,130,246,0.15); color:#60a5fa;\">\uD83D\uDD27 T\xE9cnicos " + techCount + "/4 (b\xF4nus)</span>\n                </div>\n            </div>";
      var isDanger = !player.isEliminated && player.money < 3e3;
      var isLeader = player.id === leaderId;
      var cardClasses = ["player-card"];
      if (index === gameState.currentPlayerIndex) cardClasses.push("active");
      if (isDanger) cardClasses.push("danger");
      if (isLeader) cardClasses.push("leader");
      if (player.isEliminated) cardClasses.push("eliminated");
      return "\n        <div class=\"" + cardClasses.join(" ") + "\"\n             style=\"border-left: 4px solid " + player.color + ";\">\n            <div class=\"player-header\">\n                <span class=\"player-name\">" + (isLeader ? "👑 " : "") + player.icon + " " + player.name + "</span>\n                <span class=\"player-money\">" + (isDanger ? "⚠️ " : "") + coinIcon() + " " + fm(player.money) + "</span>\n            </div>\n            <div class=\"tabs-container\">\n                <button class=\"tab-btn active\" onclick=\"switchTab(this, 'fin-" + player.id + "')\">Finan\xE7as</button>\n                <button class=\"tab-btn\" onclick=\"switchTab(this, 'assets-" + player.id + "')\">Ativos</button>\n            </div>\n            <div class=\"tab-content active\" id=\"fin-" + player.id + "\">\n                <div class=\"badge\">\n                    <span class=\"dot\" style=\"background: " + player.color + ";\"></span>\n                    <span>" + positionLabel + "</span>\n                </div>\n                " + victoryProgress + "\n            </div>\n            <div class=\"tab-content\" id=\"assets-" + player.id + "\">\n                " + assetsContent + "\n            </div>\n        </div>\n    ";
    }).join("");
    _renderStandings();
  }
  function netWorthUI(player) {
    return netWorth(player);
  }
  function _renderStandings() {
    var strip = document.getElementById("standingsStrip");
    if (!strip) return;
    if (gameState.phase !== "playing" || gameState.players.length === 0) {
      strip.innerHTML = "";
      return;
    }
    var ranked = [].concat(gameState.players).sort(function (a, b) {
      return netWorthUI(b) - netWorthUI(a);
    });
    var leaderId = ranked[0] && !ranked[0].isEliminated ? ranked[0].id : null;
    var activeCount = gameState.players.filter(function (p) {
      return !p.isEliminated;
    }).length;
    strip.innerHTML = ranked.map(function (p, i) {
      var isLeader = p.id === leaderId && activeCount > 1;
      var cls = ["standings-item"];
      if (isLeader) cls.push("is-leader");
      if (p.isEliminated) cls.push("is-out");
      if (p.id === gameState.players[gameState.currentPlayerIndex].id) cls.push("is-turn");
      return "\n            <div class=\"" + cls.join(" ") + "\" style=\"--pcolor:" + p.color + ";\" title=\"" + p.name + ": " + fm(netWorthUI(p)) + "\">\n                <span class=\"standings-rank\">" + (isLeader ? "👑" : i + 1 + "º") + "</span>\n                <span class=\"standings-icon\">" + p.icon + "</span>\n                <span class=\"standings-money\">" + (p.isEliminated ? "💀" : coinIcon() + " " + fm(netWorthUI(p))) + "</span>\n                " + (window.TLEngage ? '<span class="standings-badges">' + window.TLEngage.badgesHTML(p) + "</span>" : "") + "\n            </div>";
    }).join("");
    if (window.TLEngage) window.TLEngage.afterRender();
  }
  function _updateTurnDisplay() {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    var nameEl = document.getElementById("currentPlayerName");
    var turnEl = document.getElementById("currentTurnPlayer");
    var roundEl = document.getElementById("currentRound");
    if (nameEl) nameEl.textContent = currentPlayer.icon + " " + currentPlayer.name;
    if (turnEl) turnEl.textContent = currentPlayer.name;
    if (roundEl) roundEl.textContent = "Rodada " + gameState.currentRound + (REGRAS.LIMITE_RODADAS ? "/" + REGRAS.LIMITE_RODADAS : "");
    if (gameState.phase === "playing") {
      document.documentElement.style.setProperty("--current-color", currentPlayer.color);
      FX.turnBanner(currentPlayer.icon + " Vez de " + currentPlayer.name, currentPlayer.color);
    }
    _renderStandings();
    _renderDice3D(document.getElementById("diceDisplay"), 1, 1, false);
    gameState.diceRolled = false;
    var rollBtn = document.getElementById("rollDiceBtn");
    var endBtn = document.getElementById("endTurnBtn");
    if (rollBtn) {
      rollBtn.disabled = false;
      rollBtn.style.opacity = "1";
    }
    if (endBtn) endBtn.disabled = false;
  }
  function _renderPlayerSetupList() {
    var container = document.getElementById("playerSetupList");
    if (!container) return;
    container.innerHTML = gameState.players.map(function (player) {
      return "\n        <div class=\"player-setup-card\" style=\"border-left: 4px solid " + player.color + ";\">\n            <div class=\"player-setup-info\">\n                <span style=\"font-size: 2rem;\">" + player.icon + "</span>\n                <input \n                    type=\"text\" \n                    value=\"" + player.name + "\" \n                    onchange=\"updatePlayerName(" + player.id + ", this.value)\"\n                    class=\"player-name-input\"\n                    placeholder=\"Nome do jogador\"\n                />\n            </div>\n            <div id=\"roll-" + player.id + "\" class=\"player-roll-result\">\n                " + (player.rolled ? "\uD83C\uDFB2 " + player.rollValue : "") + "\n            </div>\n            <button class=\"btn-remove\" onclick=\"removePlayer(" + player.id + ")\">\u2715</button>\n        </div>\n    ";
    }).join("");
  }
  var style = document.createElement("style");
  style.textContent = "\n    @keyframes slideDown {\n        from { transform: translateY(-20px); opacity: 0; }\n        to { transform: translateY(0); opacity: 1; }\n    }\n    @keyframes slideUp {\n        from { transform: translateY(0); opacity: 1; }\n        to { transform: translateY(-20px); opacity: 0; }\n    }\n    @keyframes pulse {\n        0%, 100% { transform: scale(1); }\n        50% { transform: scale(1.1); }\n    }\n";
  document.head.appendChild(style);

  // src/js/modules/audio.js
  var Audio = {
    synth: null,
    polySynth: null,
    initialized: false,
    muted: false,
    // --- Fundo musical ---
    musicBus: null,
    // Barramento de volume dedicado à trilha (independente dos SFX)
    padSynth: null,
    // Acordes sustentados (clima)
    bassSynth: null,
    // Linha de baixo
    leadSynth: null,
    // Melodia
    chordLoop: null,
    // Loop de progressão de acordes/baixo (Tone.Loop)
    melodySeq: null,
    // Sequência melódica (Tone.Sequence)
    musicReady: false,
    // Trilha já montada?
    musicPlaying: false,
    // Transport rodando para a música?
    // Alterna mudo e retorna o novo estado (true = mudo).
    // Também pausa/retoma o fundo musical para acompanhar o estado.
    toggleMute: function toggleMute() {
      this.muted = !this.muted;
      if (this.muted) {
        this.stopMusic();
      } else {
        this.startMusic();
      }
      return this.muted;
    },
    init: function init() {
      try {
        this._sfxLoad();
      } catch (e) {}
      if (this.initialized) return;
      if (typeof Tone === "undefined") {
        console.warn("🔇 Tone.js indisponível — áudio desativado.");
        return;
      }
      try {
        if (Tone.context.state !== "running") {
          Tone.start().catch(function () {});
        }
        this.synth = new Tone.Synth({
          oscillator: {
            type: "square"
          },
          envelope: {
            attack: 0.01,
            decay: 0.1,
            sustain: 0,
            release: 0.1
          }
        }).toDestination();
        this.polySynth = new Tone.PolySynth(Tone.Synth).toDestination();
        this.polySynth.set({
          oscillator: {
            type: "triangle"
          },
          envelope: {
            attack: 0.05,
            decay: 0.2,
            sustain: 0.1,
            release: 1
          }
        });
        this.initialized = true;
        console.log("🔊 Audio System Initialized");
      } catch (e) {
        console.warn("🔇 Falha ao inicializar áudio:", e.message);
      }
    },
    // ===== Efeitos sonoros (ElevenLabs, HTML5 Audio pré-carregado; Menu liga/desliga) =====
    sfxOn: function sfxOn() {
      try {
        return localStorage.getItem("tvSfx") !== "off";
      } catch (e) {
        return true;
      }
    },
    setSfx: function setSfx(on) {
      try {
        localStorage.setItem("tvSfx", on ? "on" : "off");
      } catch (e) {}
    },
    _sfx: null,
    _sfxBuf: null,
    _ctx: function _ctx() {
      try {
        if (typeof Tone !== "undefined" && Tone.context && Tone.context.rawContext) return Tone.context.rawContext;
      } catch (e) {}
      if (!this._ac) {
        var C = window.AudioContext || window.webkitAudioContext;
        if (C) this._ac = new C();
      }
      return this._ac || null;
    },
    _sfxLoad: function _sfxLoad() {
      var _this = this;
      if (this._sfx) return;
      this._sfx = {};
      this._sfxBuf = {};
      var ctx = this._ctx();
      ["certificado", "azar", "dado", "pulo", "compra", "moeda"].forEach(function (n) {
        var url = "tv/sfx/" + n + ".mp3";
        if (ctx && window.fetch) {
          fetch(url).then(function (r) {
            return r.arrayBuffer();
          }).then(function (ab) {
            return new Promise(function (ok, ko) {
              return ctx.decodeAudioData(ab, ok, ko);
            });
          }).then(function (buf) {
            _this._sfxBuf[n] = buf;
          }).catch(function () {});
        }
        var a = document.createElement("audio");
        a.preload = "none";
        a.src = url;
        _this._sfx[n] = a;
      });
    },
    // Desbloqueio no primeiro OK (gesto): retoma o AudioContext e toca um buffer mudo.
    unlockSfx: function unlockSfx() {
      this._sfxLoad();
      var ctx = this._ctx();
      if (!ctx) return;
      try {
        if (ctx.state === "suspended" && ctx.resume) ctx.resume();
        var b = ctx.createBuffer(1, 1, 22050),
          s = ctx.createBufferSource();
        s.buffer = b;
        s.connect(ctx.destination);
        s.start(0);
      } catch (e) {}
    },
    sfxStatus: function sfxStatus(n) {
      this._sfxLoad();
      var c = this._ctx();
      return (this._sfxBuf[n] ? "ok" : "carregando") + (c ? ", " + c.state : ", sem WebAudio");
    },
    playSfx: function playSfx(n, vol, forcar) {
      var _this2 = this;
      if (this.muted || !forcar && !this.sfxOn()) return;
      this._sfxLoad();
      var dur = 1.5;
      var buf = this._sfxBuf[n],
        ctx = this._ctx();
      if (buf && ctx) {
        try {
          if (ctx.state === "suspended" && ctx.resume) ctx.resume();
          var src = ctx.createBufferSource(),
            g = ctx.createGain();
          src.buffer = buf;
          g.gain.value = vol;
          src.connect(g);
          g.connect(ctx.destination);
          src.start(0);
          dur = buf.duration;
        } catch (e) {
          return;
        }
      } else {
        var a = this._sfx[n];
        if (!a) return;
        try {
          a.pause();
          a.currentTime = 0;
        } catch (e) {}
        a.volume = vol;
        var pr = a.play();
        if (pr && pr.catch) pr.catch(function () {});
        if (a.duration) dur = a.duration;
      }
      if (n !== "pulo") {
        this._duckAte = Math.max(this._duckAte || 0, Date.now() + dur * 1e3 + 150);
        var m = this.trackEl;
        if (m) m.volume = Math.min(m.volume, this.DUCK_VOL);
        clearTimeout(this._duckT);
        this._duckT = setTimeout(function () {
          return _this2._unduck();
        }, this._duckAte - Date.now());
      }
    },
    TRACK_VOL: 0.8,
    DUCK_VOL: 0.5,
    _unduck: function _unduck() {
      var _this3 = this;
      this._duckT = null;
      if (Date.now() < (this._duckAte || 0)) {
        this._duckT = setTimeout(function () {
          return _this3._unduck();
        }, this._duckAte - Date.now());
        return;
      }
      if (this.trackEl) this.trackEl.volume = this.TRACK_VOL;
    },
    playCertificate: function playCertificate() {
      this.playSfx("certificado", 1);
    },
    playBadLuck: function playBadLuck() {
      this.playSfx("azar", 1);
    },
    playDice: function playDice() {
      if (this.sfxOn()) {
        var t = Date.now();
        if (!this._diceT || t - this._diceT > 1800) {
          this._diceT = t;
          this.playSfx("dado", 1);
        }
        return;
      }
      return;
      var now = Tone.now();
      this.synth.triggerAttackRelease("C6", "32n", now);
      this.synth.triggerAttackRelease("A5", "32n", now + 0.1);
      this.synth.triggerAttackRelease("F5", "32n", now + 0.2);
    },
    playMove: function playMove() {
      this.playSfx("pulo", 0.7);
      return;
      this.synth.triggerAttackRelease("C5", "64n");
    },
    playSuccess: function playSuccess() {
      if (!this.initialized || this.muted) return;
      var now = Tone.now();
      this.polySynth.triggerAttackRelease(["C5", "E5", "G5", "C6"], "8n", now);
    },
    playBuy: function playBuy() {
      this.playSfx("compra", 1);
    },
    // Tilintar de moedas (ElevenLabs): recebe ou paga dinheiro (salário, aluguel, bônus)
    playCoin: function playCoin() {
      var t = Date.now();
      if (this._coinT && t - this._coinT < 400) return;
      this._coinT = t;
      this.playSfx("moeda", 1);
    },
    playMoney: function playMoney() {
      if (!this.initialized || this.muted) return;
      var now = Tone.now();
      this.synth.triggerAttackRelease("B5", "16n", now);
      this.synth.triggerAttackRelease("E6", "16n", now + 0.1);
    },
    playCritical: function playCritical() {
      if (!this.initialized || this.muted) return;
      var now = Tone.now();
      this.polySynth.triggerAttackRelease(["C2", "F#2"], "4n", now);
    },
    playError: function playError() {
      if (!this.initialized || this.muted) return;
      var now = Tone.now();
      this.synth.triggerAttackRelease("G4", "16n", now);
      this.synth.triggerAttackRelease("C4", "16n", now + 0.1);
    },
    // Monta os instrumentos e a sequência do fundo musical (uma única vez).
    // Trilha de AVENTURA MARÍTIMA animada: 124 BPM, baixo pulsante, arpejo,
    // batida (bumbo + chimbal) e melodia marcante. A reprodução é controlada
    // pelo Tone.Transport em start/stopMusic.
    _setupMusic: function _setupMusic() {
      var _this4 = this;
      if (this.musicReady || typeof Tone === "undefined") return;
      this.musicBus = new Tone.Volume(0).toDestination();
      this.padSynth = new Tone.PolySynth(Tone.Synth).connect(this.musicBus);
      this.padSynth.set({
        oscillator: {
          type: "sawtooth"
        },
        envelope: {
          attack: 0.15,
          decay: 0.3,
          sustain: 0.4,
          release: 0.6
        }
      });
      this.padSynth.volume.value = -14;
      this.bassSynth = new Tone.Synth({
        oscillator: {
          type: "sawtooth"
        },
        envelope: {
          attack: 0.01,
          decay: 0.18,
          sustain: 0.2,
          release: 0.1
        }
      }).connect(this.musicBus);
      this.bassSynth.volume.value = -3;
      this.arpSynth = new Tone.Synth({
        oscillator: {
          type: "triangle"
        },
        envelope: {
          attack: 5e-3,
          decay: 0.08,
          sustain: 0,
          release: 0.08
        }
      }).connect(this.musicBus);
      this.arpSynth.volume.value = -14;
      this.leadSynth = new Tone.Synth({
        oscillator: {
          type: "sawtooth"
        },
        envelope: {
          attack: 0.01,
          decay: 0.15,
          sustain: 0.25,
          release: 0.2
        }
      }).connect(this.musicBus);
      this.leadSynth.volume.value = -8;
      this.kickSynth = new Tone.MembraneSynth({
        octaves: 6,
        pitchDecay: 0.05,
        envelope: {
          attack: 1e-3,
          decay: 0.3,
          sustain: 0
        }
      }).connect(this.musicBus);
      this.kickSynth.volume.value = -4;
      this.hatSynth = new Tone.NoiseSynth({
        noise: {
          type: "white"
        },
        envelope: {
          attack: 1e-3,
          decay: 0.03,
          sustain: 0
        }
      }).connect(this.musicBus);
      this.hatSynth.volume.value = -20;
      var chords = [["A3", "C4", "E4"], ["F3", "A3", "C4"], ["C4", "E4", "G4"], ["G3", "B3", "D4"]];
      var roots = ["A1", "F1", "C2", "G1"];
      var fifths = ["E2", "C2", "G2", "D2"];
      var bass = [];
      chords.forEach(function (c, b) {
        return bass.push(roots[b], roots[b], fifths[b], roots[b], roots[b], fifths[b], roots[b], fifths[b]);
      });
      var arp = [];
      chords.forEach(function (c) {
        return arp.push(c[0], c[1], c[2], c[1], c[2], c[1], c[0], c[1], c[0], c[1], c[2], c[1], c[2], c[1], c[0], c[2]);
      });
      var melody = ["A4", null, "C5", "E5", "A5", null, "E5", "C5", "F4", null, "A4", "C5", "F5", null, "C5", "A4", "C5", "E5", "G5", null, "E5", "C5", "E5", null, "G4", "B4", "D5", "G5", "D5", "B4", "G4", null];
      var bar = 0;
      this.chordLoop = new Tone.Loop(function (time) {
        _this4.padSynth.triggerAttackRelease(chords[bar % 4], "2n", time, 0.3);
        bar++;
      }, "1m").start(0);
      this.kickLoop = new Tone.Loop(function (time) {
        _this4.kickSynth.triggerAttackRelease("C1", "8n", time, 0.9);
      }, "4n").start(0);
      var hb = 0;
      this.hatLoop = new Tone.Loop(function (time) {
        if (hb % 2 === 1) _this4.hatSynth.triggerAttackRelease("16n", time, 0.35);
        hb++;
      }, "8n").start(0);
      this.bassSeq = new Tone.Sequence(function (time, n) {
        if (n) _this4.bassSynth.triggerAttackRelease(n, "8n", time, 0.85);
      }, bass, "8n").start(0);
      this.arpSeq = new Tone.Sequence(function (time, n) {
        if (n) _this4.arpSynth.triggerAttackRelease(n, "16n", time, 0.4);
      }, arp, "16n").start(0);
      this.melodySeq = new Tone.Sequence(function (time, n) {
        if (n) _this4.leadSynth.triggerAttackRelease(n, "8n", time, 0.55);
      }, melody, "8n").start(0);
      Tone.Transport.bpm.value = 124;
      this.musicReady = true;
    },
    // --- Trilha da TV: 'tema-1' | 'tema-2' | 'tema-3' | 'tema-4' | 'original' (Tone.js) ---
    trackEl: null,
    getTrack: function getTrack() {
      var t = null;
      try {
        t = localStorage.getItem("tuglords_tv_trilha");
      } catch (e) {}
      if (t === "tema-4-continuacao") {
        t = "tema-7";
        try {
          localStorage.setItem("tuglords_tv_trilha", t);
        } catch (e) {}
      }
      return t === "tema-1" || t === "tema-2" || t === "tema-3" || t === "tema-4" || t === "tema-4-estendido" || t === "tema-5" || t === "tema-6" || t === "tema-7" || t === "original" ? t : "tema-7";
    },
    setTrack: function setTrack(t) {
      try {
        localStorage.setItem("tuglords_tv_trilha", t);
      } catch (e) {}
      this.stopMusic();
      this.startMusic();
      return t;
    },
    _querTrilha: false,
    _startFile: function _startFile(t) {
      var _this5 = this;
      if (!this.trackEl) {
        var el = document.createElement("audio");
        el.loop = true;
        el.preload = "auto";
        el.volume = this.TRACK_VOL;
        el.addEventListener("ended", function () {
          if (_this5._querTrilha) {
            try {
              el.currentTime = 0;
            } catch (e) {}
            _this5._tocarFile();
          }
        });
        el.addEventListener("error", function () {
          if (_this5._querTrilha) setTimeout(function () {
            try {
              el.load();
            } catch (e) {}
            _this5._tocarFile();
          }, 1500);
        });
        el.addEventListener("pause", function () {
          if (_this5._querTrilha) setTimeout(function () {
            if (_this5._querTrilha && el.paused) _this5._tocarFile();
          }, 400);
        });
        this.trackEl = el;
        this._watchdog();
      }
      var src = "tv/audio/" + t + ".mp3";
      if (this.trackEl.getAttribute("data-t") !== t) {
        this.trackEl.src = src;
        this.trackEl.setAttribute("data-t", t);
      }
      this._querTrilha = true;
      this._tocarFile();
    },
    _tocarFile: function _tocarFile() {
      var _this6 = this;
      var el = this.trackEl;
      if (!el || this.muted || !this._querTrilha) return;
      var pr = el.play();
      if (pr && pr.catch) pr.catch(function (e) {
        console.warn("🔇 Trilha bloqueada/rejeitada, nova tentativa em 3 s:", e && e.message);
        _this6.restauros = _this6.restauros || 0;
      });
    },
    restauros: 0,
    _watchdog: function _watchdog() {
      var _this7 = this;
      if (this._wd) return;
      this._wd = setInterval(function () {
        if (_this7.muted) return;
        var t = _this7.getTrack();
        if (t === "original") {
          if (_this7.musicPlaying && typeof Tone !== "undefined" && Tone.Transport.state !== "started") {
            _this7.restauros++;
            try {
              Tone.Transport.start();
            } catch (e) {}
          }
          return;
        }
        var el = _this7.trackEl;
        if (!el || !_this7._querTrilha) return;
        if (el.paused || el.ended) {
          _this7.restauros++;
          _this7._tocarFile();
        }
        if (Date.now() >= (_this7._duckAte || 0) && el.volume < _this7.TRACK_VOL - 0.01) {
          _this7.restauros++;
          el.volume = _this7.TRACK_VOL;
        }
        try {
          var c = _this7._ctx();
          if (c && c.state === "suspended" && c.resume) c.resume();
        } catch (e) {}
      }, 3e3);
    },
    _stopFile: function _stopFile() {
      this._querTrilha = false;
      if (this.trackEl) {
        try {
          this.trackEl.pause();
        } catch (e) {}
      }
    },
    // Inicia a trilha escolhida (nunca duas ao mesmo tempo).
    startMusic: function startMusic() {
      this.init();
      if (this.muted) return;
      var t = this.getTrack();
      if (t === "original") {
        this._stopFile();
        this._startTone();
      } else {
        this._stopTone();
        this._startFile(t);
      }
    },
    stopMusic: function stopMusic() {
      this._stopFile();
      this._stopTone();
    },
    // Fundo musical original (Tone.js), respeitando o estado de mudo.
    _startTone: function _startTone() {
      var _this8 = this;
      this.init();
      if (!this.initialized || this.muted || this.musicPlaying) return;
      try {
        this._setupMusic();
        if (!this.musicReady) return;
        var begin = function begin() {
          if (_this8.muted || _this8.musicPlaying) return;
          Tone.Transport.start();
          _this8.musicPlaying = true;
          console.log("🎵 Fundo musical iniciado");
        };
        if (Tone.context.state === "running") {
          begin();
        } else {
          Tone.start().then(begin).catch(function (e) {
            return console.warn("🔇 Falha ao retomar contexto de áudio:", e.message);
          });
        }
      } catch (e) {
        console.warn("🔇 Falha ao iniciar fundo musical:", e.message);
      }
    },
    // Pausa o fundo musical sem desmontar a sequência (permite retomar).
    _stopTone: function _stopTone() {
      if (!this.musicPlaying || typeof Tone === "undefined") return;
      try {
        Tone.Transport.pause();
      } catch (e) {
        console.warn("🔇 Falha ao pausar fundo musical:", e.message);
      }
      this.musicPlaying = false;
    }
  };
  if (typeof window !== "undefined") window.TugAudio = Audio;
  if (typeof document !== "undefined") {
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && Audio._querTrilha && Audio.trackEl && Audio.trackEl.paused) Audio._tocarFile();
    });
  }

  // src/js/modules/commentary.js
  var COMMENTS = {
    // Começo da partida
    start: ["Senhoras e senhores, soltem as amarras: começa o TugLords! ⚓", "A água tá calma agora... mas não por muito tempo! 🌊", "Capitães a postos! Que vença o mais esperto (ou o mais sortudo)!"],
    // Rolar os dados (normal)
    roll: ["{player} sopra os dados pra dar sorte... ou pra disfarçar o nervosismo! 🎲", "Lá vão os dados! Tensão maior que fila de banco em dia de pagamento!", "{player} joga os dados e entrega o destino pro acaso. Corajoso!", "Atenção que {player} vai lançar... respira fundo, comandante!"],
    // Dupla nos dados
    double: ["DUPLAAA! {player} tá com a mão quente, hein?! 🔥", "Dois números iguais! Até os rebocadores pararam pra aplaudir! 👏", "Dupla de {player}! Isso é sorte ou pacto com Netuno? 🔱"],
    // Comprar porto/propriedade
    buy: ["{player} abre a carteira e leva {porto}! Investidor nato ou gastador compulsivo? 💸", "Mais um porto no império de {player}! Monopólio à vista! 🏴", "Vendido! {porto} agora é de {player}. Anota aí no cartório marítimo! 📜", "{player} fincou a bandeira em {porto}. Território conquistado!"],
    // Pagar aluguel a outro jogador
    rent: ["Ai! {player} paga aluguel e sente no bolso... dói mais que âncora no pé! ⚓", "Pedágio portuário! {owner} agradece a gentil contribuição de {player}! 🤑", "{player} atraca no porto errado e... cadê a maquininha? Paga aí!", "Dinheiro trocando de mãos! {owner} sorri, {player} chora. 😢"],
    // Cair na própria propriedade
    own: ["{player} chega em casa, tira os sapatos e relaxa. Sem aluguel hoje! 🏠", "Território amigo! {player} pode respirar aliviado."],
    // Treinamento / Universidade (certificação)
    cert: ["Hora da prova! {player}, você ESTUDOU pro teste de certificação ou vai no chute? 📚", "Exame de certificação! Torço pra {player} não ter colado... 👀", "{player} encara a banca examinadora. Lápis na mão e fé no coração! ✏️", "Teste de certificação! Quem não estuda, naufraga, comandante!"],
    // Passou pela Partida
    pass: ["+F$ 4 mi! {player} passou pela Partida faturando. Salário caiu! 🤑", "{player} deu a volta no tabuleiro e passou no caixa. Rico de novo!"],
    // Carta Sorte/Azar
    luck: ["{player} tenta a sorte... vai que vem um trevo de quatro folhas! 🍀", "Carta virada! Coração na mão, igual resultado de concurso público! 😬", "{player} aposta na sorte. O destino é brincalhão, cuidado!"],
    // Evento Oceânico
    ocean: ["Mares revoltos! {player} segura o leme com as duas mãos! 🌊", "Evento oceânico! Netuno resolveu brincar com {player} hoje..."],
    // Imposto / taxa
    tax: ["Imposto! O Leão também navega nessas águas, {player}! 🦁", "{player} paga a taxa portuária. Burocracia não perdoa nem no mar!"],
    // Docagem obrigatória
    dock: ["Rebocador na doca! Parado que nem navio esperando praticagem. ⚓", "{player} vai pra manutenção. Nada de correria por uns turnos!"],
    // Saldo baixo
    lead: ["Virada na liderança! {player} passa {owner} e assume a ponta! 👑", "Troca no topo do placar! {player} desbanca {owner}!"],
    nearbroke: ["{player} tá à beira da falência! Alguém joga uma boia aí! 🛟", "Caixa de {player} no vermelho quase! Cuidado com o próximo aluguel!"],
    bigpay: ["Pagamento gordo! {player} embolsa {valor}! 💰", "Que bolada! {player} leva {valor} pra casa!"],
    badge: ["{player} desbloqueia a conquista {valor}! Medalha no peito! 🏅", "Conquista nova pra {player}: {valor}!"],
    roundevent: ["Notícia no rádio do porto: {valor}! Muda tudo nesta rodada!", "Atenção, capitães: {valor}!"],
    final: ["Reta final! Cada moeda agora vale mais. Acelera, comandante!", "Contagem regressiva ligada! Quem vai levantar a taça?"],
    auction: ["Ninguém quis {porto}? Então vai a leilão relâmpago! 🔨", "Leilão aberto para {porto}! Quem dá mais?"],
    auctionwin: ["Dou-lhe uma, dou-lhe duas... vendido para {player} por {valor}!", "{player} arremata {porto} por {valor}!"],
    challenge: ["{player} desafia {owner} no quiz! Duelo de cérebros! 🧠", "Desafio lançado: {player} contra {owner}!"],
    lowcash: ["{player} tá raspando o tacho... hora de um empréstimo (ou de rezar)! 🙏", "Alerta de maré baixa no caixa de {player}! Segura as pontas!"],
    // Falência
    bankrupt: ["E {player} vai a nocaute! O mar não perdoa, senhores! 💀", "Fim da linha pra {player}... recolhe as redes e vai pra casa! 🎣", "{player} afundou com tudo! Buááá, um minuto de silêncio. ⚓"],
    // Vitória
    win: ["É CAMPEÃO! {player} domina os sete mares! TugLord Supremo! 🏆", "Acabou! {player} é o lorde absoluto dos rebocadores! 👑", "{player} levanta a taça! Que partida, senhoras e senhores!"]
  };
  function fill(line, ctx) {
    return line.replace(/\{player\}/g, ctx.player || "o jogador").replace(/\{porto\}/g, ctx.porto || "o porto").replace(/\{owner\}/g, ctx.owner || "o dono").replace(/\{valor\}/g, ctx.valor != null ? ctx.valor : "");
  }
  function pickComment(event, ctx) {
    if (ctx === void 0) {
      ctx = {};
    }
    var pool = COMMENTS[event];
    if (!pool || pool.length === 0) return null;
    var line = pool[Math.floor(Math.random() * pool.length)];
    return fill(line, ctx);
  }

  // src/js/modules/engagement.js
  var engagement_exports = {};
  __export(engagement_exports, {
    BADGES: function BADGES() {
      return _BADGES;
    },
    activeEvent: function activeEvent() {
      return _activeEvent;
    },
    afterRender: function afterRender() {
      return _afterRender;
    },
    answerChallenge: function answerChallenge() {
      return _answerChallenge;
    },
    auctionBid: function auctionBid() {
      return _auctionBid;
    },
    auctionPass: function auctionPass() {
      return _auctionPass;
    },
    award: function award() {
      return _award;
    },
    badgesHTML: function badgesHTML() {
      return _badgesHTML;
    },
    challengeAvailable: function challengeAvailable() {
      return _challengeAvailable;
    },
    eventMult: function eventMult() {
      return _eventMult;
    },
    isFinalStretch: function isFinalStretch() {
      return _isFinalStretch;
    },
    medalSVG: function medalSVG() {
      return _medalSVG;
    },
    onCredit: function onCredit() {
      return _onCredit;
    },
    onRoundStart: function onRoundStart() {
      return _onRoundStart;
    },
    openChallenge: function openChallenge() {
      return _openChallenge;
    },
    payoutMult: function payoutMult() {
      return _payoutMult;
    },
    resetTracking: function resetTracking() {
      return _resetTracking;
    },
    startAuction: function startAuction() {
      return _startAuction;
    },
    startChallenge: function startChallenge() {
      return _startChallenge;
    }
  });
  function say(ev, ctx) {
    _showCommentary(pickComment(ev, ctx || {}));
  }
  function cur() {
    return gameState.players[gameState.currentPlayerIndex];
  }
  function byId(id) {
    return gameState.players.find(function (p) {
      return p.id === id;
    });
  }
  function active() {
    return gameState.players.filter(function (p) {
      return !p.isEliminated;
    });
  }
  var BADGE_COLORS = {
    primeira_manobra: "#3b82f6",
    frota5: "#10b981",
    salvamento_epico: "#ef4444",
    formado: "#fbbf24",
    arrematador: "#8b5cf6",
    duelista: "#ec4899"
  };
  function _medalSVG(color, size) {
    var s = size || 28;
    return "<svg viewBox=\"0 0 24 24\" width=\"" + s + "\" height=\"" + s + "\" aria-hidden=\"true\" style=\"vertical-align:middle\"><path d=\"M7 2h4l1 5-3 1zM17 2h-4l-1 5 3 1z\" fill=\"#94a3b8\"/><circle cx=\"12\" cy=\"14\" r=\"7\" fill=\"" + color + "\" stroke=\"#fff\" stroke-width=\"1.5\"/><path d=\"M12 9.8l1.3 2.7 3 .4-2.2 2 .6 3-2.7-1.5-2.7 1.5.6-3-2.2-2 3-.4z\" fill=\"#fff\"/></svg>";
  }
  function eventSVG(color) {
    return "<svg viewBox=\"0 0 24 24\" width=\"40\" height=\"40\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"" + color + "\"/><path d=\"M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0v3c-2 2-4 2-6 0s-4-2-6 0-4 2-6 0z\" fill=\"#fff\"/><path d=\"M12 4l1.6 4.4H18l-3.6 2.6 1.4 4.3L12 12.6 8.2 15.3l1.4-4.3L6 8.4h4.4z\" fill=\"#fff\" opacity=\".9\"/></svg>";
  }
  function clockSVG() {
    return "<svg viewBox=\"0 0 24 24\" width=\"22\" height=\"22\" aria-hidden=\"true\" style=\"vertical-align:-5px\"><circle cx=\"12\" cy=\"13\" r=\"8\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2.2\"/><path d=\"M12 8v5l3 2M9 2h6\" stroke=\"#fff\" stroke-width=\"2.2\" fill=\"none\" stroke-linecap=\"round\"/></svg>";
  }
  function hammerSVG() {
    return "<svg viewBox=\"0 0 24 24\" width=\"40\" height=\"40\" aria-hidden=\"true\"><rect x=\"3\" y=\"18\" width=\"12\" height=\"3\" rx=\"1\" fill=\"#94a3b8\"/><rect x=\"9\" y=\"3\" width=\"9\" height=\"5\" rx=\"1\" transform=\"rotate(35 13 5)\" fill=\"#fbbf24\"/><rect x=\"11.5\" y=\"7\" width=\"2.6\" height=\"12\" rx=\"1\" transform=\"rotate(-55 12.8 13)\" fill=\"#b45309\"/></svg>";
  }
  function duelSVG() {
    return "<svg viewBox=\"0 0 24 24\" width=\"40\" height=\"40\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#ec4899\"/><text x=\"12\" y=\"16.5\" text-anchor=\"middle\" font-size=\"12\" font-weight=\"900\" fill=\"#fff\" font-family=\"sans-serif\">VS</text></svg>";
  }
  var lastOrder = null;
  var busy = false;
  function _resetTracking() {
    lastOrder = null;
  }
  function _afterRender() {
    if (busy || gameState.phase !== "playing") return;
    busy = true;
    try {
      var order = active().slice().sort(function (a, b) {
        return netWorth(b) - netWorth(a);
      }).map(function (p) {
        return p.id;
      });
      if (lastOrder && lastOrder.length === order.length) {
        for (var i = 0; i < order.length; i++) {
          var prev = lastOrder.indexOf(order[i]);
          if (prev > i) {
            var up = byId(order[i]),
              down = byId(lastOrder[i]);
            if (up && down && up !== down) {
              gameState.lastOvertake = {
                up: up.name,
                down: down.name
              };
              FX.turnBanner("Virada! " + up.name + " passou " + down.name, up.color);
              if (i === 0) say("lead", {
                player: up.name,
                owner: down.name
              });
            }
            break;
          }
        }
      }
      lastOrder = order;
      active().forEach(function (p) {
        if (p.money < REGRAS.NARRADOR_QUASE_FALENCIA && !p._lowWarned) {
          p._lowWarned = true;
          say("nearbroke", {
            player: p.name
          });
        } else if (p.money >= REGRAS.NARRADOR_QUASE_FALENCIA * 2) p._lowWarned = false;
        var frota = (p.portTugs || 0) + (p.hasOceanTug ? 1 : 0) + (p.hasTuglord ? 1 : 0);
        if (frota >= REGRAS.CONQUISTA_FROTA) _award(p, "frota5");
      });
      renderHud();
    } finally {
      busy = false;
    }
  }
  function _activeEvent() {
    var e = gameState.roundEvent;
    return e && e.round === gameState.currentRound ? REGRAS.EVENTOS_RODADA.find(function (x) {
      return x.id === e.id;
    }) : null;
  }
  function _eventMult(key) {
    var e = _activeEvent();
    return e && typeof e[key] === "number" ? e[key] : 1;
  }
  function _onRoundStart() {
    var r = gameState.currentRound;
    if (gameState._lastRoundSeen === r) return;
    gameState._lastRoundSeen = r;
    if (_isFinalStretch() && !gameState._finalAnnounced) {
      gameState._finalAnnounced = true;
      FX.turnBanner("Reta final! Pagamentos x" + String(REGRAS.RETA_FINAL_MULT).replace(".", ","), "#ef4444");
      say("final", {});
    }
    var n = REGRAS.EVENTOS_RODADA_A_CADA;
    if (!n || r % n !== 0) return;
    var prev = gameState.roundEvent && gameState.roundEvent.id;
    var pool = REGRAS.EVENTOS_RODADA.filter(function (x) {
      return x.id !== prev;
    });
    var ev = pool[Math.floor(Math.random() * pool.length)];
    gameState.roundEvent = {
      id: ev.id,
      round: r
    };
    say("roundevent", {
      valor: ev.nome
    });
    _showModal("Evento da rodada " + r, "\n        <div style=\"text-align:center;\">" + eventSVG(ev.cor) + "\n            <h2 style=\"color:" + ev.cor + "; margin:0.4rem 0;\">" + ev.nome + "</h2>\n            <p style=\"font-size:1.1rem;\">" + ev.texto + ".</p>\n            <p style=\"color:#94a3b8; font-size:0.85rem;\">Vale s\xF3 para a rodada " + r + ". Novo evento a cada " + n + " rodadas.</p>\n        </div>", [{
      text: "Entendi",
      onClick: "closeModal()",
      class: "btn-primary"
    }], false);
    renderHud();
  }
  function _isFinalStretch() {
    var lim = REGRAS.LIMITE_RODADAS;
    return !!lim && gameState.phase === "playing" && gameState.currentRound > lim - REGRAS.RETA_FINAL_RODADAS;
  }
  function _payoutMult(label) {
    if (!_isFinalStretch() || /sal[áa]rio/i.test(label || "")) return 1;
    return REGRAS.RETA_FINAL_MULT;
  }
  function renderHud() {
    var hud = document.getElementById("tlEngageHud");
    if (!hud) {
      hud = document.createElement("div");
      hud.id = "tlEngageHud";
      hud.style.cssText = "position:fixed; top:0.4rem; left:50%; transform:translateX(-50%); z-index:60; display:flex; gap:0.5rem; pointer-events:none; font-weight:800; font-size:0.9rem;";
      document.body.appendChild(hud);
    }
    var html = "";
    if (_isFinalStretch()) {
      var left = REGRAS.LIMITE_RODADAS - gameState.currentRound + 1;
      html += "<div id=\"finalCountdown\" style=\"background:#b91c1c; color:#fff; padding:0.3rem 0.8rem; border-radius:999px; box-shadow:0 0 0 2px #fca5a5;\">" + clockSVG() + " Reta final: " + (left === 1 ? "última rodada" : "faltam " + left + " rodadas") + " | pagamentos x" + String(REGRAS.RETA_FINAL_MULT).replace(".", ",") + "</div>";
    }
    var ev = _activeEvent();
    if (ev) html += "<div id=\"roundEventPill\" style=\"background:" + ev.cor + "; color:#0f172a; padding:0.3rem 0.8rem; border-radius:999px;\">" + ev.nome + ": " + ev.texto + "</div>";
    hud.innerHTML = html;
    hud.style.display = html ? "flex" : "none";
  }
  var A = null;
  function _startAuction(pos) {
    var house = gameState.houses[pos];
    _closeModal();
    if (!REGRAS.LEILAO_ATIVO || !house || house.owner !== void 0 && house.owner !== null) return;
    var total = gameState.players.length,
      ids = [];
    for (var k = 1; k <= total; k++) {
      var p = gameState.players[(gameState.currentPlayerIndex + k) % total];
      if (!p.isEliminated) ids.push(p.id);
    }
    A = {
      pos: pos,
      bidders: ids,
      idx: 0,
      bid: 0,
      leader: null,
      start: Math.max(REGRAS.LEILAO_INCREMENTO, Math.round(house.price * REGRAS.LEILAO_LANCE_INICIAL / REGRAS.LEILAO_INCREMENTO) * REGRAS.LEILAO_INCREMENTO)
    };
    say("auction", {
      porto: house.name
    });
    renderAuction();
  }
  function nextBid() {
    return A.leader === null ? A.start : A.bid + REGRAS.LEILAO_INCREMENTO;
  }
  function renderAuction() {
    var house = gameState.houses[A.pos];
    if (A.bidders.length === 0 || A.leader !== null && A.bidders.length === 1 && A.bidders[0] === A.leader) return finishAuction();
    if (A.bidders[A.idx] === A.leader) A.idx = (A.idx + 1) % A.bidders.length;
    var p = byId(A.bidders[A.idx]);
    var nb = nextBid();
    var can = p.money >= nb;
    var leader = A.leader !== null ? byId(A.leader) : null;
    var buttons = [];
    if (can) buttons.push({
      text: "Dar lance " + fm(nb),
      onClick: "auctionBid()",
      class: "btn-primary"
    });
    buttons.push({
      text: "Passar",
      onClick: "auctionPass()",
      class: "btn-secondary"
    });
    _showModal("Leilão relâmpago", "\n        <div style=\"text-align:center;\">" + hammerSVG() + "\n            <p style=\"margin:0.3rem 0;\"><strong>" + house.name + "</strong> (pre\xE7o de tabela " + fm(house.price) + ")</p>\n            <p style=\"font-size:1.2rem; color:var(--accent-gold); font-weight:800;\">" + (leader ? "Lance atual: " + fm(A.bid) + " de " + leader.name : "Sem lances. Mínimo " + fm(A.start)) + "</p>\n            <p style=\"font-size:1.1rem;\">Vez de <strong style=\"color:" + p.color + ";\">" + p.icon + " " + p.name + "</strong> (caixa " + fm(p.money) + ")</p>\n            " + (can ? "" : '<p style="color:#f59e0b;">Caixa insuficiente para cobrir o lance.</p>') + "\n            <p style=\"color:#94a3b8; font-size:0.8rem;\">Na disputa: " + A.bidders.map(function (id) {
      return byId(id).name;
    }).join(", ") + ". Quem passa sai do leil\xE3o.</p>\n        </div>", buttons, false);
  }
  function _auctionBid() {
    if (!A) return;
    var p = byId(A.bidders[A.idx]);
    var nb = nextBid();
    if (p.money < nb) return;
    A.bid = nb;
    A.leader = p.id;
    Audio.playCoin();
    A.idx = (A.idx + 1) % A.bidders.length;
    renderAuction();
  }
  function _auctionPass() {
    if (!A) return;
    A.bidders.splice(A.idx, 1);
    if (A.idx >= A.bidders.length) A.idx = 0;
    renderAuction();
  }
  function finishAuction() {
    var house = gameState.houses[A.pos];
    var w = A.leader !== null ? byId(A.leader) : null;
    var bid = A.bid;
    A = null;
    if (!w) {
      _showModal("Leilão relâmpago", "<p style=\"text-align:center;\">Ningu\xE9m deu lance. " + house.name + " continua \xE0 venda.</p>", [{
        text: "Continuar",
        onClick: "closeModal()",
        class: "btn-primary"
      }], false);
      return;
    }
    w.money -= bid;
    house.owner = w.id;
    w.properties.push(house.name);
    gameState.lastAuction = {
      winner: w.name,
      bid: bid,
      porto: house.name
    };
    Audio.playBuy();
    say("auctionwin", {
      player: w.name,
      porto: house.name,
      valor: fm(bid)
    });
    _showModal("Arrematado!", "<div style=\"text-align:center;\">" + hammerSVG() + "<p style=\"font-size:1.15rem;\"><strong style=\"color:" + w.color + ";\">" + w.icon + " " + w.name + "</strong> leva <strong>" + house.name + "</strong> por <strong style=\"color:var(--accent-gold);\">" + fm(bid) + "</strong>.</p></div>", [{
      text: "Continuar",
      onClick: "closeModal()",
      class: "btn-primary"
    }], false);
    _renderPlayersPanel();
    _updatePlayerPositions();
    _award(w, "arrematador");
  }
  var D = null;
  function turnKey() {
    return gameState.currentRound + ":" + gameState.currentPlayerIndex;
  }
  function _challengeAvailable() {
    return gameState.phase === "playing" && gameState.challengeTurn !== turnKey() && active().length > 1;
  }
  function _openChallenge() {
    if (!_challengeAvailable()) {
      _showNotification("Desafio: só 1 por turno.");
      return;
    }
    var me = cur();
    var min = REGRAS.DESAFIO_CAIXA_MIN || 0;
    var opp = active().filter(function (p) {
      return p.id !== me.id;
    });
    if (me.money < min) {
      _showNotification("\u2694\uFE0F Desafio exige caixa de " + fm(min) + ". " + me.name + " tem " + fm(me.money) + ".");
      return;
    }
    var ok = opp.filter(function (p) {
      return p.money >= min;
    });
    var fora = opp.filter(function (p) {
      return p.money < min;
    });
    if (!ok.length) {
      _showNotification("\u2694\uFE0F Nenhum advers\xE1rio tem caixa de " + fm(min) + " para o desafio.");
      return;
    }
    _showModal("Desafio de quiz", "\n        <div style=\"text-align:center;\">" + duelSVG() + "\n            <p>" + me.name + ", escolha quem desafiar. Os dois respondem a mesma pergunta.</p>\n            <p style=\"color:#94a3b8; font-size:0.85rem;\">Aposta " + fm(REGRAS.DESAFIO_APOSTA) + ": quem erra paga a quem acerta. Dois acertos: empate, ningu\xE9m paga. Dois erros: cada um paga " + fm(REGRAS.DESAFIO_MULTA_ERRO_DUPLO) + " ao Banco.</p>\n            <p style=\"color:#fbbf24; font-size:0.85rem;\">S\xF3 desafia quem tem pelo menos " + fm(min) + " em caixa (os dois lados)." + (fora.length ? " Fora por caixa baixo: " + fora.map(function (p) {
      return p.name;
    }).join(", ") + "." : "") + "</p>\n        </div>", ok.map(function (p) {
      return {
        text: p.icon + " " + p.name,
        onClick: "startChallenge(" + p.id + ")",
        class: "btn-primary"
      };
    }).concat([{
      text: "Cancelar",
      onClick: "closeModal()",
      class: "btn-secondary"
    }]), false);
  }
  function _startChallenge(oppId) {
    var min = REGRAS.DESAFIO_CAIXA_MIN || 0;
    if (cur().money < min || !byId(oppId) || byId(oppId).money < min) {
      _showNotification("\u2694\uFE0F Desafio exige caixa de " + fm(min) + " dos dois jogadores.");
      return;
    }
    var pools = Object.keys(TRAINING_QUESTIONS).map(function (k) {
      return TRAINING_QUESTIONS[k];
    }).reduce(function (a, b) {
      return a.concat(b);
    }, []);
    var q = pools[Math.floor(Math.random() * pools.length)];
    gameState.challengeTurn = turnKey();
    D = {
      a: cur().id,
      b: oppId,
      q: q,
      ans: {},
      step: "a"
    };
    say("challenge", {
      player: cur().name,
      owner: byId(oppId).name
    });
    renderChallenge();
  }
  function renderChallenge() {
    var p = byId(D[D.step]);
    _showModal("Desafio: vez de " + p.name, "\n        <div style=\"text-align:center;\">" + duelSVG() + "\n            <p style=\"color:" + p.color + "; font-weight:800;\">" + p.icon + " " + p.name + " responde" + (D.step === "a" ? " primeiro (o outro não espia!)" : "") + "</p>\n            <div style=\"background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 0.5rem; margin: 0.8rem 0;\"><p>" + D.q.question + "</p></div>\n        </div>", D.q.options.map(function (o, i) {
      return {
        text: o,
        onClick: "answerChallenge(" + i + ")",
        class: "btn-secondary"
      };
    }), false);
  }
  function _answerChallenge(i) {
    if (!D) return;
    D.ans[D.step] = D.q.options[i] === D.q.correct;
    if (D.step === "a") {
      D.step = "b";
      renderChallenge();
      return;
    }
    var a = byId(D.a),
      b = byId(D.b),
      ra = D.ans.a,
      rb = D.ans.b;
    var q = D.q;
    D = null;
    _closeModal();
    var msg,
      ok = true;
    if (ra && !rb) {
      ok = handleMandatoryPayment(b, REGRAS.DESAFIO_APOSTA, "Desafio de quiz", a);
      msg = a.name + " acertou e " + b.name + " errou: " + b.name + " paga " + fm(REGRAS.DESAFIO_APOSTA) + ".";
      _award(a, "duelista");
    } else if (!ra && rb) {
      ok = handleMandatoryPayment(a, REGRAS.DESAFIO_APOSTA, "Desafio de quiz", b);
      msg = b.name + " acertou e " + a.name + " errou: " + a.name + " paga " + fm(REGRAS.DESAFIO_APOSTA) + ".";
      _award(b, "duelista");
    } else if (ra && rb) msg = "Os dois acertaram: empate, ninguém paga.";else {
      ok = handleMandatoryPayment(a, REGRAS.DESAFIO_MULTA_ERRO_DUPLO, "Desafio de quiz (erro duplo)");
      if (ok) ok = handleMandatoryPayment(b, REGRAS.DESAFIO_MULTA_ERRO_DUPLO, "Desafio de quiz (erro duplo)");
      msg = "Os dois erraram: cada um paga " + fm(REGRAS.DESAFIO_MULTA_ERRO_DUPLO) + " ao Banco.";
    }
    gameState.lastChallenge = {
      a: ra,
      b: rb,
      msg: msg
    };
    if (!ok || gameState.phase === "ended") return;
    _showModal("Resultado do desafio", "<div style=\"text-align:center;\">" + duelSVG() + "<p style=\"font-size:1.1rem;\">" + msg + "</p><p style=\"color:#94a3b8; font-size:0.85rem;\">Resposta certa: " + q.correct + "</p></div>", [{
      text: "Continuar",
      onClick: "closeModal()",
      class: "btn-primary"
    }], false);
  }
  var _BADGES = {
    primeira_manobra: "Primeira manobra",
    frota5: "Frota de 5",
    salvamento_epico: "Salvamento épico",
    formado: "Formado Tuglords",
    arrematador: "Arrematador",
    duelista: "Duelista"
  };
  var lastBadgeSound = 0;
  function _award(player, id) {
    if (!player || !_BADGES[id]) return;
    if (!player.badges) player.badges = [];
    if (player.badges.indexOf(id) >= 0) return;
    player.badges.push(id);
    var el = document.createElement("div");
    el.className = "tl-badge-toast";
    el.style.cssText = "position:fixed; left:50%; bottom:12%; transform:translateX(-50%); z-index:9999; background:#0f172a; border:2px solid " + BADGE_COLORS[id] + "; color:#fff; padding:0.6rem 1.2rem; border-radius:1rem; font-weight:800; font-size:1.1rem; display:flex; gap:0.6rem; align-items:center; box-shadow:0 8px 24px rgba(0,0,0,.5);" + (coinsLight() ? "" : "transition:opacity .4s;");
    el.innerHTML = _medalSVG(BADGE_COLORS[id], 40) + ("<span>Conquista! " + player.name + ": " + _BADGES[id] + "</span>");
    document.body.appendChild(el);
    setTimeout(function () {
      el.style.opacity = "0";
    }, 2600);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 3100);
    if (!coinsLight()) FX.confetti(900);
    var now = Date.now();
    if (now - lastBadgeSound > 4e3) {
      lastBadgeSound = now;
      Audio.playSuccess();
    }
    say("badge", {
      player: player.name,
      valor: _BADGES[id]
    });
  }
  function _badgesHTML(p) {
    return (p.badges || []).map(function (id) {
      return "<span title=\"" + _BADGES[id] + "\">" + _medalSVG(BADGE_COLORS[id], 16) + "</span>";
    }).join("");
  }
  function _onCredit(player, amount, label) {
    var l = (label || "").toLowerCase();
    if (l.indexOf("manobra") >= 0) _award(player, "primeira_manobra");
    if ((l.indexOf("salvatagem") >= 0 || l.indexOf("reboque") >= 0) && amount >= REGRAS.CONQUISTA_SALVAMENTO_EPICO) _award(player, "salvamento_epico");
    if (amount >= REGRAS.NARRADOR_PAGAMENTO_GRANDE) say("bigpay", {
      player: player.name,
      valor: fm(amount)
    });
  }

  // src/js/modules/logic.js
  function commentate(event, ctx) {
    _showCommentary(pickComment(event, ctx));
  }
  var TIMING = {
    diceFrame: 130,
    // intervalo entre quadros da rolagem dos dados (ms)
    diceFrames: 16,
    // quantos quadros a rolagem dura antes de parar
    diceSettle: 1200,
    // pausa para o jogador ver o resultado antes de mover
    moveStep: 1e3,
    // intervalo entre cada casa percorrida pelo peão (ms)
    arrivalPopup: 1300
    // pausa após chegar à casa antes de abrir o popup (ms)
  };
  function isProperty(house) {
    return !!house && (house.type === "port" || house.type === "property") && !!house.price;
  }
  function operationalTugs(player) {
    var port = player.portTugs - player.dockedTugs.port;
    var ocean = player.hasOceanTug && !player.dockedTugs.ocean;
    var tuglord = player.hasTuglord && !player.dockedTugs.tuglord;
    return {
      port: port,
      ocean: ocean,
      tuglord: tuglord,
      total: port + (ocean ? 1 : 0) + (tuglord ? 1 : 0)
    };
  }
  function addPlayer() {
    var playerNum = gameState.players.length + 1;
    if (playerNum > 6) {
      _showNotification("Máximo de 6 jogadores!");
      return;
    }
    var player = {
      id: playerNum,
      name: "Jogador " + playerNum,
      icon: playerIcons[playerNum - 1],
      color: playerColors[playerNum - 1],
      money: REGRAS.DINHEIRO_INICIAL,
      // F$ 30 mi inicial
      position: 0,
      properties: [],
      rolled: false,
      rollValue: 0,
      portTugs: 0,
      hasOceanTug: false,
      hasTuglord: false,
      dockedTugs: {
        port: 0,
        ocean: false,
        tuglord: false,
        turnsRemaining: 0,
        inYard: false,
        retest: false
      },
      workshopVisits: {},
      workshopBonusPaid: {},
      tugCoupon: false,
      unisalvageStep: 0,
      // etapas da UNISALVAGE aprovadas (0 a REGRAS.UNISALVAGE_ETAPAS)
      certTuglords: false,
      // Certificado Tuglords (libera Oceânico e Reboque Oceânico)
      certificates: [],
      loans: [],
      stocks: {},
      bankruptcyStage: 0,
      isEliminated: false,
      skipNextTurn: false,
      skipNextRent: false
    };
    gameState.players.push(player);
    _renderPlayerSetupList();
    if (gameState.players.length >= 2) {
      var btn = document.getElementById("startOrderBtn");
      if (btn) btn.disabled = false;
    }
  }
  function updatePlayerName(playerId, newName) {
    var player = gameState.players.find(function (p) {
      return p.id === playerId;
    });
    if (player) {
      player.name = newName || "Jogador " + playerId;
    }
  }
  function removePlayer(playerId) {
    gameState.players = gameState.players.filter(function (p) {
      return p.id !== playerId;
    });
    _renderPlayerSetupList();
    if (gameState.players.length < 2) {
      var btn = document.getElementById("startOrderBtn");
      if (btn) btn.disabled = true;
    }
  }
  function startOrderRolls() {
    var currentPlayerIndex = 0;
    var rollInterval = setInterval(function () {
      if (currentPlayerIndex >= gameState.players.length) {
        clearInterval(rollInterval);
        determineOrder();
        return;
      }
      var player = gameState.players[currentPlayerIndex];
      var rollValue = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
      player.rolled = true;
      player.rollValue = rollValue;
      var rollElement = document.getElementById("roll-" + player.id);
      if (rollElement) {
        var animCount = 0;
        var animInterval = setInterval(function () {
          var rand = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
          rollElement.textContent = "\uD83C\uDFB2 " + rand;
          Audio.playDice();
          animCount++;
          if (animCount > 10) {
            clearInterval(animInterval);
            rollElement.textContent = "\uD83C\uDFB2 " + rollValue;
            rollElement.style.animation = "pulse 0.5s";
            Audio.playMoney();
          }
        }, 100);
      }
      currentPlayerIndex++;
    }, 1500);
  }
  function determineOrder() {
    gameState.playerOrder = [].concat(gameState.players).sort(function (a, b) {
      return b.rollValue - a.rollValue;
    });
    var orderList = document.getElementById("orderList");
    if (orderList) {
      orderList.innerHTML = gameState.playerOrder.map(function (player, index) {
        return "\n            <div class=\"order-item\" style=\"border-left: 4px solid " + player.color + ";\">\n                <span style=\"font-size: 1.5rem; width: 40px;\">" + (index + 1) + "\xBA</span>\n                <span style=\"font-size: 1.5rem;\">" + player.icon + "</span>\n                <span style=\"flex: 1; font-weight: 600;\">" + player.name + "</span>\n                <span style=\"font-weight: 700; color: var(--accent-gold);\">\uD83C\uDFB2 " + player.rollValue + "</span>\n            </div>\n        ";
      }).join("");
    }
    var orderResults = document.getElementById("orderResults");
    var setupActions = document.querySelector(".setup-actions");
    if (orderResults) orderResults.style.display = "block";
    if (setupActions) setupActions.style.display = "none";
  }
  function startGame() {
    gameState.players = gameState.playerOrder;
    gameState.phase = "playing";
    gameState.houses.forEach(function (h) {
      h.owner = void 0;
      if (h.stocks) h.stocks = 0;
      if (h.type === "tug_purchase") h.price = h.tugType === "ocean" ? REGRAS.PRECO_OCEANICO : REGRAS.PRECO_PORTUARIO;
      if (h.rent) {
        if (!h.baseRent) h.baseRent = h.rent.slice();
        h.rent = h.baseRent.map(function (v) {
          return Math.round(v * REGRAS.ALUGUEL_MULT);
        });
      }
    });
    gameState.currentRound = 1;
    gameState.currentPlayerIndex = 0;
    var setupScreen = document.getElementById("setupScreen");
    var gameScreen = document.getElementById("gameScreen");
    if (setupScreen) setupScreen.style.display = "none";
    if (gameScreen) gameScreen.style.display = "block";
    _renderBoard();
    _renderPlayersPanel();
    _updateTurnDisplay();
    _showNotification(gameState.players[0].icon + " " + gameState.players[0].name + " come\xE7a!");
    Audio.playSuccess();
    Audio.startMusic();
    commentate("start");
  }
  function rollDice() {
    if (gameState.diceRolled) return;
    var diceDisplay = document.getElementById("diceDisplay");
    _enterCinematic(true);
    _renderDice3D(diceDisplay, 1, 1, true);
    FX.haptic(15);
    var frames = 0;
    var interval = setInterval(function () {
      Audio.playDice();
      frames++;
      if (frames > TIMING.diceFrames) {
        clearInterval(interval);
        var final1 = Math.floor(Math.random() * 6) + 1;
        var final2 = Math.floor(Math.random() * 6) + 1;
        var total = final1 + final2;
        var isDouble = final1 === final2;
        _settleDice3D(diceDisplay, final1, final2, total, isDouble);
        FX.haptic(isDouble ? [40, 40, 40] : 35);
        var roller = gameState.players[gameState.currentPlayerIndex];
        commentate(isDouble ? "double" : "roll", {
          player: roller.name
        });
        console.log("\uD83C\uDFB2 Dados: " + final1 + " + " + final2 + " = " + total);
        gameState.diceRolled = true;
        var btn = document.getElementById("rollDiceBtn");
        if (btn) {
          btn.disabled = true;
          btn.style.opacity = "0.5";
        }
        setTimeout(function () {
          return movePlayer(total);
        }, TIMING.diceSettle);
      }
    }, TIMING.diceFrame);
  }
  function movePlayer(spaces) {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.isEliminated) return;
    if (!spaces) return;
    var len = gameState.houses.length;
    var direction = spaces >= 0 ? 1 : -1;
    var totalSteps = Math.abs(spaces);
    var startPosition = currentPlayer.position;
    var currentStep = 0;
    var rollBtn = document.getElementById("rollDiceBtn");
    var endBtn = document.getElementById("endTurnBtn");
    if (rollBtn) rollBtn.disabled = true;
    if (endBtn) endBtn.disabled = true;
    var cine = _enterCinematic();
    var ORBIT_MS = 1400;
    var beginStepping = function beginStepping() {
      var moveInterval = setInterval(stepTick, TIMING.moveStep);
      function stepTick() {
        if (currentStep >= totalSteps) {
          clearInterval(moveInterval);
          var finalPosition = currentPlayer.position;
          var house = gameState.houses[finalPosition];
          var currentHouseName2 = document.getElementById("currentHouseName");
          if (currentHouseName2) currentHouseName2.textContent = house.name;
          _highlightLanding(finalPosition);
          FX.haptic(30);
          _showNotification(currentPlayer.icon + " chegou em " + house.name + "!");
          if (direction === 1 && finalPosition === 0 && totalSteps > 0) payOceanFreight(currentPlayer);
          if (cine) setTimeout(function () {
            return _exitCinematic();
          }, 750);
          if (endBtn) endBtn.disabled = false;
          setTimeout(function () {
            return showContextualActions(house);
          }, TIMING.arrivalPopup);
          return;
        }
        currentStep++;
        currentPlayer.position = ((startPosition + direction * currentStep) % len + len) % len;
        Audio.playMove();
        FX.haptic(8);
        var stepHouse = gameState.houses[currentPlayer.position];
        if (direction === 1 && currentPlayer.position === 0 && currentStep < totalSteps) {
          credit(currentPlayer, REGRAS.SALARIO_PARTIDA, "Salário");
          FX.flash("rgba(34,197,94,0.25)", 300);
          _showNotification("\uD83C\uDFC1 " + currentPlayer.name + " passou pela Partida! +" + fm(REGRAS.SALARIO_PARTIDA));
          chargeShipyardLapFee(currentPlayer);
          payOceanFreight(currentPlayer);
          commentate("pass", {
            player: currentPlayer.name
          });
          _renderPlayersPanel();
        }
        _updatePlayerPositions();
        if (cine) {
          _cameraFollow(currentPlayer.position);
          _hopActivePawn();
        }
        var currentHouseName = document.getElementById("currentHouseName");
        if (currentHouseName) currentHouseName.textContent = "\u2192 " + stepHouse.name;
      }
      setTimeout(function () {
        _renderPlayersPanel();
      }, totalSteps * TIMING.moveStep + 500);
    };
    if (cine) {
      _cameraOrbit(startPosition);
      setTimeout(function () {
        _endOrbit();
        _cameraFollow(startPosition);
        beginStepping();
      }, ORBIT_MS);
    } else {
      beginStepping();
    }
  }
  function showLoanOptions() {
    if (!REGRAS.EMPRESTIMO_ATIVO) {
      _showNotification("🚫 Empréstimos desativados nesta versão");
      return;
    }
    _openPanel("panelBank");
    _showNotification("💳 Escolha o valor do empréstimo");
  }
  function advanceToNextActivePlayer() {
    var total = gameState.players.length;
    var guard = 0;
    do {
      gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % total;
      if (gameState.currentPlayerIndex === 0) gameState.currentRound++;
      guard++;
    } while (gameState.players[gameState.currentPlayerIndex].isEliminated && guard <= total);
  }
  function endTurn() {
    if (!gameState.diceRolled) {
      _showNotification("⚠️ Role os dados primeiro!");
      return;
    }
    if (checkVictory()) return;
    var actionsDiv = document.getElementById("contextualActions");
    if (actionsDiv) actionsDiv.style.display = "none";
    advanceToNextActivePlayer();
    if (checkRoundLimit()) return;
    _onRoundStart();
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    processLoans(currentPlayer);
    if (gameState.phase === "ended") return;
    var guard = 0;
    while (currentPlayer.isEliminated && guard < gameState.players.length) {
      advanceToNextActivePlayer();
      currentPlayer = gameState.players[gameState.currentPlayerIndex];
      processLoans(currentPlayer);
      if (gameState.phase === "ended") return;
      guard++;
    }
    if (currentPlayer.skipNextTurn) {
      currentPlayer.skipNextTurn = false;
      _updateTurnDisplay();
      _updatePlayerPositions();
      _renderPlayersPanel();
      gameState.diceRolled = true;
      var rollBtn = document.getElementById("rollDiceBtn");
      if (rollBtn) {
        rollBtn.disabled = true;
        rollBtn.style.opacity = "0.5";
      }
      _showNotification("\u23F8\uFE0F " + currentPlayer.name + " perdeu o turno! Clique em Finalizar Turno.");
      return;
    }
    if (currentPlayer.properties.length > 0 && !currentPlayer.isEliminated) {
      payDividends(currentPlayer);
    }
    checkDockingStatus();
    _updateTurnDisplay();
    _updatePlayerPositions();
    _renderPlayersPanel();
  }
  function checkDockingStatus() {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    var d = currentPlayer.dockedTugs;
    if (d.turnsRemaining > 0) {
      d.turnsRemaining--;
      if (d.turnsRemaining === 0) {
        if (d.inYard) {
          _showNotification("\uD83C\uDFD7\uFE0F " + currentPlayer.name + ": rebocador segue no dique do Estaleiro");
        } else if (d.retest) {
          setTimeout(function () {
            return presentInspection("retest");
          }, 600);
        } else {
          releaseDockedTugs(currentPlayer);
          _showNotification("\u2705 " + currentPlayer.name + ": Rebocadores liberados!");
        }
      } else {
        _showNotification("\u2693 " + currentPlayer.name + ": rebocador preso (" + d.turnsRemaining + " turnos)");
      }
    } else if (d.inYard) {
      _showNotification("\uD83C\uDFD7\uFE0F " + currentPlayer.name + ": rebocador no dique (sai ao cair num porto seu)");
    }
  }
  function credit(player, amount, label) {
    if (!player || !amount) return;
    amount = Math.round(amount * _payoutMult(label));
    player.money += amount;
    _onCredit(player, amount, label);
    FX.coins(amount, (label ? label + " " : "") + "+" + fm(amount));
    Audio.playCoin();
    _renderPlayersPanel();
  }
  function payOceanFreight(player) {
    var v = REGRAS.OCEANICO_FRETE_LARGADA;
    if (!v || !player || !player.hasOceanTug) return;
    credit(player, v, "Frete");
    setTimeout(function () {
      return _showNotification("\uD83C\uDF0A Frete do Rebocador Oce\xE2nico: " + player.name + " recebeu " + fm(Math.round(v * _payoutMult("Frete"))));
    }, 700);
  }
  function hasSafetyCerts(player) {
    return CERTIFICATES.every(function (c) {
      return player.certificates.includes(c);
    });
  }
  function dockedCount(player) {
    var d = player.dockedTugs;
    return (d.port || 0) + (d.ocean ? 1 : 0) + (d.tuglord ? 1 : 0);
  }
  function releaseDockedTugs(player) {
    var d = player.dockedTugs;
    d.port = 0;
    d.ocean = false;
    d.tuglord = false;
    d.turnsRemaining = 0;
    d.inYard = false;
    d.retest = false;
    _renderPlayersPanel();
  }
  function shipyardOwner(player) {
    var yard = gameState.houses.find(function (h) {
      return h.name.includes("Estaleiro");
    });
    var owner = yard && yard.owner !== void 0 ? gameState.players.find(function (p) {
      return p.id === yard.owner;
    }) : null;
    return owner && owner.id !== player.id ? owner : null;
  }
  function chargeShipyardLapFee(player) {
    if (!player.dockedTugs.inYard) return;
    var n = dockedCount(player);
    if (n <= 0) return;
    var fee = REGRAS.ESTALEIRO_ESTADIA_VOLTA * n;
    var owner = shipyardOwner(player);
    var isOwnYard = !owner && gameState.houses.some(function (h) {
      return h.name.includes("Estaleiro") && h.owner === player.id;
    });
    if (isOwnYard) return;
    if (!owner) fee = bankCap(player, fee);
    player.money -= fee;
    if (owner) {
      owner.money += fee;
      FX.coins(fee, owner.name + " +" + fm(fee));
    }
    setTimeout(function () {
      return _showNotification("\uD83C\uDFD7\uFE0F Estadia no dique: " + player.name + " pagou " + fm(fee) + " (" + n + " rebocador" + (n > 1 ? "es" : "") + ")");
    }, 900);
    _renderPlayersPanel();
  }
  function safetyCount(player) {
    return CERTIFICATES.filter(function (c) {
      return player.certificates.includes(c);
    }).length;
  }
  function canManeuver(player) {
    return !REGRAS.MANOBRA_EXIGE_CERTIFICADOS || safetyCount(player) >= REGRAS.MANOBRA_CERTS_SEGURANCA;
  }
  function canHaveOcean(player) {
    return REGRAS.OCEANICO_EXIGE_CERT_TUGLORDS ? !!player.certTuglords : hasSafetyCerts(player);
  }
  function canOceanSalvage(player) {
    return operationalTugs(player).ocean && !!player.certTuglords;
  }
  var NO_CERT_MANEUVER = REGRAS.MANOBRA_CERTS_SEGURANCA === 1 ? "Sem certificado de segurança, sem manobra." : "Sem os " + REGRAS.MANOBRA_CERTS_SEGURANCA + " certificados de segurança, sem manobra.";
  function maneuverPayout(player) {
    if (!canManeuver(player)) return 0;
    var n = Math.min(Math.max(0, operationalTugs(player).port), REGRAS.MANOBRA_MAX_PORTUARIOS);
    return Math.round(REGRAS.MANOBRA_BASE * n * _eventMult("manobraMult"));
  }
  function salvagePrize() {
    var p = REGRAS.SALVATAGEM_PREMIOS;
    return Math.round(p[Math.floor(Math.random() * p.length)] * _eventMult("salvamentoMult"));
  }
  function giveOceanTug(player) {
    if (player.hasOceanTug || !canHaveOcean(player)) {
      var why = player.hasOceanTug ? "já tem Oceânico" : "sem o Certificado Tuglords";
      _showNotification("\uD83C\uDF0A " + player.name + " " + why + ": recebeu " + fm(CARD_TUG_CASH.ocean_tug));
      credit(player, CARD_TUG_CASH.ocean_tug, "Oceânico em dinheiro");
      return false;
    }
    player.hasOceanTug = true;
    return true;
  }
  var UNISALVAGE_STEP_LABEL = ["Quiz de acesso", "Quiz de formação 1", "Quiz de formação 2"];
  function presentUnisalvage() {
    var player = gameState.players[gameState.currentPlayerIndex];
    var total = REGRAS.UNISALVAGE_ETAPAS;
    var step = Math.min(player.unisalvageStep || 0, total - 1);
    var pool = UNISALVAGE_QUESTIONS[Math.min(step, UNISALVAGE_QUESTIONS.length - 1)];
    var q = pool[Math.floor(Math.random() * pool.length)];
    var fee = REGRAS.UNISALVAGE_TAXA_PROVA;
    if (fee > 0 && !handleMandatoryPayment(player, fee, "Taxa de prova UNISALVAGE")) return;
    gameState._unisalvage = {
      correct: q.correct,
      options: [].concat(q.options).sort(function () {
        return Math.random() - 0.5;
      })
    };
    var dots = Array.from({
      length: total
    }, function (_, i) {
      return "<span style=\"display:inline-block; width:1.4rem; height:1.4rem; line-height:1.4rem; border-radius:50%; margin:0 0.2rem; font-weight:800; background:" + (i < step ? "#22c55e" : i === step ? "#fbbf24" : "rgba(255,255,255,0.1)") + "; color:#0f172a;\">" + (i + 1) + "</span>";
    }).join("");
    var body = "\n        <p style=\"color:#94a3b8;\">Escola de salvatagem: passe nas " + total + " etapas (uma por visita) para ganhar o <strong style=\"color: var(--accent-gold);\">Certificado Tuglords</strong>.</p>\n        <div style=\"text-align:center; margin:0.5rem 0;\">" + dots + "</div>\n        <p style=\"font-weight:700; color:#fbbf24;\">Etapa " + (step + 1) + " de " + total + ": " + (UNISALVAGE_STEP_LABEL[step] || "Quiz") + "</p>\n        <p style=\"color:#94a3b8; font-size:0.85rem;\">Taxa da prova paga: " + fm(fee) + "</p>\n        <div style=\"background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;\"><p>" + q.question + "</p></div>\n        <div style=\"display:grid; gap:0.5rem;\">\n            " + gameState._unisalvage.options.map(function (opt, i) {
      return "<button class=\"btn-secondary\" onclick=\"handleUnisalvageAnswer(" + i + ")\">" + opt + "</button>";
    }).join("") + "\n        </div>";
    _showModal("🛟 UNISALVAGE", body, [], false);
  }
  function showGraduation(player, ganhouOceanico) {
    FX.confetti(3e3);
    Audio.playCertificate();
    commentate("win", {
      player: player.name
    });
    _showModal("🎓 Formatura UNISALVAGE", "\n        <div style=\"text-align:center;\">\n            <div class=\"fx-trophy\" style=\"font-size:4rem;\">\uD83C\uDF93</div>\n            <h2 style=\"color: var(--accent-gold); margin:0.25rem 0;\">" + player.icon + " " + player.name + "</h2>\n            <p style=\"font-size:1.15rem; font-weight:800; color:#fbbf24;\">CERTIFICADO TUGLORDS</p>\n            " + (ganhouOceanico ? "<div class=\"fx-trophy\" style=\"font-size:3rem; margin-top:0.5rem;\">\uD83C\uDF0A\uD83D\uDEA2</div><p style=\"font-size:1.1rem; font-weight:800; color:#38bdf8;\">Presente da formatura: um Rebocador Oce\xE2nico gr\xE1tis!</p>" : "") + "\n            <p style=\"color:#94a3b8;\">Autorizado para Rebocadores Oce\xE2nicos. Agora o Reboque Oce\xE2nico paga de " + fm(Math.min.apply(null, REGRAS.SALVATAGEM_PREMIOS)) + " a " + fm(Math.max.apply(null, REGRAS.SALVATAGEM_PREMIOS)) + "!</p>\n            <button class=\"btn-primary\" style=\"width:100%; margin-top:1rem;\" onclick=\"closeModal()\">\u2693 Partiu oceano!</button>\n        </div>", [], false);
    _showNotification("\uD83D\uDEDF " + player.name + " conquistou o Certificado Tuglords!");
  }
  function handleUnisalvageAnswer(i) {
    var u = gameState._unisalvage;
    if (!u) return;
    gameState._unisalvage = null;
    _closeModal();
    var player = gameState.players[gameState.currentPlayerIndex];
    var total = REGRAS.UNISALVAGE_ETAPAS;
    if (u.options[i] === u.correct) {
      player.unisalvageStep = (player.unisalvageStep || 0) + 1;
      if (player.unisalvageStep >= total) {
        player.unisalvageStep = total;
        player.certTuglords = true;
        var ganhouOceanico = false;
        if (REGRAS.OCEANICO_NA_FORMATURA && !player.hasOceanTug) {
          player.hasOceanTug = true;
          ganhouOceanico = true;
        }
        showGraduation(player, ganhouOceanico);
        _award(player, "formado");
      } else {
        Audio.playSuccess();
        _showNotification("\u2705 UNISALVAGE: etapa " + player.unisalvageStep + "/" + total + " aprovada! Volte para a pr\xF3xima.");
      }
    } else {
      Audio.playError();
      _showNotification("\u274C UNISALVAGE: reprovado. Refa\xE7a a etapa " + ((player.unisalvageStep || 0) + 1) + " na pr\xF3xima visita. Resposta: " + u.correct);
    }
    _renderPlayersPanel();
  }
  function presentInspection(mode) {
    var q = INSPECTION_QUESTIONS[Math.floor(Math.random() * INSPECTION_QUESTIONS.length)];
    gameState._inspection = {
      mode: mode,
      correct: q.correct,
      options: [].concat(q.options).sort(function () {
        return Math.random() - 0.5;
      })
    };
    var intro = mode === "square" ? "O classificador LOYDS TUGSTER vai vistoriar seu rebocador." : mode === "yard" ? "Saída do Estaleiro: vistoria de classe obrigatória antes de voltar ao porto." : "Fim dos 3 turnos: o rebocador refaz a vistoria LOYDS TUGSTER.";
    var body = "\n        <p style=\"color:#94a3b8;\">" + intro + "</p>\n        <div style=\"background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;\">\n            <p>" + q.question + "</p>\n        </div>\n        <div style=\"display:grid; gap:0.5rem;\">\n            " + gameState._inspection.options.map(function (opt, i) {
      return "<button class=\"btn-secondary\" onclick=\"handleInspectionAnswer(" + i + ")\">" + opt + "</button>";
    }).join("") + "\n        </div>";
    _showModal("📋 Vistoria LOYDS TUGSTER", body, [], false);
  }
  function handleInspectionAnswer(i) {
    var insp = gameState._inspection;
    if (!insp) return;
    gameState._inspection = null;
    _closeModal();
    var player = gameState.players[gameState.currentPlayerIndex];
    var d = player.dockedTugs;
    var ok = insp.options[i] === insp.correct;
    var turns = REGRAS.VISTORIA_TURNOS_PRESO;
    if (insp.mode === "square") {
      if (ok) {
        _showNotification("\u2705 Vistoria aprovada! Rebocador em classe.");
        credit(player, REGRAS.VISTORIA_PREMIO, "Vistoria");
      } else {
        var op = operationalTugs(player);
        if (op.port > 0) d.port++;else if (op.ocean) d.ocean = true;else if (op.tuglord) d.tuglord = true;
        if (!d.inYard) d.turnsRemaining = turns;
        Audio.playError();
        _showNotification("\u274C Reprovado! Rebocador preso por " + turns + " turnos. Resposta: " + insp.correct);
      }
    } else {
      if (ok) {
        var port = gameState.houses[player.position];
        releaseDockedTugs(player);
        _showNotification("\u2705 Vistoria aprovada! Rebocador liberado" + (port && port.type === "port" ? " para o " + port.name : "") + ".");
        Audio.playSuccess();
      } else {
        d.inYard = false;
        d.retest = true;
        d.turnsRemaining = turns;
        Audio.playError();
        _showNotification("\u274C Reprovado! Preso " + turns + " turnos e depois refaz a vistoria. Resposta: " + insp.correct);
      }
    }
    _renderPlayersPanel();
  }
  function handleShipyard(space) {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    var owner = space.owner !== void 0 ? gameState.players.find(function (p) {
      return p.id === space.owner;
    }) : null;
    var op = operationalTugs(currentPlayer);
    if (op.total <= 0) return;
    var ownYard = owner && owner.id === currentPlayer.id;
    var dockingCost = ownYard ? 0 : REGRAS.ESTALEIRO_TAXA;
    var tugOptions = [];
    if (op.port > 0) tugOptions.push({
      label: "\u2693 Portu\xE1rio (" + op.port + ")",
      value: "port"
    });
    if (op.ocean) tugOptions.push({
      label: "\uD83C\uDF0A Oce\xE2nico",
      value: "ocean"
    });
    if (op.tuglord) tugOptions.push({
      label: "\u2B50 TugLord",
      value: "tuglord"
    });
    var modalBody = "\n        <div style=\"background: rgba(239, 68, 68, 0.1); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; border-left: 4px solid #ef4444;\">\n            <p style=\"color: #f87171; font-weight: 600; margin: 0;\">\u26A0\uFE0F DOCAGEM NO ESTALEIRO</p>\n        </div>\n        <p style=\"color: #e0e0e0;\">Taxa: " + fm(dockingCost) + " (" + (ownYard ? "dique próprio" : owner ? owner.name : "Banco") + ")</p>\n        <p style=\"color: #94a3b8; font-size: 0.9rem;\">O rebocador fica no dique e paga " + fm(REGRAS.ESTALEIRO_ESTADIA_VOLTA) + " por volta. S\xF3 sai quando voc\xEA cair num porto seu, depois da vistoria LOYDS TUGSTER.</p>\n        <div style=\"display: grid; gap: 0.75rem; margin-top: 1rem;\">\n            " + tugOptions.map(function (tug) {
      return "\n                <button class=\"btn-secondary\" onclick=\"executeDocking('" + tug.value + "', " + dockingCost + ", " + (owner && !ownYard ? owner.id : "null") + ")\">\n                    " + tug.label + "\n                </button>\n            ";
    }).join("") + "\n        </div>\n    ";
    _showModal("🏭 Estaleiro", modalBody, [], false);
  }
  function executeDocking(tugType, cost, ownerId) {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    var owner = ownerId ? gameState.players.find(function (p) {
      return p.id === ownerId;
    }) : null;
    if (cost > 0 && !handleMandatoryPayment(currentPlayer, cost, "Docagem", owner)) {
      _closeModal();
      return;
    }
    var d = currentPlayer.dockedTugs;
    if (tugType === "port") d.port = (d.port || 0) + 1;else if (tugType === "ocean") d.ocean = true;else if (tugType === "tuglord") d.tuglord = true;
    d.inYard = true;
    d.retest = false;
    d.turnsRemaining = 0;
    _showNotification("\uD83C\uDFD7\uFE0F Rebocador no dique! Sai ao cair num porto seu.");
    _renderPlayersPanel();
    _closeModal();
  }
  function buyProperty(space) {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.money < space.price) {
      _showNotification("❌ Saldo insuficiente!");
      Audio.playError();
      return;
    }
    currentPlayer.money -= space.price;
    space.owner = currentPlayer.id;
    currentPlayer.properties.push(space.name);
    _showNotification("\u2705 " + space.name + " adquirido!");
    Audio.playBuy();
    commentate("buy", {
      player: currentPlayer.name,
      porto: space.name
    });
    Audio.playSuccess();
    FX.flash("rgba(34,197,94,0.22)", 300);
    FX.haptic([25, 30]);
    _renderPlayersPanel();
    _updatePlayerPositions();
    if (space.type === "workshop" && space.certificate && !currentPlayer.certificates.includes(space.certificate)) {
      presentExam(space.certificate, space.name, true);
      return;
    }
    _closeModal();
    var actionsDiv = document.getElementById("contextualActions");
    if (actionsDiv) actionsDiv.style.display = "none";
  }
  function buyTug(space) {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    var tugType = space.tugType;
    var price = space.price;
    var needed = tugType === "port" && currentPlayer.tugCoupon ? Math.round(price * (1 - REGRAS.CUPOM_DESCONTO)) : price;
    if (currentPlayer.money < needed) {
      _showNotification("❌ Saldo insuficiente!");
      return;
    }
    if (tugType === "ocean") {
      if (currentPlayer.hasOceanTug) {
        _showNotification("⚠️ Já possui Rebocador Oceânico!");
        return;
      }
      if (!canHaveOcean(currentPlayer)) {
        _showNotification("⚠️ Requer o Certificado Tuglords (passe 3x na UNISALVAGE)!");
        return;
      }
    }
    var finalPrice = price;
    if (tugType === "port" && currentPlayer.tugCoupon) {
      finalPrice = Math.round(price * (1 - REGRAS.CUPOM_DESCONTO));
      currentPlayer.tugCoupon = false;
      _showNotification("\uD83C\uDF9F\uFE0F Cupom aplicado: " + fm(finalPrice));
    }
    currentPlayer.money -= finalPrice;
    if (tugType === "port") currentPlayer.portTugs++;else if (tugType === "ocean") currentPlayer.hasOceanTug = true;
    _showNotification("\u2693 Rebocador adquirido!");
    _renderPlayersPanel();
    var actionsDiv = document.getElementById("contextualActions");
    if (actionsDiv) actionsDiv.style.display = "none";
  }
  function bankCap(player, amount) {
    var pct = REGRAS.TETO_PAGTO_BANCO_PCT_CAIXA;
    if (!pct) return amount;
    return Math.min(amount, Math.max(0, Math.floor(player.money * pct)));
  }
  function handleMandatoryPayment(player, amount, reason, recipient) {
    if (recipient === void 0) {
      recipient = null;
    }
    if (!recipient && /imposto|taxa/i.test(reason || "")) amount = Math.round(amount * _eventMult("taxaMult"));
    if (!recipient && !/empr[ée]stimo|desafio/i.test(reason || "")) {
      var capped = bankCap(player, amount);
      if (capped < amount) {
        var msgTeto = "\uD83D\uDEE1\uFE0F Teto do Banco: " + player.name + " paga no m\xE1ximo " + Math.round(REGRAS.TETO_PAGTO_BANCO_PCT_CAIXA * 100) + "% do caixa (" + fm(capped) + " em vez de " + fm(amount) + ")";
        setTimeout(function () {
          return _showNotification(msgTeto);
        }, 1200);
      }
      amount = capped;
    }
    if (player.money >= amount) {
      player.money -= amount;
      if (recipient) recipient.money += amount;
      if (recipient) FX.coins(amount, recipient.name + " +" + fm(amount));
      _showNotification("\uD83D\uDCB8 " + player.name + " pagou " + fm(amount) + " (" + reason + ")");
      Audio.playCoin();
      var r = (reason || "").toLowerCase();
      if (r.includes("aluguel")) commentate("rent", {
        player: player.name,
        owner: recipient ? recipient.name : "o dono"
      });else if (r.includes("imposto") || r.includes("taxa")) commentate("tax", {
        player: player.name
      });else if (r.includes("docagem")) commentate("dock", {
        player: player.name
      });
      var heavy = amount >= 2e3 || amount >= player.money * 0.25;
      if (heavy) {
        FX.shake();
        FX.flash("rgba(239,68,68,0.28)", 350);
        FX.haptic([30, 40, 30]);
      } else {
        FX.haptic(20);
      }
      if (player.money < 3e3) commentate("lowcash", {
        player: player.name
      });
      _renderPlayersPanel();
      return true;
    } else {
      initiateArrest(player, amount, reason, recipient);
      return false;
    }
  }
  function liqValue(type, prop) {
    var t = REGRAS.LIQUIDACAO_TAXA;
    if (type === "property") return Math.floor(prop.price * t);
    if (type === "port_tug") return Math.floor(REGRAS.PRECO_PORTUARIO * t);
    if (type === "ocean_tug") return Math.floor(REGRAS.PRECO_OCEANICO * t);
    if (type === "tuglord") return Math.floor(tuglordStorePrice() * t);
    return 0;
  }
  function tuglordStorePrice() {
    var h = gameState.houses.find(function (x) {
      return x.tuglordBuildCost;
    });
    return h ? h.tuglordBuildCost : 0;
  }
  function initiateArrest(player, debtAmount, reason, creditor) {
    player.bankruptcyStage = 1;
    var totalAssetValue = 0;
    var assetsList = [];
    player.properties.forEach(function (propName) {
      var prop = gameState.houses.find(function (h) {
        return h.name === propName;
      });
      var val = Math.floor(prop.price * REGRAS.LIQUIDACAO_TAXA);
      totalAssetValue += val;
      assetsList.push({
        type: "property",
        name: propName,
        value: val,
        asset: prop
      });
    });
    for (var i = 0; i < player.portTugs; i++) {
      totalAssetValue += liqValue("port_tug");
      assetsList.push({
        type: "port_tug",
        name: "Reb. Portuário",
        value: liqValue("port_tug")
      });
    }
    if (player.hasOceanTug && REGRAS.LIQUIDACAO_INCLUI_OCEANICO) {
      totalAssetValue += liqValue("ocean_tug");
      assetsList.push({
        type: "ocean_tug",
        name: "Reb. Oceânico",
        value: liqValue("ocean_tug")
      });
    }
    if (player.hasTuglord) {
      totalAssetValue += liqValue("tuglord");
      assetsList.push({
        type: "tuglord",
        name: "TugLord",
        value: liqValue("tuglord")
      });
    }
    var totalAvailable = player.money + totalAssetValue;
    if (totalAvailable >= debtAmount) {
      forceLiquidation(player, debtAmount, assetsList, creditor);
    } else {
      declareBankruptcy(player, creditor);
    }
  }
  function forceLiquidation(player, debtAmount, assetsList, creditor) {
    _showModal("⚖️ Liquidação Forçada", "\n        <p>Seus ativos ser\xE3o liquidados para cobrir a d\xEDvida de " + fm(debtAmount) + ".</p>\n    ");
    var amountRaised = player.money;
    var _loop = function _loop() {
      var asset = _step2.value;
      if (amountRaised >= debtAmount) return 1; // break
      if (asset.type === "property") {
        asset.asset.owner = void 0;
        asset.asset.stocks = 0;
        player.properties = player.properties.filter(function (p) {
          return p !== asset.name;
        });
        if (player.stocks[asset.name]) delete player.stocks[asset.name];
      } else if (asset.type === "port_tug") {
        player.portTugs--;
      } else if (asset.type === "ocean_tug") {
        player.hasOceanTug = false;
      } else if (asset.type === "tuglord") {
        player.hasTuglord = false;
      }
      amountRaised += asset.value;
    };
    for (var _iterator2 = _createForOfIteratorHelperLoose(assetsList), _step2; !(_step2 = _iterator2()).done;) {
      if (_loop()) break;
    }
    var cashUsed = Math.min(player.money, debtAmount);
    player.money -= cashUsed;
    if (creditor) creditor.money += debtAmount;
    var surplus = amountRaised - debtAmount;
    if (surplus > 0) player.money += surplus;
    player.bankruptcyStage = 0;
    setTimeout(function () {
      _showNotification("\uD83D\uDD28 D\xEDvida quitada via liquida\xE7\xE3o!");
      _updatePlayerPositions();
      _renderPlayersPanel();
      _closeModal();
    }, 2e3);
  }
  function declareBankruptcy(player, creditor) {
    player.bankruptcyStage = 2;
    player.isEliminated = true;
    player.properties.forEach(function (propName) {
      var prop = gameState.houses.find(function (h) {
        return h.name === propName;
      });
      prop.owner = void 0;
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
    FX.flash("rgba(239,68,68,0.45)", 500);
    FX.haptic([60, 50, 60, 50, 120]);
    commentate("bankrupt", {
      player: player.name
    });
    _showModal("💔 Falência", "\n        <div style=\"text-align:center;\">\n            <div style=\"font-size:3.5rem; margin-bottom:0.5rem;\">\uD83D\uDC94\u2693</div>\n            <p style=\"font-size:1.1rem;\"><strong>" + player.name + "</strong> afundou!</p>\n            <p style=\"color:#94a3b8;\">Eliminado da disputa pelo dom\xEDnio portu\xE1rio.</p>\n        </div>\n    ");
    _updatePlayerPositions();
    _renderPlayersPanel();
    var activePlayers = gameState.players.filter(function (p) {
      return !p.isEliminated;
    });
    if (activePlayers.length === 1) {
      gameState.phase = "ended";
      setTimeout(function () {
        return declareWinner(activePlayers[0]);
      }, 3e3);
    }
  }
  function declareWinner(winner) {
    gameState.phase = "ended";
    FX.confetti(3e3);
    FX.flash("rgba(251,191,36,0.3)", 450);
    FX.haptic([40, 60, 40, 60, 200]);
    Audio.playSuccess();
    commentate("win", {
      player: winner.name
    });
    _showModal("🏆 Vitória!", "\n        <div style=\"text-align: center;\">\n            <div class=\"fx-trophy\" style=\"font-size: 4.5rem; margin-bottom: 0.5rem;\">\uD83C\uDFC6</div>\n            <h1 style=\"color: var(--accent-gold); margin: 0;\">" + winner.icon + " " + winner.name + "</h1>\n            <p style=\"font-size: 1.15rem; font-weight: 800; color:#fbbf24; letter-spacing:0.5px;\">TUGLORD SUPREMO!</p>\n            <p style=\"color:#94a3b8;\">Dominou os mares e o mercado portu\xE1rio. \uD83D\uDC51</p>\n            <button class=\"btn-primary\" style=\"width:100%; margin-top:1rem;\" onclick=\"location.reload()\">\u2693 Nova Partida</button>\n        </div>\n    ", [], false);
  }
  function calculateRent(space, owner) {
    if (!space.rent) return 0;
    var level = 0;
    var portTugs = owner.portTugs - owner.dockedTugs.port;
    if (portTugs >= 1) level = 1;
    if (portTugs >= 2) level = 2;
    if (portTugs >= 3) level = 3;
    if (owner.hasOceanTug && !owner.dockedTugs.ocean) level = 4;
    if (owner.hasTuglord && !owner.dockedTugs.tuglord) level = 5;
    return Math.round(space.rent[level] * _eventMult("aluguelMult"));
  }
  function triggerOceanEvent() {
    commentate("ocean", {
      player: gameState.players[gameState.currentPlayerIndex].name
    });
    var event = OCEAN_EVENTS[Math.floor(Math.random() * OCEAN_EVENTS.length)];
    var buttons = [];
    if (event.type === "choice_salvage") {
      buttons = [{
        text: "✅ Aceitar",
        onClick: "acceptSalvage()"
      }, {
        text: "❌ Recusar",
        onClick: "closeModal()"
      }];
    } else if (event.type === "choice_route") {
      buttons = [{
        text: "🧭 Norte (+3 casas)",
        onClick: "chooseRoute('north')"
      }, {
        text: "🧭 Sul (+F$ 250 mil)",
        onClick: "chooseRoute('south')"
      }];
    } else {
      buttons = [{
        text: "Continuar",
        onClick: "closeModal()"
      }];
    }
    _showModal(event.icon + " " + event.name, "\n        <p>" + event.description + "</p>\n        <p style=\"color: #94a3b8\">" + event.effect + "</p>\n    ", buttons, false);
    if (event.type !== "choice_salvage" && event.type !== "choice_route") {
      applyOceanEventEffect(event);
    }
    var actionsDiv = document.getElementById("contextualActions");
    if (actionsDiv) actionsDiv.style.display = "none";
  }
  function applyOceanEventEffect(event) {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (event.type === "money") {
      if (event.amount > 0) currentPlayer.money += event.amount;
      if (event.amount > 0) Audio.playCoin();else handleMandatoryPayment(currentPlayer, Math.abs(event.amount), event.name);
    } else if (event.type === "move") {
      setTimeout(function () {
        return movePlayer(event.spaces);
      }, 1e3);
    } else if (event.type === "advance_to_property") {
      advanceToNextProperty(event.skipRent);
    } else if (event.type === "return_to_last_property") {
      returnToLastProperty();
    } else if (event.type === "skip_turn") {
      currentPlayer.skipNextTurn = true;
    } else if (event.type === "inspection") {
      var hasAll = CERTIFICATES.every(function (c) {
        return currentPlayer.certificates.includes(c);
      });
      if (hasAll) currentPlayer.money += 200;
      if (hasAll) Audio.playCoin();else handleMandatoryPayment(currentPlayer, 150, "Multa Inspeção");
    }
    _renderPlayersPanel();
  }
  function advanceToNextProperty(skipRent) {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    var spaces = 0;
    var len = gameState.houses.length;
    for (var i = 1; i <= len; i++) {
      var pos = (currentPlayer.position + i) % len;
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
  function returnToLastProperty() {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    var spaces = 0;
    var len = gameState.houses.length;
    for (var i = 1; i <= len; i++) {
      var pos = (currentPlayer.position - i + len) % len;
      if (isProperty(gameState.houses[pos])) {
        spaces = -i;
        break;
      }
    }
    if (spaces !== 0) movePlayer(spaces);
  }
  function acceptSalvage() {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    currentPlayer.money += 400;
    Audio.playCoin();
    currentPlayer.skipNextTurn = true;
    _renderPlayersPanel();
    _closeModal();
  }
  function chooseRoute(route) {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (route === "north") {
      _closeModal();
      setTimeout(function () {
        return movePlayer(3);
      }, 500);
    } else {
      currentPlayer.money += 250;
      Audio.playCoin();
      _renderPlayersPanel();
      _closeModal();
    }
  }
  function buyTraining(name, price, certificate) {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.money < price) {
      _showNotification("Saldo insuficiente!");
      return;
    }
    currentPlayer.money -= bankCap(currentPlayer, price);
    _renderPlayersPanel();
    presentExam(certificate, name, false);
  }
  function presentExam(certificate, trainingName, isFree) {
    commentate("cert", {
      player: gameState.players[gameState.currentPlayerIndex].name
    });
    var questions = TRAINING_QUESTIONS[certificate];
    var exam = questions[Math.floor(Math.random() * questions.length)];
    var shuffledOptions = [].concat(exam.options).sort(function () {
      return Math.random() - 0.5;
    });
    var modalBody = "\n        <div style=\"background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;\">\n            <p>" + exam.question + "</p>\n        </div>\n        <div style=\"display: grid; gap: 0.5rem;\">\n            " + shuffledOptions.map(function (opt) {
      return "\n                <button class=\"btn-secondary\" onclick=\"handleExamAnswer('" + opt.replace(/'/g, "\\'") + "', '" + exam.correct.replace(/'/g, "\\'") + "', '" + certificate + "', '" + trainingName + "', " + isFree + ")\">\n                    " + opt + "\n                </button>\n            ";
    }).join("") + "\n        </div>\n    ";
    _showModal("Exame: " + trainingName, modalBody, [], false);
  }
  function handleExamAnswer(submitted, correct, certificate, name, isFree) {
    _closeModal();
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (submitted === correct) {
      if (!currentPlayer.certificates.includes(certificate)) {
        currentPlayer.certificates.push(certificate);
      }
      _showNotification("\u2705 Aprovado em " + name + "! Certificado: " + (CERT_LABELS[certificate] || certificate));
      Audio.playCertificate();
    } else {
      _showNotification("\u274C Reprovado em " + name + "! Tente novamente.");
    }
    _renderPlayersPanel();
    if (gameState._examSession) setTimeout(nextSafetyExam, 400);
  }
  function commissionTugLord(cost) {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer.money < cost) {
      _showNotification("Saldo insuficiente!");
      return;
    }
    currentPlayer.money -= cost;
    currentPlayer.hasTuglord = true;
    _showNotification("⭐ TugLord comissionado!");
    Audio.playCertificate();
    _renderPlayersPanel();
  }
  function executeContract(name, amount) {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    credit(currentPlayer, amount, "Contrato");
    _showNotification("Executado: " + name + " (+" + fm(amount) + ")");
    _renderPlayersPanel();
    document.getElementById("contextualActions").style.display = "none";
  }
  function visitUniversity() {
    startSafetyExams("univ");
  }
  function startTrainingSafety() {
    startSafetyExams("trein");
  }
  function startSafetyExams(source) {
    gameState._examSession = {
      source: source,
      left: REGRAS.UNIVERSIDADE_PROVAS_POR_VISITA,
      n: 0
    };
    nextSafetyExam();
  }
  function nextSafetyExam() {
    var s = gameState._examSession;
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    var missing = CERTIFICATES.filter(function (c) {
      return !currentPlayer.certificates.includes(c);
    });
    if (!s || s.left <= 0 || missing.length === 0) {
      if (s && missing.length === 0 && s.n === 0) _showNotification("Já possui todos os certificados!");
      gameState._examSession = null;
      return false;
    }
    if (s.source === "trein") {
      var fee = REGRAS.TREINAMENTO_CUSTO_PROVA;
      if (currentPlayer.money < fee) {
        _showNotification("Saldo insuficiente para a prova do Treinamento.");
        gameState._examSession = null;
        return false;
      }
      currentPlayer.money -= bankCap(currentPlayer, fee);
      _renderPlayersPanel();
    }
    s.left--;
    s.n++;
    var total = REGRAS.UNIVERSIDADE_PROVAS_POR_VISITA;
    var selected = missing[Math.floor(Math.random() * missing.length)];
    presentExam(selected, CERT_LABELS[selected] + " (prova " + s.n + "/" + total + ")", s.source === "univ");
    return true;
  }
  function openStockExchange() {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    var availableProperties = gameState.houses.filter(function (h) {
      return isProperty(h) && h.owner !== void 0 && h.owner !== currentPlayer.id && (h.stocks || 0) < 5;
    });
    var playerStocksList = Object.keys(currentPlayer.stocks).map(function (propName) {
      var quantity = currentPlayer.stocks[propName];
      var property = gameState.houses.find(function (h) {
        return h.name === propName;
      });
      var dividendValue = Math.floor(property.rent[0] * 0.5);
      return {
        name: propName,
        quantity: quantity,
        dividend: dividendValue,
        totalDividend: dividendValue * quantity
      };
    });
    var totalDividends = playerStocksList.reduce(function (sum, s) {
      return sum + s.totalDividend;
    }, 0);
    var modalBody = "\n        <div style=\"margin-bottom: 1rem; padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem; border-left: 4px solid #3b82f6;\">\n            <p style=\"font-weight: 600; color: #60a5fa;\">" + coinIcon() + " Saldo: " + fm(currentPlayer.money) + "</p>\n            <p style=\"font-size: 0.85rem; color: #94a3b8;\">Suas a\xE7\xF5es: " + playerStocksList.length + " | Dividendos: " + fm(totalDividends) + "/turno</p>\n        </div>\n\n        " + (playerStocksList.length > 0 ? "\n        <div style=\"margin-bottom: 1rem;\">\n            <p style=\"font-weight: 600; color: #22c55e;\">\uD83D\uDCCA Suas A\xE7\xF5es</p>\n            <div style=\"display: grid; gap: 0.5rem;\">\n                " + playerStocksList.map(function (stock) {
      return "\n                    <div style=\"padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 0.5rem;\">\n                        <span style=\"display: block; color: #e0e0e0;\">" + stock.name + "</span>\n                        <span style=\"font-size: 0.85rem; color: #94a3b8;\">" + stock.quantity + "\xD7 | Div: " + fm(stock.totalDividend) + "</span>\n                    </div>\n                ";
    }).join("") + "\n            </div>\n        </div>\n        " : "") + "\n\n        <div>\n            <p style=\"font-weight: 600; color: #e0e0e0;\">\uD83D\uDED2 Comprar A\xE7\xF5es</p>\n            " + (availableProperties.length > 0 ? "\n            <div style=\"display: grid; gap: 0.5rem; max-height: 200px; overflow-y: auto;\">\n                " + availableProperties.map(function (prop) {
      var price = Math.floor(prop.price * 0.3);
      var owner = gameState.players.find(function (p) {
        return p.id === prop.owner;
      });
      return "\n                    <button class=\"btn-secondary\" onclick=\"buyStock('" + prop.name.replace(/'/g, "\\'") + "', " + price + ")\" style=\"text-align: left;\">\n                        " + prop.name + "<br>\n                        <small style=\"color: #94a3b8;\">" + fm(price) + " | Dono: " + owner.name + " | Disp: " + (5 - (prop.stocks || 0)) + "</small>\n                    </button>\n                    ";
    }).join("") + "\n            </div>\n            " : '<p style="font-size: 0.9rem; color: #f87171;">Nenhuma ação disponível.</p>') + "\n        </div>\n    ";
    _showModal("📈 Bolsa de Valores", modalBody, [], true);
  }
  function buyStock(propName, price) {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    var property = gameState.houses.find(function (h) {
      return h.name === propName;
    });
    if (currentPlayer.money < price) {
      _showNotification("Saldo insuficiente");
      return;
    }
    if (!property.stocks) property.stocks = 0;
    if (property.stocks >= 5) {
      _showNotification("Limite atingido");
      return;
    }
    currentPlayer.money -= price;
    if (!currentPlayer.stocks[propName]) currentPlayer.stocks[propName] = 0;
    currentPlayer.stocks[propName]++;
    property.stocks++;
    var owner = gameState.players.find(function (p) {
      return p.id === property.owner;
    });
    owner.money += price;
    _showNotification("\u2705 A\xE7\xE3o de " + propName + " comprada!");
    Audio.playBuy();
    _renderPlayersPanel();
    _closeModal();
  }
  function payDividends(propertyOwner) {
    var totalPaid = 0;
    gameState.players.forEach(function (player) {
      if (player.id === propertyOwner.id || player.isEliminated) return;
      propertyOwner.properties.forEach(function (propName) {
        if (player.stocks[propName]) {
          var qty = player.stocks[propName];
          var prop = gameState.houses.find(function (h) {
            return h.name === propName;
          });
          var val = Math.floor(prop.rent[0] * 0.5) * qty;
          propertyOwner.money -= val;
          player.money += val;
          totalPaid += val;
        }
      });
    });
    if (totalPaid > 0) _showNotification("\uD83D\uDCB0 Pagou " + fm(totalPaid) + " em dividendos");
  }
  function openBankTerminal() {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    var modalBody = "\n        <div style=\"margin-bottom: 1rem; padding: 1rem; background: rgba(59, 130, 246, 0.1); border-radius: 0.5rem; border-left: 4px solid #3b82f6;\">\n             <p style=\"font-weight: 600; color: #60a5fa;\">" + coinIcon() + " Saldo: " + fm(currentPlayer.money) + "</p>\n             " + (REGRAS.EMPRESTIMO_ATIVO ? "<p style=\"font-size: 0.85rem; color: #94a3b8;\">Empr\xE9stimos ativos: " + currentPlayer.loans.length + "</p>" : "") + "\n        </div>\n\n        " + (REGRAS.EMPRESTIMO_ATIVO ? "<div style=\"margin-bottom: 1rem;\">\n             <p style=\"font-weight: 600; color: #e0e0e0; margin-bottom: 0.5rem;\">\uD83D\uDCCB Empr\xE9stimos Dispon\xEDveis</p>\n             <div style=\"display: grid; gap: 0.5rem;\">\n                 <button class=\"btn-secondary\" onclick=\"takeLoan(5000, 0.10)\">\uD83D\uDCB5 F$ 5 mi (Juros 10% \u2022 paga F$ 5,5 mi em 5 turnos)</button>\n                 <button class=\"btn-secondary\" onclick=\"takeLoan(10000, 0.15)\">\uD83D\uDCB5 F$ 10 mi (Juros 15% \u2022 paga F$ 11,5 mi em 5 turnos)</button>\n                 <button class=\"btn-secondary\" onclick=\"takeLoan(20000, 0.20)\">\uD83D\uDCB5 F$ 20 mi (Juros 20% \u2022 paga F$ 24 mi em 5 turnos)</button>\n             </div>\n        </div>" : "") + "\n\n        " + (currentPlayer.loans.length > 0 ? "\n        <div style=\"margin-bottom: 1rem;\">\n             <p style=\"font-weight: 600; color: #f87171; margin-bottom: 0.5rem;\">\uD83D\uDCB3 Seus Empr\xE9stimos</p>\n             <div style=\"display: grid; gap: 0.5rem;\">\n                 " + currentPlayer.loans.map(function (l, i) {
      return "\n                    <button class=\"btn-secondary\" onclick=\"payLoan(" + i + ")\">\n                        \uD83D\uDCB8 Pagar " + fm(l.totalDue) + " (vence em " + l.turnsRemaining + " " + (l.turnsRemaining === 1 ? "turno" : "turnos") + ")\n                    </button>\n                 ";
    }).join("") + "\n             </div>\n        </div>\n        " : "") + "\n        \n        " + (currentPlayer.properties.length > 0 || currentPlayer.portTugs > 0 || currentPlayer.hasOceanTug && REGRAS.LIQUIDACAO_INCLUI_OCEANICO || currentPlayer.hasTuglord ? "\n        <div>\n             <p style=\"font-weight: 600; color: #fbbf24; margin-bottom: 0.5rem;\">\uD83D\uDD28 Venda ao Banco (" + Math.round(REGRAS.LIQUIDACAO_TAXA * 100) + "%)</p>\n             <div style=\"display: grid; gap: 0.5rem; max-height: 150px; overflow-y: auto;\">\n                 " + currentPlayer.properties.map(function (p) {
      return "\n                    <button class=\"btn-secondary\" onclick=\"liquidateAsset('property', '" + p.replace(/'/g, "\\'") + "')\">\n                        \uD83C\uDFE2 " + p + " (" + fm(liqValue("property", gameState.houses.find(function (h) {
        return h.name === p;
      }))) + ")\n                    </button>\n                 ";
    }).join("") + "\n                 " + (currentPlayer.portTugs > 0 ? "<button class=\"btn-secondary\" onclick=\"liquidateAsset('port_tug', null)\">\u2693 Rebocador Portu\xE1rio (" + fm(liqValue("port_tug")) + ")</button>" : "") + "\n                 " + (currentPlayer.hasOceanTug && REGRAS.LIQUIDACAO_INCLUI_OCEANICO ? "<button class=\"btn-secondary\" onclick=\"liquidateAsset('ocean_tug', null)\">\uD83C\uDF0A Rebocador Oce\xE2nico (" + fm(liqValue("ocean_tug")) + ")</button>" : "") + "\n                 " + (currentPlayer.hasTuglord ? "<button class=\"btn-secondary\" onclick=\"liquidateAsset('tuglord', null)\">\u2B50 TugLord (" + fm(liqValue("tuglord")) + ")</button>" : "") + "\n             </div>\n        </div>\n        " : "") + "\n    ";
    _showModal("🏦 Terminal Bancário", modalBody, [], true);
  }
  function takeLoan(amount, rate) {
    if (rate === void 0) {
      rate = 0.1;
    }
    if (!REGRAS.EMPRESTIMO_ATIVO) {
      _showNotification("🚫 Empréstimos desativados nesta versão");
      return;
    }
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    var totalDue = Math.floor(amount * (1 + rate));
    currentPlayer.loans.push({
      principal: amount,
      totalDue: totalDue,
      turnsRemaining: 5,
      rate: rate
    });
    currentPlayer.money += amount;
    _showNotification("Empr\xE9stimo de " + fm(amount) + " realizado!");
    Audio.playBuy();
    _renderPlayersPanel();
    _closeModal();
  }
  function processLoans(player) {
    if (!player.loans || player.loans.length === 0 || player.isEliminated) return;
    for (var i = player.loans.length - 1; i >= 0; i--) {
      var loan = player.loans[i];
      loan.turnsRemaining--;
      if (loan.turnsRemaining <= 0) {
        player.loans.splice(i, 1);
        handleMandatoryPayment(player, loan.totalDue, "Empréstimo vencido");
        if (player.isEliminated) return;
      }
    }
  }
  function meetsSupremeVictory(player) {
    if (!player || player.isEliminated) return false;
    var hasAllCerts = CERTIFICATES.every(function (c) {
      return player.certificates.includes(c);
    });
    var portsOwned = gameState.houses.filter(function (h) {
      return isProperty(h) && h.owner === player.id;
    }).length;
    return hasAllCerts && player.hasTuglord && player.hasOceanTug && portsOwned >= 5;
  }
  function scoreForVictory(player) {
    return REGRAS.CRITERIO_VENCEDOR === "dinheiro" ? player.money : netWorth(player);
  }
  function checkRoundLimit() {
    var lim = REGRAS.LIMITE_RODADAS;
    if (!lim || gameState.phase !== "playing" || gameState.currentRound <= lim) return false;
    gameState.currentRound = lim;
    endByRoundLimit();
    return true;
  }
  function endByRoundLimit() {
    gameState.phase = "ended";
    var ranked = gameState.players.filter(function (p) {
      return !p.isEliminated;
    }).sort(function (a, b) {
      return scoreForVictory(b) - scoreForVictory(a);
    });
    var winner = ranked[0];
    var label = REGRAS.CRITERIO_VENCEDOR === "dinheiro" ? "dinheiro em caixa" : "patrimônio líquido";
    FX.confetti(3e3);
    Audio.playSuccess();
    commentate("win", {
      player: winner.name
    });
    _showModal("🏁 Fim das " + REGRAS.LIMITE_RODADAS + " rodadas!", "\n        <div style=\"text-align: center;\">\n            <div class=\"fx-trophy\" style=\"font-size: 4rem;\">\uD83C\uDFC6</div>\n            <h1 style=\"color: var(--accent-gold); margin: 0;\">" + winner.icon + " " + winner.name + "</h1>\n            <p style=\"color:#94a3b8;\">Vence pelo maior " + label + ".</p>\n            " + ranked.map(function (p, i) {
      return "<p style=\"margin:0.25rem 0;\">" + (i + 1) + "\xBA " + p.icon + " " + p.name + ": <strong>" + fm(scoreForVictory(p)) + "</strong></p>";
    }).join("") + "\n            <button class=\"btn-primary\" style=\"width:100%; margin-top:1rem;\" onclick=\"location.reload()\">\u2693 Nova Partida</button>\n        </div>\n    ", [], false);
  }
  function checkVictory() {
    if (gameState.phase !== "playing") return false;
    var winner = REGRAS.VITORIA_SUPREMA_ATIVA ? gameState.players.find(function (p) {
      return meetsSupremeVictory(p);
    }) : null;
    if (winner) {
      gameState.phase = "ended";
      declareWinner(winner);
      return true;
    }
    return false;
  }
  function payLoan(index) {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    var loan = currentPlayer.loans[index];
    if (currentPlayer.money < loan.totalDue) {
      _showNotification("Saldo insuficiente");
      return;
    }
    currentPlayer.money -= loan.totalDue;
    currentPlayer.loans.splice(index, 1);
    _showNotification("Empréstimo pago!");
    _renderPlayersPanel();
    _closeModal();
    setTimeout(openBankTerminal, 300);
  }
  function liquidateAsset(type, id) {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    var val = 0;
    if (type === "property") {
      var prop = gameState.houses.find(function (h) {
        return h.name === id;
      });
      val = liqValue("property", prop);
      prop.owner = void 0;
      prop.stocks = 0;
      currentPlayer.properties = currentPlayer.properties.filter(function (p) {
        return p !== id;
      });
      if (currentPlayer.stocks[id]) delete currentPlayer.stocks[id];
    } else if (type === "port_tug") {
      val = liqValue("port_tug");
      currentPlayer.portTugs--;
    } else if (type === "ocean_tug") {
      val = liqValue("ocean_tug");
      currentPlayer.hasOceanTug = false;
    } else if (type === "tuglord") {
      if (!currentPlayer.hasTuglord) return;
      val = liqValue("tuglord");
      currentPlayer.hasTuglord = false;
    }
    currentPlayer.money += val;
    _showNotification("Ativo liquidado (+" + fm(val) + ")");
    _renderPlayersPanel();
    _updatePlayerPositions();
    _closeModal();
    setTimeout(openBankTerminal, 300);
  }
  function checkTugLordCertificate() {
    _showNotification("🎖️ Certificado TugLord Ativo!");
  }
  function payTax(amount) {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    handleMandatoryPayment(currentPlayer, amount, "Imposto");
    var actionsDiv = document.getElementById("contextualActions");
    if (actionsDiv) actionsDiv.style.display = "none";
  }
  function performManeuver() {
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    var portTugs = currentPlayer.portTugs - currentPlayer.dockedTugs.port;
    var oceanTug = currentPlayer.hasOceanTug && !currentPlayer.dockedTugs.ocean;
    var tuglord = currentPlayer.hasTuglord && !currentPlayer.dockedTugs.tuglord;
    var totalTugs = portTugs + (oceanTug ? 1 : 0) + (tuglord ? 1 : 0);
    if (totalTugs === 0) {
      _showNotification("✅ Sem rebocadores, sem penalidade!");
    } else {
      var opponentsWithTugs = gameState.players.filter(function (p) {
        if (p.id === currentPlayer.id) return false;
        var pPort = p.portTugs - p.dockedTugs.port;
        var pOcean = p.hasOceanTug && !p.dockedTugs.ocean;
        var pTuglord = p.hasTuglord && !p.dockedTugs.tuglord;
        return pPort + (pOcean ? 1 : 0) + (pTuglord ? 1 : 0) > 0;
      });
      var count = opponentsWithTugs.length;
      if (count > 0) {
        var penalty = count * 100;
        handleMandatoryPayment(currentPlayer, penalty, "Manobra (" + count + " adv.)");
      } else {
        _showNotification("✅ Nenhum adversário com rebocadores!");
      }
    }
    var actionsDiv = document.getElementById("contextualActions");
    if (actionsDiv) actionsDiv.style.display = "none";
  }
  function drawCard(type) {
    var effects = [{
      msg: "Encontrou carga perdida! +F$ 100 mil",
      val: 100
    }, {
      msg: "Multa ambiental! -F$ 100 mil",
      val: -100
    }, {
      msg: "Manutenção extra! -F$ 50 mil",
      val: -50
    }, {
      msg: "Bonificação contratual! +F$ 150 mil",
      val: 150
    }];
    var effect = effects[Math.floor(Math.random() * effects.length)];
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (effect.val > 0) {
      currentPlayer.money += effect.val;
      _showNotification("\uD83C\uDF40 " + effect.msg);
    } else {
      handleMandatoryPayment(currentPlayer, Math.abs(effect.val), "Carta Sorte");
    }
    _renderPlayersPanel();
    var actionsDiv = document.getElementById("contextualActions");
    if (actionsDiv) actionsDiv.style.display = "none";
  }
  function showCardPicker(type) {
    commentate("luck", {
      player: gameState.players[gameState.currentPlayerIndex].name
    });
    var NUM_CARDS = 5;
    gameState._cardDraw = Array.from({
      length: NUM_CARDS
    }, function () {
      return CARD_DECK[Math.floor(Math.random() * CARD_DECK.length)];
    });
    gameState._cardPicked = false;
    var label = type === "surprise" ? "Carta Surpresa" : "Sorte ou Azar";
    var cards = "";
    for (var i = 0; i < NUM_CARDS; i++) {
      var c = gameState._cardDraw[i];
      var good = c.good || c.val >= 0;
      cards += "\n            <div class=\"game-card\" onclick=\"pickCard(" + i + ", '" + type + "')\">\n                <div class=\"game-card-inner\">\n                    <div class=\"game-card-face game-card-back\">\u2693</div>\n                    <div class=\"game-card-face game-card-front " + (good ? "good" : "bad") + "\">\n                        <div class=\"gc-icon\">" + (good ? "🍀" : "⚠️") + "</div>\n                        <div class=\"gc-msg\">" + c.msg + "</div>\n                    </div>\n                </div>\n            </div>";
    }
    var body = "\n        <p style=\"text-align: center; margin-bottom: 1rem; color: #cbd5e1;\">Escolha uma carta para revelar sua sorte!</p>\n        <div class=\"card-row\">" + cards + "</div>";
    _showModal("\uD83C\uDFB4 " + label, body, [], false);
  }
  function pickCard(index, type) {
    if (gameState._cardPicked) return;
    var draw = gameState._cardDraw;
    if (!draw) return;
    gameState._cardPicked = true;
    var effect = draw[index];
    var modal = document.getElementById("gameModal");
    var cards = modal ? modal.querySelectorAll(".game-card") : [];
    cards.forEach(function (card, i) {
      card.style.pointerEvents = "none";
      if (i === index) {
        card.classList.add("chosen");
        var inner = card.querySelector(".game-card-inner");
        if (inner) inner.classList.add("flipped");
      } else {
        card.classList.add("dimmed");
      }
    });
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    setTimeout(function () {
      if (effect.asset) {
        grantTugFromCard(currentPlayer, effect.asset);
      } else if (effect.val > 0) {
        _showNotification("\uD83C\uDF40 " + effect.msg);
        credit(currentPlayer, effect.val, "Sorte");
      } else if (effect.val < 0) {
        Audio.playBadLuck();
        handleMandatoryPayment(currentPlayer, Math.abs(effect.val), "Carta");
      } else {
        _showNotification(effect.msg);
      }
      _renderPlayersPanel();
    }, 650);
    setTimeout(function () {
      _closeModal();
      gameState._cardDraw = null;
      var actionsDiv = document.getElementById("contextualActions");
      if (actionsDiv) actionsDiv.style.display = "none";
    }, 2800);
  }
  function ownerName(house) {
    var p = house && house.owner !== void 0 ? gameState.players.find(function (x) {
      return x.id === house.owner;
    }) : null;
    return p ? p.name : BANK_OWNER_LABEL;
  }
  function grantTugFromCard(player, asset) {
    if (asset === "port_tug") {
      player.portTugs++;
      _showNotification("\u2693 " + player.name + " ganhou um Rebocador Portu\xE1rio!");
    } else if (asset === "port_kit") {
      player.portTugs += 2;
      _showNotification("\u2693\u2693 Kit Porto: " + player.name + " ganhou 2 Rebocadores Portu\xE1rios!");
    } else if (asset === "special_kit") {
      player.portTugs++;
      if (giveOceanTug(player)) _showNotification("\u2693\uD83C\uDF0A Kit Especial: " + player.name + " ganhou 1 Portu\xE1rio + 1 Oce\xE2nico!");
    } else if (asset === "ocean_tug") {
      if (giveOceanTug(player)) _showNotification("\uD83C\uDF0A " + player.name + " ganhou um Rebocador Oce\xE2nico!");
    } else if (asset === "tug_coupon") {
      player.tugCoupon = true;
      _showNotification("\uD83C\uDF9F\uFE0F " + player.name + ": cupom de " + Math.round(REGRAS.CUPOM_DESCONTO * 100) + "% no pr\xF3ximo Portu\xE1rio!");
    } else if (asset === "maneuver") {
      var pay = maneuverPayout(player) * REGRAS.CARTA_MANOBRA_MULT;
      if (operationalTugs(player).port > 0 && !canManeuver(player)) _showNotification("\u2693 Manobra de Porto: " + NO_CERT_MANEUVER);else if (pay > 0) {
        _showNotification("\u2693 Manobra de Porto: " + REGRAS.CARTA_MANOBRA_MULT + " x " + fm(REGRAS.MANOBRA_BASE) + " x " + Math.min(operationalTugs(player).port, REGRAS.MANOBRA_MAX_PORTUARIOS) + " portu\xE1rio(s)");
        credit(player, pay, "Manobra");
      } else _showNotification("\u2693 Manobra de Porto: sem portu\xE1rio operacional, sem manobra.");
      _renderPlayersPanel();
      return;
    } else if (asset === "salvage") {
      if (canOceanSalvage(player)) {
        var prize = salvagePrize();
        _showNotification("\uD83C\uDF0A Reboque Oce\xE2nico conclu\xEDdo!");
        credit(player, prize, "Reboque Oceânico");
      } else _showNotification("\uD83C\uDF0A Reboque Oce\xE2nico: s\xF3 com Oce\xE2nico operacional e Certificado Tuglords.");
      _renderPlayersPanel();
      return;
    }
    Audio.playSuccess();
    _renderPlayersPanel();
  }
  function handleDrydockHouse() {
    var player = gameState.players[gameState.currentPlayerIndex];
    var yard = gameState.houses.find(function (h) {
      return h.name.includes("Estaleiro");
    });
    var yardOwner = yard && yard.owner !== void 0 ? gameState.players.find(function (p) {
      return p.id === yard.owner;
    }) : null;
    var recipient = yardOwner && yardOwner.id !== player.id ? yardOwner : null;
    if (!handleMandatoryPayment(player, DOCKING_HOUSE_COST, "Docagem obrigatória", recipient)) return false;
    if (DOCKING_HOUSE_SKIP_TURN) player.skipNextTurn = true;
    return true;
  }
  function showContextualActions(house) {
    var actionsDiv = document.getElementById("contextualActions");
    if (actionsDiv) actionsDiv.style.display = "none";
    var currentPlayer = gameState.players[gameState.currentPlayerIndex];
    var title = house.icon + " " + house.name;
    var body = "";
    var buttons = [];
    if (isProperty(house)) {
      var owner = house.owner !== void 0 ? gameState.players.find(function (p) {
        return p.id === house.owner;
      }) : null;
      if (!owner) {
        body = "<p>Este porto est\xE1 \xE0 venda por <strong style=\"color: var(--accent-gold);\">" + fm(house.price) + "</strong>.</p>";
        buttons.push({
          text: "Comprar (" + fm(house.price) + ")",
          onClick: "buyProperty(gameState.houses[" + house.pos + "])",
          class: "btn-primary"
        });
        buttons.push({
          text: "Passar",
          onClick: REGRAS.LEILAO_ATIVO ? "startAuction(" + house.pos + ")" : "closeModal()",
          class: "btn-secondary"
        });
      } else if (owner.id === currentPlayer.id) {
        commentate("own", {
          player: currentPlayer.name
        });
        var tax = Math.round(house.price * REGRAS.IMPOSTO_PORTO_PROPRIO);
        if (!handleMandatoryPayment(currentPlayer, tax, "Impostos (" + house.name + ")")) return;
        body = "<p style=\"color: #22c55e;\">\u2705 Voc\xEA \xE9 o dono deste porto!</p>\n                <p style=\"color:#f59e0b;\">\uD83E\uDDFE Impostos pagos: " + fm(tax) + "</p>";
        if (currentPlayer.dockedTugs.inYard) {
          body += "<p>\uD83C\uDFD7\uFE0F Seu rebocador pode sair do dique e vir para este porto, ap\xF3s a vistoria LOYDS TUGSTER.</p>";
          buttons.push({
            text: "📋 Fazer Vistoria",
            onClick: "presentInspection('yard')",
            class: "btn-primary"
          });
        } else {
          buttons.push({
            text: "Continuar",
            onClick: "closeModal()",
            class: "btn-primary"
          });
        }
      } else {
        if (currentPlayer.skipNextRent) {
          body = "<p style=\"color: #10b981;\">\u26F5 <strong>Vento Favor\xE1vel!</strong><br>Aluguel dispensado nesta rodada.</p>";
          currentPlayer.skipNextRent = false;
          buttons.push({
            text: "Ótimo!",
            onClick: "closeModal()",
            class: "btn-primary"
          });
        } else {
          var rent = calculateRent(house, owner);
          body = "\n                    <p>Propriedade de <strong>" + owner.name + "</strong>.</p>\n                    <p style=\"color: #ef4444; font-size: 1.2rem;\">Arrendamento: " + fm(rent) + "</p>\n                ";
          buttons.push({
            text: "Pagar " + fm(rent),
            onClick: "handleMandatoryPayment(gameState.players[" + gameState.currentPlayerIndex + "], " + rent + ", 'Aluguel/arrendamento (" + house.name + ")', gameState.players.find(p => p.id === " + owner.id + ")); UI.closeModal();",
            class: "btn-primary"
          });
        }
      }
    } else if (house.type === "workshop" && house.price) {
      var _owner = house.owner !== void 0 ? gameState.players.find(function (p) {
        return p.id === house.owner;
      }) : null;
      if (!_owner) {
        body = "<p style=\"color: #94a3b8;\">\uD83C\uDFDB\uFE0F Dono atual: " + BANK_OWNER_LABEL + "</p><p>Esta oficina est\xE1 \xE0 venda por <strong style=\"color: var(--accent-gold);\">" + fm(house.price) + "</strong>.</p>\n                <p style=\"color: #94a3b8; font-size: 0.9rem;\">\uD83D\uDCDD Ap\xF3s a compra, voc\xEA far\xE1 o <strong>exame t\xE9cnico</strong> de " + (CERT_LABELS[house.certificate] || house.certificate) + " para emitir o certificado.</p>";
        buttons.push({
          text: "Comprar (" + fm(house.price) + ")",
          onClick: "buyProperty(gameState.houses[" + house.pos + "])",
          class: "btn-primary"
        });
        buttons.push({
          text: "Passar",
          onClick: "closeModal()",
          class: "btn-secondary"
        });
      } else if (_owner.id === currentPlayer.id) {
        if (!currentPlayer.workshopVisits) currentPlayer.workshopVisits = {};
        if (!currentPlayer.workshopBonusPaid) currentPlayer.workshopBonusPaid = {};
        var visits = (currentPlayer.workshopVisits[house.name] || 0) + 1;
        var staffNote;
        if (visits >= REGRAS.OFICINA_INCENTIVO_NA_VEZ) {
          var paid = currentPlayer.workshopBonusPaid[house.name] || 0;
          var incentive = Math.round(paid * REGRAS.OFICINA_INCENTIVO_TAXA);
          currentPlayer.workshopVisits[house.name] = 0;
          currentPlayer.workshopBonusPaid[house.name] = 0;
          credit(currentPlayer, incentive, "Incentivo do Banco");
          staffNote = "<p style=\"color: #22c55e;\">\uD83C\uDFE6 " + visits + "\xAA visita: o Banco devolveu " + fm(incentive) + " de incentivo (25% dos b\xF4nus pagos). Contador zerado.</p>";
        } else {
          if (!handleMandatoryPayment(currentPlayer, WORKSHOP_STAFF_PAY, "PL/b\xF4nus dos funcion\xE1rios (" + house.name + ")")) return;
          currentPlayer.workshopVisits[house.name] = visits;
          currentPlayer.workshopBonusPaid[house.name] = (currentPlayer.workshopBonusPaid[house.name] || 0) + WORKSHOP_STAFF_PAY;
          staffNote = "<p style=\"color: #f59e0b;\">\uD83D\uDC77 Voc\xEA pagou " + fm(WORKSHOP_STAFF_PAY) + " de b\xF4nus aos funcion\xE1rios (visita " + visits + " de " + (REGRAS.OFICINA_INCENTIVO_NA_VEZ - 1) + "; na " + REGRAS.OFICINA_INCENTIVO_NA_VEZ + "\xAA o Banco paga incentivo).</p>";
        }
        if (!currentPlayer.certificates.includes(house.certificate)) {
          body = staffNote + ("<p>Como dono, voc\xEA pode emitir o certificado <strong>" + (CERT_LABELS[house.certificate] || house.certificate) + "</strong> \u2014 mas precisa conhecer a \xE1rea: fa\xE7a o exame t\xE9cnico (gratuito).</p>");
          buttons.push({
            text: "📝 Fazer Exame Técnico",
            onClick: "presentExam('" + house.certificate + "', '" + house.name + "', true);",
            class: "btn-primary"
          });
        } else {
          body = staffNote + "<p style=\"color: #22c55e;\">\u2705 Oficina sob sua gest\xE3o.</p>";
          buttons.push({
            text: "Continuar",
            onClick: "closeModal()",
            class: "btn-primary"
          });
        }
      } else {
        var certified = _owner.certificates.includes(house.certificate);
        var serviceFee = certified ? Math.round(WORKSHOP_SERVICE_FEE * CERTIFIED_FEE_MULTIPLIER) : WORKSHOP_SERVICE_FEE;
        body = "\n                <p>Propriedade de <strong>" + _owner.name + "</strong>.</p>\n                " + (certified ? "<p style=\"color: var(--accent-gold);\">\uD83C\uDF93 Oficina certificada em " + (CERT_LABELS[house.certificate] || house.certificate) + " \u2014 servi\xE7o premium (+" + Math.round((CERTIFIED_FEE_MULTIPLIER - 1) * 100) + "%).</p>" : "") + "\n                <p style=\"color: #ef4444;\">Taxa de Servi\xE7o: " + fm(serviceFee) + "</p>\n            ";
        buttons.push({
          text: "Pagar " + fm(serviceFee),
          onClick: "handleMandatoryPayment(gameState.players[" + gameState.currentPlayerIndex + "], " + serviceFee + ", 'Taxa (" + house.name + ")', gameState.players.find(p => p.id === " + _owner.id + ")); UI.closeModal();",
          class: "btn-primary"
        });
      }
    } else if (house.type === "service" && house.price) {
      if (house.name.includes("Estaleiro") && operationalTugs(currentPlayer).total > 0) {
        handleShipyard(house);
        return;
      }
      var _owner2 = house.owner !== void 0 ? gameState.players.find(function (p) {
        return p.id === house.owner;
      }) : null;
      if (!_owner2) {
        body = "<p style=\"color: #94a3b8;\">\uD83C\uDFDB\uFE0F Dono atual: " + BANK_OWNER_LABEL + "</p><p>Este servi\xE7o est\xE1 \xE0 venda por <strong style=\"color: var(--accent-gold);\">" + fm(house.price) + "</strong>.</p>";
        buttons.push({
          text: "Comprar (" + fm(house.price) + ")",
          onClick: "buyProperty(gameState.houses[" + house.pos + "])",
          class: "btn-primary"
        });
        buttons.push({
          text: "Passar",
          onClick: "closeModal()",
          class: "btn-secondary"
        });
      } else if (_owner2.id === currentPlayer.id) {
        body = "<p style=\"color: #22c55e;\">\u2705 Voc\xEA possui este servi\xE7o.</p>";
        if (house.name.includes("Estaleiro") && !currentPlayer.hasTuglord && currentPlayer.money >= house.tuglordBuildCost) {
          buttons.push({
            text: "Comissionar TugLord (" + fm(house.tuglordBuildCost) + ")",
            onClick: "commissionTugLord(" + house.tuglordBuildCost + "); UI.closeModal();",
            class: "btn-primary"
          });
        }
        buttons.push({
          text: "Continuar",
          onClick: "closeModal()",
          class: "btn-primary"
        });
      } else {
        body = "<p>Propriedade de <strong>" + _owner2.name + "</strong>.</p>";
        buttons.push({
          text: "Continuar",
          onClick: "closeModal()",
          class: "btn-primary"
        });
      }
    } else if (house.type === "tug_purchase" && house.price) {
      var tugTypeName = house.tugType === "port" ? "Portuário" : "Oceânico";
      body = "<p>Deseja comprar um Rebocador <strong>" + tugTypeName + "</strong>?</p>";
      buttons.push({
        text: "Comprar (" + fm(house.price) + ")",
        onClick: "buyTug(gameState.houses[" + house.pos + "]); UI.closeModal();",
        class: "btn-primary"
      });
      buttons.push({
        text: "Não agora",
        onClick: "closeModal()",
        class: "btn-secondary"
      });
    } else if (house.type === "training" && house.price) {
      var missingSafety = CERTIFICATES.filter(function (c) {
        return !currentPlayer.certificates.includes(c);
      }).length;
      if (REGRAS.TREINAMENTO_CERT_SEGURANCA && missingSafety > 0) {
        body = "<p>\uD83E\uDDBA Treinamento de seguran\xE7a: at\xE9 <strong>" + REGRAS.UNIVERSIDADE_PROVAS_POR_VISITA + " provas</strong> de certificado de seguran\xE7a, " + fm(REGRAS.TREINAMENTO_CUSTO_PROVA) + " cada (pago antes da prova).</p>";
        buttons.push({
          text: "Prova de seguran\xE7a (" + fm(REGRAS.TREINAMENTO_CUSTO_PROVA) + ")",
          onClick: "startTrainingSafety();",
          class: "btn-primary"
        });
        if (!currentPlayer.certificates.includes(house.certificate)) {
          body += "<p style=\"color:#94a3b8;\">Ou o treinamento t\xE9cnico: <strong>" + house.certificate.toUpperCase() + "</strong> (" + fm(house.price) + ").</p>";
          buttons.push({
            text: "Treinamento t\xE9cnico (" + fm(house.price) + ")",
            onClick: "buyTraining('" + house.name + "', " + house.price + ", '" + house.certificate + "');",
            class: "btn-secondary"
          });
        }
        buttons.push({
          text: "Ignorar",
          onClick: "closeModal()",
          class: "btn-secondary"
        });
      } else if (!currentPlayer.certificates.includes(house.certificate)) {
        body = "<p>Treinamento dispon\xEDvel: <strong>" + house.certificate.toUpperCase() + "</strong>.</p>";
        buttons.push({
          text: "Fazer Treinamento (" + fm(house.price) + ")",
          onClick: "buyTraining('" + house.name + "', " + house.price + ", '" + house.certificate + "');",
          // buyTraining opens exam modal
          class: "btn-primary"
        });
        buttons.push({
          text: "Ignorar",
          onClick: "closeModal()",
          class: "btn-secondary"
        });
      } else {
        body = "<p style=\"color: #22c55e;\">\u2705 Voc\xEA j\xE1 possui este certificado.</p>";
        buttons.push({
          text: "Continuar",
          onClick: "closeModal()",
          class: "btn-primary"
        });
      }
    } else if (house.type === "university") {
      body = "<p>\uD83C\uDF93 Universidade do Mar \u2014 at\xE9 <strong>" + REGRAS.UNIVERSIDADE_PROVAS_POR_VISITA + " provas gr\xE1tis por visita</strong> dos certificados de seguran\xE7a (Inc\xEAndio, Homem ao Mar, Colis\xE3o, Abandono). " + (REGRAS.MANOBRA_CERTS_SEGURANCA === 1 ? "1 certificado" : REGRAS.MANOBRA_CERTS_SEGURANCA + " certificados") + " j\xE1 libera a manobra!</p>";
      buttons.push({
        text: "Acessar Universidade",
        onClick: "visitUniversity();",
        // Opens exam modal
        class: "btn-primary"
      });
      buttons.push({
        text: "Passar",
        onClick: "closeModal()",
        class: "btn-secondary"
      });
    } else if (house.type === "bank") {
      body = "<p>Acesse o terminal banc\xE1rio para " + (REGRAS.EMPRESTIMO_ATIVO ? "empréstimos e pagamentos" : "vender ativos ao Banco") + ".</p>";
      buttons.push({
        text: "Abrir Terminal",
        onClick: "openBankTerminal();",
        // Opens bank modal
        class: "btn-primary"
      });
      buttons.push({
        text: "Continuar",
        onClick: "closeModal()",
        class: "btn-secondary"
      });
    } else if (house.type === "stock_exchange") {
      body = "<p>Negocie a\xE7\xF5es de portos e receba dividendos.</p>";
      buttons.push({
        text: "Abrir Bolsa",
        onClick: "openStockExchange();",
        // Opens stock modal
        class: "btn-primary"
      });
      buttons.push({
        text: "Continuar",
        onClick: "closeModal()",
        class: "btn-secondary"
      });
    } else if (house.type === "tuglord_certificate") {
      body = "<p>Verifica\xE7\xE3o de status TugLord.</p>";
      buttons.push({
        text: "Verificar",
        onClick: "checkTugLordCertificate(); UI.closeModal();",
        class: "btn-primary"
      });
    } else if (house.type === "tax" && house.price) {
      body = "<p>Pagamento obrigat\xF3rio de imposto.</p>";
      buttons.push({
        text: "Pagar " + fm(house.price),
        onClick: "payTax(" + house.price + "); UI.closeModal();",
        class: "btn-primary"
      });
    } else if (house.type === "drydock") {
      if (!handleDrydockHouse()) return;
      body = "<p style=\"color: #f87171; font-weight: 600;\">\u26A0\uFE0F DOCAGEM OBRIGAT\xD3RIA</p>\n            <p>Docagem peri\xF3dica de classe: pague " + fm(DOCKING_HOUSE_COST) + " (" + ownerName(gameState.houses.find(function (h) {
        return h.name.includes("Estaleiro");
      })) + ")" + (DOCKING_HOUSE_SKIP_TURN ? " e fique uma rodada sem jogar" : "") + ".</p>";
      buttons.push({
        text: "Entendido",
        onClick: "closeModal()",
        class: "btn-primary"
      });
    } else if (house.type === "luck" || house.type === "surprise") {
      showCardPicker(house.type);
      return;
    } else if (house.type === "ocean_event" || house.type === "event") {
      if (!canOceanSalvage(currentPlayer)) {
        body = "<p style=\"color: #f59e0b;\">\uD83C\uDF0A Reboque Oce\xE2nico s\xF3 para quem tem <strong>Rebocador Oce\xE2nico</strong> operacional e o <strong>Certificado Tuglords</strong>.</p>\n                     <p style=\"color:#94a3b8;\">At\xE9 l\xE1, manobre no porto e passe " + REGRAS.UNISALVAGE_ETAPAS + " vezes na UNISALVAGE.</p>";
        buttons.push({
          text: "Continuar",
          onClick: "closeModal()",
          class: "btn-primary"
        });
      } else {
        var prize = salvagePrize();
        credit(currentPlayer, prize, "Salvatagem");
        commentate("ocean", {
          player: currentPlayer.name
        });
        FX.confetti(1500);
        body = "<p style=\"color:#22c55e; font-weight:700;\">\uD83D\uDEDF Reboque Oce\xE2nico conclu\xEDdo!</p>\n                     <p>Seu Oce\xE2nico rebocou um navio em perigo: <strong style=\"color: var(--accent-gold);\">+" + fm(prize) + "</strong>.</p>";
        buttons.push({
          text: "Ótimo!",
          onClick: "closeModal()",
          class: "btn-primary"
        });
      }
    } else if (house.type === "maneuver") {
      var n = operationalTugs(currentPlayer).port;
      if (n > 0 && !canManeuver(currentPlayer)) {
        var c = safetyCount(currentPlayer),
          need = REGRAS.MANOBRA_CERTS_SEGURANCA;
        body = "<p style=\"color:#f59e0b; font-weight:700;\">\u2693 " + NO_CERT_MANEUVER + "</p>\n                <p style=\"color:#94a3b8;\">Voc\xEA tem " + n + " portu\xE1rio" + (n > 1 ? "s" : "") + ", mas s\xF3 come\xE7a a ganhar com " + (need === 1 ? "1 certificado" : need + " certificados") + " de seguran\xE7a (" + c + "/" + need + "). Fa\xE7a a prova na Universidade do Mar ou no Treinamento.</p>";
      } else if (n <= 0) {
        body = "<p style=\"color:#f59e0b;\">\u2693 Sem rebocador portu\xE1rio operacional, sem manobra.</p>\n                <p style=\"color:#94a3b8;\">Cada portu\xE1rio rende " + fm(REGRAS.MANOBRA_BASE) + " por manobra. Compre na Loja de Rebocadores (" + fm(REGRAS.PRECO_PORTUARIO) + ").</p>";
      } else {
        var pay = maneuverPayout(currentPlayer);
        credit(currentPlayer, pay, "Manobra");
        body = "<p style=\"color:#22c55e; font-weight:700;\">\u2693 Manobra conclu\xEDda com " + n + " portu\xE1rio" + (n > 1 ? "s" : "") + "!</p>\n                <p>" + fm(REGRAS.MANOBRA_BASE) + " x " + Math.min(n, REGRAS.MANOBRA_MAX_PORTUARIOS) + " = <strong style=\"color: var(--accent-gold);\">" + fm(pay) + "</strong></p>\n                " + (n > REGRAS.MANOBRA_MAX_PORTUARIOS ? "<p style=\"color:#94a3b8; font-size:0.85rem;\">Teto: s\xF3 " + REGRAS.MANOBRA_MAX_PORTUARIOS + " portu\xE1rios contam na manobra.</p>" : "");
      }
      buttons.push({
        text: "Continuar",
        onClick: "closeModal()",
        class: "btn-primary"
      });
    } else if (house.type === "unisalvage") {
      if (currentPlayer.certTuglords) {
        body = "<p style=\"color:#22c55e; font-weight:700;\">\uD83D\uDEDF Voc\xEA j\xE1 tem o Certificado Tuglords!</p>\n                <p style=\"color:#94a3b8;\">Autorizado para Rebocadores Oce\xE2nicos e Reboque Oce\xE2nico.</p>";
        buttons.push({
          text: "Continuar",
          onClick: "closeModal()",
          class: "btn-primary"
        });
      } else {
        presentUnisalvage();
        return;
      }
    } else if (house.type === "inspection") {
      if (operationalTugs(currentPlayer).total <= 0) {
        body = "<p style=\"color:#94a3b8;\">\uD83D\uDCCB Sem rebocador operacional para vistoriar. Siga viagem.</p>";
        buttons.push({
          text: "Continuar",
          onClick: "closeModal()",
          class: "btn-primary"
        });
      } else {
        presentInspection("square");
        return;
      }
    } else if (house.type === "contract" && house.price) {
      var hasTug = currentPlayer.portTugs > 0 || currentPlayer.hasOceanTug || currentPlayer.hasTuglord;
      if (hasTug) {
        body = "<p>Contrato dispon\xEDvel para execu\xE7\xE3o.</p>";
        buttons.push({
          text: "Executar (+" + fm(house.price) + ")",
          onClick: "executeContract('" + house.name + "', " + house.price + "); UI.closeModal();",
          class: "btn-primary"
        });
      } else {
        body = "<p style=\"color: #ef4444;\">\u26A0\uFE0F Frota Insuficiente!</p>\n                     <p>Voc\xEA precisa de pelo menos um rebocador operacional para realizar contratos.</p>";
        buttons.push({
          text: "Entendido",
          onClick: "UI.closeModal()",
          class: "btn-secondary"
        });
      }
    }
    if (body) {
      _showModal(title, body, buttons, false);
    }
  }
  var SAVE_KEY = "tuglords_save_v2";
  var OLD_SAVE_KEY = "tuglords_save_v1";
  function saveGame() {
    if (gameState.phase === "setup") {
      _showNotification("⚠️ Inicie uma partida para salvar.");
      return;
    }
    try {
      var data = {
        version: 2,
        savedAt: (/* @__PURE__ */new Date()).toISOString(),
        players: gameState.players,
        currentPlayerIndex: gameState.currentPlayerIndex,
        currentRound: gameState.currentRound,
        roundEvent: gameState.roundEvent || null,
        phase: gameState.phase,
        // Apenas o estado dinâmico das casas (dono/ações); o resto é estático.
        houses: gameState.houses.map(function (h) {
          var _a;
          return {
            pos: h.pos,
            owner: (_a = h.owner) != null ? _a : null,
            stocks: h.stocks || 0
          };
        })
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      _showNotification("💾 Jogo salvo!");
      _closeModal();
    } catch (e) {
      _showNotification("❌ Falha ao salvar.");
      console.error("saveGame:", e);
    }
  }
  function loadGame() {
    var raw;
    try {
      raw = localStorage.getItem(SAVE_KEY);
    } catch (e) {
      raw = null;
    }
    if (!raw) {
      var old = null;
      try {
        old = localStorage.getItem(OLD_SAVE_KEY);
      } catch (e) {
        old = null;
      }
      if (old) {
        _showNotification("⚠️ Save antigo (v1) não é compatível com as regras novas.");
        return;
      }
      _showNotification("⚠️ Nenhum jogo salvo encontrado.");
      return;
    }
    try {
      var data = JSON.parse(raw);
      if (data.version !== 2) {
        _showNotification("⚠️ Save de versão antiga, ignorado.");
        return;
      }
      gameState.players = data.players;
      gameState.players.forEach(function (p) {
        var d = p.dockedTugs || (p.dockedTugs = {
          port: 0,
          ocean: false,
          tuglord: false,
          turnsRemaining: 0
        });
        if (d.inYard === void 0) d.inYard = false;
        if (d.retest === void 0) d.retest = false;
        if (!p.workshopVisits) p.workshopVisits = {};
        if (!p.workshopBonusPaid) p.workshopBonusPaid = {};
        if (p.tugCoupon === void 0) p.tugCoupon = false;
        if (p.unisalvageStep === void 0) p.unisalvageStep = 0;
        if (!p.badges) p.badges = [];
        if (p.certTuglords === void 0) p.certTuglords = false;
      });
      gameState.currentPlayerIndex = data.currentPlayerIndex;
      gameState.currentRound = data.currentRound;
      gameState.roundEvent = data.roundEvent || null;
      _resetTracking();
      gameState.phase = data.phase;
      gameState.diceRolled = true;
      data.houses.forEach(function (h) {
        var house2 = gameState.houses[h.pos];
        if (house2) {
          house2.owner = h.owner === null || h.owner === void 0 ? void 0 : h.owner;
          house2.stocks = h.stocks || 0;
        }
      });
      ["presentationScreen", "manualScreen", "setupScreen"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.style.display = "none";
      });
      var gameScreen = document.getElementById("gameScreen");
      if (gameScreen) gameScreen.style.display = "block";
      _closeAllPanels();
      _renderBoard();
      _renderPlayersPanel();
      _updateTurnDisplay();
      _updatePlayerPositions();
      var current = gameState.players[gameState.currentPlayerIndex];
      var house = gameState.houses[current.position];
      var currentHouseName = document.getElementById("currentHouseName");
      if (currentHouseName && house) currentHouseName.textContent = house.name;
      _showNotification("📤 Jogo carregado!");
    } catch (e) {
      _showNotification("❌ Save corrompido.");
      console.error("loadGame:", e);
    }
  }
  function netWorth(player) {
    var total = player.money;
    gameState.houses.forEach(function (h) {
      if (isProperty(h) && h.owner === player.id) total += Math.floor(h.price * 0.5);
    });
    total += Math.floor(player.portTugs * REGRAS.PRECO_PORTUARIO * 0.5);
    if (player.hasOceanTug) total += Math.floor(REGRAS.PRECO_OCEANICO * 0.5);
    if (player.hasTuglord) total += Math.floor(tuglordStorePrice() * 0.5);
    (player.loans || []).forEach(function (l) {
      total -= l.totalDue;
    });
    return total;
  }
  function showStatistics() {
    var ranked = [].concat(gameState.players).sort(function (a, b) {
      return netWorth(b) - netWorth(a);
    });
    var rows = ranked.map(function (p, i) {
      var ports = gameState.houses.filter(function (h) {
        return isProperty(h) && h.owner === p.id;
      }).length;
      var status = p.isEliminated ? "💀 Eliminado" : "" + fm(netWorth(p));
      return "\n            <div style=\"display:flex; align-items:center; gap:0.75rem; padding:0.6rem; border-radius:0.5rem; background:rgba(255,255,255,0.05); border-left:4px solid " + p.color + "; margin-bottom:0.5rem; " + (p.isEliminated ? "opacity:0.55;" : "") + "\">\n                <span style=\"font-weight:900; width:24px; color:var(--accent-gold);\">" + (i + 1) + "\xBA</span>\n                <span style=\"font-size:1.3rem;\">" + p.icon + "</span>\n                <div style=\"flex:1; min-width:0;\">\n                    <div style=\"font-weight:700;\">" + p.name + "</div>\n                    <div style=\"font-size:0.78rem; color:#94a3b8;\">\u2693 " + ports + " portos \xB7 \uD83C\uDF93 " + p.certificates.length + "/4 \xB7 " + coinIcon() + " " + fm(p.money) + "</div>\n                </div>\n                <span style=\"font-weight:800; color:#22c55e; white-space:nowrap;\">" + status + "</span>\n            </div>";
    }).join("");
    _closeAllPanels();
    _showModal("📊 Estatísticas", "\n        <p style=\"color:#94a3b8; margin-top:0;\">Rodada " + gameState.currentRound + " \xB7 classifica\xE7\xE3o por patrim\xF4nio l\xEDquido</p>\n        " + rows + "\n    ", [{
      text: "Fechar",
      onClick: "closeModal()",
      class: "btn-primary"
    }], true);
  }
  function showVictoryInfo() {
    var current = gameState.players[gameState.currentPlayerIndex];
    var haveCerts = current ? CERTIFICATES.filter(function (c) {
      return current.certificates.includes(c);
    }).length : 0;
    var ports = current ? gameState.houses.filter(function (h) {
      return isProperty(h) && h.owner === current.id;
    }).length : 0;
    var chk = function chk(ok) {
      return ok ? "✅" : "⬜";
    };
    _closeAllPanels();
    _showModal("🏆 Como Vencer", "\n        <p>Torne-se o <strong style=\"color:var(--accent-gold);\">TugLord Supremo</strong> completando todos os objetivos:</p>\n        <ul style=\"list-style:none; padding:0; line-height:2;\">\n            <li>" + chk(haveCerts === 4) + " 4 Certificados (" + haveCerts + "/4)</li>\n            <li>" + chk(current && current.hasTuglord) + " Status TugLord</li>\n            <li>" + chk(current && current.hasOceanTug) + " Rebocador Oce\xE2nico</li>\n            <li>" + chk(ports >= 5) + " 5+ Portos (" + ports + "/5)</li>\n        </ul>\n        <p style=\"font-size:0.85rem; color:#94a3b8;\">Progresso de <strong>" + (current ? current.name : "-") + "</strong>. Tamb\xE9m vence quem ficar como \xFAnico n\xE3o-falido.</p>\n    ", [{
      text: "Entendido",
      onClick: "closeModal()",
      class: "btn-primary"
    }], true);
  }
  function toggleAudio() {
    var muted = Audio.toggleMute();
    _showNotification(muted ? "🔇 Áudio desligado" : "🔊 Áudio ligado");
    var btn = document.getElementById("btnToggleAudio");
    if (btn) btn.textContent = muted ? "🔇 Áudio: Desligado" : "🔊 Áudio: Ligado";
  }
  function exitGame() {
    _showModal("🚪 Sair da Partida", "\n        <p>Tem certeza? O progresso n\xE3o salvo ser\xE1 perdido.</p>\n    ", [{
      text: "Salvar e Sair",
      onClick: "saveGame(); location.reload();",
      class: "btn-primary"
    }, {
      text: "Sair sem Salvar",
      onClick: "location.reload();",
      class: "btn-secondary"
    }, {
      text: "Cancelar",
      onClick: "closeModal();",
      class: "btn-secondary"
    }], true);
  }
  var SHARE_URL = "https://tuglords.netlify.app";
  var SHARE_TEXT = "⚓ Venha jogar TUGLORDS — domine os mares e o mercado portuário!";
  function shareGame() {
    if (navigator.share) {
      navigator.share({
        title: "TUGLORDS",
        text: SHARE_TEXT,
        url: SHARE_URL
      }).catch(function () {});
      return;
    }
    var enc = encodeURIComponent;
    var wa = "https://wa.me/?text=" + enc(SHARE_TEXT + " " + SHARE_URL);
    var tg = "https://t.me/share/url?url=" + enc(SHARE_URL) + "&text=" + enc(SHARE_TEXT);
    var tw = "https://twitter.com/intent/tweet?text=" + enc(SHARE_TEXT) + "&url=" + enc(SHARE_URL);
    var body = "\n        <p style=\"color:#cbd5e1; text-align:center; margin-top:0;\">Chame a tripula\xE7\xE3o para jogar! \u2693</p>\n        <div style=\"display:grid; gap:0.5rem;\">\n            <button class=\"btn-secondary\" onclick=\"window.open('" + wa + "','_blank','noopener')\">\uD83D\uDCAC WhatsApp</button>\n            <button class=\"btn-secondary\" onclick=\"window.open('" + tg + "','_blank','noopener')\">\u2708\uFE0F Telegram</button>\n            <button class=\"btn-secondary\" onclick=\"window.open('" + tw + "','_blank','noopener')\">\uD835\uDD4F Twitter / X</button>\n            <button class=\"btn-primary\" onclick=\"copyShareLink()\">\uD83D\uDD17 Copiar link</button>\n        </div>";
    _showModal("📤 Compartilhar", body, [], true);
  }
  function copyShareLink() {
    var done = function done() {
      return _showNotification("🔗 Link copiado!");
    };
    var fallback = function fallback() {
      try {
        var ta = document.createElement("textarea");
        ta.value = SHARE_URL;
        ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        ta.remove();
        done();
      } catch (e) {
        _showNotification("Copie: " + SHARE_URL);
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

  // src/js/main.js
  window.TLEngage = engagement_exports;
  window.startAuction = _startAuction;
  window.auctionBid = _auctionBid;
  window.auctionPass = _auctionPass;
  window.openChallenge = _openChallenge;
  window.startChallenge = _startChallenge;
  window.answerChallenge = _answerChallenge;
  window.addPlayer = addPlayer;
  document.body.addEventListener("click", function () {
    Audio.init();
    Audio.startMusic();
  }, {
    once: true
  });
  window.updatePlayerName = updatePlayerName;
  window.removePlayer = removePlayer;
  window.startOrderRolls = startOrderRolls;
  window.startGame = startGame;
  window.rollDice = rollDice;
  window.endTurn = endTurn;
  window.buyProperty = buyProperty;
  window.buyTug = buyTug;
  window.showLoanOptions = showLoanOptions;
  window.checkDockingStatus = checkDockingStatus;
  window.handleShipyard = handleShipyard;
  window.executeDocking = executeDocking;
  window.triggerOceanEvent = triggerOceanEvent;
  window.acceptSalvage = acceptSalvage;
  window.chooseRoute = chooseRoute;
  window.buyTraining = buyTraining;
  window.presentExam = presentExam;
  window.handleExamAnswer = handleExamAnswer;
  window.commissionTugLord = commissionTugLord;
  window.executeContract = executeContract;
  window.visitUniversity = visitUniversity;
  window.startTrainingSafety = startTrainingSafety;
  window.checkTugLordCertificate = checkTugLordCertificate;
  window.payTax = payTax;
  window.performManeuver = performManeuver;
  window.openStockExchange = openStockExchange;
  window.buyStock = buyStock;
  window.openBankTerminal = openBankTerminal;
  window.takeLoan = takeLoan;
  window.payLoan = payLoan;
  window.liquidateAsset = liquidateAsset;
  window.drawCard = drawCard;
  window.showCardPicker = showCardPicker;
  window.pickCard = pickCard;
  window.presentInspection = presentInspection;
  window.handleInspectionAnswer = handleInspectionAnswer;
  window.presentUnisalvage = presentUnisalvage;
  window.handleUnisalvageAnswer = handleUnisalvageAnswer;
  window.handleMandatoryPayment = handleMandatoryPayment;
  window.initiateArrest = initiateArrest;
  window.checkTugLordCertificate = checkTugLordCertificate;
  window.saveGame = saveGame;
  window.loadGame = loadGame;
  window.showStatistics = showStatistics;
  window.showVictoryInfo = showVictoryInfo;
  window.exitGame = exitGame;
  window.toggleAudio = toggleAudio;
  window.showManualModal = _showManualModal;
  window.shareGame = shareGame;
  window.copyShareLink = copyShareLink;
  window.showManual = _showManual;
  window.hideManual = _hideManual;
  window.goToSetup = _goToSetup;
  window.UI = ui_exports;
  window.closeModal = _closeModal;
  window.switchTab = _switchTab;
  window.toggleBoard = _toggleBoard;
  window.selectHouse = _selectHouse;
  window.openPanel = _openPanel;
  window.closePanel = _closePanel;
  window.closeAllPanels = _closeAllPanels;
  function runSplash() {
    var splash = document.getElementById("splashScreen");
    if (!splash) return;
    var pawn = document.getElementById("splashPawn");
    if (pawn && _pinSVG) pawn.innerHTML = _pinSVG("#fbbf24");
    var closed = false;
    var close = function close() {
      if (closed) return;
      closed = true;
      splash.classList.add("hide");
      setTimeout(function () {
        return splash.remove();
      }, 650);
    };
    var skip = document.getElementById("splashSkip");
    if (skip) skip.addEventListener("click", function (e) {
      e.stopPropagation();
      close();
    });
    splash.addEventListener("click", close);
    var reduce = false;
    if (reduce) {
      close();
      return;
    }
    setTimeout(close, 5200);
  }
  document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 [MAIN] DOMContentLoaded fired");
    var loanBox = document.getElementById("bankLoanBox");
    if (loanBox && !REGRAS.EMPRESTIMO_ATIVO) loanBox.style.display = "none";
    runSplash();
    try {
      _renderBoard();
      console.log("✅ [MAIN] Board rendered");
    } catch (e) {
      console.error("❌ [MAIN] Error rendering board:", e);
    }
    var btnStart = document.getElementById("btnStartGame");
    if (btnStart) {
      console.log("✅ [MAIN] Found btnStartGame");
      btnStart.addEventListener("click", function () {
        console.log("🖱️ [MAIN] Start Game clicked");
        _goToSetup();
      });
    } else {
      console.error("❌ [MAIN] btnStartGame NOT found");
    }
    var btnManual = document.getElementById("btnOpenManual");
    if (btnManual) {
      console.log("✅ [MAIN] Found btnOpenManual");
      btnManual.addEventListener("click", function () {
        console.log("🖱️ [MAIN] Manual clicked");
        _showManual();
      });
    } else {
      console.error("❌ [MAIN] btnOpenManual NOT found");
    }
    var btnCloseManual = document.getElementById("btnCloseManual");
    if (btnCloseManual) {
      console.log("✅ [MAIN] Found btnCloseManual");
      btnCloseManual.addEventListener("click", function () {
        console.log("🖱️ [MAIN] Close Manual clicked");
        _hideManual();
      });
    } else {
      console.error("❌ [MAIN] btnCloseManual NOT found");
    }
  });
  window.gameState = gameState;
  window.__tl = {
    show: showContextualActions,
    grant: grantTugFromCard,
    credit: credit,
    freight: payOceanFreight,
    netWorth: netWorth,
    standings: _renderStandings,
    fm: fm,
    maneuver: maneuverPayout,
    checkDocking: checkDockingStatus,
    inspect: presentInspection,
    answer: handleInspectionAnswer,
    uni: presentUnisalvage,
    uniAnswer: handleUnisalvageAnswer,
    endTurn: endTurn,
    certs: CERTIFICATES,
    deck: CARD_DECK,
    regras: REGRAS,
    engage: engagement_exports
  };
  window.FX = FX;
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (regs) {
      return regs.forEach(function (r) {
        return r.unregister();
      });
    }).catch(function () {});
  }
  if (window.caches && caches.keys) {
    caches.keys().then(function (ks) {
      return ks.forEach(function (k) {
        return caches.delete(k);
      });
    }).catch(function () {});
  }
  var deferredInstallPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredInstallPrompt = e;
    var btn = document.getElementById("btnInstallPWA");
    if (btn) btn.style.display = "";
  });
  window.installPWA = function installPWA() {
    var btn = document.getElementById("btnInstallPWA");
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      if (deferredInstallPrompt.userChoice) {
        deferredInstallPrompt.userChoice.finally(function () {
          deferredInstallPrompt = null;
          if (btn) btn.style.display = "none";
        });
      }
      return;
    }
    var isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    var msg = isIOS ? '<p>Para instalar no iPhone/iPad:</p><ol style="padding-left:1.1rem; line-height:1.7;"><li>Toque no botão <strong>Compartilhar</strong> (ícone de caixa com seta).</li><li>Escolha <strong>Adicionar à Tela de Início</strong>.</li></ol>' : "<p>Use o menu do navegador e escolha <strong>Instalar app</strong> / <strong>Adicionar à tela inicial</strong>. Se o app já estiver instalado, abra pelo ícone. ⚓</p>";
    _showModal("📲 Instalar TUGLORDS", msg, [{
      text: "Entendi",
      onClick: "closeModal()",
      class: "btn-primary"
    }], true);
  };
  window.addEventListener("appinstalled", function () {
    var btn = document.getElementById("btnInstallPWA");
    if (btn) btn.style.display = "none";
    deferredInstallPrompt = null;
  });
  window.TVApplyCamera = _applyCameraMode;
})();
