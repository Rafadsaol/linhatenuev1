# Linha Tênue — V4 / Admin Experience

Loja de streetwear para portfólio em **React 19 + Vite 6**, com duas experiências integradas: vitrine Street Campaign e painel **LT AXIS / ADMIN**. Tudo é demonstrativo, com dados locais e nenhuma autenticação, pagamento, entrega ou serviço comercial real. A campanha agora pode ser compartilhada automaticamente pelo servidor do projeto entre computador e celular.

A V4 evolui o projeto existente. Preserva a identidade LT Axis, os 18 produtos, fotografias individuais, catálogo com busca/filtros/ordenação, favoritos, sacola, checkout de três etapas, conta demo, histórico, Shop the Look, galeria ampliável e previews mobile de outfits/acabamento.

## Executar

Node.js **22.8+** (recomendado: Node 24) e npm:

```sh
npm ci
npm run dev -- --port 3000
npm test
npm run build
npm run preview
```

No PowerShell do VS Code, se `npm.ps1` estiver bloqueado:

```powershell
git pull origin main
npm.cmd ci
npm.cmd run dev -- --port 3000
```

A porta padrão é 3000. Se ela já estiver ocupada, o projeto avisa e não inicia em outra porta silenciosamente. Encerre o servidor anterior antes de iniciar novamente. O servidor informa os endereços Local e Network. Para abrir no celular, use Network com ambos os dispositivos no mesmo Wi-Fi. **A campanha é compartilhada entre os dispositivos conectados ao mesmo servidor**. Catálogo, sacola, favoritos e pedidos continuam pertencendo ao navegador em que foram criados.

## Campanha no computador e no celular

1. Inicie `npm.cmd run dev -- --port 3000` no computador. Se o servidor já estava aberto antes desta atualização, encerre com Ctrl+C e inicie novamente.
2. No computador, abra **Painel demo → Campanhas**, faça as alterações e clique em **Salvar alterações**. Aguarde “Campanha sincronizada com os dispositivos conectados”.
3. No celular, conectado ao mesmo Wi-Fi, abra o endereço **Network** informado pelo Vite. A home recebe título, imagem, subtítulo, CTA, drop, mensagens da topbar e seleção de destaques em cerca de três segundos, ou ao voltar para a aba.

O computador pode usar `localhost` e o celular o IP de rede: ambos consultam o mesmo servidor. Na primeira execução, uma campanha já editada no navegador é publicada automaticamente se ainda não houver campanha compartilhada. Uma campanha já publicada prevalece sobre cópias antigas de outros navegadores.

A configuração compartilhada fica em **`.linha-tenue/campaign.json`**, no computador que executa o projeto, e permanece após reiniciar o servidor. Essa pasta é ignorada pelo Git. Somente campos de campanha são compartilhados; não há envio de pedidos ou dados de conta. Os destaques por produto usam os IDs disponíveis no catálogo de cada navegador.

A sincronização usa um endpoint local de demonstração (`/api/demo/campaign`) em `npm run dev` e `npm run preview`. Um deploy apenas estático não executa esse endpoint: nesse caso a interface informa que a campanha permanece local. O servidor deve continuar ligado para os dispositivos receberem mudanças. A edição compartilhada é demonstrativa e não possui autenticação.

## Acessar o painel

Abra `http://localhost:3000/#/admin` ou o link **Painel demo ↗** no rodapé da loja. Não há login. O administrador é fictício, e todas as páginas exibem “Ambiente demonstrativo — dados fictícios.”

