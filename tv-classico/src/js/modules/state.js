// ===== Agrupamento de portos por região (cores de "bairro", estilo Monopoly) =====
export const REGION_COLORS = {
    norte: '#10b981',     // verde
    nordeste: '#f59e0b',  // âmbar
    sudeste: '#ef4444',   // vermelho
    sul: '#3b82f6'        // azul
};

const PORT_REGIONS = {
    'Porto de Fortaleza': 'nordeste',
    'Porto de Salvador': 'nordeste',
    'Porto de Suape': 'nordeste',
    'Porto de Santos': 'sudeste',
    'Porto de Vitória': 'sudeste',
    'Porto de Macaé': 'sudeste',
    'Porto do Açu': 'sudeste',
    'Porto de Itajaí': 'sul',
    'Porto de Rio Grande': 'sul',
    'Porto de Paranaguá': 'sul',
    'Porto de Manaus': 'norte',
    'Porto de Belém': 'norte',
    'Porto de São Luís': 'norte',
    'Porto de Vila do Conde': 'norte'
};

export const gameState = {
    players: [],
    currentPlayerIndex: 0,
    currentRound: 1,
    phase: 'setup', // setup, playing
    playerOrder: [],
    diceRolled: false,
    houses: [
        { name: 'Casa Inicial', type: 'start', icon: '🏁', actions: [] },
        { name: 'Porto de Fortaleza', type: 'port', price: 8000, rent: [800, 1600, 3000, 5000, 7500, 10000], icon: '⚓', actions: ['buy'] },
        { name: 'Manobra do Porto', type: 'maneuver', icon: '⚓', actions: [] }, // Regras v2 (antes: Evento Oceânico)
        { name: 'Porto de Santos', type: 'port', price: 12000, rent: [1200, 2400, 4500, 7000, 10000, 14000], icon: '🚢', actions: ['buy'] },
        { name: 'Posto de Combustível', type: 'service', price: 6000, icon: '⛽', actions: ['buy'] },
        { name: 'Banco', type: 'bank', icon: '🏦', actions: ['loan'] },
        { name: 'Loja de Rebocadores', type: 'tug_purchase', price: 7000 /* REGRAS.PRECO_PORTUARIO */, tugType: 'port', icon: '🛒', actions: ['buy'] }, // Added Shop
        { name: 'Carta Surpresa', type: 'surprise', icon: '🎁', actions: [] },
        { name: 'SCHOREL', type: 'workshop', price: 8000, serviceFee: 1500, certificate: 'azimuth', icon: '🛠️', actions: ['buy'] },
        { name: 'Docagem Obrigatória', type: 'drydock', icon: '🛠️', actions: [] }, // Index 9 (antes: Canto Sorte, casa sem efeito)
        // Side 2 (Left)
        { name: 'Porto de Salvador', type: 'port', price: 9000, rent: [900, 1800, 3500, 5500, 8000, 11000], icon: '⛵', actions: ['buy'] },
        { name: 'Salvatagem Oceânica', type: 'event', icon: '🌊', actions: [] }, // Regras v2: só para quem tem Oceânico
        { name: 'KAT', type: 'workshop', price: 9000, serviceFee: 1800, certificate: 'diesel', icon: '🏭', actions: ['buy'] },
        { name: 'Porto de Vitória', type: 'port', price: 8500, rent: [850, 1700, 3200, 5200, 7800, 10500], icon: '🚤', actions: ['buy'] },
        { name: 'Universidade do Mar', type: 'university', icon: '🎓', actions: [] },
        { name: 'Porto de Macaé', type: 'port', price: 11000, rent: [1100, 2200, 4000, 6500, 9500, 13000], icon: '⛴️', actions: ['buy'] },
        { name: 'Carta Sorte', type: 'luck', icon: '🎲', actions: [] },
        { name: 'Porto do Açu', type: 'port', price: 14000, rent: [1400, 2800, 5000, 8000, 12000, 16000], icon: '🛳️', actions: ['buy'] },
        // Corner 18
        { name: 'Certificação TugLord', type: 'tuglord_certificate', icon: '🎖️', actions: [] },
        // Side 3 (Top)
        { name: 'Porto de Itajaí', type: 'port', price: 9500, rent: [950, 1900, 3600, 5800, 8500, 11500], icon: '🛥️', actions: ['buy'] },
        { name: 'Manobra do Porto', type: 'maneuver', icon: '⚓', actions: [] }, // Regras v2 (antes: Evento Oceânico)
        { name: 'MDU', type: 'workshop', price: 8500, serviceFee: 1600, certificate: 'highspeed', icon: '🔧', actions: ['buy'] },
        { name: 'Porto de Rio Grande', type: 'port', price: 9000, rent: [900, 1800, 3500, 5500, 8000, 11000], icon: '🚤', actions: ['buy'] },
        { name: 'Bolsa de Valores', type: 'stock_exchange', icon: '📈', actions: ['invest'] },
        { name: 'Porto de Paranaguá', type: 'port', price: 10500, rent: [1050, 2100, 3900, 6200, 9000, 12500], icon: '⛴️', actions: ['buy'] },
        { name: 'Treinamento', type: 'training', price: 3000, certificate: 'maneuver', icon: '🎓', actions: ['buy'] },
        { name: 'Porto de Suape', type: 'port', price: 11500, rent: [1150, 2300, 4200, 6800, 9800, 13500], icon: '🚢', actions: ['buy'] },
        // Corner 27
        { name: 'UNISALVAGE', type: 'unisalvage', icon: '🛟', actions: [] }, // Regras v2 (antes: Banco Central; o Banco da casa 5 segue com empréstimos)
        // Side 4 (Right)
        { name: 'Porto de Manaus', type: 'port', price: 8000, rent: [800, 1600, 3000, 5000, 7500, 10000], icon: '⛴️', actions: ['buy'] },
        { name: 'Carta Azar', type: 'luck', icon: '⚠️', actions: [] },
        { name: 'Estaleiro Naval', type: 'service', price: 12000, tuglordBuildCost: 20000, icon: '🏗️', actions: ['buy'] },
        { name: 'Porto de Belém', type: 'port', price: 8500, rent: [850, 1700, 3200, 5200, 7800, 10500], icon: '⛵', actions: ['buy'] },
        { name: 'Loja de Rebocadores (Oceânico)', type: 'tug_purchase', price: 15000, tugType: 'ocean', icon: '🛒', actions: ['buy'] }, // Added Shop
        { name: 'Porto de São Luís', type: 'port', price: 10000, rent: [1000, 2000, 3800, 6000, 8800, 12000], icon: '🚤', actions: ['buy'] },
        { name: 'Vistoria LOYDS TUGSTER', type: 'inspection', icon: '📋', actions: [] }, // Regras v2 (antes: Taxa Portuária)
        { name: 'Porto de Vila do Conde', type: 'port', price: 9500, rent: [950, 1900, 3600, 5800, 8500, 11500], icon: '🚢', actions: ['buy'] }
    ].map((h, i) => ({ ...h, pos: i, region: PORT_REGIONS[h.name] }))
};

