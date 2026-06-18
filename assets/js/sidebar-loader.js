/* ============================================================
   sidebar-loader.js
   Injeta a sidebar conforme o perfil do usuário.
   Funciona detectando ?perfil= na URL ou data-profile no <body>.
   ============================================================ */


/* ============================================================
   Dados iniciais de demonstracao
   Salva os mocks principais no localStorage na primeira execucao.
   Mantem o projeto simples, sem back-end e sem frameworks.
   ============================================================ */
const DEMO_SEED_VERSION = "2026-06-localstorage-v1";

function seedMyPersonalDemoData() {
  try {
    const marker = localStorage.getItem("mypersonal:demoSeedVersion");

    const lerJson = (chave, fallback) => {
      try {
        const valor = localStorage.getItem(chave);
        return valor ? JSON.parse(valor) : fallback;
      } catch (erro) {
        return fallback;
      }
    };

    const salvarJson = (chave, valor) => {
      localStorage.setItem(chave, JSON.stringify(valor));
    };

    const pad2 = (n) => String(n).padStart(2, "0");
    const isoHojeMais = (dias) => {
      const data = new Date();
      data.setHours(0, 0, 0, 0);
      data.setDate(data.getDate() + dias);
      return `${data.getFullYear()}-${pad2(data.getMonth() + 1)}-${pad2(data.getDate())}`;
    };

    const usuarioLogadoSeed = lerJson("mypersonal:usuarioLogado", null);
    const usuarioLogadoProfissional = usuarioLogadoSeed && (
      usuarioLogadoSeed.tipo === "profissional" ||
      (usuarioLogadoSeed.perfil && usuarioLogadoSeed.perfil !== "aluno")
    );
    const usuarioLogadoAluno = usuarioLogadoSeed && (usuarioLogadoSeed.tipo === "aluno" || usuarioLogadoSeed.perfil === "aluno");
    const profissionalId = usuarioLogadoProfissional && usuarioLogadoSeed.id
      ? usuarioLogadoSeed.id
      : "profissional-demo";
    const alunoPrincipalId = usuarioLogadoAluno && usuarioLogadoSeed.id
      ? usuarioLogadoSeed.id
      : "aluno-eliabe-monteiro";
    const alunoPrincipalNome = usuarioLogadoAluno
      ? (usuarioLogadoSeed.nome || "Aluno Demo")
      : "Eliabe Monteiro";
    const alunoPrincipalEmail = usuarioLogadoAluno
      ? (usuarioLogadoSeed.email || "aluno@demo.com")
      : "eliabe@email.com";

    const alunosDemo = [
      {
        id: "aluno-eliabe-monteiro",
        alunoId: "aluno-eliabe-monteiro",
        nome: "Eliabe Monteiro",
        email: "eliabe@email.com",
        senha: "123456",
        telefone: "(11) 99999-0001",
        tel: "(11) 99999-0001",
        nascimento: "1995-03-15",
        nasc: "1995-03-15",
        sexo: "Masc",
        cidade: "Sao Paulo",
        peso: "82",
        altura: "178",
        gordura: "18",
        objetivo: "Hipertrofia",
        status: "ativo",
      },
      {
        id: "aluno-lucas-rodrigues",
        alunoId: "aluno-lucas-rodrigues",
        nome: "Lucas Rodrigues",
        email: "lucas@email.com",
        senha: "123456",
        telefone: "(11) 99999-0002",
        tel: "(11) 99999-0002",
        nascimento: "1998-07-22",
        nasc: "1998-07-22",
        sexo: "Masc",
        cidade: "Campinas",
        peso: "75",
        altura: "175",
        gordura: "15",
        objetivo: "Emagrecimento",
        status: "ativo",
      },
      {
        id: "aluno-ana-paula",
        alunoId: "aluno-ana-paula",
        nome: "Ana Paula",
        email: "ana@email.com",
        senha: "123456",
        telefone: "(11) 99999-0003",
        tel: "(11) 99999-0003",
        nascimento: "1992-11-10",
        nasc: "1992-11-10",
        sexo: "Fem",
        cidade: "Rio de Janeiro",
        peso: "60",
        altura: "162",
        gordura: "22",
        objetivo: "Condicionamento",
        status: "inativo",
      },
      {
        id: "aluno-fernanda-santos",
        alunoId: "aluno-fernanda-santos",
        nome: "Fernanda Santos",
        email: "fernanda@email.com",
        senha: "123456",
        telefone: "(11) 99999-0004",
        tel: "(11) 99999-0004",
        nascimento: "1996-06-05",
        nasc: "1996-06-05",
        sexo: "Fem",
        cidade: "Belo Horizonte",
        peso: "58",
        altura: "165",
        gordura: "20",
        objetivo: "Hipertrofia",
        status: "ativo",
      },
      {
        id: "aluno-carlos-melo",
        alunoId: "aluno-carlos-melo",
        nome: "Carlos Melo",
        email: "carlos@email.com",
        senha: "123456",
        telefone: "(11) 99999-0005",
        tel: "(11) 99999-0005",
        nascimento: "2000-01-30",
        nasc: "2000-01-30",
        sexo: "Masc",
        cidade: "Curitiba",
        peso: "70",
        altura: "172",
        gordura: "21",
        objetivo: "Saude geral",
        status: "novo",
      },
    ].map((aluno) => ({
      ...aluno,
      tipo: "aluno",
      perfil: "aluno",
      profissionalId,
    }));

    const usuarios = lerJson("mypersonal:usuarios", {});
    if (!usuarios[profissionalId]) {
      usuarios[profissionalId] = {
        id: profissionalId,
        nome: usuarioLogadoProfissional ? (usuarioLogadoSeed.nome || "Pierre Silva") : "Pierre Silva",
        email: usuarioLogadoProfissional ? (usuarioLogadoSeed.email || "pierre@email.com") : "pierre@email.com",
        senha: usuarios[profissionalId]?.senha || "123456",
        tipo: "profissional",
        perfil: usuarioLogadoProfissional ? (usuarioLogadoSeed.perfil || "personal-trainer") : "personal-trainer",
        telefone: usuarioLogadoSeed?.telefone || "(31) 99999-9999",
        tel: usuarioLogadoSeed?.tel || usuarioLogadoSeed?.telefone || "(31) 99999-9999",
        cidade: usuarioLogadoSeed?.cidade || "Belo Horizonte",
        status: "ativo",
      };
    }

    alunosDemo.forEach((aluno) => {
      if (!usuarios[aluno.id]) {
        usuarios[aluno.id] = aluno;
      } else if (!usuarios[aluno.id].profissionalId || usuarios[aluno.id].profissionalId === "profissional-demo") {
        usuarios[aluno.id] = { ...usuarios[aluno.id], profissionalId };
      }
    });

    if (usuarioLogadoAluno && alunoPrincipalId) {
      usuarios[alunoPrincipalId] = {
        ...usuarios[alunoPrincipalId],
        ...usuarioLogadoSeed,
        id: alunoPrincipalId,
        alunoId: alunoPrincipalId,
        nome: alunoPrincipalNome,
        email: alunoPrincipalEmail,
        senha: usuarios[alunoPrincipalId]?.senha || "123456",
        tipo: "aluno",
        perfil: "aluno",
        status: usuarios[alunoPrincipalId]?.status || "ativo",
        profissionalId: usuarios[alunoPrincipalId]?.profissionalId || profissionalId,
      };
    }

    salvarJson("mypersonal:usuarios", usuarios);

    if (!localStorage.getItem("mypersonal:profissionalAtualId") || localStorage.getItem("mypersonal:profissionalAtualId") === "profissional-demo") {
      localStorage.setItem("mypersonal:profissionalAtualId", profissionalId);
    }

    if (!localStorage.getItem("mypersonal:alunoSelecionadoId")) {
      localStorage.setItem("mypersonal:alunoSelecionadoId", alunoPrincipalId);
    }

    if (!localStorage.getItem("mypersonal:configuracoesAluno")) {
      salvarJson("mypersonal:configuracoesAluno", {
        id: "aluno-eliabe-monteiro",
        nome: "Eliabe",
        sobrenome: "Monteiro",
        email: "eliabe@email.com",
        telefone: "(31) 98888-8888",
        cidade: "Belo Horizonte",
        preferencias: { email: true, agenda: true, mensagens: false },
      });
    }

    if (!localStorage.getItem("mypersonal:configuracoesProfissional")) {
      salvarJson("mypersonal:configuracoesProfissional", {
        id: profissionalId,
        nome: "Pierre",
        sobrenome: "Silva",
        email: "pierre@email.com",
        telefone: "(31) 99999-9999",
        cidade: "Belo Horizonte",
        preferencias: { email: true, agenda: true, mensagens: false },
      });
    }

    const compromissosDemo = [
      {
        id: "seed-compromisso-treino-eliabe-hoje",
        tipo: "treino",
        alunoId: alunoPrincipalId,
        alunoNome: alunoPrincipalNome,
        profissionalId,
        data: isoHojeMais(0),
        horaInicio: "09:00",
        horaFim: "10:00",
        local: "Academia principal",
        recorrencia: "nao",
        lembrete: "30min",
        descricao: "Treino A - peito e triceps",
        status: "Agendado",
      },
      {
        id: "seed-compromisso-consulta-lucas-hoje",
        tipo: "consulta",
        alunoId: "aluno-lucas-rodrigues",
        alunoNome: "Lucas Rodrigues",
        profissionalId,
        data: isoHojeMais(0),
        horaInicio: "14:00",
        horaFim: "15:00",
        local: "Sala de avaliacao",
        recorrencia: "nao",
        lembrete: "1h",
        descricao: "Consulta de acompanhamento",
        status: "Agendada",
      },
      {
        id: "seed-compromisso-avaliacao-eliabe-proximo",
        tipo: "avaliacao",
        alunoId: alunoPrincipalId,
        alunoNome: alunoPrincipalNome,
        profissionalId,
        data: isoHojeMais(3),
        horaInicio: "10:30",
        horaFim: "11:30",
        local: "Sala de avaliacao",
        recorrencia: "nao",
        lembrete: "1dia",
        descricao: "Avaliacao corporal",
        status: "Agendado",
      },
      {
        id: "seed-compromisso-troca-treino-fernanda",
        tipo: "troca-treino",
        alunoId: "aluno-fernanda-santos",
        alunoNome: "Fernanda Santos",
        profissionalId,
        data: isoHojeMais(5),
        horaInicio: "11:00",
        horaFim: "11:30",
        local: "Online",
        recorrencia: "nao",
        lembrete: "nenhum",
        descricao: "Troca de treino",
        status: "Agendado",
      },
      {
        id: "seed-compromisso-consulta-carlos",
        tipo: "consulta",
        alunoId: "aluno-carlos-melo",
        alunoNome: "Carlos Melo",
        profissionalId,
        data: isoHojeMais(8),
        horaInicio: "08:00",
        horaFim: "09:00",
        local: "Sala de consulta",
        recorrencia: "nao",
        lembrete: "30min",
        descricao: "Primeira consulta",
        status: "Agendada",
      },
    ];

    const compromissos = lerJson("mypersonal:compromissos", []);
    const idsCompromissos = new Set((Array.isArray(compromissos) ? compromissos : []).map((c) => c.id));
    const compromissosAtualizados = Array.isArray(compromissos) ? [...compromissos] : [];
    compromissosDemo.forEach((compromisso) => {
      if (!idsCompromissos.has(compromisso.id)) compromissosAtualizados.push(compromisso);
    });
    salvarJson("mypersonal:compromissos", compromissosAtualizados);

    if (!localStorage.getItem("mypersonal_treinos_alunos")) {
      salvarJson("mypersonal_treinos_alunos", {
        [alunoPrincipalId]: {
          alunoId: alunoPrincipalId,
          alunoNome: alunoPrincipalNome,
          atualizadoEm: new Date().toISOString(),
          observacoesProfissional: "Priorizar execucao controlada e registrar as cargas.",
          grupos: [
            {
              id: "treino-a",
              aba: "Treino A",
              nome: "Treino A - Peito e Triceps",
              musculatura: "Peitoral, Triceps, Ombros",
              observacoesGerais: "Aquecimento de 5 a 10 minutos antes do treino.",
              exercicios: [
                { nome: "Supino reto com barra", series: "4", reps: "12", descanso: "60s", observacao: "Manter escapulas retraidas", video: "https://www.youtube.com/watch?v=sqOw2Y6Ju9A" },
                { nome: "Crucifixo inclinado", series: "3", reps: "12", descanso: "60s", observacao: "Movimento controlado", video: "" },
                { nome: "Triceps corda", series: "3", reps: "15", descanso: "45s", observacao: "Contrair no final", video: "" },
              ],
            },
            {
              id: "treino-b",
              aba: "Treino B",
              nome: "Treino B - Costas e Biceps",
              musculatura: "Costas, Biceps",
              observacoesGerais: "Evitar impulso nas puxadas.",
              exercicios: [
                { nome: "Puxada alta", series: "4", reps: "10", descanso: "60s", observacao: "Descer ate a linha do peito", video: "" },
                { nome: "Remada baixa", series: "3", reps: "12", descanso: "60s", observacao: "Manter coluna neutra", video: "" },
              ],
            },
            {
              id: "treino-c",
              aba: "Treino C",
              nome: "Treino C - Pernas",
              musculatura: "Quadriceps, Posterior, Gluteos",
              observacoesGerais: "Caprichar na amplitude sem perder postura.",
              exercicios: [
                { nome: "Agachamento livre", series: "4", reps: "10", descanso: "90s", observacao: "Controlar a descida", video: "" },
                { nome: "Cadeira extensora", series: "3", reps: "15", descanso: "60s", observacao: "Segurar 1 segundo no topo", video: "" },
              ],
            },
          ],
        },
      });
    }

    if (!localStorage.getItem("mypersonal:dietas")) {
      const agora = new Date().toISOString();
      const refeicoesBase = [
        {
          id: "ref-cafe",
          nome: "Cafe da manha",
          horario: "07:00",
          alimentos: [
            { id: "alimento-leite", nome: "Leite", quantidade: "150 ml", calorias: 90, proteina: 5, carboidrato: 7, gordura: 4 },
            { id: "alimento-whey", nome: "Whey", quantidade: "30 g", calorias: 120, proteina: 24, carboidrato: 3, gordura: 2 },
          ],
        },
        {
          id: "ref-almoco",
          nome: "Almoco",
          horario: "12:00",
          alimentos: [
            { id: "alimento-arroz", nome: "Arroz", quantidade: "200 g", calorias: 260, proteina: 5, carboidrato: 56, gordura: 1 },
            { id: "alimento-feijao", nome: "Feijao", quantidade: "100 g", calorias: 90, proteina: 6, carboidrato: 16, gordura: 1 },
            { id: "alimento-frango", nome: "Frango", quantidade: "100 g", calorias: 165, proteina: 31, carboidrato: 0, gordura: 4 },
          ],
        },
      ];
      salvarJson("mypersonal:dietas", {
        "dieta-demo-eliabe": {
          id: "dieta-demo-eliabe",
          alunoId: alunoPrincipalId,
          profissionalId,
          atual: true,
          criadaEm: agora,
          atualizadaEm: agora,
          observacoesProfissional: "Manter boa hidratacao e seguir os horarios sempre que possivel.",
          dias: ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"].reduce((dias, dia) => {
            dias[dia] = { refeicoes: refeicoesBase };
            return dias;
          }, {}),
        },
      });
    }

    if (!localStorage.getItem("mypersonal:avaliacoes")) {
      salvarJson("mypersonal:avaliacoes", [
        { id: "avaliacao-2026-01-10", alunoId: alunoPrincipalId, alunoNome: alunoPrincipalNome, profissionalId, data: "2026-01-10", tipo: "Avaliacao corporal", peso: 85, altura: 178, gordura: 21, massaMagra: 65, cintura: 91, quadril: 101, bracoDireito: 34, bracoEsquerdo: 34, coxaDireita: 57, coxaEsquerda: 57, observacoes: "Inicio do acompanhamento" },
        { id: "avaliacao-2026-02-10", alunoId: alunoPrincipalId, alunoNome: alunoPrincipalNome, profissionalId, data: "2026-02-10", tipo: "Reavaliacao", peso: 83, altura: 178, gordura: 20, massaMagra: 66, cintura: 89, quadril: 100, bracoDireito: 35, bracoEsquerdo: 35, coxaDireita: 58, coxaEsquerda: 58, observacoes: "Boa aderencia" },
        { id: "avaliacao-2026-03-15", alunoId: alunoPrincipalId, alunoNome: alunoPrincipalNome, profissionalId, data: "2026-03-15", tipo: "Avaliacao corporal", peso: 82, altura: 178, gordura: 18, massaMagra: 67, cintura: 87, quadril: 99, bracoDireito: 36, bracoEsquerdo: 36, coxaDireita: 59, coxaEsquerda: 59, observacoes: "Meta parcial atingida" },
      ]);
    }

    if (!localStorage.getItem("mypersonal:conversas")) {
      salvarJson("mypersonal:conversas", {
        "aluno-ana-paula": {
          nome: "Ana Paula",
          mensagens: [
            { autor: "Ana Paula", texto: "Otimo! Vi que adicionou mais frutas.", tipo: "received" },
            { autor: "Profissional", texto: "Perfeito. Vamos manter assim esta semana.", tipo: "sent" },
          ],
        },
        "aluno-eliabe-monteiro": {
          nome: "Eliabe Monteiro",
          mensagens: [
            { autor: "Eliabe Monteiro", texto: "Bom dia! Terminei o treino de ontem.", tipo: "received" },
            { autor: "Profissional", texto: "Boa! Como foi a carga no agachamento?", tipo: "sent" },
          ],
        },
      });
    }

    if (!localStorage.getItem("mypersonal:conversasAluno")) {
      salvarJson("mypersonal:conversasAluno", {
        "profissional-demo": {
          nome: "Pierre Oliveira",
          mensagens: [
            { autor: "Pierre Oliveira", texto: "Atualizei seu treino para esta semana.", tipo: "received" },
            { autor: "Voce", texto: "Obrigado! Vou seguir hoje.", tipo: "sent" },
            { autor: "Pierre Oliveira", texto: "Qualquer desconforto me avisa por aqui.", tipo: "received" },
          ],
        },
      });
    }

    if (!marker) {
      localStorage.setItem("mypersonal:demoSeedVersion", DEMO_SEED_VERSION);
    }
  } catch (erro) {
    // Se o localStorage estiver indisponivel, o projeto continua funcionando com os fallbacks das telas.
  }
}