| Rota administrativa | Recursos funcionais |
| --- | --- |
| `#/admin` | Indicadores calculados, gráficos interativos, períodos 7/30/90/todos, filtro por origem, pedidos recentes, alertas e atalhos |
| `#/admin/produtos` | Busca, categoria/status/ordenação, cadastro, edição, promoção, preview, variantes, imagens locais, duplicação oculta, ativação/ocultação e exclusão confirmada |
| `#/admin/estoque` | Quantidades por variante, grade numérica de calças, disponibilidade, ajuste/reposição e histórico de até 300 movimentações |
| `#/admin/pedidos` | Número/status/período/origem, detalhes e snapshots, transições sequenciais, cancelamento elegível e devolução única de estoque |
| `#/admin/clientes` | 19 perfis fictícios, busca e segmento, pedidos associados, itens e indicadores por perfil |
| `#/admin/cupons` | Percentual ou fixo, mínimo em peças, limite de utilizações, validade opcional, ativação, edição e exclusão confirmada |
| `#/admin/campanhas` | CMS local do hero/topbar/drop/imagem/CTA/destaques, prévia antes de salvar e restauração confirmada |
| `#/admin/relatorios` | Vendas, pedidos, ticket, produtos, categorias e volume por período/origem; exportação CSV no navegador |
| `#/admin/configuracoes` | Limite de estoque baixo, movimento, informações de persistência, restaurações confirmadas e backup JSON |

O painel tem navegação em drawer no mobile, tabelas com rolagem contida e formulários em coluna única. Modais funcionam com Tab, Shift+Tab e Escape, com retorno de foco.

## Roteiro loja → admin → loja

1. Em **Produtos → Cadastrar produto**, preencha nome, slug/SKU únicos, descrições, preço, variantes e imagens locais. Salve e abra a loja: a peça aparece no catálogo. “Destaque da home” também a inclui no Shop the Drop.
2. Edite o preço ou cadastre uma promoção. As próximas operações usam o novo preço. Oculte a peça para retirá-la da vitrine e impedir adições; ative-a novamente.
3. Em **Estoque**, ajuste uma variante para zero. A loja sinaliza indisponibilidade e impede sua adição. Reponha para continuar.
4. Em **Cupons**, crie, por exemplo, `DEMO20`, fixo de **R$ 20,00**, mínimo de **R$ 100,00** e limite de **1 uso**.
5. Na loja, selecione a variante, adicione à sacola, aplique `DEMO20`, avance por revisão/entrega/pagamento demo e clique em **SIMULAR PEDIDO**. Nenhum dado financeiro é solicitado.
6. Volte a **Pedidos**. O novo registro tem origem **Visitante · V4**, cliente **Visitante Demo** e estoque já descontado. Avance para preparação, envio e entrega; a conta demo recebe o mesmo status.
7. Para testar cancelamento, use outro pedido em estado registrado/preparação. Confirme o cancelamento com devolução de unidades. Recarregar não repete a devolução. Se optar por adiar, “Devolver estoque” fica disponível uma única vez.
8. Em **Campanhas**, altere título/topbar/CTA e salve. A home reflete as mudanças. Em **Relatórios**, filtre origem/período e exporte CSV. Em **Configurações**, exporte um backup JSON.

Para demonstrar atualização de catálogo, estoque e pedidos entre abas, mantenha loja e admin abertos **no mesmo navegador e origem**. A campanha também é compartilhada entre dispositivos pelo servidor. Alterações são propagadas pelo evento `storage`. Histórico de pedidos conserva nome, variantes, preço, desconto, frete e total da simulação mesmo após editar ou excluir o produto.

## Dados iniciais e indicadores

A primeira inicialização cria **18 produtos**, **42 pedidos históricos fictícios**, **18 perfis de exemplo + Visitante Demo**, três cupons e a campanha original. IDs são estáveis; refresh não duplica os exemplos. O cadastro usa um contador de IDs que não é reutilizado após excluir produtos.

Origens são identificadas separadamente:

- **Exemplo inicial:** histórico para apresentar gráficos; não gera baixa adicional no estoque.
- **Visitante · V3:** pedidos migrados, com seus valores preservados e sem baixa retroativa.
- **Visitante · V4:** novos pedidos, com baixa de estoque registrada na mesma gravação local.

A área do cliente mostra somente os pedidos do Visitante Demo. O admin permite consultar todas as origens.

Vendas e ticket usam o total dos pedidos não cancelados, incluindo o frete fictício. Produtos mais presentes contam unidades; categorias contam pedidos não cancelados contendo cada categoria (um pedido pode aparecer em mais de uma). Período e origem filtram os indicadores transacionais; produtos, estoque e perfis mostram o estado atual dos cadastros.

