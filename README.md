# Linha Tênue®

V1 conceitual de e-commerce streetwear em React 19, Vite 6 e Lucide. Layout responsivo underground editorial em preto, papel off-white e azul elétrico. Identidade LT Axis, com monograma arquitetônico, eixo azul e assinatura espaçada Linha Tênue. Camisetas boxy minimalistas com aplicação pequena do símbolo, jeans baggy, campanha urbana e texturas de impressão. Tipografia Barlow Condensed e Space Grotesk incluída localmente com @fontsource.

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
- Seleção de tamanho/cor, foto individual de produto, visualização em tela cheia com tamanho original, medidas e informações de troca.
- Sacola persistida no localStorage, quantidades, remoção, frete e cupom demonstrativo `LINHA10`.
- Menu mobile, feedbacks acessíveis, suporte a movimento reduzido e newsletter ilustrativa.

`src/data.js` contém os dados; `src/components` contém componentes compartilhados; `src/pages/Home.jsx` compõe a página editorial; `src/main.jsx` gerencia estado e demais telas. `src/style.css` define a estrutura e `src/street.css` a direção underground e seus breakpoints. `ProductImage` e `ProductGallery` compartilham a mesma foto individual com a identidade LT Axis no catálogo, galeria e sacola. `src/brand.css` define o sistema de marca.

## Limites da V1

Não há backend, autenticação, inscrição em newsletter, estoque remoto, pagamentos nem envio de pedidos. A tela de conta não transmite nem armazena credenciais. A sacola é local a cada navegador. O checkout explicita o caráter conceitual.

As imagens em `public/images/` foram geradas para esta loja conceitual e não representam produtos físicos. Imagens e fontes são servidas localmente. Substitua por fotografias e especificações reais antes de uma operação comercial.

## Identidade LT Axis

`BrandLogo` reúne o símbolo vetorial L/T em torno de um eixo azul e a assinatura espaçada Linha Tênue, redesenhados a partir da referência fornecida. O mesmo símbolo aparece no cabeçalho, rodapé, favicon, manifesto e página Sobre. `BrandMark` usa `currentColor` para fundos claros e escuros. Os SVGs independentes estão em `public/brand/`.

As camisetas recebem o símbolo pequeno no peito; a foto de costas o aplica abaixo da gola. Os jeans recebem uma pequena peça metálica com o monograma. Campanhas e fotografias individuais foram atualizadas com a nova marca.

## Novas modelagens

A coleção tem 16 peças: oito originais, quatro Boxy Fit unissex com ombros menos deslocados, mangas proporcionais e comprimento mais curto, e quatro femininas (duas boxy cropped, uma baby tee e uma wide leg de cintura alta). As novas peças mantêm o símbolo LT Axis pequeno.

`axis/fit-editorial.png` mostra o caimento no corpo. Descrições e medidas são específicas de cada modelagem. As medidas são ilustrativas da V1 e não são especificações de fabricação.

## Fotografias de produto

O catálogo e a página de produto usam `detailImage`, uma fotografia individual de 1086 × 1448 pixels em `public/images/products/axis-*.png`. As imagens do catálogo são carregadas sob demanda. Produtos da mesma modelagem e cor podem compartilhar a foto.

`ProductGallery` usa uma imagem real com texto alternativo, prioridade de carregamento e `object-fit: contain`. A ampliação abre um diálogo nativo com foco contido, fechamento por Escape e opção de explorar a imagem em seu tamanho original, sem ampliar artificialmente o recorte da prancha. As fotos permanecem conceituais.