seedMyPersonalDemoData();

const PROFILE_MENUS = {
  "personal-trainer": {
    label: "Personal Trainer",
    initial: "P",
    items: [
      { label: "Dashboard",    href: "dashboard.html",      key: "dashboard" },
      { label: "Meus Alunos",  href: "meus-alunos.html",     key: "meus-alunos" },
      { label: "Agenda",       href: "agenda.html",          key: "agenda" },
      { label: "Mensagens",    href: "mensagens.html",       key: "mensagens" },
    ],
  },
  "nutricionista": {
    label: "Nutricionista",
    initial: "N",
    items: [
      { label: "Dashboard",    href: "dashboard.html",      key: "dashboard" },
      { label: "Meus Alunos",  href: "meus-alunos.html",    key: "meus-alunos" },
      { label: "Agenda",       href: "agenda.html",          key: "agenda" },
      { label: "Mensagens",    href: "mensagens.html",       key: "mensagens" },
    ],
  },
  "personal-nutricionista": {
    label: "Personal Nutricionista",
    initial: "PN",
    items: [
      { label: "Dashboard",    href: "dashboard.html",      key: "dashboard" },
      { label: "Meus Alunos",  href: "meus-alunos.html",    key: "meus-alunos" },
      { label: "Agenda",       href: "agenda.html",          key: "agenda" },
      { label: "Mensagens",    href: "mensagens.html",       key: "mensagens" },
    ],
  },
  "aluno": {
    label: "Aluno",
    initial: "A",
    items: [
      { label: "Início",       href: "../aluno/home.html",            key: "home" },
      { label: "Meu Treino",   href: "../aluno/meu-treino.html",      key: "meu-treino" },
      { label: "Minha Dieta",  href: "../aluno/minha-dieta.html",     key: "minha-dieta" },
      { label: "Estatísticas", href: "../aluno/estatisticaaluno.html", key: "estatisticas" },
      { label: "Agenda",       href: "../aluno/agenda.html",          key: "agenda" },
      { label: "Mensagens",    href: "../aluno/mensagens.html",       key: "mensagens" },
    ],
  },
};

