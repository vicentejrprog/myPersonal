/* ============================================================
   compromissos-store.js — Compromissos compartilhados (localStorage)
   Fonte única lida por: cadastro, agenda (profissional/aluno) e dashboard.

   Estrutura:
   localStorage["mypersonal:compromissos"] = [
     {
       id, serieId, recorrenciaOrdem, recorrenciaTotal,
       tipo, alunoId, alunoNome, profissionalId, data "YYYY-MM-DD", horaInicio,
       horaFim, local, recorrencia, lembrete, descricao, status
     }
   ]
   ============================================================ */

const COMPROMISSOS_KEY = "mypersonal:compromissos";

const TIPO_CLASSE = {
  "treino": "treino",
  "consulta": "consulta",
  "troca-treino": "outro",
  "avaliacao": "avaliacao",
  "outro": "outro",
};

const TIPO_LABEL = {
  "treino": "Treino",
  "consulta": "Consulta",
  "troca-treino": "Troca de treino",
  "avaliacao": "Avaliação",
  "outro": "Compromisso",
};

const RECORRENCIA_LABEL = {
  "nao": "Não repete",
  "semanal": "Semanal",
  "quinzenal": "Quinzenal",
  "mensal": "Mensal",
};

const LEMBRETE_LABEL = {
  "30min": "30 min antes",
  "1h": "1 hora antes",
  "1dia": "1 dia antes",
  "nenhum": "Sem lembrete",
};

const TOTAL_RECORRENCIAS = {
  "nao": 1,
  "semanal": 12,    // aproximadamente 3 meses
  "quinzenal": 6,   // aproximadamente 3 meses
  "mensal": 3,      // aproximadamente 3 meses
};

