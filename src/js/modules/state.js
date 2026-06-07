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
        { name: 'Evento Oceânico', type: 'event', icon: '🌊', actions: [] },
        { name: 'Porto de Santos', type: 'port', price: 12000, rent: [1200, 2400, 4500, 7000, 10000, 14000], icon: '🚢', actions: ['buy'] },
        { name: 'Posto de Combustível', type: 'service', price: 6000, icon: '⛽', actions: ['buy'] },
        { name: 'Banco', type: 'bank', icon: '🏦', actions: ['loan'] },
        { name: 'Loja de Rebocadores', type: 'tug_purchase', price: 10000, tugType: 'port', icon: '🛒', actions: ['buy'] }, // Added Shop
        { name: 'Carta Surpresa', type: 'surprise', icon: '🎁', actions: [] },
        { name: 'SCHOTTEL', type: 'workshop', price: 8000, serviceFee: 1500, certificate: 'azimuth', icon: '🛠️', actions: ['buy'] },
        { name: 'Canto Sorte', type: 'corner', icon: '🍀', actions: [] }, // Index 9
        // Side 2 (Left)
        { name: 'Porto de Salvador', type: 'port', price: 9000, rent: [900, 1800, 3500, 5500, 8000, 11000], icon: '⛵', actions: ['buy'] },
        { name: 'Evento Oceânico', type: 'event', icon: '🌊', actions: [] },
        { name: 'CAT', type: 'workshop', price: 9000, serviceFee: 1800, certificate: 'diesel', icon: '🏭', actions: ['buy'] },
        { name: 'Porto de Vitória', type: 'port', price: 8500, rent: [850, 1700, 3200, 5200, 7800, 10500], icon: '🚤', actions: ['buy'] },
        { name: 'Posto de Abastecimento', type: 'service', price: 6500, icon: '⛽', actions: ['buy'] },
        { name: 'Porto de Macaé', type: 'port', price: 11000, rent: [1100, 2200, 4000, 6500, 9500, 13000], icon: '⛴️', actions: ['buy'] },
        { name: 'Carta Sorte', type: 'luck', icon: '🎲', actions: [] },
        { name: 'Porto do Açu', type: 'port', price: 14000, rent: [1400, 2800, 5000, 8000, 12000, 16000], icon: '🛳️', actions: ['buy'] },
        // Corner 18
        { name: 'Certificação TugLord', type: 'tuglord_certificate', icon: '🎖️', actions: [] },
        // Side 3 (Top)
        { name: 'Porto de Itajaí', type: 'port', price: 9500, rent: [950, 1900, 3600, 5800, 8500, 11500], icon: '🛥️', actions: ['buy'] },
        { name: 'Evento Oceânico', type: 'event', icon: '🌊', actions: [] },
        { name: 'MTU', type: 'workshop', price: 8500, serviceFee: 1600, certificate: 'highspeed', icon: '🔧', actions: ['buy'] },
        { name: 'Porto de Rio Grande', type: 'port', price: 9000, rent: [900, 1800, 3500, 5500, 8000, 11000], icon: '🚤', actions: ['buy'] },
        { name: 'Bolsa de Valores', type: 'stock_exchange', icon: '📈', actions: ['invest'] },
        { name: 'Porto de Paranaguá', type: 'port', price: 10500, rent: [1050, 2100, 3900, 6200, 9000, 12500], icon: '⛴️', actions: ['buy'] },
        { name: 'Treinamento', type: 'training', price: 3000, certificate: 'maneuver', icon: '🎓', actions: ['buy'] },
        { name: 'Porto de Suape', type: 'port', price: 11500, rent: [1150, 2300, 4200, 6800, 9800, 13500], icon: '🚢', actions: ['buy'] },
        // Corner 27
        { name: 'Banco Central', type: 'bank', icon: '🏛️', actions: [] },
        // Side 4 (Right)
        { name: 'Porto de Manaus', type: 'port', price: 8000, rent: [800, 1600, 3000, 5000, 7500, 10000], icon: '⛴️', actions: ['buy'] },
        { name: 'Carta Azar', type: 'luck', icon: '⚠️', actions: [] },
        { name: 'Estaleiro Naval', type: 'service', price: 12000, tuglordBuildCost: 20000, icon: '🏗️', actions: ['buy'] },
        { name: 'Porto de Belém', type: 'port', price: 8500, rent: [850, 1700, 3200, 5200, 7800, 10500], icon: '⛵', actions: ['buy'] },
        { name: 'Loja de Rebocadores (Oceânico)', type: 'tug_purchase', price: 15000, tugType: 'ocean', icon: '🛒', actions: ['buy'] }, // Added Shop
        { name: 'Porto de São Luís', type: 'port', price: 10000, rent: [1000, 2000, 3800, 6000, 8800, 12000], icon: '🚤', actions: ['buy'] },
        { name: 'Taxa Portuária', type: 'tax', price: 2000, icon: '💸', actions: ['pay'] },
        { name: 'Porto de Vila do Conde', type: 'port', price: 9500, rent: [950, 1900, 3600, 5800, 8500, 11500], icon: '🚢', actions: ['buy'] }
    ].map((h, i) => ({ ...h, pos: i }))
};

