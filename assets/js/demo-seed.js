/* ============================================================
   demo-seed.js — Conta de demonstração: Carlos Mendes (aluno)
   Acesso aluno:        carlos@demo.com  / demo123
   Acesso profissional: pierre@demo.com  / demo123
   ============================================================ */

const DEMO_ALUNO_ID = "aluno-carlos-mendes";
const DEMO_PROF_ID  = "profissional-pierre";

function carregarDadosDemo() {
  /* ---------- 1. Usuários ---------- */
  const usuarios = {};
  try { Object.assign(usuarios, JSON.parse(localStorage.getItem("mypersonal:usuarios") || "{}")); } catch (_) {}

  usuarios[DEMO_PROF_ID] = {
    id: DEMO_PROF_ID,
    nome: "Pierre Silva",
    email: "pierre@demo.com",
    senha: "demo123",
    tipo: "profissional",
    perfil: "personal-trainer",
    telefone: "(31) 99999-9999",
    cidade: "Belo Horizonte",
  };

  usuarios[DEMO_ALUNO_ID] = {
    id: DEMO_ALUNO_ID,
    alunoId: DEMO_ALUNO_ID,
    nome: "Carlos Mendes",
    email: "carlos@demo.com",
    senha: "demo123",
    tipo: "aluno",
    perfil: "aluno",
    telefone: "(11) 98765-4321",
    nascimento: "1998-03-15",
    nasc: "1998-03-15",
    sexo: "M",
    cidade: "São Paulo",
    peso: "82",
    altura: "178",
    gordura: "17",
    objetivo: "Hipertrofia",
    status: "ativo",
    profissionalId: DEMO_PROF_ID,
  };

  localStorage.setItem("mypersonal:usuarios", JSON.stringify(usuarios));

  /* ---------- 2. Treinos ---------- */
  const treinos = {};
  try { Object.assign(treinos, JSON.parse(localStorage.getItem("mypersonal_treinos_alunos") || "{}")); } catch (_) {}

  treinos[DEMO_ALUNO_ID] = {
    alunoId: DEMO_ALUNO_ID,
    alunoNome: "Carlos Mendes",
    atualizadoEm: "2026-06-01T10:00:00.000Z",
    observacoesProfissional: "Foco em hipertrofia. Priorizar execução técnica antes de aumentar carga. Registrar as cargas a cada sessão.",
    notificarAluno: false,
    grupos: [
      {
        id: "treino-a",
        aba: "Treino A",
        nome: "Treino A — Peito e Tríceps",
        musculatura: "Peitoral, Tríceps, Deltoide Anterior",
        observacoesGerais: "Aquecer no banco inclinado leve antes de começar. Foco no peitoral, não em hombro.",
        exercicios: [
          { nome: "Supino reto com barra",          series: "4", reps: "10", descanso: "90s", observacao: "Descer a barra até tocar o peito",              video: "https://www.youtube.com/watch?v=sqOw2Y6Ju9A" },
          { nome: "Supino inclinado com halteres",  series: "3", reps: "12", descanso: "60s", observacao: "Cotovelos a 45° do tronco" },
          { nome: "Crucifixo reto",                 series: "3", reps: "15", descanso: "60s", observacao: "Manter leve flexão no cotovelo durante todo o movimento" },
          { nome: "Crossover no cabo",              series: "3", reps: "15", descanso: "60s", observacao: "Cruzar as mãos no final para contrair o peitoral" },
          { nome: "Tríceps polia alta",             series: "4", reps: "12", descanso: "60s", observacao: "Cotovelos fixos ao lado do corpo" },
          { nome: "Tríceps testa com barra W",      series: "3", reps: "12", descanso: "60s", observacao: "Descer a barra até a testa, não atrás da cabeça" },
          { nome: "Desenvolvimento com halteres",   series: "3", reps: "12", descanso: "60s", observacao: "Não bloquear o cotovelo no topo" },
        ],
      },
      {
        id: "treino-b",
        aba: "Treino B",
        nome: "Treino B — Costas e Bíceps",
        musculatura: "Dorsal, Trapézio, Bíceps, Antebraço",
        observacoesGerais: "Manter postura neutra na coluna em todos os exercícios. Sentir a costas trabalhar, não apenas os braços.",
        exercicios: [
          { nome: "Puxada frente (pegada aberta)",  series: "4", reps: "10", descanso: "90s", observacao: "Puxar até o queixo, peito projetado para frente",  video: "https://www.youtube.com/watch?v=CAwf7n6Luuc" },
          { nome: "Remada curvada com barra",        series: "4", reps: "10", descanso: "90s", observacao: "Coluna levemente inclinada, empurrar cotovelo para trás" },
          { nome: "Serrote com halteres",            series: "3", reps: "12", descanso: "60s", observacao: "Apoiar joelho e mão no banco, amplitude total" },
          { nome: "Pulldown no cabo",                series: "3", reps: "15", descanso: "60s", observacao: "Focar no squeeze da costas ao finalizar o movimento" },
          { nome: "Rosca direta com barra",          series: "3", reps: "10", descanso: "60s", observacao: "Sem balançar o tronco — isolar o bíceps" },
          { nome: "Rosca martelo com halteres",      series: "3", reps: "12", descanso: "60s", observacao: "Contrair o braquiorradial no topo" },
          { nome: "Rosca concentrada",               series: "3", reps: "12", descanso: "60s", observacao: "Apoiar o cotovelo na face interna da coxa" },
        ],
      },
      {
        id: "treino-c",
        aba: "Treino C",
        nome: "Treino C — Pernas e Ombros",
        musculatura: "Quadríceps, Isquiotibiais, Glúteos, Panturrilha, Deltoide",
        observacoesGerais: "Aquecimento obrigatório de joelho antes dos agachamentos. Não pular o trabalho de panturrilha.",
        exercicios: [
          { nome: "Agachamento livre com barra",     series: "4", reps: "8",  descanso: "120s", observacao: "Descer até o paralelo. Joelhos na linha dos pés.",   video: "https://www.youtube.com/watch?v=ultWZbUMPL8" },
          { nome: "Leg press 45°",                   series: "4", reps: "12", descanso: "90s",  observacao: "Pés na largura dos ombros. Não travar joelho no topo" },
          { nome: "Cadeira extensora",               series: "3", reps: "15", descanso: "60s",  observacao: "Segurar 2 segundos no topo para isometria" },
          { nome: "Mesa flexora",                    series: "3", reps: "12", descanso: "60s",  observacao: "Descer a fase excêntrica em 3 segundos" },
          { nome: "Stiff com halteres",              series: "3", reps: "12", descanso: "60s",  observacao: "Coluna neutra, sentir o alongamento dos posteriores" },
          { nome: "Desenvolvimento militar",         series: "4", reps: "10", descanso: "90s",  observacao: "Empurrar acima da cabeça sem arquear a lombar" },
          { nome: "Elevação lateral com halteres",   series: "3", reps: "15", descanso: "60s",  observacao: "Cotovelos levemente flexionados, não usar impulso" },
          { nome: "Panturrilha no leg press",        series: "4", reps: "20", descanso: "45s",  observacao: "Amplitude total — calcâneo bem abaixo e ponta bem alta" },
        ],
      },
    ],
  };

  localStorage.setItem("mypersonal_treinos_alunos", JSON.stringify(treinos));

  /* ---------- 3. Dieta ---------- */
  const dietas = {};
  try { Object.assign(dietas, JSON.parse(localStorage.getItem("mypersonal:dietas") || "{}")); } catch (_) {}

  const DEMO_DIETA_ID = "dieta-demo-carlos-mendes";

  dietas[DEMO_DIETA_ID] = {
    id: DEMO_DIETA_ID,
    alunoId: DEMO_ALUNO_ID,
    profissionalId: DEMO_PROF_ID,
    atual: true,
    criadaEm: "2026-06-01T08:00:00.000Z",
    atualizadaEm: "2026-06-10T14:30:00.000Z",
    observacoesProfissional: "Dieta hipercalórica para hipertrofia (~3100 kcal/dia). Manter ingestão de água acima de 3 L/dia. Evitar ultraprocessados. Priorizar proteínas magras nas refeições pós-treino.",
    dias: {
      segunda: {
        refeicoes: [
          {
            id: "seg-cafe", nome: "Café da manhã", horario: "07:00",
            alimentos: [
              { id: "s1", nome: "Ovos mexidos",       quantidade: "3 unidades",          calorias: 210, proteina: 18, carboidrato: 2,  gordura: 15 },
              { id: "s2", nome: "Pão integral",       quantidade: "2 fatias",             calorias: 160, proteina: 6,  carboidrato: 30, gordura: 2  },
              { id: "s3", nome: "Banana",             quantidade: "1 unidade média",      calorias: 90,  proteina: 1,  carboidrato: 23, gordura: 0  },
              { id: "s4", nome: "Café com leite",     quantidade: "200 ml",               calorias: 60,  proteina: 3,  carboidrato: 6,  gordura: 2  },
            ],
          },
          {
            id: "seg-almoco", nome: "Almoço", horario: "12:00",
            alimentos: [
              { id: "s5", nome: "Frango grelhado",    quantidade: "200 g",                calorias: 330, proteina: 62, carboidrato: 0,  gordura: 8  },
              { id: "s6", nome: "Arroz branco",       quantidade: "4 colheres de sopa",   calorias: 220, proteina: 4,  carboidrato: 48, gordura: 0  },
              { id: "s7", nome: "Feijão carioca",     quantidade: "2 colheres de sopa",   calorias: 90,  proteina: 5,  carboidrato: 16, gordura: 1  },
              { id: "s8", nome: "Salada verde",       quantidade: "à vontade",            calorias: 20,  proteina: 1,  carboidrato: 3,  gordura: 0  },
            ],
          },
          {
            id: "seg-pretreino", nome: "Pré-treino", horario: "16:30",
            alimentos: [
              { id: "s9",  nome: "Batata-doce cozida", quantidade: "150 g",              calorias: 135, proteina: 3,  carboidrato: 31, gordura: 0  },
              { id: "s10", nome: "Whey protein",       quantidade: "1 scoop (30 g)",     calorias: 120, proteina: 24, carboidrato: 4,  gordura: 2  },
            ],
          },
          {
            id: "seg-postrtreino", nome: "Pós-treino", horario: "19:00",
            alimentos: [
              { id: "s11", nome: "Frango grelhado",   quantidade: "200 g",               calorias: 330, proteina: 62, carboidrato: 0,  gordura: 8  },
              { id: "s12", nome: "Arroz branco",      quantidade: "3 colheres de sopa",  calorias: 165, proteina: 3,  carboidrato: 36, gordura: 0  },
              { id: "s13", nome: "Brócolis cozido",   quantidade: "100 g",               calorias: 35,  proteina: 3,  carboidrato: 7,  gordura: 0  },
            ],
          },
          {
            id: "seg-ceia", nome: "Ceia", horario: "22:00",
            alimentos: [
              { id: "s14", nome: "Iogurte grego",     quantidade: "200 g",               calorias: 130, proteina: 18, carboidrato: 8,  gordura: 3  },
              { id: "s15", nome: "Amendoim torrado",  quantidade: "30 g",                calorias: 175, proteina: 7,  carboidrato: 5,  gordura: 15 },
            ],
          },
        ],
      },
      terca: {
        refeicoes: [
          {
            id: "ter-cafe", nome: "Café da manhã", horario: "07:00",
            alimentos: [
              { id: "t1", nome: "Omelete de claras",  quantidade: "4 claras + 1 ovo inteiro", calorias: 180, proteina: 22, carboidrato: 1,  gordura: 9  },
              { id: "t2", nome: "Aveia com leite",    quantidade: "50 g aveia + 200 ml leite", calorias: 250, proteina: 11, carboidrato: 38, gordura: 6  },
              { id: "t3", nome: "Morango",            quantidade: "100 g",                calorias: 30,  proteina: 1,  carboidrato: 7,  gordura: 0  },
            ],
          },
          {
            id: "ter-almoco", nome: "Almoço", horario: "12:00",
            alimentos: [
              { id: "t4", nome: "Patinho moído",      quantidade: "200 g",               calorias: 340, proteina: 44, carboidrato: 0,  gordura: 17 },
              { id: "t5", nome: "Arroz integral",     quantidade: "4 colheres de sopa",  calorias: 230, proteina: 5,  carboidrato: 47, gordura: 2  },
              { id: "t6", nome: "Abobrinha refogada", quantidade: "100 g",               calorias: 25,  proteina: 2,  carboidrato: 4,  gordura: 0  },
            ],
          },
          {
            id: "ter-jantar", nome: "Jantar", horario: "19:30",
            alimentos: [
              { id: "t7", nome: "Tilápia grelhada",   quantidade: "200 g",               calorias: 220, proteina: 44, carboidrato: 0,  gordura: 5  },
              { id: "t8", nome: "Batata-doce cozida", quantidade: "200 g",               calorias: 180, proteina: 4,  carboidrato: 41, gordura: 0  },
              { id: "t9", nome: "Aspargos grelhados", quantidade: "100 g",               calorias: 20,  proteina: 2,  carboidrato: 4,  gordura: 0  },
            ],
          },
          {
            id: "ter-ceia", nome: "Ceia", horario: "22:00",
            alimentos: [
              { id: "t10", nome: "Caseína em pó",     quantidade: "1 scoop (30 g)",      calorias: 110, proteina: 24, carboidrato: 3,  gordura: 1  },
              { id: "t11", nome: "Mix de castanhas",  quantidade: "25 g",                calorias: 155, proteina: 4,  carboidrato: 4,  gordura: 14 },
            ],
          },
        ],
      },
      quarta: {
        refeicoes: [
          {
            id: "qua-cafe", nome: "Café da manhã", horario: "07:00",
            alimentos: [
              { id: "q1", nome: "Ovos mexidos",       quantidade: "3 unidades",          calorias: 210, proteina: 18, carboidrato: 2,  gordura: 15 },
              { id: "q2", nome: "Pão integral",       quantidade: "2 fatias",            calorias: 160, proteina: 6,  carboidrato: 30, gordura: 2  },
              { id: "q3", nome: "Mamão",              quantidade: "1 fatia média",       calorias: 60,  proteina: 1,  carboidrato: 15, gordura: 0  },
            ],
          },
          {
            id: "qua-almoco", nome: "Almoço", horario: "12:00",
            alimentos: [
              { id: "q4", nome: "Frango grelhado",    quantidade: "200 g",               calorias: 330, proteina: 62, carboidrato: 0,  gordura: 8  },
              { id: "q5", nome: "Macarrão integral",  quantidade: "100 g (cru)",         calorias: 350, proteina: 13, carboidrato: 70, gordura: 2  },
              { id: "q6", nome: "Molho de tomate",    quantidade: "3 colheres de sopa",  calorias: 30,  proteina: 1,  carboidrato: 6,  gordura: 0  },
            ],
          },
          {
            id: "qua-jantar", nome: "Jantar", horario: "19:00",
            alimentos: [
              { id: "q7", nome: "Salmão grelhado",    quantidade: "180 g",               calorias: 376, proteina: 38, carboidrato: 0,  gordura: 23 },
              { id: "q8", nome: "Purê de batata-doce", quantidade: "150 g",             calorias: 135, proteina: 3,  carboidrato: 31, gordura: 0  },
              { id: "q9", nome: "Cenoura cozida",     quantidade: "100 g",              calorias: 35,  proteina: 1,  carboidrato: 8,  gordura: 0  },
            ],
          },
        ],
      },
      quinta: {
        refeicoes: [
          {
            id: "qui-cafe", nome: "Café da manhã", horario: "07:00",
            alimentos: [
              { id: "u1", nome: "Vitamina de banana e whey", quantidade: "1 copo 400 ml", calorias: 380, proteina: 30, carboidrato: 50, gordura: 5 },
            ],
          },
          {
            id: "qui-almoco", nome: "Almoço", horario: "12:00",
            alimentos: [
              { id: "u2", nome: "Carne bovina magra", quantidade: "200 g",              calorias: 360, proteina: 46, carboidrato: 0,  gordura: 18 },
              { id: "u3", nome: "Arroz branco",       quantidade: "4 colheres de sopa", calorias: 220, proteina: 4,  carboidrato: 48, gordura: 0  },
              { id: "u4", nome: "Lentilha cozida",    quantidade: "3 colheres de sopa", calorias: 100, proteina: 8,  carboidrato: 17, gordura: 0  },
            ],
          },
          {
            id: "qui-pretreino", nome: "Pré-treino", horario: "16:30",
            alimentos: [
              { id: "u5", nome: "Tâmaras",            quantidade: "4 unidades",          calorias: 100, proteina: 1,  carboidrato: 27, gordura: 0  },
              { id: "u6", nome: "Whey protein",       quantidade: "1 scoop (30 g)",      calorias: 120, proteina: 24, carboidrato: 4,  gordura: 2  },
            ],
          },
          {
            id: "qui-jantar", nome: "Pós-treino / Jantar", horario: "19:30",
            alimentos: [
              { id: "u7", nome: "Frango assado",      quantidade: "250 g",               calorias: 410, proteina: 78, carboidrato: 0,  gordura: 9  },
              { id: "u8", nome: "Batata-doce cozida", quantidade: "200 g",               calorias: 180, proteina: 4,  carboidrato: 41, gordura: 0  },
            ],
          },
        ],
      },
      sexta: {
        refeicoes: [
          {
            id: "sex-cafe", nome: "Café da manhã", horario: "07:00",
            alimentos: [
              { id: "x1", nome: "Ovos mexidos",       quantidade: "3 unidades",           calorias: 210, proteina: 18, carboidrato: 2,  gordura: 15 },
              { id: "x2", nome: "Tapioca",            quantidade: "2 unidades (60 g goma)", calorias: 200, proteina: 2, carboidrato: 48, gordura: 0  },
              { id: "x3", nome: "Queijo minas frescal", quantidade: "50 g",              calorias: 75,  proteina: 7,  carboidrato: 1,  gordura: 5  },
            ],
          },
          {
            id: "sex-almoco", nome: "Almoço", horario: "12:00",
            alimentos: [
              { id: "x4", nome: "Frango grelhado",    quantidade: "200 g",               calorias: 330, proteina: 62, carboidrato: 0,  gordura: 8  },
              { id: "x5", nome: "Arroz branco",       quantidade: "4 colheres de sopa",  calorias: 220, proteina: 4,  carboidrato: 48, gordura: 0  },
              { id: "x6", nome: "Feijão preto",       quantidade: "2 colheres de sopa",  calorias: 95,  proteina: 6,  carboidrato: 17, gordura: 1  },
            ],
          },
          {
            id: "sex-jantar", nome: "Jantar", horario: "19:00",
            alimentos: [
              { id: "x7", nome: "Tilápia grelhada",   quantidade: "200 g",               calorias: 220, proteina: 44, carboidrato: 0,  gordura: 5  },
              { id: "x8", nome: "Legumes no vapor",   quantidade: "200 g",               calorias: 60,  proteina: 4,  carboidrato: 12, gordura: 0  },
            ],
          },
        ],
      },
      sabado: {
        refeicoes: [
          {
            id: "sab-cafe", nome: "Café da manhã", horario: "08:30",
            alimentos: [
              { id: "b1", nome: "Panqueca de aveia e banana", quantidade: "3 unidades", calorias: 300, proteina: 12, carboidrato: 42, gordura: 9  },
              { id: "b2", nome: "Mel",                quantidade: "1 colher de chá",     calorias: 25,  proteina: 0,  carboidrato: 7,  gordura: 0  },
            ],
          },
          {
            id: "sab-almoco", nome: "Almoço livre (controlado)", horario: "13:00",
            alimentos: [
              { id: "b3", nome: "Refeição livre (estimativa)", quantidade: "1 prato médio", calorias: 700, proteina: 35, carboidrato: 80, gordura: 20 },
            ],
          },
          {
            id: "sab-jantar", nome: "Jantar", horario: "20:00",
            alimentos: [
              { id: "b4", nome: "Omelete com queijo", quantidade: "3 ovos + 30 g queijo", calorias: 310, proteina: 22, carboidrato: 2,  gordura: 24 },
              { id: "b5", nome: "Salada mista",       quantidade: "à vontade",            calorias: 30,  proteina: 2,  carboidrato: 5,  gordura: 0  },
            ],
          },
        ],
      },
      domingo: {
        refeicoes: [
          {
            id: "dom-cafe", nome: "Café da manhã", horario: "09:00",
            alimentos: [
              { id: "d1", nome: "Vitamina de frutas com whey", quantidade: "1 copo grande (450 ml)", calorias: 420, proteina: 30, carboidrato: 58, gordura: 6 },
            ],
          },
          {
            id: "dom-almoco", nome: "Almoço em família", horario: "13:00",
            alimentos: [
              { id: "d2", nome: "Refeição completa (estimativa)", quantidade: "1 prato médio", calorias: 750, proteina: 40, carboidrato: 85, gordura: 22 },
            ],
          },
          {
            id: "dom-jantar", nome: "Jantar leve", horario: "19:30",
            alimentos: [
              { id: "d3", nome: "Sopa de legumes com frango", quantidade: "500 ml", calorias: 280, proteina: 28, carboidrato: 30, gordura: 4 },
            ],
          },
        ],
      },
    },
  };

  localStorage.setItem("mypersonal:dietas", JSON.stringify(dietas));

  /* ---------- 4. Avaliações ---------- */
  let avaliacoes = [];
  try {
    const stored = JSON.parse(localStorage.getItem("mypersonal:avaliacoes") || "[]");
    avaliacoes = Array.isArray(stored) ? stored : [];
  } catch (_) {}

  const avaliacoesCarlos = [
    {
      id: "avaliacao-carlos-2026-01-15",
      alunoId: DEMO_ALUNO_ID,
      alunoNome: "Carlos Mendes",
      profissionalId: DEMO_PROF_ID,
      data: "2026-01-15",
      tipo: "Avaliacao corporal",
      peso: 88, altura: 178, gordura: 22, massaMagra: 67,
      cintura: 93, quadril: 103, bracoDireito: 33, bracoEsquerdo: 33, coxaDireita: 57, coxaEsquerda: 57,
      observacoes: "Início do acompanhamento. Aluno com bom potencial e muita disposição.",
    },
    {
      id: "avaliacao-carlos-2026-02-20",
      alunoId: DEMO_ALUNO_ID,
      alunoNome: "Carlos Mendes",
      profissionalId: DEMO_PROF_ID,
      data: "2026-02-20",
      tipo: "Reavaliacao",
      peso: 86, altura: 178, gordura: 20, massaMagra: 68,
      cintura: 90, quadril: 101, bracoDireito: 34, bracoEsquerdo: 34, coxaDireita: 58, coxaEsquerda: 58,
      observacoes: "Boa aderência à dieta. Redução de gordura com ganho de massa magra.",
    },
    {
      id: "avaliacao-carlos-2026-03-25",
      alunoId: DEMO_ALUNO_ID,
      alunoNome: "Carlos Mendes",
      profissionalId: DEMO_PROF_ID,
      data: "2026-03-25",
      tipo: "Reavaliacao",
      peso: 84, altura: 178, gordura: 19, massaMagra: 68,
      cintura: 88, quadril: 100, bracoDireito: 35, bracoEsquerdo: 35, coxaDireita: 59, coxaEsquerda: 59,
      observacoes: "Excelente progresso. Cargas nos treinos subindo consistentemente.",
    },
    {
      id: "avaliacao-carlos-2026-04-30",
      alunoId: DEMO_ALUNO_ID,
      alunoNome: "Carlos Mendes",
      profissionalId: DEMO_PROF_ID,
      data: "2026-04-30",
      tipo: "Reavaliacao",
      peso: 83, altura: 178, gordura: 18, massaMagra: 68,
      cintura: 87, quadril: 99, bracoDireito: 36, bracoEsquerdo: 36, coxaDireita: 60, coxaEsquerda: 60,
      observacoes: "Mantendo o progresso. Iniciar fase de volume a partir de maio.",
    },
    {
      id: "avaliacao-carlos-2026-06-05",
      alunoId: DEMO_ALUNO_ID,
      alunoNome: "Carlos Mendes",
      profissionalId: DEMO_PROF_ID,
      data: "2026-06-05",
      tipo: "Reavaliacao",
      peso: 82, altura: 178, gordura: 17, massaMagra: 68,
      cintura: 86, quadril: 98, bracoDireito: 36, bracoEsquerdo: 36, coxaDireita: 61, coxaEsquerda: 61,
      observacoes: "5 meses de evolução contínua. Aluno referência em comprometimento.",
    },
  ];

  // Substituir avaliações antigas do Carlos pelas atuais
  const avaliacoesSemCarlos = avaliacoes.filter((a) => a.alunoId !== DEMO_ALUNO_ID);
  localStorage.setItem("mypersonal:avaliacoes", JSON.stringify([...avaliacoesSemCarlos, ...avaliacoesCarlos]));

  /* ---------- 5. Compromissos ---------- */
  let compromissos = [];
  try {
    const stored = JSON.parse(localStorage.getItem("mypersonal:compromissos") || "[]");
    compromissos = Array.isArray(stored) ? stored : [];
  } catch (_) {}

  const compromissosSemCarlos = compromissos.filter((c) => c.alunoId !== DEMO_ALUNO_ID);

  function isoDate(d) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  // 12 treinos semanais a partir de 22/06/2026 (segunda-feira)
  const serieId = "serie-treino-carlos-demo";
  const treinosSerie = Array.from({ length: 12 }, (_, i) => {
    const d = new Date("2026-06-22");
    d.setDate(d.getDate() + i * 7);
    return {
      id: `comp-treino-carlos-${i + 1}`,
      serieId,
      recorrenciaOrdem: i + 1,
      recorrenciaTotal: 12,
      tipo: "treino",
      alunoId: DEMO_ALUNO_ID,
      alunoNome: "Carlos Mendes",
      profissionalId: DEMO_PROF_ID,
      data: isoDate(d),
      horaInicio: "17:00",
      horaFim: "18:30",
      local: "presencial",
      recorrencia: "semanal",
      lembrete: "1h",
      descricao: "Treino de musculação — ciclo A/B/C",
      status: "Agendado",
    };
  });

  // 3 avaliações mensais a partir de 10/07/2026
  const serieAvalId = "serie-aval-carlos-demo";
  const avaliacoesSerie = Array.from({ length: 3 }, (_, i) => {
    const d = new Date("2026-07-10");
    d.setMonth(d.getMonth() + i);
    return {
      id: `comp-aval-carlos-${i + 1}`,
      serieId: serieAvalId,
      recorrenciaOrdem: i + 1,
      recorrenciaTotal: 3,
      tipo: "avaliacao",
      alunoId: DEMO_ALUNO_ID,
      alunoNome: "Carlos Mendes",
      profissionalId: DEMO_PROF_ID,
      data: isoDate(d),
      horaInicio: "09:00",
      horaFim: "10:00",
      local: "presencial",
      recorrencia: "mensal",
      lembrete: "1dia",
      descricao: "Avaliação física trimestral",
      status: "Agendado",
    };
  });

  // 1 troca de treino online
  const trocaTreino = {
    id: "comp-troca-carlos-1",
    serieId: "",
    recorrenciaOrdem: 1,
    recorrenciaTotal: 1,
    tipo: "troca-treino",
    alunoId: DEMO_ALUNO_ID,
    alunoNome: "Carlos Mendes",
    profissionalId: DEMO_PROF_ID,
    data: "2026-07-01",
    horaInicio: "10:00",
    horaFim: "11:00",
    local: "online",
    recorrencia: "nao",
    lembrete: "30min",
    descricao: "Revisão e atualização do plano de treino para o 2º semestre",
    status: "Agendado",
  };

  localStorage.setItem(
    "mypersonal:compromissos",
    JSON.stringify([...compromissosSemCarlos, ...treinosSerie, ...avaliacoesSerie, trocaTreino])
  );

  /* ---------- 6. Configurações do aluno ---------- */
  localStorage.setItem("mypersonal:configuracoesAluno", JSON.stringify({
    id: DEMO_ALUNO_ID,
    nome: "Carlos",
    sobrenome: "Mendes",
    email: "carlos@demo.com",
    telefone: "(11) 98765-4321",
    cidade: "São Paulo",
    preferencias: { email: true, agenda: true, mensagens: true },
  }));

  return {
    alunoId:          DEMO_ALUNO_ID,
    alunoEmail:       "carlos@demo.com",
    profissionalId:   DEMO_PROF_ID,
    profissionalEmail: "pierre@demo.com",
    senha:            "demo123",
  };
}

window.carregarDadosDemo = carregarDadosDemo;
