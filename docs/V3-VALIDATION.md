# Validação da V3

Verificação executada em 29/10/2026, com Node 24, Vite 6 e Chromium headless via Playwright. As ferramentas de navegador foram executadas fora das dependências da aplicação; nenhuma biblioteca de runtime foi adicionada.

## Verificações automatizadas do repositório

`npm test`: 23 testes de catálogo, variantes, estoque, sacola, campanha, cupons, frete, arredondamento, seleção atômica de looks, snapshots de pedidos, restauração validada e progressão fictícia. Inclui os 13 testes existentes da V2.

`npm run build`: build de produção concluído. Sem scripts de lint ou TypeScript configurados nesta stack JavaScript. `git diff --check` sem erros.

## Jornada no navegador

- Quick View: tamanho obrigatório, troca de cor, foto individual em alta resolução, variantes agrupadas/separadas corretamente e abertura da sacola.
- Sacola: aumentar/diminuir, limite de estoque, remover peça e esvaziar com confirmação. Cancelar a confirmação mantém o drawer e as peças.
- Look builder: seleção completa e seleção parcial, variantes de camiseta e calça, erro antes da adição e adição conjunta sem alterações parciais.
- Cupons: inválido, LT10, AXIS20, alias LINHA10, remoção e substituição. Totais recalculados após alterar quantidades.
- Regra de frete após desconto: R$ 319,80 em peças tem padrão grátis; com 10%, peças R$ 287,82 + R$ 19,90 = R$ 307,72. Expressa = R$ 322,72.
- Checkout: revisão dos itens, foco no título ao avançar, endereço fictício, duas modalidades, bloqueio de pedido sem opção de pagamento e ausência de campos financeiros.
- Confirmação: clique duplicado não cria dois pedidos; identificador fictício, snapshot dos valores, sacola limpa e histórico preservado ao recarregar.
- Histórico: detalhes, quatro etapas manuais, persistência da progressão e valores independentes de alterações posteriores na sacola.
- Jornada feminina em celular: Boxy Cropped + Wide Leg, seleção parcial de look, Quick View com grade numérica, AXIS20, expressa, Boleto demo e consulta após recarga.
- Conta: Visitante Demo, acesso/cadastro com campos fictícios somente leitura, navegação de áreas, favoritos reais do navegador e dados de exemplo.
- Reinício: cancelar preserva dados; confirmar remove apenas as quatro chaves próprias, mantendo uma chave de outro projeto.
- Armazenamento bloqueado: sacola, checkout, confirmação e histórico continuam em memória; aviso informa o limite à sessão.
- Estado vazio de checkout, pedidos e identificador inexistente com caminhos de retorno.
- Nenhum erro JavaScript, recurso ausente ou POST durante a jornada completa.

## Responsividade e teclado

Telas de 320, 360, 390, 768, 1024, 1440 e 1920 px: home, catálogo, produto, sacola, três etapas do checkout, conta e áreas, histórico, detalhes e confirmação. Sem overflow horizontal. Quick View e montagem de look também foram verificados nessas larguras. O espaçamento vertical entre resumo, acompanhamento e seção seguinte foi conferido de 320 a 900 px.

Tab permanece dentro do Quick View; Escape fecha e retorna o foco ao card. Menu mobile, busca, filtro em drawer, seleção combinada e fechamento com retorno de foco passaram na regressão da V2. As abas da conta respondem a setas, Home e End. A opção de redução de animações persiste após recarga e funciona junto à preferência do sistema.

## Repetição manual

Siga a jornada documentada no README. Confira também em uma janela privativa (estado vazio), depois recarregue a confirmação e o histórico. Para verificar o reinício, mantenha dados de outro projeto na mesma origem: eles devem permanecer intactos.

Estas verificações cobrem o front-end demonstrativo. Não validam operação comercial, serviços reais, dispositivos físicos ou outros motores de navegador. Uma suíte de navegador versionada em CI permanece como evolução recomendada para a V4.
