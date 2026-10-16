// ========== NARRADOR / COMENTARISTA DO JOGO ==========
// Frases humoradas no estilo "comentarista esportivo" para cada jogada.
// Placeholders suportados: {player}, {porto}, {owner}, {valor}.

export const COMMENTS = {
    // Começo da partida
    start: [
        'Senhoras e senhores, soltem as amarras: começa o TugLords! ⚓',
        'A água tá calma agora... mas não por muito tempo! 🌊',
        'Capitães a postos! Que vença o mais esperto (ou o mais sortudo)!'
    ],

    // Rolar os dados (normal)
    roll: [
        '{player} sopra os dados pra dar sorte... ou pra disfarçar o nervosismo! 🎲',
        'Lá vão os dados! Tensão maior que fila de banco em dia de pagamento!',
        '{player} joga os dados e entrega o destino pro acaso. Corajoso!',
        'Atenção que {player} vai lançar... respira fundo, comandante!'
    ],

    // Dupla nos dados
    double: [
        'DUPLAAA! {player} tá com a mão quente, hein?! 🔥',
        'Dois números iguais! Até os rebocadores pararam pra aplaudir! 👏',
        'Dupla de {player}! Isso é sorte ou pacto com Netuno? 🔱'
    ],

    // Comprar porto/propriedade
    buy: [
        '{player} abre a carteira e leva {porto}! Investidor nato ou gastador compulsivo? 💸',
        'Mais um porto no império de {player}! Monopólio à vista! 🏴',
        'Vendido! {porto} agora é de {player}. Anota aí no cartório marítimo! 📜',
        '{player} fincou a bandeira em {porto}. Território conquistado!'
    ],

    // Pagar aluguel a outro jogador
    rent: [
        'Ai! {player} paga aluguel e sente no bolso... dói mais que âncora no pé! ⚓',
        'Pedágio portuário! {owner} agradece a gentil contribuição de {player}! 🤑',
        '{player} atraca no porto errado e... cadê a maquininha? Paga aí!',
        'Dinheiro trocando de mãos! {owner} sorri, {player} chora. 😢'
    ],

    // Cair na própria propriedade
    own: [
        '{player} chega em casa, tira os sapatos e relaxa. Sem aluguel hoje! 🏠',
        'Território amigo! {player} pode respirar aliviado.'
    ],

    // Treinamento / Universidade (certificação)
    cert: [
        'Hora da prova! {player}, você ESTUDOU pro teste de certificação ou vai no chute? 📚',
        'Exame de certificação! Torço pra {player} não ter colado... 👀',
        '{player} encara a banca examinadora. Lápis na mão e fé no coração! ✏️',
        'Teste de certificação! Quem não estuda, naufraga, comandante!'
    ],

    // Passou pela Partida
    pass: [
        '+R$4.000! {player} passou pela Partida faturando. Salário caiu! 🤑',
        '{player} deu a volta no tabuleiro e passou no caixa. Rico de novo!'
    ],

    // Carta Sorte/Azar
    luck: [
        '{player} tenta a sorte... vai que vem um trevo de quatro folhas! 🍀',
        'Carta virada! Coração na mão, igual resultado de concurso público! 😬',
        '{player} aposta na sorte. O destino é brincalhão, cuidado!'
    ],

    // Evento Oceânico
    ocean: [
        'Mares revoltos! {player} segura o leme com as duas mãos! 🌊',
        'Evento oceânico! Netuno resolveu brincar com {player} hoje...'
    ],

    // Imposto / taxa
    tax: [
        'Imposto! O Leão também navega nessas águas, {player}! 🦁',
        '{player} paga a taxa portuária. Burocracia não perdoa nem no mar!'
    ],

    // Docagem obrigatória
    dock: [
        'Rebocador na doca! Parado que nem navio esperando praticagem. ⚓',
        '{player} vai pra manutenção. Nada de correria por uns turnos!'
    ],

    // Saldo baixo
    lowcash: [
        '{player} tá raspando o tacho... hora de um empréstimo (ou de rezar)! 🙏',
        'Alerta de maré baixa no caixa de {player}! Segura as pontas!'
    ],

    // Falência
    bankrupt: [
        'E {player} vai a nocaute! O mar não perdoa, senhores! 💀',
        'Fim da linha pra {player}... recolhe as redes e vai pra casa! 🎣',
        '{player} afundou com tudo! Buááá, um minuto de silêncio. ⚓'
    ],

    // Vitória
    win: [
        'É CAMPEÃO! {player} domina os sete mares! TugLord Supremo! 🏆',
        'Acabou! {player} é o lorde absoluto dos rebocadores! 👑',
        '{player} levanta a taça! Que partida, senhoras e senhores!'
    ]
};

function fill(line, ctx) {
    return line
        .replace(/\{player\}/g, ctx.player || 'o jogador')
        .replace(/\{porto\}/g, ctx.porto || 'o porto')
        .replace(/\{owner\}/g, ctx.owner || 'o dono')
        .replace(/\{valor\}/g, ctx.valor != null ? ctx.valor : '');
}

// Retorna uma frase aleatória do evento, já com os nomes preenchidos.
export function pickComment(event, ctx = {}) {
    const pool = COMMENTS[event];
    if (!pool || pool.length === 0) return null;
    const line = pool[Math.floor(Math.random() * pool.length)];
    return fill(line, ctx);
}
