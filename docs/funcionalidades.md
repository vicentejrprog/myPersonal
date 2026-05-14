# Funcionalidades do Sistema — MyPersonal

> **Atende os critérios H3i-SI-G** (descrever elementos-chave) **e H3a-SI-G** (projetar fluxo de telas).
>
> Este documento relaciona cada tela do sistema com os requisitos funcionais (RF) e histórias de usuário (US) que ela atende, conforme especificado na Etapa 1.

## Mapa de Telas

### 🔐 Contexto de Acesso

#### Tela 01 — Login (`index.html`)
- **Atende:** RNF04 (perfis distintos), validação de credenciais
- **Funcionalidades:** entrada de e-mail e senha; link para recuperação; opção de criar conta; validação client-side
- **Elementos-chave:** form de autenticação, validação de e-mail, link de fluxo

#### Tela 02 — Identificação de Perfil (`identificacao-perfil.html`)
- **Atende:** RNF04
- **Funcionalidades:** seleção entre 4 perfis (Nutricionista, Personal Trainer, Personal Nutricionista, Aluno) para roteamento da experiência

### 👨‍⚕️ Contexto do Profissional

#### Tela 03 — Dashboard (`profissional/dashboard.html`)
- **Atende:** US04, US10, RF09
- **Funcionalidades:** cards de métricas (alunos ativos, treinos do dia, mensagens, próx. consulta); lista de alunos recentes; resumo da agenda do dia

#### Tela 04 — Lista de Alunos (`profissional/alunos.html`)
- **Atende:** US10, RF09
- **Funcionalidades:** busca por nome; tabela com status (ativo/inativo/novo); ação rápida para ver perfil ou cadastrar novo

#### Tela 05 — Cadastrar Aluno (`profissional/cadastrar-aluno.html`)
- **Atende:** RF09, **H4a-SI-G** (validação de formulário)
- **Funcionalidades:** dados pessoais, dados físicos iniciais, vínculo e acesso, foto opcional, credenciais; validação de todos os campos obrigatórios

#### Tela 06 — Perfil do Aluno (`profissional/perfil-aluno.html`)
- **Atende:** US04, US10, RF09
- **Funcionalidades:** header com dados do aluno; abas internas (Treino, Dieta, Histórico, Estatísticas, Agenda, Mensagens); cada aba mostra resumo + botão de editar

#### Tela 07 — Editar Treino (`profissional/editar-treino.html`)
- **Atende:** US02, RF02
- **Funcionalidades:** seleção de grupo (Treino A/B/C); tabela editável de exercícios (série, reps, descanso, observação, link de vídeo); observações gerais

#### Tela 08 — Editar Dieta (`profissional/editar-dieta.html`)
- **Atende:** US03, RF04
- **Funcionalidades:** seleção de dia da semana; 4 refeições editáveis (Café, Almoço, Lanche, Jantar); cálculo de macros; observações da dieta

#### Tela 09 — Nova Avaliação Corporal (`profissional/nova-avaliacao.html`)
- **Atende:** US04, RF05
- **Funcionalidades:** medidas corporais (peso, %gordura, circunferências); comparativo com avaliação anterior; observações; fotos de progresso

#### Tela 10 — Agenda (`profissional/agenda.html`)
- **Atende:** US01, RF01
- **Funcionalidades:** calendário mensal; eventos por dia; botão para novo compromisso

#### Tela 11 — Mensagens (`profissional/mensagens.html`)
- **Atende:** comunicação aluno↔profissional
- **Funcionalidades:** lista de conversas; chat com aluno selecionado; envio de mensagem

### 🏃 Contexto do Aluno

#### Tela 12 — Início (`aluno/inicio.html`)
- **Atende:** US05, US06, US07, US09
- **Funcionalidades:** cards de acesso rápido (treino, dieta, evolução, agenda, mensagens); resumo do treino de hoje; próximos compromissos; mini gráfico de evolução

#### Tela 13 — Meu Treino — Unificada (`aluno/meu-treino.html`)
- **Atende:** US05, US08, RF03, RF07, RF08
- **Funcionalidades:** abas por grupo (A/B/C); tabela única com **visualização do planejado + registro do realizado** (séries, reps, carga, observações por exercício); botão de vídeo por exercício; observações gerais e sensação do treino

#### Tela 14 — Minha Dieta (`aluno/minha-dieta.html`)
- **Atende:** US06, RF04
- **Funcionalidades:** navegação por dia da semana; cards das 4 refeições; totais de macros; observações do profissional; histórico de versões

#### Tela 15 — Histórico e Estatísticas (`aluno/historico.html`)
- **Atende:** US09, RF06, RF10
- **Funcionalidades:** métricas resumo; gráficos de evolução (peso, %gordura); tabela de avaliações registradas

#### Tela 16 — Agenda do Aluno (`aluno/agenda.html`)
- **Atende:** US07, RF01
- **Funcionalidades:** calendário pessoal; consultas, trocas de treino, avaliações

#### Tela 17 — Mensagens do Aluno (`aluno/mensagens.html`)
- **Atende:** comunicação aluno↔profissional
- **Funcionalidades:** chat com o profissional; envio de dúvidas e observações

## Telas de Confirmação

Algumas ações geram modais de confirmação após sucesso. Eles são overlays sobre a tela de origem:

| Confirmação | Após qual ação |
|-------------|----------------|
| Cadastro realizado | Cadastrar aluno |
| Treino salvo | Editar treino |
| Dieta salva | Editar dieta |
| Avaliação registrada | Nova avaliação |
| Compromisso agendado | Novo compromisso |
| Mensagem enviada | Envio no chat |

## Resumo: Requisitos × Telas

### Requisitos Funcionais

| RF | Descrição | Telas que atendem |
|----|-----------|-------------------|
| RF01 | Agenda de atendimentos | 10, 16 |
| RF02 | Cadastrar/editar treinos | 07 |
| RF03 | Aluno visualizar treino | 13 |
| RF04 | Registro de dieta | 08, 14 |
| RF05 | Avaliações e estatísticas | 09, 15 |
| RF06 | Histórico de treinos/dieta/avaliações | 06, 15 |
| RF07 | Vídeos de exercícios | 13 |
| RF08 | Aluno registrar observações | 13 |
| RF09 | Perfil consolidado do aluno | 03, 04, 06 |
| RF10 | Exportar relatório (estatísticas) | 15 |

### Histórias de Usuário

| US | Tela principal |
|----|----------------|
| US01 — Personal: gerenciar agenda | 10 |
| US02 — Personal: montar/atualizar treinos | 07 |
| US03 — Nutricionista: registrar dieta | 08 |
| US04 — Profissional: histórico e estatísticas | 06, 09 |
| US05 — Aluno: visualizar treino | 13 |
| US06 — Aluno: acompanhar dieta | 14 |
| US07 — Aluno: ver agenda | 16 |
| US08 — Aluno: registrar observações | 13 |
| US09 — Aluno: consultar histórico e evolução | 15 |
| US10 — Profissional: perfil consolidado | 06 |
