# Changelog

## Sincronização com o Netlify (16/11/2026)

Branch de trabalho: `sync/netlify-20261116`, criada a partir de `origin/main` (2950fea).

### Origem das cópias

As cópias vieram dos sites publicados no Netlify e foram conferidas por SHA-1
contra a lista de arquivos de cada deploy, depois de remover o script de
monitoramento (RUM) que a Netlify injeta no HTML.

| Site | Deploy publicado | Data | Destino no repo |
|---|---|---|---|
| tuglords.netlify.app | 6ada6e3ef53e5b69b6d56e2f | 22/10/2026 | raiz |
| tuglords-tv.netlify.app | 6af4f3c84a36813e417266af | 11/11/2026 (publicado em 12/11 UTC) | `tv-classico/` |
| tuglords-porto.netlify.app | 6af4f3c88438c53b42ad7da9 | 11/11/2026 (publicado em 12/11 UTC) | fora deste repo |

### O que entrou

**Raiz (produção de 22/10)**

- Oficinas renomeadas para evitar marcas: SCHOTTEL para SCHOREL, CAT para KAT,
  MTU/mtu para MDU/mdu, em `src/js/modules/state.js` e em
  `TUGLORDS_IBS_v19_0_SPRINT4_OCEAN_EVENTS.html`.
- `sw.js`: cache `tuglords-v1` para `tuglords-v2`.
- Os demais arquivos publicados já eram idênticos ao `main`.
- Nomes existentes preservados (`LICENSE`, `README.md` e os HTML em maiúsculas).
  A listagem da Netlify devolve os caminhos em minúsculas; o conteúdo é o mesmo.

**`tv-classico/` (produção de 11/11)**

- TugLords Clássico para TV: pinos 3D, controle remoto, quiz e botão
  "Voltar para TuglifeFM TV" quando aberto com `?origem=fmtv`.
- Inclui `index.html`, `src/`, `icons/`, `sw.js`, `manifest.webmanifest`,
  `server.js` e a subpasta `tv/` do site (`tv/build/game.js`, áudios, efeitos
  sonoros, fontes e bibliotecas em `tv/vendor/`).
- Inclui `LICENSE-CONTENT` (conteúdo do jogo sob CC BY-SA 4.0).
- `LICENSE`, `LICENSE-CONTENT`, `README.md` e os HTML usam a grafia em
  maiúsculas citada no próprio README; o conteúdo é byte a byte o publicado.

### O que ficou de fora

- `netlify.toml`: o da raiz é idêntico ao publicado e não foi alterado. Os
  `netlify.toml` de tuglords-tv e tuglords-porto não são servidos pela Netlify
  (404), então não há cópia conferida; nenhum `netlify.toml` foi criado em
  subpastas.
- **tuglords-porto** (TugLords 3D / Porto 3D, Unity WebGL): site Netlify próprio,
  sem repositório GitHub. O pacote não estava disponível nesta máquina e não
  pertence a este repo. A proposta é um repositório separado, por exemplo
  `Jbvix/tuglords-porto`. Não confundir com o Porto Solar
  (`Jbvix/rebocador-navio-3d`), que é outro projeto e não deve ser misturado.

### Relação com a PR 9

A PR 9 (Ranking online com Supabase, branch `claude/cool-turing-JEQDf`) segue
aberta e é independente desta sincronização. Nada nela foi alterado aqui.
