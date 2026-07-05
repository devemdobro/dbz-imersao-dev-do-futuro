# Saga Section Spec — `#saga` (A Saga do Freeza)

> Fonte de verdade: **prints + textos deste documento**. Copy exata, sem inventar elementos.
> Herda 100% do `DESIGN.md`. **Não introduz cores novas** — apenas tokens do `:root` (base + `css/jornada.css`).
> Seção referida no `DESIGN.md §7.3` como `#saga`, `class="jornada"` — linha do tempo dos **6 capítulos** em **scroll vertical**.

---

## 1) Objetivo

Construir a seção **A Saga** como uma **linha do tempo vertical de 6 capítulos** que:

- Abre com um **painel de título**: eyebrow, título pôster em duas linhas (branco + dourado), tagline e rótulo de scroll.
- Empilha os **6 cards de capítulo** em coluna, em ordem narrativa (01→06).
- Cada capítulo aplica sua **cor de acento própria** via `--ch-accent` (mapeada sobre os acentos do `§2`, sem cor nova).
- Numerais grandes (`01…06`) decorativos acima de cada card.
- **HUD** (rail + dots + counter) **opcional/oculto** — reservado para evolução futura; no layout atual permanece oculto via `--jornada-timeline-mobile`.

**Comportamento-chave:** scroll vertical normal da página; sem pin, sem scrub, sem biblioteca de animação obrigatória.

**Restrição estrutural:** HTML semântico em coluna; **sem overflow horizontal** em nenhuma largura (`DESIGN.md §5`).

---

## 2) Inventário (source-of-truth)

### 2.1 HUD / cronologia (opcional — oculto no layout atual)
- **Rail** horizontal laranja (linha fina).
- **Dots** = Esferas do Dragão (1 por capítulo); dot ativo com glow.
- **Counter** `01/06` … `06/06` — número corrente em laranja, `/06` esmaecido.
- **Fill** — barra de progresso do rail.

### 2.2 Numerais decorativos
- `01`, `02`, `03`, `04`, `05`, `06` — grandes, esmaecidos, acima de cada card (`aria-hidden`).

### 2.3 Decoração hero (somente painel de título)
- **Kanji** decorativo (traço/contorno sutil) ao fundo do painel de título.

### 2.4 Painel de título
| Elemento | Copy exata | Cor / token |
|---|---|---|
| Eyebrow | `A JORNADA EM NAMEKUSEI` | `--accent-star` |
| Título linha 1 | `A Saga do` | `--text-primary` |
| Título linha 2 | `Freeza` | `--cosmic-rose` |
| Tagline | `A BATALHA QUE FORJOU UMA LENDA` | `--text-muted` (caixa alta, `--ls-label`) |
| Scroll label + seta | `ROLE PARA CONTINUAR` `↓` | label `--text-muted`; seta `--accent-star` |

### 2.5 Cards de capítulo — 6 (copy exata)

**Capítulo 01 — `--ch-accent: --cosmic-cyan`**
- Kicker: `CAPÍTULO 01`
- Título: `Chegada em Namekusei`
- Descrição: `Gohan, Kuririn e Bulma viajam até o distante planeta Namekusei em busca das Esferas do Dragão para reviver seus amigos — mas Freeza e seus soldados já estão lá com o mesmo objetivo.`
- Mídia: planeta Namekusei (verde) em campo estelar.

**Capítulo 02 — `--ch-accent: --cosmic-purple`**
- Kicker: `CAPÍTULO 02`
- Título: `O Esquadrão Ginyu ataca`
- Descrição: `Freeza convoca a temida força de elite. O Capitão Ginyu troca de corpo com Goku, e só a astúcia dos Guerreiros Z impede o desastre antes da chegada do verdadeiro perigo.`
- Mídia: Esquadrão Ginyu (cinco membros em pose).

**Capítulo 03 — `--ch-accent: --accent-star`**
- Kicker: `CAPÍTULO 03`
- Título: `A morte de Kuririn`
- Descrição: `No auge da batalha, Freeza assassina Kuririn diante de Goku. A perda do amigo de toda uma vida acende uma fúria capaz de despertar uma lenda adormecida.`
- Mídia: split Freeza / Kuririn gritando.

**Capítulo 04 — `--ch-accent: --cosmic-rose`**
- Kicker: `CAPÍTULO 04`
- Título: `O Despertar do Super Saiyajin`
- Descrição: `Cabelos dourados, aura flamejante: pela primeira vez em mil anos, um Saiyajin alcança a transformação lendária. Goku enfim encara Freeza de igual para igual.`
- Mídia: Goku Super Saiyajin (aura dourada).

**Capítulo 05 — `--ch-accent: --cosmic-cyan`**
- Kicker: `CAPÍTULO 05`
- Título: `A Batalha Final`
- Descrição: `Goku Super Saiyajin contra Freeza em 100% de seu poder. Um confronto colossal que define o destino do universo enquanto Namekusei se desfaz a cada golpe.`
- Mídia: Goku SSJ vs Freeza (choque de energia azul contra roxa).