// Certificados de SEGURANÇA — OBRIGATÓRIOS para a vitória, rebocador oceânico
// e bônus de inspeção. Obtidos na Universidade (exames de segurança).
export const CERTIFICATES = ['fire', 'rescue', 'collision', 'abandon'];

// Certificados TÉCNICOS — OPCIONAIS (bônus). Concedidos pelas oficinas
// (SCHOREL/KAT/MDU) e pelo Treinamento, mediante exame técnico da área.
export const TECH_CERTIFICATES = ['azimuth', 'diesel', 'highspeed', 'maneuver'];

// Bônus dos certificados técnicos: uma oficina cujo DONO possui o certificado
// técnico da área vira "certificada" e cobra um serviço premium — a taxa de
// serviço é multiplicada por este fator, gerando renda extra ao dono.
export const CERTIFIED_FEE_MULTIPLIER = 1.5;

// Baralho de cartas Sorte/Azar. Ao cair numa casa de carta, o jogador escolhe
// uma carta virada para baixo (fileira no centro do tabuleiro) e a revela.
// val > 0 = Sorte (ganha); val < 0 = Azar (paga).


// ===== Regras v2 (26/10/2026): TODOS os números num só lugar =====
// Valores internos: 1 = F$ 1 mil. Ajuste aqui (balanceamento Dr. Fintech).
export const REGRAS = {
    // Balanceamento Dr. Fintech (26/10/2026, aprovado pelo Jossian).
    DINHEIRO_INICIAL: 30000,
    SALARIO_PARTIDA: 2500,
    ALUGUEL_MULT: 0.6,               // aluguel/arrendamento = tabela rent[] x 0,6 (Santos: 720, 1440, 2700...)
    // Rebocadores
    PRECO_PORTUARIO: 7000,           // antes F$ 10 mi: portuário mais barato (manobra é o motor do jogo)
    PRECO_OCEANICO: 15000,
    CUPOM_DESCONTO: 0.5,             // carta de cupom: 50% na próxima compra de portuário
    CARTA_TUG_DINHEIRO: { port_tug: 5000, ocean_tug: 15000 }, // sem requisito ou já tem: recebe em dinheiro
    // Portos
    IMPOSTO_PORTO_PROPRIO: 0.10,     // própria casa: paga 10% do preço do porto em impostos
    // Oficinas
    OFICINA_SERVICO: 5000,           // adversário paga ao dono (x1,5 se certificada)
    OFICINA_BONUS: 1000,             // dono paga aos funcionários (1ª a 3ª vez)
    OFICINA_INCENTIVO_TAXA: 0.25,    // na 4ª vez o Banco devolve 25% dos bônus pagos e zera
    OFICINA_INCENTIVO_NA_VEZ: 4,
    // Estaleiro
    ESTALEIRO_TAXA: 3000,            // ao cair (ao dono do Estaleiro ou ao Banco)
    ESTALEIRO_ESTADIA_VOLTA: 1000,   // por volta, por rebocador docado
    // Manobra do Porto: valor base x nº de portuários operacionais
    MANOBRA_BASE: 10000,             // por portuário operacional
    MANOBRA_MAX_PORTUARIOS: 4,       // teto: no máximo 4 portuários contam na manobra (99 = sem teto)
    CARTA_MANOBRA_MULT: 2,           // carta Manobra de Porto paga 2 x base x portuários
    // Salvatagem (só com Oceânico operacional)
    // Reboque Oceânico / Salvatagem (casa 11 e cartas): o evento de dinheiro grande.
    // Só com Rebocador Oceânico operacional + Certificado Tuglords.
    SALVATAGEM_PREMIOS: [40000, 45000, 50000, 55000, 60000],
    // Manobra só rende com MANOBRA_CERTS_SEGURANCA certificado(s) de segurança (v3.3: 1).
    MANOBRA_EXIGE_CERTIFICADOS: true,
    MANOBRA_CERTS_SEGURANCA: 1,      // v3.3: 1 certificado de segurança basta para manobrar (antes 4)
    UNIVERSIDADE_PROVAS_POR_VISITA: 2, // v3.3: provas de segurança por visita (Universidade e Treinamento)
    TREINAMENTO_CERT_SEGURANCA: true, // v3.3: casa 25 Treinamento também dá certificado de segurança
    TREINAMENTO_CUSTO_PROVA: 3000,   // v3.3: custo por prova de segurança no Treinamento (F$ 3 mi)
    // UNISALVAGE: cair 3x (1 quiz de acesso + 2 quizzes). Reprovou: refaz a mesma etapa na próxima visita.
    UNISALVAGE_ETAPAS: 2,            // v3.3: 2 aprovações na UNISALVAGE dão o Certificado Tuglords (antes 3)
    // ===== Engajamento (TV) =====
    EVENTOS_RODADA_A_CADA: 5,        // a cada N rodadas sorteia um evento global (vale só naquela rodada)
    EVENTOS_RODADA: [
        { id: 'safra', nome: 'Safra recorde', texto: 'manobras pagam em dobro nesta rodada', cor: '#22c55e', manobraMult: 2 },
        { id: 'ressaca', nome: 'Ressaca no porto', texto: 'sem manobra nesta rodada', cor: '#64748b', manobraMult: 0 },
        { id: 'aluguel_alta', nome: 'Aluguel em alta', texto: 'arrendamentos +50% nesta rodada', cor: '#f97316', aluguelMult: 1.5 },
        { id: 'taxa_reduzida', nome: 'Taxa reduzida', texto: 'impostos e taxas pela metade nesta rodada', cor: '#38bdf8', taxaMult: 0.5 },
        { id: 'mar_calmo', nome: 'Mar calmo', texto: 'Reboque Oceânico paga +50% nesta rodada', cor: '#a78bfa', salvamentoMult: 1.5 }
    ],
    RETA_FINAL_RODADAS: 5,           // últimas N rodadas do LIMITE_RODADAS
    RETA_FINAL_MULT: 1.5,            // multiplicador de pagamentos recebidos (exceto salário)
    LEILAO_ATIVO: true,
    LEILAO_LANCE_INICIAL: 0.5,       // lance mínimo = 50% do preço do porto
    LEILAO_INCREMENTO: 1000,         // cada lance sobe F$ 1 mi
    // Economia P2 (v3e, sem empréstimo)
    OCEANICO_NA_FORMATURA: true,     // formatura UNISALVAGE dá um Rebocador Oceânico grátis
    DESAFIO_CAIXA_MIN: 10000,        // desafio só se os dois tiverem caixa >= F$ 10 mi
    LIQUIDACAO_TAXA: 0.7,            // venda forçada/voluntária ao Banco paga 70% (antes 50%)
    LIQUIDACAO_INCLUI_OCEANICO: true, // o Rebocador Oceânico também pode ser vendido ao Banco
    TETO_PAGTO_BANCO_PCT_CAIXA: 0.5, // pagamentos ao Banco limitados a 50% do caixa atual
    EMPRESTIMO_ATIVO: false,         // false: sem empréstimos (botões ocultos, takeLoan bloqueado); true traz de volta
    OCEANICO_FRETE_LARGADA: 3000,    // P3: frete de F$ 3 mi por volta para quem tem Rebocador Oceânico (via credit)
    DESAFIO_APOSTA: 3000,            // quem erra paga a quem acerta (F$ 3 mi)
    DESAFIO_MULTA_ERRO_DUPLO: 500,   // dois erros: cada um paga ao Banco
    CONQUISTA_FROTA: 5,
    CONQUISTA_SALVAMENTO_EPICO: 50000,
    NARRADOR_PAGAMENTO_GRANDE: 30000,
    NARRADOR_QUASE_FALENCIA: 2000,
    UNISALVAGE_TAXA_PROVA: 2000,     // taxa por tentativa de prova (paga antes do quiz, passe ou não)
    // Rebocador Oceânico (loja, kits e brindes) exige o Certificado Tuglords.
    OCEANICO_EXIGE_CERT_TUGLORDS: true,
    // Vistoria LOYDS TUGSTER
    VISTORIA_PREMIO: 2000,
    VISTORIA_TURNOS_PRESO: 3,
    // Casa Docagem Obrigatória (regras 24/10)
    DOCAGEM_CASA: 2000,
    DOCAGEM_CASA_PERDE_TURNO: true,
    // Fim de jogo (Jossian ainda decide a condição de vitória: ajuste aqui).
    LIMITE_RODADAS: 40,              // 0 = sem limite
    CRITERIO_VENCEDOR: 'patrimonio', // 'patrimonio' (netWorth) ou 'dinheiro' (só caixa)
    VITORIA_SUPREMA_ATIVA: true      // TugLord Supremo continua encerrando antes do limite
};

