# Inngest no projeto

Este diretório contém as funções de background jobs do projeto usando Inngest.

## O que é o Inngest?

O Inngest é uma ferramenta para criar workflows assíncronos e automáticos, como:
- envio de emails
- tarefas agendadas
- ações depois de eventos do sistema

Em vez de deixar tudo no fluxo principal da API, o Inngest permite separar processos que podem demorar ou acontecer mais tarde.

## Arquivo principal

- index.ts: define o cliente Inngest e as funções disponíveis

## Funções implementadas

### 1. checkLowStock
Objetivo:
- alertar o administrador quando um produto ficar com estoque baixo.

Como funciona:
- escuta o evento "inventory/stock.updated"
- procura o produto pelo ID
- se o estoque estiver abaixo do limite definido, envia um email de alerta

Variável importante:
- LOW_STOCK_THRESHOLD = 10

### 2. sendMonthlyOffers
Objetivo:
- enviar ofertas mensais para os usuários do sistema.

Como funciona:
- é disparada por cron, no dia 1 de cada mês às 10:00
- busca produtos com estoque disponível
- escolhe os melhores descontos
- envia emails em batches para não sobrecarregar o servidor de email

### 3. autoAssignRider
Objetivo:
- atribuir automaticamente um entregador a um pedido recém-criado.

Como funciona:
- escuta o evento "order/placed"
- espera 5 minutos
- verifica se o pedido existe e ainda não foi atribuído
- procura um entregador ativo e disponível
- gera um OTP
- atualiza o pedido com o entregador e o status "Assigned"

## Fluxo geral

O Inngest ajuda a separar ações de negócio em segundo plano, por exemplo:
1. um pedido é criado
2. o sistema dispara um evento
3. uma função do Inngest reage a esse evento
4. a ação é executada sem bloquear a resposta da API

## Vantagens

- reduz o tempo de resposta das rotas
- organiza processos recorrentes e automáticos
- facilita manutenção e escalabilidade
- permite reprocessamento e rastreio de jobs

## Pontos a lembrar

- as funções dependem de variáveis de ambiente, como emails de administração e URL do cliente
- o envio de emails pode falhar, então o código já tenta tratar isso com segurança
- o comportamento é baseado em eventos e cron jobs