/**
 * Detecta o perfil ativo. Ordem:
 *   1. ?perfil= na URL
 *   2. data-profile no <body>
 *   3. localStorage 'mypersonal:perfil', respeitando a pasta atual
 *   4. fallback pela pasta atual
 */
function detectProfile() {
  const body = document.body;
  const url = new URLSearchParams(window.location.search);
  const path = window.location.pathname;
  const isAlunoPage = path.includes("/aluno/");
  const isProfissionalPage = path.includes("/profissional/");

  if (url.get("perfil")) {
    localStorage.setItem("mypersonal:perfil", url.get("perfil"));
    return url.get("perfil");
  }

  if (body.dataset.profile) return body.dataset.profile;

  const stored = localStorage.getItem("mypersonal:perfil");
  if (stored) {
    if (isAlunoPage) return "aluno";
    if (isProfissionalPage && stored === "aluno") return "personal-trainer";
    return stored;
  }

  if (isAlunoPage) return "aluno";
  return "personal-trainer";
}

/**
 * Detecta a página ativa pelo nome do arquivo
 */
function detectActivePage() {
  if (document.body.dataset.activePage) {
    return document.body.dataset.activePage === "alunos" ? "meus-alunos" : document.body.dataset.activePage;
  }

  const path = window.location.pathname;
  const file = path.split("/").pop().replace(".html", "");
  if (file === "estatisticaaluno") return "estatisticas";
  return file || "dashboard";
}