// Aliases das regras 24/10 (mantidos para o código existente).
export const WORKSHOP_STAFF_PAY = REGRAS.OFICINA_BONUS;
export const WORKSHOP_SERVICE_FEE = REGRAS.OFICINA_SERVICO;
export const DOCKING_HOUSE_COST = REGRAS.DOCAGEM_CASA;
export const DOCKING_HOUSE_SKIP_TURN = REGRAS.DOCAGEM_CASA_PERDE_TURNO;
export const CARD_TUG_CASH = REGRAS.CARTA_TUG_DINHEIRO;
// Dono inicial de todo ativo (portos, oficinas, serviços, Estaleiro): o Banco.
export const BANK_OWNER_LABEL = 'Banco';

// Baralho Sorte/Azar v2 (32 cartas: 24 Sorte, 8 Azar). val > 0 = Sorte, val < 0 = Azar.
// Prêmios grandes: F$ 7,2 a 10,8 mi (balanceamento Dr. Fintech).
// asset: port_tug | ocean_tug | port_kit (2 portuários) | special_kit (1 portuário + 1 oceânico)
//        | tug_coupon | maneuver (base x portuários) | salvage (só com Oceânico)
export const CARD_DECK = [
    { msg: 'Salvatagem de petroleiro! +F$ 10,8 mi', val: 10800 },
    { msg: 'Contrato anual de porto! +F$ 9,6 mi', val: 9600 },
    { msg: 'Resgate offshore! +F$ 9 mi', val: 9000 },
    { msg: 'Reboque de plataforma! +F$ 10,2 mi', val: 10200 },
    { msg: 'Salvamento de graneleiro! +F$ 8,4 mi', val: 8400 },
    { msg: 'Contrato com terminal de contêineres! +F$ 9,6 mi', val: 9600 },
    { msg: 'Assistência a navio encalhado! +F$ 7,8 mi', val: 7800 },
    { msg: 'Frota contratada por estatal de energia! +F$ 10,8 mi', val: 10800 },
    { msg: 'Escolta de navio gaseiro! +F$ 8,4 mi', val: 8400 },
    { msg: 'Prêmio de segurança do ano! +F$ 7,2 mi', val: 7200 },
    { msg: 'Kit Porto! 2 Rebocadores Portuários', val: 0, asset: 'port_kit', good: true },
    { msg: 'Kit Porto! 2 Rebocadores Portuários', val: 0, asset: 'port_kit', good: true },
    { msg: 'Kit Especial! 1 Portuário + 1 Oceânico', val: 0, asset: 'special_kit', good: true },
    { msg: 'Você ganhou um Rebocador Portuário!', val: 0, asset: 'port_tug', good: true },
    { msg: 'Você ganhou um Rebocador Portuário!', val: 0, asset: 'port_tug', good: true },
    { msg: 'Você ganhou um Rebocador Oceânico!', val: 0, asset: 'ocean_tug', good: true },
    { msg: 'Cupom do estaleiro! 50% no próximo Portuário', val: 0, asset: 'tug_coupon', good: true },
    { msg: 'Manobra de Porto! Atracação de navio', val: 0, asset: 'maneuver', good: true },
    { msg: 'Manobra de Porto! Desatracação noturna', val: 0, asset: 'maneuver', good: true },
    { msg: 'Manobra de Porto! Giro na bacia', val: 0, asset: 'maneuver', good: true },
    { msg: 'Manobra de Porto! Navio de cruzeiro', val: 0, asset: 'maneuver', good: true },
    { msg: 'Reboque Oceânico! Navio à deriva', val: 0, asset: 'salvage', good: true },
    { msg: 'Reboque Oceânico! Plataforma em tempestade', val: 0, asset: 'salvage', good: true },
    { msg: 'Reboque Oceânico! Resgate de cargueiro', val: 0, asset: 'salvage', good: true },
    { msg: 'Multa ambiental! -F$ 2 mi', val: -2000 },
    { msg: 'Avaria no motor! -F$ 4 mi', val: -4000 },
    { msg: 'Manutenção emergencial! -F$ 3 mi', val: -3000 },
    { msg: 'Avaria grave no guincho! -F$ 6 mi', val: -6000 },
    { msg: 'Multa da Capitania dos Portos! -F$ 8 mi', val: -8000 },
    { msg: 'Colisão no cais! -F$ 10 mi', val: -10000 },
    { msg: 'Derramamento de óleo! -F$ 15 mi', val: -15000 },
    { msg: 'Greve no porto! -F$ 7 mi', val: -7000 },
];