**Capítulo 06 — `--ch-accent: --accent-star`**
- Kicker: `CAPÍTULO 06`
- Título: `A destruição de Namekusei`
- Descrição: `Com o planeta à beira da explosão, Goku enfrenta seus últimos instantes contra o tirano e prova que a esperança — e a coragem — sempre encontram um caminho.`
- Mídia: Namekusei se despedaçando em explosão.

> Kicker (`CAPÍTULO NN`) usa a `--ch-accent` do capítulo. Título em **Fredoka** (`--font-display`). Descrição em **Outfit** (`--font-body`), `--text-muted`.

---

## 3) HTML (estrutura semântica — não código final)

```
<section id="saga" class="jornada" aria-label="A Saga do Freeza">

  ├─ .jornada__pin                      ← wrapper da seção
  │
  │   ├─ .jornada__hud                   ← HUD (opcional; oculto no layout atual)
  │   │   ├─ .jornada__rail
  │   │   │   ├─ .jornada__fill
  │   │   │   └─ .jornada__dot × 6
  │   │   └─ .jornada__counter           "<span.cur>01</span>/06"
  │   │
  │   └─ .jornada__track                 ← coluna vertical (flex-direction: column)
  │       │
  │       ├─ .jornada__panel--hero       ← painel de título
  │       │   ├─ .jornada__kanji         (aria-hidden)
  │       │   ├─ .jornada__eyebrow
  │       │   ├─ h2.jornada__title
  │       │   ├─ .jornada__tagline
  │       │   └─ .jornada__scroll
  │       │
  │       └─ .jornada__card-wrap × 6     ← numeral + card por capítulo
  │           ├─ .jornada__numeral      01..06 (aria-hidden)
  │           └─ article.jornada__card
  │               ├─ .jornada__card-media
  │               ├─ .jornada__card-kicker
  │               ├─ h3.jornada__card-title
  │               └─ p.jornada__card-desc
```

Notas:
- Ordem do DOM = ordem narrativa (hero → cap.01 → … → cap.06).
- Cada `.jornada__card-wrap` recebe `style="--ch-accent: var(--cosmic-…)"` inline conforme mapa do `§5.3`.
- Cards visíveis sem dependência de JS.

---

## 4) CSS por bloco

> **Regra transversal:** só tokens do `:root` (base do `DESIGN.md §8` + `css/jornada.css`). Nada de cor literal.

### 4.1 Seção / wrapper
- `#saga.jornada`: `position: relative`.
- `.jornada__pin`: wrapper com fundo decorativo (gradientes + kanji `ナメック` em `::before`).
- **Fundo decorativo:** vive em **`.jornada__pin`**, não em `#saga.jornada`.

### 4.2 Track (coluna vertical)
- `.jornada__track`: `display: flex`; `flex-direction: column`; `gap: var(--jornada-gap)`; padding via `--space-section-y` e `--space-gutter-x`.
- **Sem** `transform: translateX`; **sem** variáveis de runtime de animação.

### 4.3 Painel Hero
- `.jornada__panel--hero`: padding generoso; texto centralizado; kanji decorativo ao fundo.
- `.jornada__kanji`: `opacity: var(--jornada-kanji-opacity)`; `aria-hidden`.

### 4.4 Tipografia do painel hero
- `.jornada__eyebrow`: `--font-hero-saga`, caixa alta, `--ls-label`, `--accent-star`, `--fs-2xs`.
- `.jornada__title`: `.line--main` `--text-primary`; `.line--saga` gradiente `--accent-star` → `--cosmic-rose`.
- `.jornada__tagline`: `--font-hero-saga`, caixa alta, `--text-muted`.
- `.jornada__scroll`: `--font-hero-saga`, caixa alta, `--text-muted`; seta `--accent-star` com micro-bob (respeita `prefers-reduced-motion`).

### 4.5 Card
- `.jornada__card-wrap` + `.jornada__numeral` acima do card.
- `.jornada__card`: largura fluida (`max-width` ~42rem, centralizado); filete superior na `--ch-accent`; fundo `--bg-surface` translúcido + `backdrop-filter`.
- `.jornada__card-media`: `aspect-ratio: var(--jornada-media-ratio)`; `object-fit: cover`.
- Tipografia: kicker `--ch-accent`; título `--font-display`; descrição `--font-body`, `--text-muted`.

### 4.6 HUD (opcional — oculto)
- `.jornada__hud`: `display: var(--jornada-timeline-mobile)` (default `none`).
- Estilos do rail, fill, dots e counter reservados para quando o HUD for reativado.

### 4.7 Numerais
- `.jornada__numeral`: `--font-hero-stamp`; `opacity: var(--jornada-numeral-opacity)`; cor `--ch-accent` do capítulo.
- Tamanho fluido via `--jornada-numeral-size` / `--jornada-numeral-size-mobile`.