function getSettingsHref() {
  if (detectProfile() === "aluno") return "../aluno/configuracoes.html";
  return "configuracoes.html";
}

function getLoggedUserName() {
  try {
    const usuarioLogado = JSON.parse(localStorage.getItem("mypersonal:usuarioLogado"));
    return usuarioLogado?.nome || "Usuário";
  } catch (err) {
    return "Usuário";
  }
}

function realizarLogout(event) {
  event.preventDefault();

  // Mantém os usuários cadastrados, mas encerra a sessão atual.
  localStorage.removeItem("mypersonal:usuarioLogado");
  localStorage.removeItem("mypersonal:perfil");

  window.location.href = "../../index.html";
}

/**
 * Renderiza a sidebar no elemento #sidebar-mount
 */
function renderSidebar() {
  const mount = document.getElementById("sidebar-mount");
  if (!mount) return;

  const profile = detectProfile();
  const active  = detectActivePage();
  const menu    = PROFILE_MENUS[profile] || PROFILE_MENUS["personal-trainer"];
  const settingsHref = getSettingsHref();
  const userName = getLoggedUserName();

  const itemsHTML = menu.items.map((item) => {
    const isActive = item.key === active;
    return `
      <a href="${item.href}" class="menu-item ${isActive ? "active" : ""}" data-page="${item.key}">
        <span>${item.label}</span>
      </a>
    `;
  }).join("");

  mount.innerHTML = `
    <button class="sidebar-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="app-sidebar">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div class="sidebar-backdrop" data-sidebar-close></div>
    <aside class="sidebar" id="app-sidebar">
      <div class="sidebar-header">
        <div class="brand">
          <div class="logo">MP</div>
          <span>MyPersonal</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        ${itemsHTML}
      </nav>

      <div class="user-profile-sidebar profile-menu" data-profile-menu>
        <button class="profile-menu-trigger profile-menu-trigger-sidebar" type="button" aria-label="Abrir menu do perfil" aria-haspopup="true" aria-expanded="false">
          <span class="side-avatar">${menu.initial}</span>
          <span class="side-info">
            <span class="side-name">${userName}</span>
            <span class="side-role">${menu.label}</span>
          </span>
        </button>

        <div class="profile-dropdown" role="menu">
          <a href="${settingsHref}" class="profile-dropdown-item" role="menuitem">Configurações</a>
          <a href="../../index.html" class="profile-dropdown-item profile-dropdown-logout" role="menuitem" data-logout>Sair</a>
        </div>
      </div>
    </aside>
  `;
}