// Quizzes da UNISALVAGE: uma lista por etapa (1 = acesso, 2 = formação; REGRAS.UNISALVAGE_ETAPAS = 2).
export const UNISALVAGE_QUESTIONS = [
    [
        { question: 'Antes de uma salvatagem, a prioridade número 1 é:', options: ['Salvar vidas', 'Salvar a carga e o casco antes de tudo', 'Calcular o prêmio da salvatagem', 'Chamar a imprensa'], correct: 'Salvar vidas' },
        { question: 'Ao avistar náufragos, o primeiro passo do rebocador é:', options: ['Avisar pelo rádio e prestar socorro', 'Seguir viagem', 'Fotografar a cena', 'Esperar o fim do turno'], correct: 'Avisar pelo rádio e prestar socorro' },
        { question: 'O canal VHF de socorro e chamada é o:', options: ['Canal 16', 'Canal 2', 'Canal 99', 'Canal 44'], correct: 'Canal 16' }
    ],
    [
        { question: 'O contrato padrão de salvatagem "sem cura, sem pagamento" é o:', options: ['Lloyd\'s Open Form (LOF)', 'Contrato de frete por viagem redonda', 'Carta-partida a tempo', 'Conhecimento de embarque'], correct: 'Lloyd\'s Open Form (LOF)' },
        { question: 'Em reboque oceânico, o cabo deve ter uma catenária para:', options: ['Absorver os trancos', 'Economizar cabo no convés', 'Aumentar a velocidade', 'Ficar bonito'], correct: 'Absorver os trancos' },
        { question: 'Antes de conectar o reboque num navio à deriva, faça:', options: ['Avaliação de risco e plano de conexão', 'Aproximação em velocidade máxima', 'Nada, é rotina', 'Desligar o rádio'], correct: 'Avaliação de risco e plano de conexão' }
    ]
];

