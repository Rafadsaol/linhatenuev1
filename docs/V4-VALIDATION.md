# Validação — V4 Admin Experience

Executada em 29/10/2026 com Node 24, Vite 6 e Chromium headless via Playwright. O browser foi usado como ferramenta externa de validação, sem adicionar dependências à aplicação. Não foram utilizados serviços comerciais.

## Checks do repositório

- `npm test`: 37 testes de catálogo, campanha, sacola, cupons, frete, pedidos, V4 e migração; os 23 testes anteriores foram mantidos.
- `npm run build`: produção gerada com Vite. Sem importações quebradas.
- `git diff --check`: sem erros.
- Não existem scripts de lint ou TypeScript nesta stack JavaScript.

Os novos testes verificam seeds estáveis, restauração sem duplicação, migração V3 sem baixa retroativa, corrupção, validação de produtos e preços, variantes numéricas, sacola reconciliada, baixa de estoque única, transições elegíveis, devolução única/imediata/adiada, snapshots após exclusão, cupons fixos/limites/validade, CMS, métricas por período/origem e CSV.

## Jornada integrada em duas abas

1. Cadastro de produto no admin, preview, preço promocional e destaque na home.
2. Catálogo recebe a peça; ocultação/ativação atualiza a outra aba. Duplicação gera cópia oculta. Exclusão exige confirmação e o próximo ID não é reutilizado.
3. Ajuste de estoque a zero impede seleção na loja; reposição reabilita a variante sem refresh. Remover uma cor no admin atualiza produto/Quick View já abertos em outra aba, com fallback válido da galeria; o montador de look recebe o novo preço sem navegar.
4. Criação de cupom fixo FIX20: R$ 20, mínimo R$ 100 e limite de um uso. Produto de R$ 129,90 resulta em peças de R$ 109,90 + R$ 19,90 de frete = R$ 129,80.
5. Checkout Pix demo registra um único pedido mesmo com clique duplicado, limpa sacola e desconta uma unidade do estoque. O pedido aparece no admin como Visitante · V4.
6. Admin muda para preparação; histórico do cliente acompanha a etapa. Cancelamento com confirmação devolve uma vez; refresh não duplica a reposição.
7. Segundo pedido com AXIS20/Boleto demo avança sequencialmente até entregue. Valores, nome e variante do snapshot permanecem após editar preço e excluir o produto.
8. Perfil Visitante Demo associa os dois pedidos e exclui o cancelado do total simulado.
9. CMS altera título, subtítulo, CTA interno, imagem e topbar; home reage. Refresh mantém os dados e restauração confirmada recupera a campanha original.
10. Relatórios filtram período e origem; CSV e backup JSON foram baixados e inspecionados. Indicadores usam os registros locais.
11. Configuração de estoque baixo é salva. Restaurar cupons mantém os descontos dos snapshots. Reiniciar a demonstração pede confirmação, restaura 18 produtos e 42 exemplos e preserva chave de outra aplicação.

Nenhum erro JavaScript, imagem ausente ou POST na jornada integrada.

## Migração e falhas de armazenamento

- Pedido da V3, sacola com grade antiga de calça, favoritos e preferências migrados no navegador. Cliente vê somente o próprio histórico; admin inclui exemplos e identifica origem legada.
- Valores antigos e estoque inicial preservados. Refresh mantém 43 registros (42 exemplos + 1 legado), sem duplicação. Chaves da V3 ficam intactas.
- Documento inválido recuperado com aviso; conteúdo bruto preservado na chave de recuperação, quando gravável. Dados de outra aplicação intactos. Nova recarga lê a V4 válida.
- localStorage bloqueado: checkout e consulta do novo pedido no admin continuam em memória na mesma sessão, com aviso explícito; recarregar não é tratado como persistência disponível.

## Layout e acessibilidade

As nove páginas administrativas foram verificadas em **320, 360, 390, 768, 1024, 1440 e 1920 px**. Formulários de produto/cupom e detalhe de pedido também, com foco contido e Escape. Tabelas rolam dentro de seu contêiner; página sem overflow horizontal. Menu administrativo mobile navega, fecha e retorna foco ao acionador.

Regressão da vitrine: URL de filtros, busca, quatro ordenações, favoritos/refresh, galeria de alta resolução, variantes/estoque, grade numérica, quantidades, sacola/cupom, checkout e links numéricos antigos. Previews mobile masculino/feminino, Frente/Acabamento de algodão/denim e Quick View por cor passaram com toque e teclado.

## Limites de cobertura

Testes de navegador executados nesta entrega, com roteiro registrado neste documento. Não há runner de navegador adicionado ao package.json ou CI versionado. A verificação não substitui testes em dispositivos físicos ou outros motores de navegador. Não inclui backend, autenticação, pagamentos, logística ou simultaneidade distribuída: estes recursos não existem na demonstração.
