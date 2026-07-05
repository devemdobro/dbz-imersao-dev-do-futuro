# Especificação — Animação GSAP da seção "A Saga" (Jornada em Namekusei)

> Documento de especificação da implementação REAL que está no ar hoje.
> Diferente do `prompt-saga-gsap.md` (prompt para recriar a seção do zero),
> este arquivo descreve como o código existente funciona, com referências
> de arquivo/linha, valores exatos e a divisão de responsabilidade JS × CSS.

## 1. Escopo e arquivos

A seção `#saga` do `index.html` é uma timeline de **scroll horizontal dirigido
pelo scroll vertical**: a viewport trava (pin) e o trilho de painéis corre no
eixo X conforme o usuário rola a página.

| Arquivo | Papel |
| --- | --- |
| `index.html:142-251` | Markup da seção (`#saga.jornada`) |
| `js/jornada.js` | Toda a lógica GSAP + vídeo pingue-pongue (IIFE isolada) |
| `css/jornada.css` | Layout vertical padrão + modo `.is-horizontal` + transições de revelação |
| `css/styles.css` | Tokens globais (`--cosmic-*`, `--accent-star`, easings) |

Bibliotecas (CDN, `index.html:347-348`): `gsap@3.12.5` + `ScrollTrigger`.

## 2. Contrato de seletores (HTML)

```
#saga.jornada                       ← seção; recebe .is-horizontal via JS
└── .jornada__viewport              ← elemento PINADO (100vh no modo horizontal)
    ├── .jornada__atmos             ← nébulas/grain/vinheta (só CSS, decorativo)
    ├── .jornada__hud               ← HUD fixo sobre a viewport pinada
    │   ├── .jornada__progress > .jornada__progress-fill   ← barra de progresso
    │   └── [data-counter]          ← contador do capítulo ("01"…"06")
    └── .jornada__track             ← trilho horizontal (transformado em X)
        ├── .jornada__rail          ← linha contínua atrás dos painéis
        ├── .jornada__panel.jornada__intro          ← abertura (título/kanji/cue)
        └── .jornada__panel.jornada__chapter × 6    ← data-chapter="1..6"
            ├── .jornada__num       ← numeral gigante (parallax)
            ├── .jornada__node      ← "esfera do dragão" sobre o trilho
            └── .jornada__card      ← mídia + kicker + título + texto
```

Cada capítulo define sua cor via CSS custom property inline:
`style="--ch-accent: var(--cosmic-cyan)"` etc. (`index.html:182-239`).
O capítulo 05 usa `<video class="jornada__video">` no lugar de imagem.

## 3. Gate de ativação (progressive enhancement)

Tudo roda dentro de `gsap.matchMedia()` (`jornada.js:110-112`) com a query:

```
(min-width: 768px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)
```

- **Dentro do match**: JS adiciona `.is-horizontal` na seção e o CSS troca o
  layout para trilho horizontal (`jornada.css:319+`).
- **Fora do match** (mobile, tela baixa, movimento reduzido, GSAP fora do ar):
  nada roda; o CSS padrão mantém os painéis empilhados na vertical, legíveis
  e acessíveis. Há early-return se `gsap`/`ScrollTrigger` não existirem
  (`jornada.js:95`) e o plugin é registrado com `gsap.registerPlugin(ScrollTrigger)`.

## 4. Mecânica principal — pin + scrub

### 4.1 Distância do trajeto (`jornada.js:115-117`)

```js
var distance = function () {
  return Math.max(0, track.scrollWidth - viewport.clientWidth);
};
```

Função (não valor fixo) para ser recalculada a cada `refresh` — imagens/vídeo
carregando mudam a largura do trilho.

### 4.2 Tween do trilho (`jornada.js:120`)

```js
var tween = gsap.to(track, { x: function () { return -distance(); }, ease: 'none' });
```

`ease: 'none'` — o mapeamento scroll→X é linear; qualquer suavização vem do `scrub`.

