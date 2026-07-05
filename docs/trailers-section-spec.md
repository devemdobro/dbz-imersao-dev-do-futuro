# Trailers — Section Spec

> Seção **Trailers** do site *Dragon Ball Z — A Saga do Freeza*.
> Carrossel de "melhores momentos" da saga (YouTube, embed nocookie) com moldura em gradiente, setas e dots.
> **Source of truth:** prints anexados + dados desta spec. Copy exata. Nenhum elemento além dos listados.
> **Regras herdadas:** respeita `DESIGN.md`; usa **apenas** tokens do `:root` (§8 do DESIGN.md). Nenhuma cor nova.

---

## 1. Objetivo

Apresentar um carrossel de 4 vídeos do YouTube com os melhores momentos da Saga do Freeza, um por vez, dentro de uma moldura em gradiente. O usuário navega por setas (prev/next) e por dots (tabs). Apenas o slide ativo carrega o `<iframe>` real (lazy real via `data-src`); os demais permanecem em `about:blank`. É a 4ª seção da página (âncora `#trailers` da nav) e antecede o Footer.

Metas:
- **Performance:** só um iframe do YouTube ativo por vez; troca substitui `src` do ativo e devolve os inativos a `about:blank`.
- **Acessibilidade:** dots como tablist (`role=tab`), região `aria-live` anunciando o slide ativo, navegação por teclado (setas / Home / End).
- **Fidelidade visual:** eyebrow laranja, título Fredoka, subtítulo muted, texto de fundo decorativo grande "TRAILERS", moldura do player em gradiente com cantos arredondados.

---

## 2. Inventário

### 2.1 Textos exatos
| Papel | Texto |
|-------|-------|
| Eyebrow | `Assista agora` |
| Título | `Melhores momentos` |
| Subtítulo | `A batalha de Goku contra Freeza em Namekusei` |
| Texto de fundo (decorativo, grande) | `TRAILERS` |

> Copy exata. No print o eyebrow/subtítulo aparecem renderizados em caixa alta — isso é **transformação visual** (`text-transform: uppercase`), não o texto de origem.

### 2.2 Vídeos (4 slides, na ordem) — `data-src`, **não** `src`
| Slide | `id` | YouTube ID |
|-------|------|------------|
| 1 | `trailers-slide-1` | `c7jvWOfwc1M` |
| 2 | `trailers-slide-2` | `CE5RQyafYaE` |
| 3 | `trailers-slide-3` | `WXJN3ZPFW2o` |
| 4 | `trailers-slide-4` | `anFoJ9WOkWQ` |

Embed base (nocookie): `https://www.youtube-nocookie.com/embed/{ID}`. Guardado em `data-src`; o JS promove ao `src` real quando o slide fica ativo.

### 2.3 Controles
- Seta anterior: `.trailers__arrow--prev` (glifo `‹`)
- Seta próxima: `.trailers__arrow--next` (glifo `›`)
- 4 dots: `.trailers__dot` (`role=tab`), cada um `aria-controls` do slide correspondente
- Região viva: `#trailers-carousel-live` (`aria-live`) anunciando o slide ativo

### 2.4 O que **não** existe
Não inventar: nada de contadores "01/04", legendas por slide, thumbnails custom, botões de play próprios, autoplay, players além dos 4. O botão de play vermelho e o "Assista no YouTube" no print são **UI nativa do próprio embed do YouTube**, não elementos da seção.

---

## 3. HTML — árvore / classes

```
section#trailers.trailers
├── span.trailers__bg-text            → "TRAILERS" (decorativo, aria-hidden)
├── header.trailers__head
│   ├── p.trailers__eyebrow           → "Assista agora"
│   ├── h2.trailers__title            → "Melhores momentos"
│   └── p.trailers__subtitle          → "A batalha de Goku contra Freeza em Namekusei"
├── div.trailers__carousel
│   ├── button.trailers__arrow.trailers__arrow--prev   [aria-label]
│   ├── div.trailers__viewport
│   │   └── ul.trailers__track
│   │       ├── li#trailers-slide-1.trailers__slide  [role=tabpanel, aria-label]
│   │       │   └── div.trailers__player
│   │       │       └── iframe[data-src=".../c7jvWOfwc1M"] (src="about:blank" inicial)
│   │       ├── li#trailers-slide-2.trailers__slide → iframe data-src …/CE5RQyafYaE
│   │       ├── li#trailers-slide-3.trailers__slide → iframe data-src …/WXJN3ZPFW2o
│   │       └── li#trailers-slide-4.trailers__slide → iframe data-src …/anFoJ9WOkWQ
│   └── button.trailers__arrow.trailers__arrow--next   [aria-label]
├── div.trailers__dots               [role=tablist, aria-label]
│   ├── button.trailers__dot  [role=tab, aria-controls="trailers-slide-1"]
│   ├── button.trailers__dot  [role=tab, aria-controls="trailers-slide-2"]
│   ├── button.trailers__dot  [role=tab, aria-controls="trailers-slide-3"]
│   └── button.trailers__dot  [role=tab, aria-controls="trailers-slide-4"]
└── p#trailers-carousel-live.trailers__live  [aria-live=polite, class visually-hidden]
```