### 4.8 Transição com `#trailers`
- Scroll **normal** entre seções: `#saga` termina e `#trailers` entra em sequência, sem sobreposição, pin ou camada fixa.

---

## 5) Tokens (somente existentes)

### 5.1 Base (`DESIGN.md §8`) usados aqui
Fundo: `--bg-mid`, `--bg-surface`, `--bg-overlay`.
Texto: `--text-primary`, `--text-muted`, `--text-faint`.
Acentos: `--accent-star`, `--accent-star-dim`, `--accent-star-glow`, `--cosmic-cyan`, `--cosmic-purple`, `--cosmic-rose`.
Bordas/foco: `--border-subtle`, `--border-strong`, `--ring-focus`.
Tipografia: `--font-body`, `--font-display`, `--font-hero-stamp`, `--font-hero-saga`.
Labels/escala: `--ls-label`, `--fs-2xs`, `--space-gutter-x`, `--space-section-y`.
Motion: `--ease-out-expo`, `--stagger-*` (somente para micro-animações CSS opcionais).

### 5.2 Geometria da Jornada (`css/jornada.css`)
`--jornada-bp`, `--jornada-gap`, `--jornada-card-radius`,
`--jornada-media-ratio`, `--jornada-media-radius`, `--jornada-desc-maxw`,
`--jornada-rail-weight`, `--jornada-dot-size`, `--jornada-hud-maxw`,
`--jornada-numeral-opacity`, `--jornada-numeral-size`, `--jornada-numeral-size-mobile`,
`--jornada-kanji-opacity`, `--jornada-reveal-y`, `--jornada-timeline-mobile`,
`--jornada-fs-heading`, `--jornada-fs-desc`, `--jornada-fs-counter`.

### 5.3 Mapa `--ch-accent` por capítulo (inline)
| Capítulo | `--ch-accent` |
|---|---|
| 01 | `var(--cosmic-cyan)` |
| 02 | `var(--cosmic-purple)` |
| 03 | `var(--accent-star)` |
| 04 | `var(--cosmic-rose)` |
| 05 | `var(--cosmic-cyan)` |
| 06 | `var(--accent-star)` |

> Nenhuma cor nova. Nenhum valor literal fora dos tokens.

---

## 6) Responsividade & Acessibilidade

**Responsividade**
- Todas as larguras: coluna vertical, cards em largura fluida.
- Numerais e tipografia fluidos via `clamp` nos tokens `--jornada-fs-*`, `--fs-*`.
- **Sem overflow horizontal** (`DESIGN.md §5`).

**Acessibilidade**
- `#saga` com `aria-label="A Saga do Freeza"`.
- Ordem do DOM = ordem narrativa; leitura por teclado/leitor segue cap.01→06.
- Numerais de fundo e kanji: `aria-hidden="true"`.
- Cada `<img>` de mídia com `alt` descritivo do capítulo.
- Contraste AA sobre `--bg-surface`.
- `:focus-visible` usa `--ring-focus`.
- `prefers-reduced-motion: reduce` → sem animações CSS; conteúdo totalmente visível sem JS.

---

## 7) Checklist de implementação

- [ ] `#saga.jornada` com `.jornada__pin` e `.jornada__track` em coluna vertical.
- [ ] Painel hero com copy exata do `§2.4`.
- [ ] 6 cards com **copy exata** do `§2.5` e `style="--ch-accent:…"` do `§5.3`.
- [ ] Numerais `01..06` acima de cada card, `aria-hidden`.
- [ ] Kanji decorativo no painel hero, `aria-hidden`, `--jornada-kanji-opacity`.
- [ ] Fundo decorativo em `.jornada__pin`, não em `#saga`.
- [ ] Scroll normal até `#trailers` — sem sobreposição entre seções.
- [ ] Só tokens do `:root`; **zero** cor/valor literal.
- [ ] `alt` em todas as mídias; `aria-label` na seção; foco com `--ring-focus`.

---

## 8) Critérios de aceitação

1. **Abertura:** painel de título com eyebrow, título (branco + dourado), tagline e "ROLE PARA CONTINUAR ↓".
2. **Linha do tempo vertical:** 6 capítulos empilhados em ordem, scroll normal da página.
3. **Copy exata:** todos os textos batem 1:1 com o `§2`.
4. **Cores por capítulo:** kicker e filete usam a `--ch-accent` correta do `§5.3`.
5. **Sem overflow horizontal** em nenhuma largura.
6. **Transição para `#trailers`:** seção seguinte entra em sequência, sem sobreposição ou travamento de scroll.
7. **Acessível:** ordem narrativa no DOM; `prefers-reduced-motion` estático; imagens com `alt`.
8. **Fidelidade ao DESIGN.md:** tipografia, tokens e nomenclatura `jornada__*` conforme `DESIGN.md §8`.
