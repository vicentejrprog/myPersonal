# Arquitetura da Solução — MyPersonal

> **Atende o critério H1f-SI-G:** Estruturar a arquitetura da solução.

## 1. Visão Geral

O MyPersonal é uma **aplicação web front-end** desenvolvida em HTML, CSS e JavaScript puro (vanilla), sem dependência de frameworks. O foco da Etapa 3 é a estrutura estática do sistema, com fluxo de telas e validação de formulários implementados.

## 2. Diagrama de Arquitetura

```
┌──────────────────────────────────────────────────────────────┐
│                        NAVEGADOR (Cliente)                   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              CAMADA DE APRESENTAÇÃO                    │  │
│  │                                                        │  │
│  │   HTML (estrutura)  +  CSS (estilo)  +  JS (lógica)    │  │
│  │                                                        │  │
│  │   ┌─────────────┐  ┌─────────────┐  ┌──────────────┐   │  │
│  │   │  Páginas    │  │ Componentes │  │ Validação    │   │  │
│  │   │  (pages/)   │  │  (CSS)      │  │ (JS)         │   │  │
│  │   └─────────────┘  └─────────────┘  └──────────────┘   │  │
│  └────────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌────────────────────────────────────────────────────────┐  │
│  │            DADOS LOCAIS (mock para Etapa 3)            │  │
│  │                                                        │  │
│  │   mock.json (alunos, treinos, dietas, agenda)          │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │       GitHub Pages            │
              │   (hospedagem estática)       │
              └───────────────────────────────┘
```

## 3. Camadas

### 3.1 Apresentação (HTML)
Páginas estáticas organizadas por perfil de usuário (`pages/profissional/`, `pages/aluno/`, `pages/auth/`). Cada página corresponde a uma tela do wireframe.

### 3.2 Estilização (CSS)
Organizado em arquivos modulares dentro de `assets/css/`:
- `reset.css` — normalização entre navegadores
- `variables.css` — design tokens (cores, fontes, espaçamentos)
- `components.css` — componentes reutilizáveis (botões, inputs, cards)
- `layout.css` — estruturas de layout (sidebar, topbar, grids, responsividade)

### 3.3 Lógica (JavaScript)
Vanilla JS, sem dependências externas:
- `validation.js` — biblioteca de validação de formulários
- `navigation.js` — marcação automática do menu ativo

### 3.4 Dados
Para a Etapa 3 (front-end estático), os dados são fictícios (mock) em arquivo JSON. Nas etapas seguintes serão dinamizados via LocalStorage ou API.

## 4. Fluxo de Navegação

O fluxo completo está documentado nos User Flows do Figma (3 perfis: Personal Trainer, Nutricionista e Personal Nutricionista).

Esquema simplificado:

```
[index.html — Login]
        │
        ▼
[identificacao-perfil.html]
        │
        ├──→ Profissional ──→ [dashboard.html]
        │                          │
        │                          ├──→ [alunos.html]
        │                          │       ├──→ [cadastrar-aluno.html]
        │                          │       └──→ [perfil-aluno.html]
        │                          │                 ├──→ [editar-treino.html]
        │                          │                 ├──→ [editar-dieta.html]
        │                          │                 └──→ [nova-avaliacao.html]
        │                          ├──→ [agenda.html]
        │                          └──→ [mensagens.html]
        │
        └──→ Aluno ─────────→ [inicio.html]
                                   ├──→ [meu-treino.html]
                                   ├──→ [minha-dieta.html]
                                   ├──→ [historico.html]
                                   ├──→ [agenda.html]
                                   └──→ [mensagens.html]
```

## 5. Decisões Arquiteturais

| Decisão | Justificativa |
|---------|---------------|
| HTML + CSS + JS vanilla | Foco em fundamentos, sem complexidade de frameworks na Etapa 3 |
| Páginas separadas (multi-page) | Facilita o desenvolvimento incremental e a divisão entre integrantes |
| Design Tokens via CSS Custom Properties | Manutenção centralizada da identidade visual |
| Mobile-first responsivo | Atende RNF01 (interface utilizável em desktop e smartphone) |
| Validação client-side em JS modular | Reuso entre formulários e separação de responsabilidades |
| Hospedagem em GitHub Pages | Gratuito, integrado ao versionamento e ideal para sites estáticos |

## 6. Tecnologias

| Camada | Tecnologia | Versão / Padrão |
|--------|------------|-----------------|
| Estrutura | HTML5 | semântico |
| Estilo | CSS3 | com Custom Properties e Grid/Flexbox |
| Lógica | JavaScript | ES6+ |
| Versionamento | Git + GitHub | — |
| Hospedagem | GitHub Pages | — |
| Wireframes | Figma | — |

## 7. Atendimento a Requisitos Não Funcionais

| RNF | Como é atendido |
|-----|-----------------|
| **RNF01** — Responsividade | Media queries em `layout.css` (breakpoints 1024px, 768px, 480px) |
| **RNF02** — Linguagem simples e organização visual | Design tokens consistentes + hierarquia tipográfica clara |
| **RNF03** — Contraste e legibilidade | Paleta validada no Adobe Color, tamanho de fonte ≥ 14px no corpo |
| **RNF04** — Perfis de acesso distintos | Pastas separadas (`profissional/` e `aluno/`) + identificação inicial |
| **RNF06** — Expansão futura para back-end | Estrutura modular permite plugar API/LocalStorage nas próximas etapas |
| **RNF08** — Padrão visual minimalista | Componentes simples, espaçamento generoso, sem ornamentos desnecessários |