### 4.3 ScrollTrigger condutor (`jornada.js:151-164`)

```js
ScrollTrigger.create({
  animation: tween,
  trigger: viewport,
  start: 'top top',
  end: function () { return '+=' + distance(); },
  pin: true,
  scrub: 1,               // inércia suave de ~1s (não acoplamento seco)
  anticipatePin: 1,       // evita "pulo" visual na hora de pinar
  invalidateOnRefresh: true,
  onUpdate: ...           // barra de progresso + contador (seção 5)
});
```

Ponto-chave: **`end` = distância exata do trilho**. A seção fica pinada por
exatamente o scroll necessário para o último painel chegar; depois destrava e a
página segue na vertical. Rolando para cima o trajeto inverte simetricamente.
Não existe scroll horizontal nativo em nenhum momento.

## 5. HUD — barra de progresso + contador (no `onUpdate`)

- **Barra** (`jornada.js:161`): `fill.style.transform = 'scaleX(progress)'` —
  transform direto no style, sem tween (é chamado a cada frame do scrub).
- **Contador** (`jornada.js:122-149`):
  1. Os bounds dos painéis (`offsetLeft`, `offsetWidth`, `data-chapter`) são
     medidos uma vez e re-medidos no evento `refreshInit` do ScrollTrigger.
  2. A cada update, o capítulo ativo é o painel que contém o centro da viewport
     dentro do trilho: `center = progress * distance() + viewport.clientWidth / 2`.
  3. Quando o capítulo muda: texto com zero à esquerda (`('0' + ch).slice(-2)`)
     e replay da animação CSS de "pop" — remove `.is-pulse`, força reflow com
     `void counter.offsetWidth`, adiciona de novo. O pop é o keyframe
     `jornada-counter-pop` (0.42s, `--ease-spring`, `jornada.css:551-555`).

## 6. Animações internas do trilho (`containerAnimation`)

Os capítulos vivem DENTRO de um container que se move — por isso os
ScrollTriggers deles usam `containerAnimation: tween` (posição medida contra o
movimento do trilho, não contra o scroll vertical da página).

### 6.1 Parallax dos numerais gigantes (`jornada.js:170-187`)

Para cada `.jornada__num`:

```js
gsap.fromTo(num, { xPercent: 16 }, {
  xPercent: -16, ease: 'none',
  scrollTrigger: {
    trigger: capitulo, containerAnimation: tween,
    start: 'left right', end: 'right left', scrub: true,
  },
});
```

O numeral atravessa de +16% a −16% enquanto o painel cruza a tela — anda em
sentido contrário ao trilho, criando profundidade. O GSAP só cuida do X; a
opacidade do numeral é do CSS (seção 6.2).

### 6.2 Revelação por capítulo — JS dispara, CSS anima (`jornada.js:189-195`)

```js
ScrollTrigger.create({
  trigger: capitulo, containerAnimation: tween,
  start: 'left 78%',
  onEnter:     function () { ch.classList.add('is-inview'); },
  onEnterBack: function () { ch.classList.add('is-inview'); },
});
```

O JS só adiciona a classe `is-inview` (uma vez adicionada, não remove durante a
sessão de scroll). Toda a transição visual está no CSS (`jornada.css:529-541`):

| Elemento | Estado inicial | Com `.is-inview` | Transição |
| --- | --- | --- | --- |
| `.jornada__num` | `opacity: 0` | `opacity: 0.16` | 0.7s `--ease-out-expo` |
| `.jornada__node` | `opacity: 0; scale(0.4)` | `opacity: 1; scale(1)` | 0.6s (`--ease-spring` no transform) |
| `.jornada__card` | `opacity: 0; translateY(30px)` | `opacity: 1; translateY(0)` | 0.7s `--ease-out-expo` |

### 6.3 Abertura da intro (`jornada.js:199-210`)

Único tween que usa o scroll **vertical** normal (dispara antes do pin):

