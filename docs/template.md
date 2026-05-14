# Template padrão do site

O template padrão do MyPersonal define um layout visual comum para todas as páginas do sistema. A proposta prioriza organização, legibilidade e padronização dos principais elementos da interface, como menus, botões, cards, tabelas e campos de formulário.

A linguagem visual do projeto combina tons neutros com verde como cor de destaque, mantendo responsividade e uso de ícones simples para facilitar a navegação.

## Design

O design do MyPersonal é dividido em dois grandes contextos visuais que mantêm a mesma identidade, mas atendem a necessidades diferentes:

### 1. Contexto de Acesso (Público)
Focado em recepção e segurança. Utiliza um layout de painéis fixos para destacar a marca e centralizar as ações de login e cadastro.

Página Principal: index.html

![Print da tela de Login](img/index.png)

### 2. Contexto de Gestão (Área Logada)
Para as áreas internas, adotamos um layout de **Dashboard** com navegação lateral fixa (*sidebar*). Esse padrão garante consistência visual e previsibilidade de navegação entre os diferentes perfis de usuário, permitindo que as ferramentas de gestão ocupem a área central da tela.

* **Dashboard do Profissional:** Prioriza o monitoramento rápido através de cards de métricas e tabelas de status para compromissos e alunos recentes.
![Dashboard Profissional](img/inicio-personal.png)

* **Dashboard do Aluno:** Adapta a estrutura para focar no consumo de informações diárias, como treinos e dietas, utilizando botões de ação proeminentes para registro de atividades.
![Dashboard Aluno](img/inicial-aluno.png)

* **Gestão de Cronogramas:** Interfaces específicas, como a Agenda, utilizam uma estrutura de grade (*grid*) para organizar dados temporais de forma legível, mantendo o padrão cromático para identificar diferentes tipos de eventos.
![Agenda MyPersonal](img/agenda.png)


## Cores

A paleta de cores do projeto foi padronizada com foco em sobriedade, legibilidade e associação com o universo fitness e da saúde. O sistema utiliza três tons principais de verde para ações, estados de destaque e áreas de apoio visual, enquanto os tons neutros ajudam a manter a interface limpa e profissional.

| Cor | Código | Uso principal |
| --- | --- | --- |
| Verde principal | `#10B981` | Botões principais, links, estados ativos e elementos de destaque |
| Verde escuro | `#047857` | Hover, contraste de destaque e textos em estado ativo |
| Verde claro | `#D1FAE5` | Fundo de itens ativos, badges e áreas de feedback positivo |
| Branco | `#FFFFFF` | Fundo de cards, painéis e páginas |
| Cinza muito claro | `#F9FAFB` | Fundo de áreas internas e tabelas |
| Cinza de borda | `#E5E7EB` / `#E2E8F0` | Bordas de inputs, cards e divisões visuais |
| Texto escuro | `#111827` / `#1A1A1A` | Títulos e conteúdos principais |
| Texto secundário | `#6B7280` / `#718096` / `#666666` | Subtítulos, descrições, rótulos e informações auxiliares |
| Amarelo de alerta | `#FEF3C7` | Destaque de status pendente |
| Laranja de alerta | `#D97706` | Texto de status pendente |
| Vermelho suave | `#FFCCCC` | Hover de ações de saída ou estado de atenção |
| Vermelho escuro | `#A30000` | Texto de ação crítica ou alerta |

De forma geral, o sistema trabalha com contraste moderado, fundo claro e destaque visual concentrado nos estados de ação, confirmação e navegação ativa, evitando variações excessivas da cor principal.

Para garantir a harmonia visual e o contraste entre os elementos, a paleta foi validada utilizando a ferramenta Adobe Color, conforme demonstrado abaixo:
![Paleta de Cores MyPersonal - Adobe Color](img/AdobeColor-MyPersonal-Theme.jpeg)

## Tipografia

A tipografia do projeto foi padronizada com a fonte **Segoe UI**, acompanhada de fontes de fallback do tipo sans-serif, como `Roboto`, `Helvetica`, `Arial` e `sans-serif`. Essa escolha reforça legibilidade, neutralidade visual e estabilidade de renderização, especialmente em dashboards, formulários, tabelas e áreas de uso recorrente.

