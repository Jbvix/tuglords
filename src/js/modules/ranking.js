// ========== RANKING ONLINE (Supabase REST / PostgREST) ==========
// Usa chaves PÚBLICAS (publishable/anon) — seguras por design: o acesso é
// controlado por Row Level Security (RLS) no banco. A tabela tuglords_leaderboard
// permite apenas SELECT e INSERT limitados (sem UPDATE/DELETE).

const SUPABASE_URL = 'https://yhkmrifpgyvsrtcnzcrp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ngPT_uTEWiq43XcBUx3GBQ_M9k1DP51';
const TABLE = 'tuglords_leaderboard';
const REST = `${SUPABASE_URL}/rest/v1/${TABLE}`;

function authHeaders() {
    return {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
    };
}

// Envia um placar ao ranking. Lança erro em falha de rede/HTTP.
export async function submitScore({ nickname, score, rounds = 0, won = true }) {
    const row = {
        nickname: String(nickname || 'Anônimo').trim().slice(0, 24) || 'Anônimo',
        score: Math.max(0, Math.min(100000000, Math.floor(Number(score) || 0))),
        rounds: Math.max(0, Math.min(100000, Math.floor(Number(rounds) || 0))),
        won: !!won
    };
    const res = await fetch(REST, {
        method: 'POST',
        headers: { ...authHeaders(), Prefer: 'return=minimal' },
        body: JSON.stringify([row])
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return true;
}

// Busca os melhores placares (ordem: maior pontuação primeiro).
export async function fetchTopScores(limit = 20) {
    const url = `${REST}?select=nickname,score,rounds,created_at&order=score.desc,created_at.desc&limit=${limit}`;
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
}