Atributos obrigatórios:
- `<section id="trailers" class="trailers">` — âncora `#trailers` da nav.
- Cada `<iframe>`: `data-src` (não `src` funcional), `title` descritivo, `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"`, `allowfullscreen`, `loading="lazy"`, `referrerpolicy="strict-origin-when-cross-origin"`. `src="about:blank"` como estado inicial de todos.
- Cada `.trailers__slide`: `role="tabpanel"`, `aria-label` (ex.: "Trailer 1 de 4"), `hidden`/`aria-hidden` gerenciado por estado.
- Cada `.trailers__dot`: `role="tab"`, `aria-controls="trailers-slide-N"`, `aria-selected`, `aria-label` (ex.: "Ir para o trailer 1").
- `#trailers-carousel-live`: `aria-live="polite"`, `aria-atomic="true"`, `role="status"`, oculto visualmente (`.visually-hidden`) mas lido por leitores de tela.

---

## 4. Camadas (z / empilhamento)

Da mais ao fundo para a frente:

1. **Fundo da seção** — `--bg-mid` / `--bg-deep`; gradiente ambiente laranja→azul (esquerda `--accent-star-glow`, direita `--cosmic-cyan-dim`), consistente com o print. Camada de fundo.
2. **`.trailers__bg-text` "TRAILERS"** — tipografia gigante, baixa opacidade (`--text-faint` ou derivada), atrás do conteúdo, `aria-hidden`, `pointer-events: none`. `z-index` baixo, acima do fundo.
3. **`.trailers__head`** — eyebrow, título, subtítulo. Conteúdo de fluxo.
4. **`.trailers__carousel`** — viewport + track (players) no centro; setas nas laterais.
   - `.trailers__viewport` recorta (`overflow: hidden`); `.trailers__track` desliza por `transform: translateX(...)`.
   - Moldura em gradiente aplicada ao `.trailers__player` (borda/anel em gradiente, `--trailers-frame-radius`).
   - `.trailers__arrow--prev/next` acima do viewport (`z-index` de controle); no print aparecem semitransparentes nas bordas.
5. **`.trailers__dots`** — abaixo do carrossel, centralizados; dot ativo em destaque.
6. **`.trailers__live`** — fora do fluxo visual (visually-hidden).

---

## 5. Tokens

**Somente tokens do `:root` do DESIGN.md (§8). Nenhuma cor nova.**

| Uso | Token |
|-----|-------|
| Fundo da seção | `--bg-mid`, `--bg-deep` |
| Superfície do player / carousel | `--bg-surface`, `--bg-surface-raised` |
| Overlay | `--bg-overlay` |
| Título "Melhores momentos" | `--text-primary` + `--font-display` (Fredoka, 600–700) |
| Corpo / subtítulo | `--font-body` (Outfit) |
| Eyebrow "Assista agora" | `--accent-star`, caixa alta, `--ls-label` |
| Subtítulo | `--text-muted` |
| Texto de fundo "TRAILERS" | `--text-faint` (baixa opacidade), `--font-display` |
| Moldura em gradiente do player | gradiente com `--accent-star`, `--cosmic-cyan`, `--cosmic-purple` (moldura em gradiente, DESIGN.md §4) |
| Glow / halo | `--accent-star-glow`, `--cosmic-cyan-dim` |
| Setas (arrow) | `--bg-surface-raised` + `--border-subtle`; hover/ativo `--accent-star` |
| Dots — inativo | `--text-faint` / `--border-strong` |
| Dots — ativo | `--cosmic-cyan` (carrossel usa Azul Ki, DESIGN.md §4/§2) |
| Bordas | `--border-subtle`, `--border-strong` |
| Foco visível | `--ring-focus` em `:focus-visible` |
| Espaçamento vertical | `--space-section-y` |
| Respiro lateral | `--space-gutter-x` |
| Easing de transição | `--ease-out-expo` (slide), `--ease-spring` (dots/setas opcional) |
| Escala tipográfica | `--fs-2xs` … `--fs-display` (clamp) |

