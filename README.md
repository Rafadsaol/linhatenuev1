# Linha Tênue — V2

E-commerce conceitual de streetwear, construído sobre a V1 existente em **React 19 + Vite 6**. Mantém a identidade **LT Axis**, as coleções originais, Boxy Fit e Feminino, as fotografias individuais, o cupom demonstrativo e as páginas institucionais. A V2 adiciona catálogo compartilhável, favoritos, variantes com estoque fictício e sacola lateral.

## Executar

Requer Node.js **22.8+** (recomendado: Node 24) e npm.

```sh
npm ci
npm run dev -- --port 3000
```

No PowerShell, se `npm.ps1` estiver bloqueado, use `npm.cmd ci` e `npm.cmd run dev`.

```sh
npm test
npm run build
npm run preview
```

Os 11 testes de lógica usam o runner nativo do Node, sem dependências de teste. Não há scripts de lint ou TypeScript configurados: a stack JavaScript da V1 foi preservada. O build valida os módulos React com Vite.

## Rotas

A navegação mantém o padrão de hash da V1, compatível com hospedagem estática:

| Rota | Experiência |
| --- | --- |
| `#/` | Home, lançamentos, categorias, Boxy Fit, Feminino, manifesto e lookbook |
| `#/loja` | Catálogo completo |
| `#/loja/camisetas-boxy` | Boxy Tees |
| `#/loja/essentials` | Essentials |
| `#/loja/calcas-baggy` | Baggy Pants |
| `#/loja/baby-tees` | Baby Tees |
| `#/loja/boxy-fit` | Linha Boxy Fit |
| `#/loja/drops` | Drops limitados |
| `#/produto/boxy-fit-black` | Produto por slug |
| `#/favoritos` | Peças salvas no navegador |
| `#/sacola` | Sacola completa, cupom e checkout ilustrativo |
| `#/sobre` | História e identidade LT Axis |
| `#/conta` | Interface de conta demonstrativa |

Os links numéricos antigos, como `#/produto/1`, continuam funcionando.

### Filtros compartilháveis

Exemplo:

```text
#/loja/camisetas-boxy?colecao=Feminino&tamanho=M&cor=Off-white&min=100&max=115&ordenar=menor-preco
```

Parâmetros: `q`, `categoria` (quando a categoria não estiver no caminho), `colecao`, `tamanho`, `cor`, `min`, `max` e `ordenar`. A busca considera nome, categoria, descrição e tags, ignorando acentos. Ordenações: `novidades`, `menor-preco`, `maior-preco` e `nome`. Filtros de tamanho e cor verificam a mesma variante disponível. Voltar, avançar, recarregar e compartilhar preservam os filtros na URL.

No desktop há sidebar; no mobile, drawer com foco contido e fechamento por Escape. O grid usa duas colunas a partir de 360px e três ou quatro em telas maiores.

## Produtos, imagens e variantes

- 18 produtos fictícios, incluindo os oito iniciais e as linhas Boxy Fit e Feminino já existentes.
- Duas Art Editions estampadas: Axis Blueprint e Axis Study.
- Cada produto tem slug, descrições curta e detalhada, preço, categorias, imagens, cores, tamanhos, tags e data de lançamento.
- Camisetas usam P, M, G e GG. Calças usam grade numérica: 36–46 no unissex e 34–44 no feminino.
- Cada variante possui identificador, tamanho, cor, estoque fictício e foto correspondente.
- Boxy Fit e Boxy Cropped têm opções de cor com fotos reais dentro do catálogo mockado; o preço permanece coerente no grupo de variantes.
- Exemplos para validar indisponibilidade: Boxy Shadow está esgotada; Boxy Fit Cobalt em Azul/GG e Boxy Distortion em Preto/GG estão indisponíveis na demonstração.
- A galeria tem frente, foto ilustrativa de acabamento e editorial no corpo quando disponível. Miniaturas trocam a imagem. A ampliação nativa permite explorar a foto no tamanho original.
- As fotografias foram geradas para esta experiência conceitual. Detalhes de tecido são ilustrativos da coleção, não registros de peças físicas.

As imagens são locais em `public/images/`. As fotos frontais individuais têm 1086 × 1448 pixels. Imagens do catálogo usam carregamento sob demanda. As fontes Anton, Space Grotesk e Barlow Condensed são servidas localmente via `@fontsource`.

## Sacola e favoritos

A sacola distingue produto, tamanho e cor, limita quantidades ao estoque fictício e calcula valores em centavos. Abre em drawer após adicionar, permite editar/remover e possui página própria. O cupom `LINHA10` aplica 10% ilustrativos.

`lt-cart` e `lt-favorites` persistem no localStorage. Dados inválidos são tratados com segurança; grades antigas P–GG das calças da V1 são migradas para tamanhos numéricos. Se o navegador bloquear o armazenamento, os estados continuam disponíveis na sessão com aviso.

Corações são botões independentes dos links dos cards, com estado acessível. Favoritos podem ser adicionados/removidos no catálogo, no produto e na página dedicada.

## Organização

```text
src/
  data.js                    # catálogo mockado e variantes
  lib/catalog.js             # busca, filtros, ordenação, URLs e variantes
  lib/cart.js                # validação, migração, quantidades e centavos
  lib/router.js              # navegação por hash e histórico
  lib/motion.js              # rolagem respeitando movimento reduzido
  state/Store.jsx            # sacola, favoritos, persistência e feedback
  components/                # marca, cards, galeria, drawers, header, footer e lookbook
  pages/                     # Home, Shop, Product, Favorites, Cart, About e Account
  style.css / street.css     # base visual preservada da V1
  brand.css                  # identidade LT Axis
  v2.css                     # aprimoramentos e responsividade da V2
tests/                       # 11 testes de filtros, catálogo, variantes e sacola
```

`BrandLogo` e `BrandMark` reutilizam o monograma arquitetônico inspirado na referência fornecida. Os vetores substituíveis estão em `public/brand/`. Não se usa a prancha de apresentação como logo. A identidade se aplica ao header, favicon, footer, coleções e produtos.

## Validação

Os testes de lógica cobrem combinações de filtros, busca sem acentos, ordenação, URLs, grades, estoque, fotos existentes, migração do carrinho, limites de variante e cálculo em centavos. A validação em navegador cobre busca, recarga e histórico das URLs, favoritos persistentes, galeria, troca de cor, quantidade, sacola, cupom, checkout demonstrativo, menu/drawers com Escape e foco, além das telas em 360, 390, 768, 1024 e 1440px.

Títulos e descrições da página são atualizados por rota. A aplicação é uma SPA estática: renderização no servidor e SEO avançado não fazem parte desta versão. Controles de toque, textos alternativos, contraste, foco e `prefers-reduced-motion` fazem parte da interface.

## Limites e V3

**Tudo é demonstrativo.** Não há estoque real, compra, pagamento, coleta de dados financeiros, envio de pedidos, autenticação, cadastro de newsletter ou atendimento comercial. A conta não transmite nem armazena credenciais. As medidas e orientações são ilustrativas.

Uma V3 poderá integrar catálogo e estoque reais, autenticação, checkout, painel administrativo e fotografias de produção. Nenhuma dessas integrações foi simulada como se estivesse operacional.
