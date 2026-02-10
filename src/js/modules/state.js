export const gameState = {
    players: [],
    currentPlayerIndex: 0,
    currentRound: 1,
    phase: 'setup', // setup, playing
    playerOrder: [],
    diceRolled: false,
    houses: [
        { name: 'Casa Inicial', type: 'start', actions: [] },
        { name: 'Porto de Fortaleza', type: 'port', price: 5000, actions: ['buy'] },
        { name: 'Evento Oceânico', type: 'event', actions: [] },
        { name: 'Porto de Santos', type: 'port', price: 7000, actions: ['buy'] },
        { name: 'Posto de Combustível', type: 'fuel', price: 3000, actions: ['buy'] },
        { name: 'Banco', type: 'bank', actions: ['loan'] },
        { name: 'Porto do Rio', type: 'port', price: 8000, actions: ['buy'] },
        { name: 'Carta Surpresa', type: 'surprise', actions: [] },
        { name: 'Oficina Naval', type: 'workshop', price: 4000, actions: ['buy'] },
        { name: 'Canto Sorte', type: 'corner', actions: [] }, // Index 9 (Visual Corner)
        // Side 2 (Left) 10-17
        { name: 'Porto de Salvador', type: 'port', price: 6000, actions: ['buy'] },
        { name: 'Evento Oceânico', type: 'event', actions: [] },
        { name: 'Estaleiro Atlântico', type: 'workshop', price: 5000, actions: ['buy'] },
        { name: 'Porto de Vitória', type: 'port', price: 5500, actions: ['buy'] },
        { name: 'Posto de Abastecimento', type: 'fuel', price: 3500, actions: ['buy'] },
        { name: 'Porto de Macaé', type: 'port', price: 7500, actions: ['buy'] },
        { name: 'Carta Sorte', type: 'luck', actions: [] },
        { name: 'Porto do Açu', type: 'port', price: 8000, actions: ['buy'] },
        // Corner 18 (TugLord)
        { name: 'Certificação TugLord', type: 'corner', actions: [] },
        // Side 3 (Top) 19-26
        { name: 'Porto de Itajaí', type: 'port', price: 6500, actions: ['buy'] },
        { name: 'Evento Oceânico', type: 'event', actions: [] },
        { name: 'Oficina de Reparos', type: 'workshop', price: 4500, actions: ['buy'] },
        { name: 'Porto de Rio Grande', type: 'port', price: 6000, actions: ['buy'] },
        { name: 'Bolsa de Valores', type: 'stock', actions: ['invest'] },
        { name: 'Porto de Paranaguá', type: 'port', price: 7000, actions: ['buy'] },
        { name: 'Treinamento', type: 'training', price: 2000, actions: ['buy'] },
        { name: 'Porto de Suape', type: 'port', price: 7500, actions: ['buy'] },
        // Corner 27 (Bank)
        { name: 'Banco Central', type: 'corner', actions: [] },
        // Side 4 (Right) 28-35
        { name: 'Porto de Manaus', type: 'port', price: 5000, actions: ['buy'] },
        { name: 'Carta Azar', type: 'luck', actions: [] },
        { name: 'Estaleiro Naval', type: 'workshop', price: 5500, actions: ['buy'] },
        { name: 'Porto de Belém', type: 'port', price: 5500, actions: ['buy'] },
        { name: 'Evento Oceânico', type: 'event', actions: [] },
        { name: 'Porto de São Luís', type: 'port', price: 6000, actions: ['buy'] },
        { name: 'Taxa Portuária', type: 'tax', price: 1000, actions: ['pay'] },
        { name: 'Porto de Vila do Conde', type: 'port', price: 6500, actions: ['buy'] }
    ].map((h, i) => ({ ...h, pos: i }))
};

export const TRAINING_QUESTIONS = {
    fire: [
        {
            question: "Qual é a primeira ação ao descobrir um incêndio a bordo?",
            options: [
                "Abandonar o navio imediatamente",
                "Tentar apagar com água do mar",
                "Soar o alarme geral",
                "Contactar o armador"
            ],
            correct: "Soar o alarme geral"
        },
        {
            question: "Qual classe de incêndio envolve líquidos inflamáveis?",
            options: [
                "Classe A",
                "Classe B",
                "Classe C",
                "Classe D"
            ],
            correct: "Classe B"
        }
    ],
    rescue: [
        {
            question: "Qual manobra é usada para resgatar homem ao mar?",
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
            options: [
                "Colete salva-vidas",
                "Boia circular",
                "Corda com nó",
                "Escada de embarque"
            ],
            correct: "Boia circular"
        }
    ],
    collision: [
        {
            question: "Qual é a regra de ouro para evitar colisões no mar?",
            options: [
                "Máquinas sempre prontas",
                "Vigília constante",
                "Velocidade reduzida",
                "Sinais sonoros contínuos"
            ],
            correct: "Vigília constante"
        },
        {
            question: "Em situação de risco de colisão, qual embarcação deve manobrar?",
            options: [
                "A menor embarcação",
                "A que avista primeiro",
                "A que tem o outro por bombordo",
                "A que tem o outro por boreste"
            ],
            correct: "A que tem o outro por boreste"
        }
    ],
    abandon: [
        {
            question: "Qual sinal sonoro indica abandono de navio?",
            options: [
                "Um apito longo",
                "Três apitos curtos",
                "Sete apitos curtos e um longo",
                "Dois apitos longos"
            ],
            correct: "Sete apitos curtos e um longo"
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