## Estoque e estados dos pedidos

Estoque baixo começa em **5 unidades ou menos por variante**, configurável entre 0 e 100. Quantidades de estoque aceitam inteiros de 0 a 10.000. Peças ocultas, removidas ou variantes sem estoque deixam de ser compráveis. A sacola é reconciliada com o catálogo após alterações, preservando apenas seleções disponíveis e limitando quantidades ao estoque.

Fluxo permitido: **Registrado → Em preparação → Enviado → Entregue**. Cancelamento apenas em registrado/preparação; entregue e cancelado são estados finais. Não há saltos ou transições repetidas. Uma baixa ou devolução não reaparece após refresh.

Pedidos de exemplo/V3 não recebem reposição por cancelamento, pois não tiveram baixa nesta base. Se uma peça/variante tiver sido excluída, a devolução ignora essa variante sem recriar produtos; o snapshot do pedido permanece intacto.

## Cupons e frete

| Código inicial | Benefício |
| --- | --- |
| `LT10` | 10% sobre as peças |
| `AXIS20` | 20% sobre as peças |
| `LINHA10` | Alias de 10% preservado da V2 |

Um cupom por pedido. Aplicar outro substitui o anterior; um código inválido não remove o cupom válido atual. Desconto fixo é limitado ao subtotal; percentuais aceitam inteiros de 1 a 100. Mínimo refere-se ao subtotal antes de descontos. Usos contam pedidos não cancelados; cancelar libera o uso. Validade considera o fim do dia no horário de Brasília. Alterações no admin podem invalidar um cupom da sacola: o aviso pede removê-lo ou substituí-lo antes de concluir.

Cálculos usam centavos. Frete padrão **R$ 19,90**, grátis quando peças **após descontos ≥ R$ 299,00**; expressa **R$ 34,90**. O desconto nunca reduz o frete. Prazos são fictícios.

## Rotas da loja preservadas

| Rota | Experiência |
| --- | --- |
| `#/` | Home Street Campaign, categorias, coleções, manifesto e Shop the Look |
| `#/loja` | Catálogo, busca, filtros e ordenação compartilháveis na URL |
| `#/loja/camisetas-boxy`, `#/loja/essentials`, `#/loja/calcas-baggy` | Categorias originais |
| `#/loja/baby-tees`, `#/loja/boxy-fit`, `#/loja/drops` | Coleções e drops |
| `#/produto/:slug` | Produto, galeria/zoom, variantes, medidas e sugestões |
| `#/favoritos`, `#/sacola`, `#/checkout` | Curadoria, sacola e checkout demonstrativo |
| `#/pedido-confirmado/:id`, `#/pedidos`, `#/pedidos/:id` | Confirmação e histórico local do visitante |
| `#/minha-conta` | Visão geral do Visitante Demo |
| `#/conta` | Acesso/cadastro visual com dados fictícios somente leitura |
| `#/minha-conta?area=pedidos` | Também aceita `resumo`, `acesso`, `favoritos`, `dados`; links antigos `#/conta?area=…` preservados |
| `#/campanha`, `#/sobre` | Campanha editorial e manifesto LT Axis |

Links antigos como `#/produto/1` continuam válidos para produtos ativos. A home mantém as opções Masculino/Feminino no mobile; cards e Quick View mantêm Frente/Acabamento sem exigir navegação à página do produto.

## Persistência, migração e restauração

A fonte compartilhada é **`lt-database-v4`**, com `schemaVersion: 4`, revisão local, catálogo/variantes, pedidos, perfis fictícios, cupons, campanha, sacola, favoritos, preferências, configurações e movimentações.

Quando não existe uma V4 válida, a leitura migra `lt-cart`, `lt-favorites`, `lt-orders` e `lt-preferences`, mantendo as chaves antigas intactas. Depois disso, apenas a base V4 dirige a experiência; as chaves antigas não são espelhos reativos. Histórico migrado não sofre recálculo por preço/cupom atual. Dados inválidos são validados ou recuperados; quando possível, o documento V4 corrompido é preservado em `lt-recovery-v4` antes de substituí-lo.