Tokens locais da seção (derivados, **sem cor nova**), definíveis num `:root` ou no escopo `.trailers`:
```
--trailers-frame-radius     /* raio da moldura do player */
--trailers-frame-gradient   /* composto de --accent-star/--cosmic-cyan/--cosmic-purple */
--trailers-media-ratio      /* 16 / 9 */
--trailers-arrow-size
--trailers-dot-size
--trailers-slide-ease        /* = --ease-out-expo */
/* Runtime (setados por js): --active-index, --track-x */
```

---

## 6. Comportamento JS

### 6.1 Estado
- `activeIndex` (0–3), inicial `0`.
- `slides` = 4 `<li>`; `dots` = 4 `<button>`; `iframes` = 4.
- Track posicionado por `transform: translateX(calc(activeIndex * -100%))` (ou via `--track-x`), transição com `--ease-out-expo`.

### 6.2 Lazy real (obrigatório)
- **Inicial:** todos os iframes com `src="about:blank"`; a URL verdadeira mora em `data-src`.
- Ao ativar o slide `i`:
  1. `iframes[i].src = iframes[i].dataset.src` (promove só o ativo).
  2. Para todo `j ≠ i`: `iframes[j].src = "about:blank"` (descarrega/pausa os demais — garante que nenhum áudio/vídeo continue tocando fora do slide ativo).
- Nunca há mais de **um** iframe do YouTube carregado por vez.
- O primeiro slide **não** carrega no load da página por si só; carrega quando a seção fica ativa/entra em foco. (Opcional: `IntersectionObserver` para promover o slide 0 só quando a seção entra na viewport — mantém o carregamento diferido de verdade. Se `IntersectionObserver` indisponível, promover no primeiro gesto/entrada em foco.)

### 6.3 Navegação
- **`.trailers__arrow--next`:** `activeIndex = (activeIndex + 1) % 4`.
- **`.trailers__arrow--prev`:** `activeIndex = (activeIndex - 1 + 4) % 4`.
- **`.trailers__dot[i]`:** vai direto para `i`.
- Toda mudança chama `goTo(i)`, que: atualiza `transform`, aplica lazy (§6.2), atualiza `aria-selected`/`tabindex` dos dots, `aria-hidden`/`hidden` dos slides, e a região viva (§6.4).
- Setas podem ser wrap-around (looping, como sugerem os dots do print) — sem estado disabled. (Se preferir não-loop, desabilitar prev em 0 e next em 3; **default = loop**.)

### 6.4 Região viva
- A cada `goTo(i)`, `#trailers-carousel-live.textContent = "Trailer " + (i+1) + " de 4"`.

### 6.5 Teclado
Escopo: quando o foco está dentro de `.trailers__dots` (tablist) ou nos controles do carrossel.
- **→ / ↓:** próximo slide (`next`).
- **← / ↑:** slide anterior (`prev`).
- **Home:** primeiro slide (índice 0).
- **End:** último slide (índice 3).
- **Enter / Espaço** num dot: ativa o slide daquele dot.
- Após navegação por teclado no tablist, mover o foco para o dot recém-selecionado (padrão ARIA tabs: roving `tabindex` — só o dot ativo com `tabindex="0"`, os demais `tabindex="-1"`).

### 6.6 Reduced motion
- `@media (prefers-reduced-motion: reduce)`: troca de slide sem transição de `transform` (corte seco); sem glows animados.

---

## 7. Responsividade / Acessibilidade

### Responsividade
- **Desktop (≥ 768px):** carrossel centralizado, largura contida (~1200–1400px, DESIGN.md §5), setas nas laterais fora/sobre o viewport; player em `--trailers-media-ratio` (16:9).
- **Mobile (< 768px):** coluna única, sem overflow horizontal (DESIGN.md §5). Setas podem encolher e recuar para dentro das bordas ou ir para baixo do player junto dos dots; texto de fundo "TRAILERS" reduz escala/opacidade para não vazar. Player mantém 16:9 fluido (largura 100% do gutter).
- Escala tipográfica e espaçamento por `clamp(...)`.

