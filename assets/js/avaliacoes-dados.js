/* ============================================================
   avaliacoes-dados.js
   Dados modelo, localStorage e funções utilitárias das avaliações.
   ============================================================ */
(function (app) {
  /* chaves usadas para salvar e buscar dados no localStorage */
  const CHAVES = {
    avaliacoes: "mypersonal:avaliacoes",
    configuracoesAluno: "mypersonal:configuracoesAluno",
    configuracoesProfissional: "mypersonal:configuracoesProfissional",
  };

  /* dados iniciais do aluno usados quando o localStorage ainda esta vazio */
  const alunoPadrao = {
    id: "aluno-eliabe-monteiro",
    nome: "Eliabe",
    sobrenome: "Monteiro",
    email: "eliabe@email.com",
    telefone: "(31) 98888-8888",
    cidade: "Belo Horizonte",
    preferencias: {
      email: true,
      agenda: true,
      mensagens: false,
    },
  };

  /* dados iniciais do profissional usados quando o localStorage ainda esta vazio */
  const profissionalPadrao = {
    id: "pierre",
    nome: "Pierre",
    sobrenome: "Silva",
    email: "pierre@email.com",
    telefone: "(31) 99999-9999",
    cidade: "Belo Horizonte",
    preferencias: {
      email: true,
      agenda: true,
      mensagens: false,
    },
  };

  /* avaliacoes iniciais para alimentar estatisticas, historico e graficos */
  const avaliacoesIniciais = [
    {
      id: "avaliacao-2026-01-10",
      alunoId: "eliabe",
      data: "2026-01-10",
      tipo: "Avaliacao corporal",
      peso: 85,
      altura: 178,
      gordura: 21,
      massaMagra: 65,
      cintura: 91,
      quadril: 101,
      bracoDireito: 34,
      bracoEsquerdo: 34,
      coxaDireita: 57,
      coxaEsquerda: 57,
      observacoes: "Inicio do acompanhamento",
    },
    {
      id: "avaliacao-2026-02-10",
      alunoId: "eliabe",
      data: "2026-02-10",
      tipo: "Reavaliacao",
      peso: 83,
      altura: 178,
      gordura: 20,
      massaMagra: 66,
      cintura: 89,
      quadril: 100,
      bracoDireito: 35,
      bracoEsquerdo: 35,
      coxaDireita: 58,
      coxaEsquerda: 58,
      observacoes: "Boa aderencia",
    },
    {
      id: "avaliacao-2026-03-15",
      alunoId: "eliabe",
      data: "2026-03-15",
      tipo: "Avaliacao corporal",
      peso: 82,
      altura: 178,
      gordura: 18,
      massaMagra: 67,
      cintura: 87,
      quadril: 99,
      bracoDireito: 36,
      bracoEsquerdo: 36,
      coxaDireita: 59,
      coxaEsquerda: 59,
      observacoes: "Meta parcial atingida",
    },
    {
      id: "avaliacao-lucas-2026-01-12",
      alunoId: "aluno-lucas-rodrigues",
      alunoNome: "Lucas Rodrigues",
      data: "2026-01-12",
      tipo: "Avaliacao corporal",
      peso: 78,
      altura: 175,
      gordura: 19,
      massaMagra: 63,
      cintura: 88,
      quadril: 97,
      bracoDireito: 33,
      bracoEsquerdo: 33,
      coxaDireita: 55,
      coxaEsquerda: 55,
      observacoes: "Inicio do plano de emagrecimento",
    },
    {
      id: "avaliacao-lucas-2026-03-18",
      alunoId: "aluno-lucas-rodrigues",
      alunoNome: "Lucas Rodrigues",
      data: "2026-03-18",
      tipo: "Reavaliacao",
      peso: 75,
      altura: 175,
      gordura: 15,
      massaMagra: 64,
      cintura: 84,
      quadril: 95,
      bracoDireito: 34,
      bracoEsquerdo: 34,
      coxaDireita: 56,
      coxaEsquerda: 56,
      observacoes: "Boa reducao de medidas",
    },
    {
      id: "avaliacao-fernanda-2026-01-20",
      alunoId: "aluno-fernanda-santos",
      alunoNome: "Fernanda Santos",
      data: "2026-01-20",
      tipo: "Avaliacao corporal",
      peso: 58,
      altura: 165,
      gordura: 22,
      massaMagra: 45,
      cintura: 72,
      quadril: 96,
      bracoDireito: 27,
      bracoEsquerdo: 27,
      coxaDireita: 52,
      coxaEsquerda: 52,
      observacoes: "Inicio do acompanhamento de hipertrofia",
    },
    {
      id: "avaliacao-fernanda-2026-03-22",
      alunoId: "aluno-fernanda-santos",
      alunoNome: "Fernanda Santos",
      data: "2026-03-22",
      tipo: "Reavaliacao",
      peso: 59,
      altura: 165,
      gordura: 20,
      massaMagra: 47,
      cintura: 71,
      quadril: 97,
      bracoDireito: 28,
      bracoEsquerdo: 28,
      coxaDireita: 53,
      coxaEsquerda: 53,
      observacoes: "Ganho de massa magra",
    },
    {
      id: "avaliacao-carlos-2026-02-05",
      alunoId: "aluno-carlos-melo",
      alunoNome: "Carlos Melo",
      data: "2026-02-05",
      tipo: "Avaliacao corporal",
      peso: 72,
      altura: 172,
      gordura: 23,
      massaMagra: 55,
      cintura: 86,
      quadril: 96,
      bracoDireito: 31,
      bracoEsquerdo: 31,
      coxaDireita: 54,
      coxaEsquerda: 54,
      observacoes: "Primeira avaliacao do aluno",
    },
  ];

  /* codigo para ler JSON do localStorage com valorPadrao se der erro */
  function lerJson(chave, valorPadrao) {
    try {
      const valor = localStorage.getItem(chave);
      return valor ? JSON.parse(valor) : valorPadrao;
    } catch (erro) {
      return valorPadrao;
    }
  }

  /* codigo para salvar JSON no localStorage */
  function salvarJson(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
  }

  /* codigo para criar dados iniciais no localStorage na primeira execucao */
  function garantirDadosIniciais() {
    if (!localStorage.getItem(CHAVES.avaliacoes)) {
      salvarJson(CHAVES.avaliacoes, avaliacoesIniciais);
    } else {
      const avaliacoesAtuais = lerJson(CHAVES.avaliacoes, []);
      const idsAtuais = new Set(avaliacoesAtuais.map((avaliacao) => avaliacao.id));
      const avaliacoesFaltantes = avaliacoesIniciais.filter((avaliacao) => !idsAtuais.has(avaliacao.id));

      if (avaliacoesFaltantes.length) {
        salvarJson(CHAVES.avaliacoes, [...avaliacoesAtuais, ...avaliacoesFaltantes]);
      }
    }

    if (!localStorage.getItem(CHAVES.configuracoesAluno)) {
      salvarJson(CHAVES.configuracoesAluno, alunoPadrao);
    }

    if (!localStorage.getItem(CHAVES.configuracoesProfissional)) {
      salvarJson(CHAVES.configuracoesProfissional, profissionalPadrao);
    }
  }

  /* codigo para gerar um id estavel para integracoes futuras */
  function gerarIdAluno(valor) {
    const normalizado = normalizarTexto(valor).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    if (normalizado.includes("eliabe")) return alunoPadrao.id;
    return normalizado ? `aluno-${normalizado.replace(/^aluno-/, "")}` : alunoPadrao.id;
  }

  function paginaAtualEAluno() {
    return window.location.pathname.includes("/aluno/") || document.body.dataset.profile === "aluno";
  }

  function montarNomeCompletoEstatistica(dados = {}) {
    if (window.AlunoContexto && typeof window.AlunoContexto.montarNomeCompleto === "function") {
      return window.AlunoContexto.montarNomeCompleto(dados);
    }

    const nome = String(dados.nome || "").trim();
    const sobrenome = String(dados.sobrenome || "").trim();
    if (!nome) return sobrenome;
    if (!sobrenome) return nome;

    const nomeLower = nome.toLowerCase();
    const sobrenomeLower = sobrenome.toLowerCase();
    if (nome.split(/\s+/).length > 1 || nomeLower.endsWith(` ${sobrenomeLower}`) || nomeLower === sobrenomeLower) {
      return nome;
    }

    return `${nome} ${sobrenome}`.trim();
  }

  function formatarAlunoParaEstatistica(dados = {}) {
    dados = dados || {};
    const nomeCompleto = montarNomeCompletoEstatistica(dados) || `${alunoPadrao.nome} ${alunoPadrao.sobrenome}`;
    const [nomeFallback, ...sobrenomePartes] = String(nomeCompleto).trim().split(/\s+/);

    return {
      ...alunoPadrao,
      ...dados,
      id: dados.id || dados.alunoId || gerarIdAluno(nomeCompleto),
      alunoId: dados.id || dados.alunoId || gerarIdAluno(nomeCompleto),
      nome: nomeFallback || alunoPadrao.nome,
      sobrenome: sobrenomePartes.join(" ") || alunoPadrao.sobrenome,
      telefone: dados.telefone || dados.tel || alunoPadrao.telefone,
    };
  }

  /* codigo para ler o aluno selecionado ou o aluno logado, usando ID unico */
  function buscarAlunoAtual() {
    if (window.AlunoContexto && typeof window.AlunoContexto.buscarAlunoAtual === "function") {
      if (paginaAtualEAluno() && typeof window.AlunoContexto.buscarAlunoLogado === "function") {
        const alunoLogado = window.AlunoContexto.buscarAlunoLogado();
        return alunoLogado
          ? formatarAlunoParaEstatistica(alunoLogado)
          : formatarAlunoParaEstatistica({ nome: "Aluno" });
      }

      const aluno = window.AlunoContexto.buscarAlunoAtual({ preferirUsuarioLogado: paginaAtualEAluno() });
      if (aluno) return formatarAlunoParaEstatistica(aluno);
      if (paginaAtualEAluno()) return formatarAlunoParaEstatistica({ nome: "Aluno" });
    }

    try {
      if (paginaAtualEAluno()) {
        const logado = JSON.parse(localStorage.getItem("mypersonal:usuarioLogado"));
        if (logado && (logado.tipo === "aluno" || logado.perfil === "aluno")) {
          return formatarAlunoParaEstatistica(logado);
        }
      }

      const selecionado = sessionStorage.getItem("alunoSelecionado");
      if (selecionado) {
        return formatarAlunoParaEstatistica(JSON.parse(selecionado));
      }
    } catch (erro) {
      return alunoPadrao;
    }

    return alunoPadrao;
  }

  function buscarAlunoIdAtual() {
    return buscarAlunoAtual().id || alunoPadrao.id;
  }

  function gerarAliasesAlunoAtual(aluno = buscarAlunoAtual()) {
    if (window.AlunoContexto && typeof window.AlunoContexto.gerarAliasesAluno === "function") {
      return window.AlunoContexto.gerarAliasesAluno(aluno);
    }

    const nomeCompleto = formatarNomeAluno(aluno);
    const slug = normalizarTexto(nomeCompleto).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const aliases = new Set([aluno.id, aluno.alunoId, slug, `aluno-${slug}`].filter(Boolean));
    if (slug.includes("eliabe")) aliases.add("eliabe");
    return Array.from(aliases);
  }

  function formatarNomeAluno(aluno = buscarAlunoAtual()) {
    return montarNomeCompletoEstatistica(aluno) || `${alunoPadrao.nome} ${alunoPadrao.sobrenome}`;
  }

  /* codigo para refletir o aluno atual em textos das telas de profissional */
  function atualizarContextoAlunoNaTela() {
    const aluno = buscarAlunoAtual();
    const nomeAluno = formatarNomeAluno(aluno);

    document.querySelectorAll(".student-name").forEach((elemento) => {
      elemento.textContent = nomeAluno;
    });

    document.querySelectorAll(".student-header .avatar-lg").forEach((elemento) => {
      const partes = nomeAluno.split(/\s+/).filter(Boolean);
      elemento.textContent = `${partes[0]?.[0] || "A"}${partes[1]?.[0] || ""}`.toUpperCase();
    });

    document.body.dataset.pageTitle = `Perfil do Aluno - ${nomeAluno}`;

    const topbarTitle = document.querySelector(".topbar-title");
    if (topbarTitle) topbarTitle.textContent = document.body.dataset.pageTitle;
  }


  /* codigo para buscar todas as avaliacoes em ordem de data */
  function buscarTodasAvaliacoes() {
    garantirDadosIniciais();
    return lerJson(CHAVES.avaliacoes, []).sort((a, b) => a.data.localeCompare(b.data));
  }

  /* codigo para buscar avaliacoes do aluno atual em ordem de data */
  function buscarAvaliacoes(alunoId = buscarAlunoIdAtual()) {
    const aliases = alunoId === buscarAlunoIdAtual()
      ? gerarAliasesAlunoAtual()
      : [alunoId];

    return buscarTodasAvaliacoes().filter((avaliacao) => {
      return aliases.includes(avaliacao.alunoId || alunoPadrao.id);
    });
  }

  /* codigo para salvar uma nova avaliacao no localStorage */
  function salvarAvaliacao(avaliacao) {
    const avaliacoes = buscarTodasAvaliacoes();
    const aluno = buscarAlunoAtual();

    avaliacoes.push({
      ...avaliacao,
      alunoId: avaliacao.alunoId || aluno.id || buscarAlunoIdAtual(),
      alunoNome: avaliacao.alunoNome || formatarNomeAluno(aluno),
      profissionalId: avaliacao.profissionalId || aluno.profissionalId || "",
    });

    try {
      salvarJson(CHAVES.avaliacoes, avaliacoes);
      return true;
    } catch (erro) {
      alert("Nao foi possivel salvar a avaliacao. Tente usar fotos menores ou remover alguma foto.");
      return false;
    }
  }

  /* codigo para excluir uma avaliacao pelo id */
  function excluirAvaliacao(idAvaliacao) {
    const avaliacoesAtualizadas = buscarTodasAvaliacoes().filter((avaliacao) => avaliacao.id !== idAvaliacao);
    salvarJson(CHAVES.avaliacoes, avaliacoesAtualizadas);
  }

  /* codigo para buscar as configuracoes salvas do aluno */
  function buscarConfigAluno() {
    garantirDadosIniciais();
    return lerJson(CHAVES.configuracoesAluno, alunoPadrao);
  }

  /* codigo para salvar as configuracoes do aluno */
  function salvarConfigAluno(configuracao) {
    salvarJson(CHAVES.configuracoesAluno, configuracao);
  }

  /* codigo para buscar as configuracoes salvas do profissional */
  function buscarConfigProfissional() {
    garantirDadosIniciais();
    return lerJson(CHAVES.configuracoesProfissional, profissionalPadrao);
  }

  /* codigo para salvar as configuracoes do profissional */
  function salvarConfigProfissional(configuracao) {
    salvarJson(CHAVES.configuracoesProfissional, configuracao);
  }

  /* codigo para formatar data no padrao brasileiro */
  function formatarData(dataIso) {
    if (!dataIso) return "-";
    const partes = dataIso.split("-");
    if (partes.length !== 3) return dataIso;
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  /* codigo para formatar mes e ano nos graficos e tabelas */
  function formatarMesAno(dataIso) {
    const data = new Date(`${dataIso}T00:00:00`);
    if (Number.isNaN(data.getTime())) return dataIso;

    return data.toLocaleDateString("pt-BR", {
      month: "short",
      year: "numeric",
    }).replace(".", "");
  }

  /* codigo para aceitar numeros com ponto ou virgula */
  function converterDecimal(valor) {
    if (valor === "" || valor === null || valor === undefined) return null;
    const normalizado = String(valor).replace(",", ".");
    const numero = Number(normalizado);
    return Number.isNaN(numero) ? null : numero;
  }

  /* codigo para exibir numeros com unidade ou traco quando estiver vazio */
  function numeroOuTraco(valor, sufixo) {
    const numero = converterDecimal(valor);
    if (numero === null) return "-";
    return `${numero.toLocaleString("pt-BR")}${sufixo || ""}`;
  }

  /* codigo para calcular IMC a partir de peso e altura */
  function calcularImc(avaliacao) {
    const peso = converterDecimal(avaliacao.peso);
    const alturaCm = converterDecimal(avaliacao.altura);
    if (!peso || !alturaCm) return "-";

    const alturaM = alturaCm / 100;
    return (peso / (alturaM * alturaM)).toFixed(1);
  }

  /* codigo para calcular diferenca entre duas medidas */
  function calcularDiferenca(atual, anterior) {
    const numeroAtual = converterDecimal(atual);
    const numeroAnterior = converterDecimal(anterior);
    if (numeroAtual === null || numeroAnterior === null) return 0;
    return numeroAtual - numeroAnterior;
  }

  /* codigo para formatar valores numericos usados nos graficos */
  function formatarValorMetrica(valor) {
    const numero = converterDecimal(valor);
    if (numero === null) return "-";
    return numero.toLocaleString("pt-BR");
  }

  /* codigo para calcular datas relativas usadas nos filtros do historico */
  function buscarDataMesesAtras(meses) {
    const data = new Date();
    data.setMonth(data.getMonth() - meses);
    return data.toISOString().slice(0, 10);
  }

  /* codigo para evitar HTML indevido em textos digitados pelo usuario */
  function escaparHtml(valor) {
    return String(valor || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /* codigo para comparar textos ignorando acentos */
  function normalizarTexto(valor) {
    return String(valor || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  /* codigo para exibir o tipo da avaliacao com acentos */
  function formatarTipoAvaliacao(valor) {
    const tipoNormalizado = normalizarTexto(valor);
    if (tipoNormalizado.includes("reavaliacao")) return "Reavaliação";
    if (tipoNormalizado.includes("avaliacao") || tipoNormalizado.includes("corporal")) return "Avaliação corporal";
    return valor || "Avaliação corporal";
  }

  /* codigo para buscar a avaliacao mais recente */
  function buscarUltimaAvaliacao() {
    const avaliacoes = buscarAvaliacoes();
    return avaliacoes[avaliacoes.length - 1] || null;
  }

  Object.assign(app, {
    garantirDadosIniciais,
    buscarAlunoAtual,
    buscarAlunoIdAtual,
    gerarAliasesAlunoAtual,
    formatarNomeAluno,
    atualizarContextoAlunoNaTela,
    buscarTodasAvaliacoes,
    buscarAvaliacoes,
    salvarAvaliacao,
    excluirAvaliacao,
    buscarConfigAluno,
    salvarConfigAluno,
    buscarConfigProfissional,
    salvarConfigProfissional,
    formatarData,
    formatarMesAno,
    converterDecimal,
    numeroOuTraco,
    calcularImc,
    calcularDiferenca,
    formatarValorMetrica,
    buscarDataMesesAtras,
    escaparHtml,
    normalizarTexto,
    formatarTipoAvaliacao,
    buscarUltimaAvaliacao,
  });
})(window.MyPersonal = window.MyPersonal || {});