```js
gsap.from(intro.children, {
  y: 30, opacity: 0, filter: 'blur(8px)',
  duration: 0.8, stagger: 0.1, ease: 'power3.out',
  scrollTrigger: { trigger: section, start: 'top 70%', once: true },
});
```

A seta "Role para atravessar" pulsa via keyframe CSS `jornada-cue-arrow`
(1.3s infinito, só com `prefers-reduced-motion: no-preference`,
`jornada.css:557-561`).

## 7. Cleanup do matchMedia (`jornada.js:213-224`)

O callback retorna uma função executada quando o match deixa de valer
(resize < 768px, reduced-motion ligado):

1. remove o listener de `refreshInit`;
2. remove `.is-horizontal` da seção e `.is-inview` dos capítulos;
3. zera a barra (`fill.style.transform = ''`) e o estado do contador;
4. `gsap.set(track, { clearProps: 'transform' })` limpa o X residual do trilho.

Tweens e ScrollTriggers criados no contexto são revertidos automaticamente pelo
próprio `gsap.matchMedia()` — o cleanup manual cobre só o que o GSAP não rastreia
(classes, listeners, styles inline setados fora de tween).

## 8. Robustez de medidas (`jornada.js:232-239`)

`ScrollTrigger.refresh()` é chamado em:

- `window.load` — mídia carregada muda altura/largura da página e deslocaria o pin;
- `loadedmetadata` do `.jornada__video` — o vídeo do capítulo 05 define sua
  dimensão só depois dos metadados.

Combinado com `invalidateOnRefresh: true` + `distance()` como função, qualquer
refresh recalcula trajeto, `end` e bounds do contador de forma consistente.

## 9. Complemento não-GSAP — vídeo pingue-pongue (`jornada.js:15-91`)

O vídeo da "Batalha Final" (capítulo 05) não usa loop nativo:

- `video.loop = false; video.muted = true`;
- no `ended`, pausa e retrocede via `requestAnimationFrame` decrementando
  `video.currentTime` pelo delta real de cada frame (reverso a 1x) até 0,
  quando volta a tocar pra frente;
- `IntersectionObserver` (threshold 0.25) ativa/desativa tudo: fora da tela o
  vídeo pausa e o rAF é cancelado.

## 10. Resumo de parâmetros

| Parâmetro | Valor | Onde |
| --- | --- | --- |
| Media query do modo horizontal | `min-width: 768px` + `min-height: 600px` + `no-preference` | `jornada.js:112` |
| Scrub do trilho | `1` (inércia ~1s) | `jornada.js:157` |
| Largura de cada capítulo | `clamp(22rem, 56vw, 34rem)` | `jornada.css:449` |
| Parallax do numeral | `xPercent 16 → -16` | `jornada.js:174-176` |
| Gatilho de revelação do capítulo | `left 78%` (no containerAnimation) | `jornada.js:192` |
| Entrada da intro | `y:30, blur 8px, 0.8s, stagger 0.1, power3.out` @ `top 70%` | `jornada.js:201-208` |
| Pop do contador | `0.42s var(--ease-spring)` | `jornada.css:388` |
| Opacidade final do numeral | `0.16` | `jornada.css:530` |

## 11. Observações / código legado

- Em `js/script.js` ainda existem `initSectionReveals` (bloco `#saga` mirando
  `.saga__header`, `.saga__eyebrow`, `.saga__item` — `script.js:857-889`) e
  `initBatalhaFinalVideoLoop` (mirando `.saga__video` — `script.js:972`).
  Esses seletores `.saga__*` pertencem ao layout ANTIGO da seção e **não
  existem mais** no `index.html` atual — as funções fazem early-return e viram
  no-ops. A implementação viva é 100% a de `js/jornada.js` (namespace
  `.jornada__*`), que foi criada justamente para não colidir com `.saga__*`.
- A ordem do array `sectionOrder` da nav flutuante (`script.js:267`) inclui
  `'saga'` — a nav destaca o link "A Saga" enquanto a seção pinada ocupa a tela.