### Acessibilidade
- `.trailers__dots` = `role="tablist"` com `aria-label` (ex.: "Trailers"); dots = `role="tab"` + `aria-controls` + `aria-selected` + roving `tabindex`.
- `.trailers__slide` = `role="tabpanel"` + `aria-label`; slides inativos `hidden`/`aria-hidden="true"`.
- Setas = `<button>` com `aria-label` ("Trailer anterior" / "Próximo trailer").
- `#trailers-carousel-live` = `aria-live="polite"`, `aria-atomic="true"`, `role="status"`, visualmente oculto.
- `:focus-visible` com `--ring-focus` em setas e dots.
- `.trailers__bg-text` = `aria-hidden="true"`, `pointer-events: none`.
- Cada `<iframe>` com `title` significativo.
- Contraste de eyebrow/subtítulo/dots conforme os tokens de texto do DESIGN.md.

---

## 8. Checklist

- [ ] `<section id="trailers" class="trailers">` presente (âncora da nav).
- [ ] Eyebrow = "Assista agora"; título = "Melhores momentos"; subtítulo = "A batalha de Goku contra Freeza em Namekusei" (copy exata).
- [ ] Texto de fundo decorativo "TRAILERS" presente, `aria-hidden`, `pointer-events:none`.
- [ ] `.trailers__track` com 4 `<li id="trailers-slide-N" class="trailers__slide">` na ordem: `c7jvWOfwc1M`, `CE5RQyafYaE`, `WXJN3ZPFW2o`, `anFoJ9WOkWQ`.
- [ ] Cada slide tem `.trailers__player > iframe[data-src]` (embed youtube-nocookie), `src="about:blank"` inicial.
- [ ] `.trailers__arrow--prev` e `.trailers__arrow--next` presentes, com `aria-label`.
- [ ] `.trailers__dots` com 4 `.trailers__dot` (`role=tab`, `aria-controls` → slide correspondente).
- [ ] `#trailers-carousel-live` (`aria-live`) presente e atualizado a cada troca.
- [ ] Título em Fredoka (`--font-display`); corpo em Outfit (`--font-body`); eyebrow laranja `--accent-star` caixa alta.
- [ ] Apenas tokens do `:root` — nenhuma cor nova.
- [ ] Lazy real: só o slide ativo com `src`; demais em `about:blank`; nunca >1 iframe carregado.
- [ ] Setas e dots funcionam; dots refletem estado (`aria-selected`).
- [ ] Teclado: setas / Home / End; roving `tabindex` no tablist.
- [ ] Reduced motion neutraliza transições.
- [ ] Mobile: coluna única, sem overflow horizontal.
- [ ] Nenhum elemento fora do inventário (§2.4).

---

## 9. Aceitação

A seção é aceita quando:

1. **Estrutura** — o DOM corresponde exatamente à árvore da §3 (ids, classes, ordem dos vídeos, atributos ARIA).
2. **Copy** — os quatro textos batem carácter a carácter com a §2.1.
3. **Lazy comprovado** — na carga da página, os 4 iframes estão em `about:blank`; após ativar um slide, exatamente **um** iframe tem `src` de `youtube-nocookie` e os outros três voltaram a `about:blank`; ao trocar de slide, o áudio/vídeo do anterior cessa.
4. **Navegação** — setas prev/next e os 4 dots levam ao slide correto; `#trailers-carousel-live` anuncia "Trailer N de 4".
5. **Teclado** — →/↓, ←/↑, Home, End operam o carrossel a partir do tablist com foco visível (`--ring-focus`) e roving `tabindex`.
6. **Tokens** — inspeção do CSS não revela nenhuma cor/valor cru fora dos tokens do `:root`; título em Fredoka, eyebrow em `--accent-star`, dot ativo em `--cosmic-cyan`.
7. **Responsivo** — em < 768px não há scroll horizontal; player mantém 16:9; setas/dots acessíveis por toque.
8. **A11y** — tablist/tabpanel válidos, `aria-live` funcional, `.trailers__bg-text` inerte a leitores e ponteiro, `#trailers` alcançável pela nav.
9. **Reduced motion** — com a preferência ativa, a troca de slide ocorre sem animação de deslize.