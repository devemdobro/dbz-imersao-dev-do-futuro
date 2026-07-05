# Footer Section — Spec

> **Source of truth:** print `footer.png`. Toda a copy abaixo é transcrição literal do print. Nenhum link ou texto foi inventado.
> **Nota:** `DESIGN.md` não foi fornecido junto aos arquivos. Os tokens abaixo referenciam variáveis `:root` por nome semântico — ajuste os nomes/valores para casar exatamente com o `DESIGN.md` do projeto antes de implementar.

---

## 1) Objetivo

Renderizar o rodapé conceitual da página "Dragon Ball Z: A Saga do Freeza", exibindo o título da obra e um disclaimer educacional/legal centralizados sobre fundo escuro, separados do conteúdo acima por uma linha divisória fina.

---

## 2) Inventário

Elementos presentes no print (e **somente** estes):

| # | Tipo | Conteúdo | Observações visuais |
|---|------|----------|---------------------|
| 1 | Divisória | — | Linha horizontal fina no topo do footer, largura total |
| 2 | Título | `Dragon Ball Z: A Saga do Freeza` | Negrito, cor branca, centralizado |
| 3 | Texto (disclaimer) | `Projeto conceitual para fins educacionais. Dragon Ball, Dragon Ball Z e personagens relacionados são criação de Akira Toriyama e marcas registradas da Bird Studio / Shueisha e Toei Animation.` | Cinza (muted), centralizado, quebra em 2 linhas no desktop |

**Ausentes** (não devem ser adicionados): logo/imagem, links, ícones sociais, botões, campos de formulário, copyright com ano.

---

## 3) HTML (estrutura semântica)

```
<footer class="footer">
  <div class="footer__inner">
    <p class="footer__title">Dragon Ball Z: A Saga do Freeza</p>
    <p class="footer__disclaimer">
      Projeto conceitual para fins educacionais. Dragon Ball, Dragon Ball Z
      e personagens relacionados são criação de Akira Toriyama e marcas
      registradas da Bird Studio / Shueisha e Toei Animation.
    </p>
  </div>
</footer>
```

- `<footer>` como landmark semântico único da seção.
- `.footer__inner` centraliza e limita a largura da coluna de texto.
- Título como `<p>` (não é heading de navegação; é rótulo da obra) — ajustar para `<h2>` apenas se o `DESIGN.md` exigir hierarquia de headings.
- Divisória renderizada via `border-top`/`box-shadow` do `.footer` (não como elemento no DOM).

---

## 4) Tokens (apenas `:root`)

Usar exclusivamente tokens de `:root`. Mapeamento esperado:

| Uso | Token (`:root`) |
|-----|-----------------|
| Fundo do footer | `--color-bg` (fundo escuro/quase preto) |
| Cor do título | `--color-text` / `--color-text-strong` (branco) |
| Cor do disclaimer | `--color-text-muted` (cinza) |
| Cor da divisória | `--color-border` |
| Peso do título | `--font-weight-bold` |
| Fonte | `--font-family-base` |
| Tamanho título | `--font-size-md` (a validar com DESIGN.md) |
| Tamanho disclaimer | `--font-size-sm` |
| Espaçamento vertical (padding) | `--space-*` (topo/base generosos, ver print) |
| Gap título → disclaimer | `--space-*` |
| Largura máx. da coluna | `--container-max` / `--measure` |

> Nenhum valor hex/px literal no CSS de implementação — todos via `var(--token)`.

---

## 5) Responsividade

- **Desktop (≥ ~768px):** coluna centralizada com largura máxima limitada; disclaimer quebra naturalmente em ~2 linhas.
- **Mobile (< ~768px):** manter centralização; padding lateral via token para evitar texto colado nas bordas; disclaimer flui em mais linhas conforme necessário (sem quebra forçada `<br>`).
- Título permanece em linha única sempre que possível; sem truncamento.
- Divisória e centralização mantidas em todos os breakpoints.

---

## 6) Checklist

- [ ] Copy do título idêntica ao print.
- [ ] Copy do disclaimer idêntica ao print (incluindo "Bird Studio / Shueisha e Toei Animation").
- [ ] Nenhum link ou logo adicionado.
- [ ] `<footer>` semântico único.
- [ ] Todas as cores/espaçamentos via tokens `:root`.
- [ ] Divisória superior de largura total, fina.
- [ ] Conteúdo centralizado (texto e bloco).
- [ ] Contraste do disclaimer (cinza sobre fundo escuro) atende AA.
- [ ] Sem valores literais no CSS (somente `var(--token)`).
- [ ] Layout válido em mobile e desktop.

---

## 7) Aceitação

O footer é aceito quando:

1. Renderiza exatamente os 3 elementos do inventário — título, disclaimer e divisória — e nada além.
2. A copy corresponde caractere-a-caractere ao print.
3. Nenhum token fora de `:root` é utilizado e não há valores hardcoded.
4. Visualmente corresponde ao print em fundo, cor, peso, centralização e espaçamento.
5. Comporta-se corretamente em mobile e desktop conforme a seção 5.
6. Passa em verificação de contraste AA.