# Linha Tênue — V3 / Interactive Shopping Experience

Loja de streetwear para portfólio em **React 19 + Vite 6**, evoluída sobre a V2 Street Campaign. Mantém a identidade **LT Axis**, os 18 produtos, coleções, fotografias, composição editorial, filtros, favoritos e rotas anteriores. A V3 completa a jornada de compra com pedidos inteiramente fictícios, executados no navegador.

## Executar e validar

Node.js **22.8+** (recomendado: Node 24) e npm:

```sh
npm ci
npm run dev -- --port 3000
npm test
npm run build
npm run preview
```

No terminal PowerShell do VS Code, use `npm.cmd` quando a política do Windows bloquear `npm.ps1`:

```powershell
git pull origin main
npm.cmd ci
npm.cmd run dev
```

O Vite informa o endereço local disponível no terminal. Os testes usam o runner nativo do Node, sem dependências adicionais. O projeto JavaScript não possui scripts de lint ou TypeScript; o build verifica a resolução dos módulos React.

O [registro de validação da V3](docs/V3-VALIDATION.md) descreve os testes de lógica, a jornada no navegador e as verificações de responsividade e teclado.

## O que a V3 entrega

- Sacola persistente com variantes agrupadas por produto/cor/tamanho, limites de estoque fictício, quantidades, remoção e confirmação para esvaziar; drawer com continuidade para loja, sacola e checkout.
- Checkout em **revisão → entrega → pagamento demo**, com resumo compartilhado e atualização imediata de valores. Destino de exemplo predefinido; nenhuma solicitação de CPF, endereço pessoal ou dados financeiros.
- Cupons locais, frete padrão/expresso, progresso para gratuidade e cálculos monetários em centavos.
- Pedido com identificador local `LT-DEMO-…`, cópia dos produtos/variantes/preços/totais, confirmação, histórico e acompanhamento fictício manual em quatro etapas. O resumo registrado não depende do catálogo atual ou de mudanças posteriores na sacola.
- **Visitante Demo / Conta demonstrativa** com visão geral, pedidos, favoritos, dados fixos de exemplo, preferência de movimento e reinício da experiência. A aparência de acesso/cadastro da V2 continua disponível, com campos fictícios preenchidos e somente leitura.
- **Shop the Look** na home e campanha: três combinações de camiseta + calça, links individuais, valor combinado e painel para escolher variantes e adicionar uma ou ambas as peças. A seleção é validada integralmente antes de alterar a sacola.
- **Quick View** nos cards: imagem, cor, tamanho, quantidade, adicionar e link para a página completa. Dialogs nativos com Escape, foco e navegação por teclado.
- Estados vazios, erros de seleção, feedback de cupons, confirmação discreta e respeito a `prefers-reduced-motion` e à preferência visual do visitante.

## Cupons e frete

| Código | Benefício |
| --- | --- |
| `LT10` | 10% sobre as peças |
| `AXIS20` | 20% sobre as peças |
| `LINHA10` | Alias de 10% preservado da V2 |

Um único cupom por pedido: aplicar outro substitui o anterior. Códigos são normalizados sem distinguir maiúsculas; inválidos exibem erro e preservam o cupom válido atual. O desconto é arredondado uma vez sobre o subtotal em centavos, antes do cálculo de frete. Frete nunca recebe desconto.

| Modalidade fictícia | Valor | Prazo ilustrativo |
| --- | --- | --- |
| Padrão | R$ 19,90; grátis se peças **após descontos ≥ R$ 299,00** | 5–8 dias úteis fictícios |
| Expressa | R$ 34,90, inclusive acima do limite | 1–3 dias úteis fictícios |

## Jornada para apresentar o projeto

1. Na home, abra **Montar este look: Forma em equilíbrio**. Escolha Boxy Fit Black no tamanho M e Baggy Washed Denim no 38. Adicione ambas.
2. Vá à sacola: subtotal **R$ 319,80** e padrão grátis. Experimente um cupom inválido e depois **LT10**: peças **R$ 287,82**, padrão **R$ 19,90**, total **R$ 307,72**. Isso demonstra que a gratuidade considera o valor após desconto.
3. Abra o checkout, revise as peças e continue. Em entrega, compare padrão e expressa; com expressa, o total do exemplo é **R$ 322,72**.
4. Escolha Cartão, Pix ou Boleto **(demonstração)**. Nenhuma opção solicita dados ou gera instruções de pagamento. Clique em **SIMULAR PEDIDO**.
5. A confirmação mostra o identificador, as peças e os valores. A sacola fica vazia. Recarregue a página para conferir persistência.
6. Abra **VER MEUS PEDIDOS → Ver detalhes → Simular próxima etapa**. Avance até “Entregue ficticiamente” e recarregue: o progresso continua salvo.
7. Abra Minha conta, explore favoritos e dados de exemplo. **REINICIAR DEMONSTRAÇÃO** pede confirmação e apaga apenas os dados desta loja.

Também é possível iniciar pelos cards com **Quick view**, combinar variantes diferentes do mesmo produto e conferir limites de estoque na sacola.

## Rotas

A navegação por hash funciona em hospedagem estática, preservando os links da V2:

| Rota | Experiência |
| --- | --- |
| `#/` | Street Campaign, categorias, lançamentos, manifesto, Boxy Fit, Feminino e Shop the Look |
| `#/loja` | Catálogo compartilhável com busca, filtros e ordenação |
| `#/loja/camisetas-boxy`, `#/loja/essentials`, `#/loja/calcas-baggy` | Categorias originais |
| `#/loja/baby-tees`, `#/loja/boxy-fit`, `#/loja/drops` | Coleções e drops |
| `#/produto/boxy-fit-black` | Produto, galeria ampliável, variantes, medidas e sugestões |
| `#/favoritos` | Curadoria salva neste navegador |
| `#/sacola` | Sacola, cupom e resumo |
| `#/checkout` | Checkout demonstrativo em três etapas |
| `#/pedido-confirmado/:id` | Confirmação fictícia e resumo registrado |
| `#/pedidos` | Histórico local de pedidos fictícios |
| `#/pedidos/:id` | Detalhes e acompanhamento manual |
| `#/minha-conta` | Visão geral do Visitante Demo |
| `#/minha-conta?area=pedidos` | Pedidos dentro da conta; também aceita `resumo`, `acesso`, `favoritos`, `dados` |
| `#/conta` | Aparência de acesso/cadastro preservada da V2 |
| `#/conta?area=pedidos` | Links antigos das áreas da conta continuam válidos |
| `#/campanha`, `#/sobre` | Campanha editorial e manifesto LT Axis |

Links numéricos antigos, como `#/produto/1`, continuam funcionando. Pedidos inexistentes e checkout sem peças exibem um estado vazio com navegação útil.

### Catálogo e produto preservados

Busca sem distinção de acentos; filtros combináveis por categoria, público, tamanho, cor e faixa de preço; ordenação por novidades, preço ou nome. Estado na URL, por exemplo:

```text
#/loja?colecao=Feminino&tamanho=M&cor=Off-white&max=120&ordenar=menor-preco
```

Os filtros de cor/tamanho consideram a mesma variante disponível. O banner editorial do catálogo não altera a contagem de peças. A galeria mantém fotos individuais em alta resolução, acabamento ilustrativo e editorial no corpo quando disponível, com ampliação no tamanho original. Calças usam grade numérica. Todos os produtos e fotografias são conceituais; medidas e orientações de cuidados/trocas também são ilustrativas.

## Organização

```text
src/
  data.js                    # 18 produtos, variantes, estoque e fotos locais
  state/Store.jsx            # estado compartilhado e persistência da demo
  lib/
    catalog.js, router.js    # catálogo e navegação existentes
    cart.js                  # agrupamento, estoque e adição atômica de looks
    coupons.js               # validação dos códigos locais
    shipping.js, pricing.js  # frete e cálculos em centavos
    orders.js                # snapshots, leitura validada e etapas fictícias
    demo.js                  # perfil, destino e meios fictícios
    campaign.js, looks.js    # curadoria editorial e combinações
  components/
    VariantPicker.jsx        # variantes reutilizáveis no Quick View e looks
    QuickView.jsx, LookBuilder.jsx
    CouponForm.jsx, OrderTotals.jsx
    OrderRecord.jsx          # itens registrados, histórico e timeline
    DemoControls.jsx         # confirmações de limpeza/reinício
    ...                      # componentes editoriais e V2 preservados
  pages/
    Checkout.jsx, Orders.jsx # novos fluxos demonstrativos
    ...                      # home, catálogo, produto, sacola, conta e institucionais
  experience.css             # apresentação da V3 sobre Street Campaign
public/brand/                # logo LT Axis e favicon preservados
public/images/               # imagens conceituais locais
```

## Persistência, privacidade e limites

Somente quatro chaves próprias são usadas no `localStorage`: `lt-cart`, `lt-favorites`, `lt-orders` e `lt-preferences` (cupom, modalidade e redução de movimento). A leitura valida os dados e mantém compatibilidade com sacolas antigas. Pedidos restaurados usam somente campos previstos no esquema; o destino é sempre o exemplo fictício. O reinício remove essas quatro chaves após confirmação e preserva outros dados do navegador.

**Tudo é demonstrativo.** Não há backend, conta real, pagamento, QR Code Pix, emissão de boleto, entrega, rastreamento, cadastro de newsletter ou atendimento comercial. Os campos da conta usam valores fictícios fixos; senhas, dados pessoais e bancários não são coletados nem persistidos. Nenhuma requisição externa gera pedidos. Fotos e fontes são locais.

O histórico pertence ao navegador/origem atual, não sincroniza entre dispositivos e pode ser apagado pelo visitante ou pelas configurações do navegador. Se o armazenamento estiver bloqueado ou cheio, a interface informa que os dados ficam apenas na sessão. Estoque é uma restrição fictícia por sacola, sem reserva ou baixa global após um pedido. As etapas avançam somente por ação do visitante. Recarregar o checkout retorna à revisão com sacola, cupom e frete preservados.

## Próximas evoluções — V4

Para aprofundar o portfólio: suíte de navegador versionada em CI, mais editoriais próprios e comparação de medidas/caimentos. Uma eventual operação comercial exige projeto próprio de backend, catálogo/estoque reais, autenticação, checkout seguro, gestão de pedidos e fotografias de produção; esses serviços não fazem parte da V3.