**Configurações → Reiniciar demonstração inteira** pede confirmação, repõe dados iniciais e limpa pedidos adicionais, sacola, favoritos e preferências. Remove apenas as chaves próprias antigas/de recuperação, mantendo a base V4 reiniciada. Nunca usa `localStorage.clear()`.

Restaurar catálogo, campanhas ou cupons separadamente também exige confirmação. A restauração de catálogo repõe estoques iniciais e considera as baixas históricas conciliadas, evitando devolver novamente unidades de um estoque já restaurado; os valores dos pedidos são preservados.

Sem armazenamento disponível, a interface informa que tudo fica apenas na sessão. Abas usam a mesma origem (protocolo, host e porta); `localhost`, IP de rede, portas diferentes e navegadores distintos têm bases independentes. Edições simultâneas seguem a última gravação local; não há transações distribuídas ou reserva comercial de estoque. A campanha possui sincronização separada pelo servidor, sem compartilhar sacola, pedidos ou perfis.

O CSV e o backup JSON são gerados por Blob no próprio navegador, somente com dados fictícios. O backup é uma exportação; importação de backup não faz parte desta versão.

## Organização e bibliotecas

```text
src/state/Store.jsx             # Context compartilhado, transações e storage event
src/lib/admin/catalog.js       # produtos, variantes, validação e assets locais
src/lib/admin/database.js      # schema, leitura validada e migração da V3
src/lib/admin/seed.js           # exemplos estáveis e configurações iniciais
src/lib/admin/operations.js     # estoque, pedidos e transições atômicas locais
src/lib/admin/analytics.js      # indicadores, períodos, CSV e download local
src/lib/admin/campaign.js       # configuração/validação do CMS
src/lib/coupons.js, pricing.js  # cupons dinâmicos e totais em centavos
src/admin/                     # nove telas, shell, charts, formulários e estilos
src/components/                # componentes da loja reutilizados/preservados
src/lib/campaignSync.js         # recepção, publicação e reconexão da campanha
scripts/campaign-server.js     # persistência compartilhada com escrita serializada
src/framing.css                # proporções e pontos de enquadramento responsivos
public/images/looks/           # retratos individuais dos três looks
src/data.js                    # catálogo original mantido como base de restauração
```

Nenhuma dependência foi adicionada. Gráficos usam SVG/CSS e controles acessíveis; React Context, lucide-react e as fontes locais existentes foram mantidos.

## Validação e limites

**50 testes automatizados** no runner nativo do Node (incluindo os 23 anteriores), build Vite e verificações de navegador. Não há scripts de lint/typecheck configurados nesta stack JavaScript. Consulte o [registro da V4](docs/V4-VALIDATION.md) para os fluxos, larguras e limites de cobertura.

O servidor local compartilha apenas a campanha. Não há conta real, senha real, pagamentos, emissão de boletos/QR Code, e-mail, entrega, upload ou serviço pago. Os dados de perfil são fixos e fictícios. Fotografias, acabamento, medidas, prazos e orientações de troca são conceituais. Nenhuma operação gera pedidos em serviços externos.

## Revisão dos enquadramentos

O banner preserva o topo das imagens de campanha, incluindo em monitores largos. Blocos de editorial usam a proporção original; produtos e retratos completos usam contenção para preservar a peça. O Shop the Look possui fotos individuais: look 01 com o rapaz centralizado, look 02 com a mulher de cropped off-white e look 03 com a mulher de Baby Tee Cobalt. As fotos foram geradas a partir dos editoriais da marca para esta demonstração. A foto escolhida em Campanhas aparece tanto no computador quanto no celular. A campanha padrão usa a foto original com os dois modelos; no celular, os botões Masculino e Feminino alternam o enquadramento na mesma imagem. O foco acompanha a posição de cada modelo na foto e a largura da tela. Nas campanhas com um único modelo, esses botões não são exibidos.
