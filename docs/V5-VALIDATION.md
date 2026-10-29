# V5 Final — auditoria e entrega

## Escopo preservado

React 19, Vite 6, JavaScript, CSS, Lucide React e Fontsource. Sem novas dependências. Catálogo inicial de 18 produtos, variantes, preços e nomes preservados; nenhuma migração destrutiva ou reset automático foi introduzido. A identidade LT Axis, as fotografias locais, os looks individuais e o foco responsivo do hero foram mantidos.

A loja utiliza componentes compartilhados de galeria, cards, variantes, totais, cupons, pedidos, menus e diálogos. StoreProvider continua responsável pela base local `lt-database-v4`. A API demonstrativa de campanhas existente continua ativa em dev/preview; não foi acrescentado banco externo.

## Melhorias entregues

- Tour não modal de oito etapas, opcional, disponível na loja e admin. Voltar, Próximo, Pular, Concluir e Escape. Não gera pedidos nem altera dados. Retorna à rota, rolagem e foco de origem; trata catálogo sem produtos disponíveis honestamente.
- Página `#/case-study` com apresentação editorial, conceito, logo, cores, tipografia, funcionalidades, stack real e atalhos loja/admin/reset. Se a peça original for removida, o link demonstrativo de produto usa outra peça disponível ou o catálogo.
- Seis capturas reais, JPEG, 1440 × 1000, em `public/images/case-study/`. Exibem uma sessão de exemplo com uma peça na sacola. Não são previews ao vivo. Total aproximado: 570 KB. Fotografias editoriais locais nos cards de categorias sem alterar suas proporções aprovadas.
- Foco visível, descrição acessível do guia, progresso identificado, newsletter explicitamente ilustrativa e aviso de confirmação de pedido: “Pedido demonstrativo. Nenhuma compra real foi realizada.”
- Carregamento sob demanda do admin e case study; fontes limitadas ao conjunto latino. Build inicial JS reduzido de cerca de 438 KB para 381 KB, com chunks separados (~64 KB admin, ~6 KB case study). Não equivale a uma medição Lighthouse.
- Metadados básicos e descrição do case study por rota. Favicon LT Axis preservado. README, versão do pacote e identificação visual atualizados para V5; schema de dados permanece V4 por compatibilidade.

## Resultados executados

- `npm test`: **50 testes passaram**, zero falhas. Incluem catálogo, variantes, cupons, centavos, frete, snapshots, estoque, migração, servidor e recuperação de sincronização de campanhas.
- `npm run build`: passou; chunks admin e case study separados.
- `git diff --check`: sem erros de whitespace.
- Preview de produção em 4173: loja, chunks de admin/case study, tour e API de campanha passaram.
- Auditoria de 52 links internos únicos, busca mobile, menu/Escape/restauração de foco e tour somente por teclado: passou.
- Admin em 320, 360, 390, 768, 1024, 1440 e 1920 px: nove rotas, diálogos de produto/pedido/cupom, rolagem contida de tabelas e navegação do menu passaram.
- Chromium/Playwright: 20 rotas em **360, 390, 768, 1024, 1440 e 1920 px**, incluindo loja, produto, sacola, checkout, favoritos, pedidos, conta, sobre, campanha, case study e nove módulos administrativos. Sem overflow horizontal indevido, imagens quebradas ou erros JavaScript nesses fluxos.
- Tour: oito etapas, navegação adiante/volta/conclusão, Pular e Escape, retorno ao case study, restauração de foco e igualdade da base local antes/depois. Layout do guia testado nas seis larguras.
- Integração A–H: criar produto e ver na loja; preço promocional e estoque por variante; ocultar/reativar entre abas; duplicar/excluir com confirmação; cupom fixo e percentual no checkout; pedido com baixa única; status no histórico; cancelamento com reposição única; snapshots após editar/excluir produtos; campanha na home e restauração; relatórios CSV/backup JSON; reset consistente preservando chaves alheias.
- Armazenamento: recuperação de JSON inválido com backup; localStorage bloqueado mantém sessão, checkout e pedido no admin em memória com aviso; variantes removidas e preços atualizados entre abas não quebram Quick View, galeria ou montador de look.

Os roteiros de navegador foram executados na infraestrutura de validação externa à aplicação. Não se adicionou Playwright às dependências do site. A verificação de integração anterior à sincronização foi atualizada para permitir exclusivamente PUT no endpoint de campanha; outras requisições de gravação comerciais continuam ausentes.

## Limitações e publicação

- Sem autenticação, transações financeiras, entrega, envio de newsletter ou dados comerciais reais. Não é uma loja pronta para operar vendas.
- Produtos, pedidos, cupons, conta, favoritos e sacola pertencem ao navegador. Abas da mesma origem recebem atualizações. Só campanha é compartilhada entre dispositivos pelo mesmo servidor Vite e arquivo `.linha-tenue/campaign.json`.
- Um deploy estático não executa a API demo de campanhas; a interface informa a persistência local. O arquivo de campanha não vai para o Git. Não foi criado backend comercial nesta versão.
- Não houve teste físico em iOS/Android, auditoria certificada WCAG ou medição Lighthouse. O navegador automatizado foi Chromium. Não há hidratação porque a aplicação é renderizada no cliente.
- Lint e TypeScript typecheck não foram executados: o projeto JavaScript não possui esses scripts/configurações. Nenhum resultado deles é presumido.
- SEO é básico: rotas hash não oferecem metadados por página a todos os crawlers. Ao publicar, definir URL absoluta para a imagem Open Graph no domínio final. Não foi feito deploy ou configurado domínio público.
- Fotografias conceituais e dados são demonstrativos. As imagens originais permanecem locais; não foram inventadas integrações ou fontes comerciais.

## Demonstração

1. No VS Code, parar o servidor anterior, atualizar o Git e executar `npm.cmd ci` (primeira instalação) e `npm.cmd run dev`.
2. Abrir `http://localhost:3000/#/case-study`; iniciar o tour ou entrar em `#/` e `#/admin`.
3. No celular, usar o endereço Network da mesma execução, com PC e celular na mesma rede. A porta 3000 é estrita.
4. Cupons: LT10 (10%), AXIS20 (20%) e LINHA10 (10%, alias legado).
5. Reiniciar demonstração no rodapé, case study ou Configurações do admin e confirmar. Esse comando apaga seleções/pedidos adicionais, restaura exemplos e também restaura a campanha compartilhada. O tour por si só nunca reinicia dados.
