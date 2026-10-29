# Linha Tênue®

V1 conceitual de e-commerce streetwear em React 19, Vite 6 e Lucide. Layout responsivo underground editorial em preto, papel off-white e azul elétrico. Camisetas boxy minimalistas com aplicação pequena da logomarca Linha Tênue, jeans baggy, campanha urbana e texturas de impressão. Tipografia Barlow Condensed e Space Grotesk incluída localmente com @fontsource.

## Desenvolvimento

Requer Node.js 22+ e npm.

```sh
npm ci
npm run dev -- --port 3000
```

```sh
npm run build
npm run preview
```

## Experiência

- Home, catálogo, detalhe de produto, sacola, sobre e conta visual, com navegação por hash.
- Busca, categorias, coleção (Unissex/Feminino), cor, preço e ordenação; todas as peças mockadas estão disponíveis em P–GG.
- Seleção de tamanho/cor, galeria com detalhe ampliado, medidas e informações de troca.
- Sacola persistida no localStorage, quantidades, remoção, frete e cupom demonstrativo `LINHA10`.
- Menu mobile, feedbacks acessíveis, suporte a movimento reduzido e newsletter ilustrativa.

`src/data.js` contém os dados; `src/components` contém componentes compartilhados; `src/pages/Home.jsx` compõe a página editorial; `src/main.jsx` gerencia estado e demais telas. `src/style.css` define a estrutura e `src/street.css` a direção underground e seus breakpoints. `ProductImage` usa `imageIndex` para enquadrar cada peça das pranchas locais de forma consistente no catálogo, galeria e sacola.

## Limites da V1

Não há backend, autenticação, inscrição em newsletter, estoque remoto, pagamentos nem envio de pedidos. A tela de conta não transmite nem armazena credenciais. A sacola é local a cada navegador. O checkout explicita o caráter conceitual.

As imagens em `public/images/` foram geradas para a direção visual desta loja conceitual e não representam produtos físicos. A prancha `collection.png` contém as oito peças em uma grade regular 4 × 2, enquadradas pelo componente ProductImage. As camisetas exibem somente a logomarca discreta no peito; a imagem de costas aplica a marca abaixo da gola. Campanha e manifesto usam imagens próprias desta V1. Imagens e fontes são servidas localmente, sem dependência de Unsplash ou Google Fonts. Substitua por fotografias e especificações reais antes de uma operação comercial.

## Novas modelagens

A coleção tem 16 peças: oito originais, quatro Boxy Fit unissex com ombros menos deslocados, mangas proporcionais e comprimento mais curto, e quatro femininas (duas boxy cropped, uma baby tee e uma wide leg de cintura alta). As novas peças mantêm somente a logomarca pequena.

`fit-collection.png` usa a mesma grade 4 × 2: Boxy Fit na primeira linha e coleção feminina na segunda. `fit-editorial.png` mostra o caimento no corpo. Descrições e medidas são específicas de cada modelagem. As medidas são ilustrativas da V1 e não são especificações de fabricação.
