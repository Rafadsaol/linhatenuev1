# Linha Tênue®

V1 conceitual de e-commerce streetwear em React 19, Vite 6 e Lucide. Layout responsivo editorial em off-white, preto e azul elétrico, com tipografia Barlow Condensed e Space Grotesk.

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
- Busca, categorias, cor, preço e ordenação; todas as peças mockadas estão disponíveis em P–GG.
- Seleção de tamanho/cor, galeria com detalhe ampliado, medidas e informações de troca.
- Sacola persistida no localStorage, quantidades, remoção, frete e cupom demonstrativo `LINHA10`.
- Menu mobile, feedbacks acessíveis, suporte a movimento reduzido e newsletter ilustrativa.

`src/data.js` contém os dados; `src/components` contém componentes compartilhados; `src/pages/Home.jsx` compõe a página editorial; `src/main.jsx` gerencia estado e demais telas. `src/style.css` define o sistema visual e breakpoints.

## Limites da V1

Não há backend, autenticação, inscrição em newsletter, estoque remoto, pagamentos nem envio de pedidos. A tela de conta não transmite nem armazena credenciais. A sacola é local a cada navegador. O checkout explicita o caráter conceitual.

As fotografias são referências ilustrativas do Unsplash e não representam fotografias reais dos produtos. Fontes e imagens dependem de `fonts.googleapis.com`, `fonts.gstatic.com` e `images.unsplash.com`; substitua por assets licenciados da marca antes de uma operação comercial.