As principais funções tipográficas do sistema são:

| Função | Característica |
| --- | --- |
| Título de página | Tamanho maior, peso entre `600` e `700`, usado em cabeçalhos principais |
| Título de seção | Peso `700`, uso recorrente para separar blocos de conteúdo e destacar agrupamentos visuais |
| Rótulos de componentes | Tamanho reduzido e cor secundária, aplicado em inputs, campos e indicadores |
| Corpo de texto | Peso regular ou médio, priorizando leitura simples e objetiva |
| Botões e ações | Peso `600`, reforçando clareza e hierarquia de interação |

O uso de uma única família tipográfica contribui para maior consistência visual entre as telas públicas e autenticadas, além de simplificar a manutenção do padrão visual do sistema.

## Iconografia

A iconografia do projeto segue uma linha simples, funcional e de fácil reconhecimento. Os ícones utilizados priorizam leitura imediata e apoio à navegação, sem excesso de detalhes visuais. A linguagem adotada combina ícones lineares, símbolos objetivos e elementos gráficos leves.

Os principais padrões de iconografia observados no sistema são:

| Ícone / recurso | Função |
| --- | --- |
| Monograma `MP` | Representação simplificada da marca nas telas públicas |
| Ícones de check em SVG | Destacar benefícios e funcionalidades principais na tela inicial |
| Ícones do Icons8 | Diferenciar os perfis de **Profissional** e **Aluno** na seleção de perfil |
| Setas `<` e `>` | Navegação entre períodos na agenda e no calendário |
| Símbolo `✓` | Confirmar ações concluídas, como cadastro ou salvamento |
| Símbolo `▶` | Indicar acesso a vídeo de apoio em treinos |
| Avatar circular | Representação visual de usuário, aluno ou contato |

Visualmente, os ícones seguem o mesmo padrão da identidade do sistema: uso de verde para ações positivas ou principais, cinza para elementos neutros e formas arredondadas para manter coerência com cards, botões e campos de entrada.

## Estilos CSS

Os estilos CSS do projeto foram organizados de modo a padronizar a aparência dos principais elementos da interface. Entre os padrões já definidos, destacam-se:

| Elemento | Classe / padrão | Função visual |
| --- | --- | --- |
| Identidade visual | `.logo`, `.brand` | Exibir a marca do sistema de forma simples e reconhecível |
| Botão principal | `.btn-primary`, `.btn-continue` | Destacar ações principais do fluxo |
| Botão secundário | `.btn-secondary`, `.btn-outline` | Ações de apoio, com menor prioridade visual |
| Botão de navegação | `.btn-icon` | Ações rápidas, como troca de mês na agenda |
| Botão de saída | `.btn-logout` | Encerrar sessão com diferenciação visual no hover |
| Menu lateral | `.sidebar`, `.menu-item`, `.menu-item.active` | Estruturar navegação principal das áreas internas |
| Cards | `.card` | Agrupar conteúdo em blocos visuais reutilizáveis |
| Tabelas | `.custom-table` | Organizar dados de forma objetiva e legível |
| Badges de status | `.badge-status` | Sinalizar situação de compromissos e registros |
| Campos de formulário | `.input-group`, `.search-input`, `.form-control` | Padronizar entradas de texto e pesquisa |
| Perfil lateral | `.user-profile-sidebar`, `.side-avatar`, `.side-name` | Identificação visual do usuário logado |
| Compromissos | `.appointment` | Exibir eventos e lembretes com ênfase lateral |
| Áreas reservadas | `.dashed-box` | Marcar espaços futuros para gráficos, listas e componentes visuais |

Além disso, o uso de variáveis CSS, como `--green-primary`, `--green-dark`, `--green-light`, `--text-dark` e `--border-color`, facilita a manutenção da identidade visual e a reutilização de estilos em diferentes páginas do sistema. Outras seções podem ser adicionadas futuramente para detalhar padrões de componentes, navegação e responsividade.