export const INSPECTION_QUESTIONS = [
    { question: 'Na vistoria de casco, o que o classificador verifica primeiro?', options: ['Espessura das chapas e corrosão', 'A cor da pintura', 'O nome do comandante', 'O modelo e a marca do rádio VHF da ponte'], correct: 'Espessura das chapas e corrosão' },
    { question: 'O gato de reboque precisa ter qual teste em dia?', options: ['Teste de liberação de emergência', 'Teste de pintura', 'Teste de velocidade máxima em mar aberto', 'Nenhum teste'], correct: 'Teste de liberação de emergência' },
    { question: 'O que indica o Bollard Pull no certificado do rebocador?', options: ['Força de tração estática', 'Velocidade máxima', 'Consumo de combustível por hora de máquina', 'Calado do navio'], correct: 'Força de tração estática' },
    { question: 'Qual documento comprova que o rebocador está em classe?', options: ['Certificado de Classe válido', 'Nota fiscal do motor', 'Carteira de habilitação do marinheiro de convés', 'Licença de pesca'], correct: 'Certificado de Classe válido' },
    { question: 'O cabo de reboque deve ser inspecionado quanto a:', options: ['Fios rompidos, desgaste e corrosão', 'Somente o comprimento total e o diâmetro nominal', 'A cor do cabo', 'A marca do fabricante'], correct: 'Fios rompidos, desgaste e corrosão' },
    { question: 'Qual equipamento de salvatagem é obrigatório a bordo?', options: ['Balsas e coletes salva-vidas', 'Ar-condicionado em todos os camarotes', 'Televisão', 'Máquina de café'], correct: 'Balsas e coletes salva-vidas' },
    { question: 'O guincho de reboque deve ter freio:', options: ['Testado e com capacidade certificada', 'Desligado', 'Só manual, sem teste e sem certificado', 'Opcional'], correct: 'Testado e com capacidade certificada' },
    { question: 'Antes de sair do dique, o que precisa ser conferido?', options: ['Válvulas de fundo e estanqueidade', 'O cardápio da semana e o estoque da cozinha', 'A música do rádio', 'Nada'], correct: 'Válvulas de fundo e estanqueidade' },
    { question: 'Extintores a bordo devem estar:', options: ['Carregados e com inspeção em dia', 'Guardados no porão, longe do uso diário', 'Vazios para não pesar', 'Só no camarote'], correct: 'Carregados e com inspeção em dia' },
    { question: 'O que é a borda livre (linha de carga)?', options: ['Distância entre a linha d\'água e o convés', 'A altura do mastro acima da casaria', 'O tamanho da hélice', 'A largura do cais'], correct: 'Distância entre a linha d\'água e o convés' },
    { question: 'A propulsão azimutal deve ser vistoriada quanto a:', options: ['Vedações, folgas e resposta do comando', 'A cor do propulsor', 'O peso total da tripulação embarcada', 'Nada, é automática'], correct: 'Vedações, folgas e resposta do comando' },
    { question: 'O alarme geral do rebocador deve ser:', options: ['Audível em todos os compartimentos', 'Desligado sempre que estiver em porto', 'Só na ponte', 'Opcional'], correct: 'Audível em todos os compartimentos' }
];

