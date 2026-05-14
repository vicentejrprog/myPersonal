<<<<<<< HEAD
# MyPersonal

Plataforma web front-end para acompanhamento centralizado entre profissionais da saúde (personal trainers, nutricionistas) e seus alunos/clientes.

## 🎯 Sobre o projeto

O **MyPersonal** centraliza informações de treino, dieta, agenda e evolução física em uma interface única, reduzindo a dispersão de informações entre múltiplos canais (WhatsApp, planilhas, aplicativos).

Projeto desenvolvido na disciplina **Projeto: Aplicações Web** — PUC Minas, 2026/1.

## 👥 Equipe

- Vicente Luiz da Silva Junior
- Mateus Rocha Dourado
- Leonardo Laurindo do Nascimento
- Jonathan Joaquim Rodrigues
- Nathan Santos Dutra da Silva

**Professor Tutor:** Caroline Rhaian da Silva Jandre

## 🚀 Como executar

### Opção 1 — Abrir localmente
```bash
git clone <url-do-repositorio>
cd mypersonal
# Abra index.html no navegador (duplo clique)
```

### Opção 2 — Servidor local (recomendado)
```bash
# Com Python
python -m http.server 8000

# Com Node.js (http-server)
npx http-server

# Acesse http://localhost:8000
```

### Opção 3 — GitHub Pages
A aplicação está disponível em: `https://<usuario>.github.io/mypersonal/`

## 📁 Estrutura do projeto

```
mypersonal/
├── index.html                    # Tela de login (entrada do sistema)
├── README.md                     # Este arquivo
│
├── assets/
│   ├── css/
│   │   ├── reset.css            # Reset CSS
│   │   ├── variables.css        # Design tokens (cores, fontes)
│   │   ├── components.css       # Botões, inputs, cards, badges
│   │   ├── layout.css           # Sidebar, topbar, grids
│   │   └── pages/               # CSS específico por página
│   ├── js/
│   │   ├── validation.js        # Validação de formulários (RF H4a-SI-G)
│   │   └── navigation.js        # Highlight do menu ativo
│   ├── img/                     # Imagens e ícones
│   └── data/
│       └── mock.json            # Dados fictícios para demonstração
│
├── pages/
│   ├── auth/
│   │   ├── login.html
│   │   └── identificacao-perfil.html
│   ├── profissional/
│   │   ├── dashboard.html
│   │   ├── alunos.html
│   │   ├── cadastrar-aluno.html
│   │   ├── perfil-aluno.html
│   │   ├── editar-treino.html
│   │   ├── editar-dieta.html
│   │   ├── nova-avaliacao.html
│   │   ├── agenda.html
│   │   └── mensagens.html
│   └── aluno/
│       ├── inicio.html
│       ├── meu-treino.html
│       ├── minha-dieta.html
│       ├── historico.html
│       ├── agenda.html
│       └── mensagens.html
│
└── docs/
    ├── template.md              # Guia visual (cores, fontes, componentes)
    ├── arquitetura.md           # Arquitetura da solução
    └── funcionalidades.md       # Relação tela ↔ requisito
```

## 📋 Cronograma — Etapa 3

| Semana | Período | Sprint | Entregáveis |
|--------|---------|--------|-------------|
| 1 | dd/mm – dd/mm | **Setup e Design System** | Estrutura de pastas · Git inicializado · `variables.css` · `components.css` · `layout.css` |
| 2 | dd/mm – dd/mm | **Telas de Acesso** | `index.html` (Login) · `identificacao-perfil.html` · validação de formulário |
| 3 | dd/mm – dd/mm | **Telas do Profissional — parte 1** | Dashboard · Lista de alunos · Cadastrar aluno · Perfil do aluno |
| 4 | dd/mm – dd/mm | **Telas do Profissional — parte 2** | Editar treino · Editar dieta · Nova avaliação · Agenda · Mensagens |
| 5 | dd/mm – dd/mm | **Telas do Aluno** | Início · Meu Treino (unificada) · Minha Dieta · Histórico · Agenda · Mensagens |
| 6 | dd/mm – dd/mm | **Polimento e Deploy** | Responsividade · Acessibilidade · Documentação · Deploy GitHub Pages |

> Datas devem ser preenchidas pela equipe.

## ✅ Habilidades avaliadas (Etapa 3)

| Habilidade | Onde é atendida |
|---|---|
| **H1f** — Estruturar arquitetura da solução | `docs/arquitetura.md` |
| **H2a/b/c** — Controle de versão, comunicação, metodologia ágil | GitHub + issues + sprints |
| **H3a** — Projetar interface e fluxo de telas | Wireframes no Figma + User Flow |
| **H3b** — Implementar páginas estáticas | `pages/*.html` |
| **H3d** — Implementar estilos | `assets/css/` |
| **H3e** — Fluxo de telas e navegação | Links entre páginas + sidebar |
| **H3h** — Tipos de dados adequados | `assets/data/mock.json` |
| **H3i** — Elementos-chave do sistema | `docs/funcionalidades.md` |
| **H4a** — Validar formulários | `assets/js/validation.js` |

## 🎨 Design System

Toda a identidade visual (paleta, tipografia, componentes) está documentada em [`docs/template.md`](docs/template.md).

## 📄 Documentação relacionada

- [Template visual](docs/template.md)
- [Arquitetura da solução](docs/arquitetura.md)
- [Funcionalidades por tela](docs/funcionalidades.md)
- [Wireframes no Figma](https://www.figma.com/design/PFjpEWszxjKIBndIfxI1Cl/MY_PERSONAL)

## 📌 Convenções

- **Nomes de arquivos**: kebab-case (`cadastrar-aluno.html`)
- **Classes CSS**: kebab-case (`btn-primary`, `card-header`)
- **Variáveis CSS**: prefixo descritivo (`--green-primary`, `--text-dark`)
- **Commits**: mensagens em português, formato `[tipo]: descrição` — ex: `feat: tela de login`, `fix: ajuste no botão`, `docs: atualiza README`

## 📜 Licença

Projeto acadêmico — PUC Minas — 2026/1.
=======
# myPersonal
>>>>>>> origin/main