/**
 * Renderiza a topbar
 * Usa data-page-title no <body> ou um título padrão
 */
function renderTopbar() {
  const mount = document.getElementById("topbar-mount");
  if (!mount) return;

  const title = document.body.dataset.pageTitle || "MyPersonal";
  const back  = document.body.dataset.back;
  const initial = (PROFILE_MENUS[detectProfile()] || {}).initial || "U";
  const settingsHref = getSettingsHref();

  mount.innerHTML = `
    <header class="topbar">
      <div>
        ${back ? `<a href="${back.split("|")[0]}" class="back-link">← ${back.split("|")[1] || "Voltar"}</a>` : ""}
        <h1 class="topbar-title">${title}</h1>
      </div>
      <div class="topbar-actions">
        <div class="profile-menu profile-menu-topbar" data-profile-menu>
          <button class="profile-menu-trigger" type="button" aria-label="Abrir menu do perfil" aria-haspopup="true" aria-expanded="false">
            <span class="avatar avatar-sm">${initial}</span>
          </button>

          <div class="profile-dropdown" role="menu">
            <a href="${settingsHref}" class="profile-dropdown-item" role="menuitem">Configurações</a>
            <a href="../../index.html" class="profile-dropdown-item profile-dropdown-logout" role="menuitem" data-logout>Sair</a>
          </div>
        </div>
      </div>
    </header>
  `;
}