// Rótulos amigáveis exibidos ao jogador (a interface não deve mostrar o ID cru).
export const CERT_LABELS = {
    // Segurança (obrigatórios)
    fire: 'Incêndio',
    rescue: 'Homem ao Mar',
    collision: 'Colisão',
    abandon: 'Abandono',
    // Técnicos (opcionais)
    azimuth: 'Propulsão Azimutal',
    diesel: 'Motores Diesel',
    highspeed: 'Diesel de Alta Rotação',
    maneuver: 'Manobra de Rebocador'
};

export const TRAINING_QUESTIONS = {
    // ===== CERTIFICADOS DE SEGURANÇA (Universidade) — OBRIGATÓRIOS =====
    fire: [
        {
            question: "Qual é a primeira ação ao descobrir um incêndio a bordo?",
            options: [
                "Abandonar o navio",
                "Jogar água do mar no fogo",
                "Soar o alarme geral",
                "Contatar o armador"
            ],
            correct: "Soar o alarme geral"
        },
        {
            question: "Qual classe de incêndio envolve líquidos inflamáveis?",
            options: ["Classe A", "Classe B", "Classe C", "Classe D"],
            correct: "Classe B"
        }
    ],
    rescue: [
        {
            question: "Homem ao mar com ação imediata: qual manobra leva o navio de volta à própria esteira, em rumo oposto?",
            options: [
                "Manobra de Scharnow",
                "Manobra de Williamson",
                "Manobra de Anderson",
                "Manobra de Boutakov"
            ],
            correct: "Manobra de Williamson"
        },
        {
            question: "Qual equipamento deve ser lançado primeiro para homem ao mar?",
            options: ["Colete salva-vidas", "Boia circular", "Corda com nó", "Escada de embarque pelo costado"],
            correct: "Boia circular"
        }
    ],
    collision: [
        {
            question: "Qual é a regra de ouro para evitar colisões no mar?",
            options: ["Máquinas sempre prontas", "Vigília constante", "Velocidade reduzida", "Sinais sonoros contínuos e repetidos"],
            correct: "Vigília constante"
        },
        {
            question: "Duas embarcações a motor em rumos cruzados (Regra 15 do RIPEAM): qual deve manobrar?",
            options: [
                "A de menor porte",
                "A que avistou primeiro",
                "A que tem o outro por bombordo",
                "A que tem o outro por boreste"
            ],
            correct: "A que tem o outro por boreste"
        }
    ],
    abandon: [
        {
            question: "Qual sinal sonoro é o alarme geral de emergência a bordo?",
            options: ["Um apito longo", "Três apitos curtos", "Sete curtos e um longo", "Dois apitos longos"],
            correct: "Sete curtos e um longo"
        },
        {
            question: "O que é EPIRB?",
            options: [
                "Equipamento de primeiros socorros",
                "Radiobaliza de localização de sinistros",
                "Equipamento de proteção individual",
                "Extintor portátil de incêndio"
            ],
            correct: "Radiobaliza de localização de sinistros"
        }
    ],

    // ===== CERTIFICADOS TÉCNICOS (Oficinas/Treinamento) — OPCIONAIS =====
    // SCHOREL — Propulsão Azimutal (Rudderpropeller / Z-drive)
    azimuth: [
        {
            question: "O que é um propulsor azimutal (Rudderpropeller), especialidade da SCHOREL?",
            options: [
                "Uma hélice de passo fixo montada em eixo único e reto",
                "Um propulsor que gira 360° fornecendo empuxo em qualquer direção",
                "Um leme convencional sem hélice",
                "Um motor de propulsão a vapor"
            ],
            correct: "Um propulsor que gira 360° fornecendo empuxo em qualquer direção"
        },
        {
            question: "Qual é a principal vantagem do propulsor azimutal em um rebocador?",
            options: [
                "Elimina a necessidade de motor principal a bordo",
                "Permite navegar sem combustível",
                "Alta manobrabilidade, dispensando leme convencional",
                "Reduz a tripulação a zero"
            ],
            correct: "Alta manobrabilidade, dispensando leme convencional"
        },
        {
            question: "Em um rebocador ASD (Azimuth Stern Drive), onde ficam os propulsores azimutais?",
            options: [
                "Na popa",
                "No topo do mastro",
                "Acima da linha d'água, presos no costado",
                "Fixos na proa"
            ],
            correct: "Na popa"
        }
    ],
    // KAT — Motores Diesel marítimos
    diesel: [
        {
            question: "Qual é o ciclo de funcionamento dos motores marítimos KAT?",
            options: [
                "Ciclo Otto (ignição por vela e faísca)",
                "Ciclo diesel (ignição por compressão)",
                "Ciclo a vapor",
                "Propulsão eólica"
            ],
            correct: "Ciclo diesel (ignição por compressão)"
        },
        {
            question: "No motor diesel, como ocorre a ignição do combustível?",
            options: [
                "Por uma vela de ignição",
                "Pela alta temperatura do ar comprimido",
                "Por chama piloto externa ao cilindro, ligada sempre",
                "Por descarga da bateria no cilindro"
            ],
            correct: "Pela alta temperatura do ar comprimido"
        },
        {
            question: "Qual sistema é essencial para evitar o superaquecimento de um motor diesel marítimo?",
            options: [
                "Circuito de arrefecimento (água)",
                "Sistema de velas de ignição e bobinas",
                "Vela de proa",
                "Âncora flutuante"
            ],
            correct: "Circuito de arrefecimento (água)"
        }
    ],
    // MDU — Motores diesel de alta rotação (Series 2000/4000)
    highspeed: [
        {
            question: "Os motores MDU (Series 2000/4000) são classificados como diesel de qual categoria?",
            options: [
                "Baixa rotação a vapor",
                "Alta rotação (high-speed)",
                "Combustão externa com caldeira auxiliar",
                "Propulsão a vela"
            ],
            correct: "Alta rotação (high-speed)"
        },
        {
            question: "Para que serve o turbocompressor em um motor diesel de alta rotação?",
            options: [
                "Aproveita os gases de escape para aumentar a admissão de ar",
                "Gera a ignição por faísca dentro de cada cilindro",
                "Funciona como leme auxiliar",
                "Substitui o óleo lubrificante"
            ],
            correct: "Aproveita os gases de escape para aumentar a admissão de ar"
        },
        {
            question: "Por que motores diesel de alta rotação são usados em embarcações de trabalho?",
            options: [
                "Alta potência com menor peso e volume",
                "Por dispensarem combustível",
                "Por não exigirem lubrificação",
                "Por funcionarem sem ar"
            ],
            correct: "Alta potência com menor peso e volume"
        }
    ],
    // Treinamento — Manobra e operação de rebocador
    maneuver: [
        {
            question: "O que mede o 'bollard pull' de um rebocador?",
            options: [
                "A força de tração estática que ele consegue exercer",
                "A velocidade máxima do rebocador",
                "O peso da âncora",
                "O volume do tanque de combustível"
            ],
            correct: "A força de tração estática que ele consegue exercer"
        },
        {
            question: "Em uma manobra de atracação, qual é a função típica do rebocador?",
            options: [
                "Empurrar ou puxar o navio para posicioná-lo no berço",
                "Transportar a carga do navio",
                "Substituir o motor do navio",
                "Içar os contêineres"
            ],
            correct: "Empurrar ou puxar o navio para posicioná-lo no berço"
        },
        {
            question: "O que caracteriza uma manobra de 'escort towing'?",
            options: [
                "Acompanhar o navio pronto para controlá-lo em emergência",
                "Rebocar apenas a âncora",
                "Limpar o casco do navio",
                "Abastecer o navio em alto-mar"
            ],
            correct: "Acompanhar o navio pronto para controlá-lo em emergência"
        }
    ]
};