// Certificados técnicos do jogo. Cada um é concedido por uma oficina/casa
// específica e exige aprovação no exame da respectiva área.
export const CERTIFICATES = ['azimuth', 'diesel', 'highspeed', 'maneuver'];

// Rótulos amigáveis exibidos ao jogador (a interface não deve mostrar o ID cru).
export const CERT_LABELS = {
    azimuth: 'Propulsão Azimutal',
    diesel: 'Motores Diesel',
    highspeed: 'Diesel de Alta Rotação',
    maneuver: 'Manobra de Rebocador'
};

export const TRAINING_QUESTIONS = {
    // SCHOTTEL — Propulsão Azimutal (Rudderpropeller / Z-drive)
    azimuth: [
        {
            question: "O que é um propulsor azimutal (Rudderpropeller), especialidade da SCHOTTEL?",
            options: [
                "Uma hélice de passo fixo em eixo único",
                "Um propulsor que gira 360° fornecendo empuxo em qualquer direção",
                "Um leme convencional sem hélice",
                "Um motor de propulsão a vapor"
            ],
            correct: "Um propulsor que gira 360° fornecendo empuxo em qualquer direção"
        },
        {
            question: "Qual é a principal vantagem do propulsor azimutal em um rebocador?",
            options: [
                "Elimina a necessidade de motor",
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
                "Acima da linha d'água, no costado",
                "Fixos na proa"
            ],
            correct: "Na popa"
        }
    ],
    // CAT (Caterpillar) — Motores Diesel marítimos
    diesel: [
        {
            question: "Qual é o ciclo de funcionamento dos motores marítimos Caterpillar?",
            options: [
                "Ciclo Otto (ignição por vela)",
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
                "Por chama piloto externa",
                "Por descarga da bateria no cilindro"
            ],
            correct: "Pela alta temperatura do ar comprimido"
        },
        {
            question: "Qual sistema é essencial para evitar o superaquecimento de um motor diesel marítimo?",
            options: [
                "Circuito de arrefecimento (água)",
                "Sistema de velas de ignição",
                "Vela de proa",
                "Âncora flutuante"
            ],
            correct: "Circuito de arrefecimento (água)"
        }
    ],
    // MTU — Motores diesel de alta rotação (Series 2000/4000)
    highspeed: [
        {
            question: "Os motores mtu (Series 2000/4000) são classificados como diesel de qual categoria?",
            options: [
                "Baixa rotação a vapor",
                "Alta rotação (high-speed)",
                "Combustão externa",
                "Propulsão a vela"
            ],
            correct: "Alta rotação (high-speed)"
        },
        {
            question: "Para que serve o turbocompressor em um motor diesel de alta rotação?",
            options: [
                "Aproveita os gases de escape para aumentar a admissão de ar",
                "Gera a ignição por faísca",
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
        description: 'Contrato de pesquisa marinha!',
        effect: 'Receba R$300 de contrato científico',
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
        effect: 'Receba R$500 imediatamente',
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
        effect: 'Pague R$200 de manutenção',
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
        name: 'Inspeção da Marinha',
        icon: '🏴‍☠️',
        description: 'Fiscalização de segurança marítima',
        effect: 'Certificados completos = R$200 | Incompleto = R$150 multa',
        type: 'inspection'
    },
    {
        id: 9,
        name: 'Oportunidade de Salvamento',
        icon: '🎣',
        description: 'Embarcação em perigo solicita auxílio',
        effect: 'Aceitar: +R$400 mas perca turno | Recusar: continue',
        type: 'choice_salvage'
    },
    {
        id: 10,
        name: 'Escolha de Rota',
        icon: '🌅',
        description: 'Duas rotas disponíveis para seu destino',
        effect: 'Rota Norte: +3 casas | Rota Sul: +R$250',
        type: 'choice_route'
    }
];

export const playerColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
export const playerIcons = ['⚓', '🚢', '⛵', '🛟', '🎣', '🏴‍☠️'];