function setupProfileMenus() {
  const profileMenus = document.querySelectorAll("[data-profile-menu]");
  if (!profileMenus.length) return;
  const mobileQuery = window.matchMedia("(max-width: 768px)");

  function closeProfileMenus(exceptMenu = null) {
    profileMenus.forEach((menu) => {
      if (menu === exceptMenu) return;

      menu.classList.remove("is-open");
      const trigger = menu.querySelector(".profile-menu-trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  }

  function updateProfileMenuAvailability() {
    const isMobile = mobileQuery.matches;

    profileMenus.forEach((menu) => {
      const trigger = menu.querySelector(".profile-menu-trigger");
      if (!trigger || !menu.classList.contains("user-profile-sidebar")) return;

      trigger.disabled = !isMobile;

      if (!isMobile) {
        menu.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  profileMenus.forEach((menu) => {
    const trigger = menu.querySelector(".profile-menu-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", (event) => {
      if (trigger.disabled) return;

      event.stopPropagation();
      const isOpen = menu.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));
      closeProfileMenus(menu);
    });
  });

  document.addEventListener("click", () => closeProfileMenus());

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeProfileMenus();
  });

  updateProfileMenuAvailability();
  mobileQuery.addEventListener("change", updateProfileMenuAvailability);
}

function setupLogout() {
  document.querySelectorAll("[data-logout]").forEach((link) => {
    link.addEventListener("click", realizarLogout);
  });
}

function setupSidebarToggle() {
  const toggle = document.querySelector(".sidebar-toggle");
  const backdrop = document.querySelector(".sidebar-backdrop");
  const sidebarLinks = document.querySelectorAll(".sidebar .menu-item");
  if (!toggle) return;

  function setSidebarOpen(isOpen) {
    document.body.classList.toggle("sidebar-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  }

  toggle.addEventListener("click", () => {
    setSidebarOpen(!document.body.classList.contains("sidebar-open"));
  });

  if (backdrop) {
    backdrop.addEventListener("click", () => setSidebarOpen(false));
  }

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => setSidebarOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setSidebarOpen(false);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderSidebar();
  renderTopbar();
  setupProfileMenus();
  setupLogout();
  setupSidebarToggle();
});