export const OCEAN_EVENTS = [
    // EVENTOS POSITIVOS (4)
    {
        id: 1,
        name: 'Vento Favorável',
        icon: '⛵',
        description: 'As correntes estão a seu favor!',
        effect: 'Avance até a próxima propriedade sem pagar aluguel',
        type: 'advance_to_property',
        skipRent: true
    },
    {
        id: 2,
        name: 'Avistamento de Baleias',
        icon: '🐋',
        description: 'Contrato de pesquisa oceanográfica!',
        effect: 'Receba F$ 300 mil de contrato científico',
        type: 'money',
        amount: 300
    },
    {
        id: 3,
        name: 'Corrente do Brasil',
        icon: '🌊',
        description: 'Corrente oceânica acelera sua navegação!',
        effect: 'Avance 5 casas',
        type: 'move',
        spaces: 5
    },
    {
        id: 4,
        name: 'Contrato de Emergência',
        icon: '📡',
        description: 'Reboque emergencial bem remunerado!',
        effect: 'Receba F$ 500 mil imediatamente',
        type: 'money',
        amount: 500
    },

    // EVENTOS NEGATIVOS (3)
    {
        id: 5,
        name: 'Tempestade Tropical',
        icon: '🌀',
        description: 'Condições adversas forçam retorno!',
        effect: 'Volte à última propriedade visitada',
        type: 'return_to_last_property'
    },
    {
        id: 6,
        name: 'Avaria no Motor',
        icon: '⚠️',
        description: 'Reparo emergencial necessário!',
        effect: 'Pague F$ 200 mil de manutenção',
        type: 'money',
        amount: -200
    },
    {
        id: 7,
        name: 'Zona de Risco',
        icon: '🦈',
        description: 'Navegação perigosa! Docagem preventiva.',
        effect: 'Perca o próximo turno',
        type: 'skip_turn'
    },

    // EVENTOS NEUTROS/MISTOS (3)
    {
        id: 8,
        name: 'Inspeção de Segurança',
        icon: '🏴‍☠️',
        description: 'Fiscalização de segurança marítima',
        effect: 'Certificados completos = F$ 200 mil | Incompleto = F$ 150 mil multa',
        type: 'inspection'
    },
    {
        id: 9,
        name: 'Oportunidade de Salvamento',
        icon: '🎣',
        description: 'Embarcação em perigo solicita auxílio',
        effect: 'Aceitar: +F$ 400 mil mas perca turno | Recusar: continue',
        type: 'choice_salvage'
    },
    {
        id: 10,
        name: 'Escolha de Rota',
        icon: '🌅',
        description: 'Duas rotas disponíveis para seu destino',
        effect: 'Rota Norte: +3 casas | Rota Sul: +F$ 250 mil',
        type: 'choice_route'
    }
];

export const playerColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
export const playerIcons = ['⚓', '🚢', '⛵', '🛟', '🎣', '🏴‍☠️'];