function gerarIdCompromisso(prefixo = "c") {
  return `${prefixo}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseISODateLocal(dateKey) {
  const partes = String(dateKey || "").split("-").map(Number);
  if (partes.length !== 3 || partes.some(isNaN)) return null;
  return new Date(partes[0], partes[1] - 1, partes[2]);
}

function formatISODateLocal(data) {
  const y = data.getFullYear();
  const m = String(data.getMonth() + 1).padStart(2, "0");
  const d = String(data.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function somarDias(data, dias) {
  const novaData = new Date(data);
  novaData.setDate(novaData.getDate() + dias);
  return novaData;
}

function somarMesesMantendoDia(data, meses) {
  const diaOriginal = data.getDate();
  const alvo = new Date(data.getFullYear(), data.getMonth() + meses, 1);
  const ultimoDiaDoMes = new Date(alvo.getFullYear(), alvo.getMonth() + 1, 0).getDate();
  alvo.setDate(Math.min(diaOriginal, ultimoDiaDoMes));
  return alvo;
}

function normalizarCompromisso(c) {
  return {
    id: c.id || gerarIdCompromisso(),
    serieId: c.serieId || "",
    recorrenciaOrdem: c.recorrenciaOrdem || 1,
    recorrenciaTotal: c.recorrenciaTotal || 1,
    tipo: c.tipo || "outro",
    alunoId: c.alunoId || "",
    alunoNome: c.alunoNome || "",
    profissionalId: c.profissionalId || "",
    data: c.data || "",
    horaInicio: c.horaInicio || "",
    horaFim: c.horaFim || "",
    local: c.local || "",
    recorrencia: c.recorrencia || "nao",
    lembrete: c.lembrete || "nenhum",
    descricao: c.descricao || "",
    status: c.status || "Agendado",
  };
}

function getCompromissos() {
  try {
    const d = JSON.parse(localStorage.getItem(COMPROMISSOS_KEY));
    return Array.isArray(d) ? d.map(normalizarCompromisso) : [];
  } catch (err) {
    return [];
  }
}

function salvarCompromissos(lista) {
  try {
    localStorage.setItem(COMPROMISSOS_KEY, JSON.stringify(lista.map(normalizarCompromisso)));
  } catch (err) {
    // localStorage indisponível: ignora
  }
}

function adicionarCompromisso(c) {
  const lista = getCompromissos();
  const compromisso = normalizarCompromisso(c);

  lista.push(compromisso);
  salvarCompromissos(lista);
  return compromisso;
}

function criarOcorrenciasRecorrentes(c) {
  const recorrencia = c.recorrencia || "nao";
  const total = TOTAL_RECORRENCIAS[recorrencia] || 1;
  const dataBase = parseISODateLocal(c.data);

  if (!dataBase || total <= 1) {
    return [normalizarCompromisso({
      ...c,
      recorrencia: recorrencia,
      recorrenciaOrdem: 1,
      recorrenciaTotal: 1,
    })];
  }

  const serieId = c.serieId || gerarIdCompromisso("serie");
  const ocorrencias = [];

  for (let i = 0; i < total; i++) {
    let dataOcorrencia = new Date(dataBase);

    if (recorrencia === "semanal") {
      dataOcorrencia = somarDias(dataBase, i * 7);
    } else if (recorrencia === "quinzenal") {
      dataOcorrencia = somarDias(dataBase, i * 14);
    } else if (recorrencia === "mensal") {
      dataOcorrencia = somarMesesMantendoDia(dataBase, i);
    }

    ocorrencias.push(normalizarCompromisso({
      ...c,
      id: gerarIdCompromisso(),
      serieId,
      data: formatISODateLocal(dataOcorrencia),
      recorrencia,
      recorrenciaOrdem: i + 1,
      recorrenciaTotal: total,
    }));
  }

  return ocorrencias;
}

function adicionarCompromissosRecorrentes(c) {
  const lista = getCompromissos();
  const ocorrencias = criarOcorrenciasRecorrentes(c);

  salvarCompromissos([...lista, ...ocorrencias]);
  return ocorrencias;
}

function atualizarStatusCompromisso(id, status) {
  let atualizado = null;

  const lista = getCompromissos().map((c) => {
    if (c.id !== id) return c;
    atualizado = { ...c, status };
    return atualizado;
  });

  salvarCompromissos(lista);
  return atualizado;
}

function cancelarCompromisso(id) {
  return atualizarStatusCompromisso(id, "Cancelado");
}

function removerCompromisso(id) {
  salvarCompromissos(getCompromissos().filter((c) => c.id !== id));
}

function compromissosDoDia(dateKey) {
  return getCompromissos().filter((c) => c.data === dateKey);
}

/* Cria o elemento visual de um compromisso salvo para o calendário.
   Se "cancelavel" for true, marca como clicável para cancelamento. */
function criarEventoCompromisso(c, cancelavel) {
  const cancelado = c.status === "Cancelado" || c.status === "Cancelada";
  const partes = [TIPO_LABEL[c.tipo] || "Compromisso", c.horaInicio, "-", c.alunoNome].filter(Boolean);
  const labelBase = partes.join(" ").replace(" - ", " - ");
  const label = cancelado ? `${labelBase} (Cancelado)` : labelBase;
  const detalhes = [
    c.status,
    RECORRENCIA_LABEL[c.recorrencia],
    c.recorrenciaTotal > 1 ? `${c.recorrenciaOrdem}/${c.recorrenciaTotal}` : "",
    LEMBRETE_LABEL[c.lembrete],
  ].filter(Boolean).join(" | ");

  const el = document.createElement("div");
  el.className = `calendar-event event-${TIPO_CLASSE[c.tipo] || "outro"}`;
  el.textContent = label;
  el.title = detalhes ? `${label} (${detalhes})` : label;

  if (cancelado) {
    el.classList.add("is-cancelado");
  } else if (cancelavel) {
    el.classList.add("is-cancelavel");
    el.dataset.compromissoId = c.id;
    el.style.cursor = "pointer";
    el.title = `${el.title} - clique para cancelar`;
  }

  return el;
}

window.getCompromissos = getCompromissos;
window.salvarCompromissos = salvarCompromissos;
window.adicionarCompromisso = adicionarCompromisso;
window.adicionarCompromissosRecorrentes = adicionarCompromissosRecorrentes;
window.atualizarStatusCompromisso = atualizarStatusCompromisso;
window.cancelarCompromisso = cancelarCompromisso;
window.removerCompromisso = removerCompromisso;
window.compromissosDoDia = compromissosDoDia;
window.criarEventoCompromisso = criarEventoCompromisso;
window.TIPO_LABEL = TIPO_LABEL;
window.RECORRENCIA_LABEL = RECORRENCIA_LABEL;
window.LEMBRETE_LABEL = LEMBRETE_LABEL;
window.TOTAL_RECORRENCIAS = TOTAL_RECORRENCIAS;
