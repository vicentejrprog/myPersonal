/* ============================================================
   historico-profissional.js
   Filtros, resumo, detalhes, exclusao e exportacao do historico.
   ============================================================ */
(function (app) {
  const {
    abrirModalDetalhe,
    buscarAvaliacoes,
    buscarDataMesesAtras,
    calcularDiferenca,
    calcularImc,
    excluirAvaliacao,
    formatarNomeAluno,
    formatarData,
    formatarTipoAvaliacao,
    normalizarTexto,
    numeroOuTraco,
    renderizarGraficosEvolucao,
    renderizarTabelaHistorico,
  } = app;

  /* codigo dos cartoes de resumo do historico filtrado */
  function renderizarMetricasHistorico(avaliacoes) {
    const metricas = document.querySelectorAll(".metrics-grid .metric-card .metric-value");
    if (!metricas.length) return;

    const ordenadas = avaliacoes.slice().sort((a, b) => a.data.localeCompare(b.data));
    const primeira = ordenadas[0];
    const ultima = ordenadas[ordenadas.length - 1];
    const pesoDiff = primeira && ultima ? calcularDiferenca(ultima.peso, primeira.peso) : 0;
    const gorduraDiff = primeira && ultima ? calcularDiferenca(ultima.gordura, primeira.gordura) : 0;

    metricas[0].textContent = String(avaliacoes.length);
    metricas[1].textContent = `${pesoDiff > 0 ? "+" : ""}${pesoDiff.toLocaleString("pt-BR")} kg`;
    metricas[2].textContent = `${gorduraDiff > 0 ? "+" : ""}${gorduraDiff.toLocaleString("pt-BR")}%`;
    metricas[1].classList.toggle("negativo", pesoDiff < 0);
    metricas[2].classList.toggle("negativo", gorduraDiff < 0);
    if (metricas[3]) metricas[3].textContent = String(avaliacoes.length * 4);
  }

  /* codigo para ler quais filtros estao ativos no historico */
  function buscarFiltrosHistorico() {
    const grupos = document.querySelectorAll(".secao-filtros .opcoes-filtro");
    const tipoTexto = normalizarTexto(grupos[0]?.querySelector(".filtro-btn.ativo")?.textContent.trim() || "todos");
    const periodoTexto = normalizarTexto(grupos[1]?.querySelector(".filtro-btn.ativo")?.textContent.trim() || "ultimos 3 meses");
    const dataInicio = document.getElementById("data-inicio")?.value || "";
    const dataFim = document.getElementById("data-fim")?.value || "";

    return { tipoTexto, periodoTexto, dataInicio, dataFim };
  }

  /* codigo que aplica filtro por tipo e periodo nas avaliacoes */
  function filtrarAvaliacoesHistorico(avaliacoes) {
    const gruposFiltro = buscarFiltrosHistorico();

    return avaliacoes.filter((avaliacao) => {
      const tipo = normalizarTexto(avaliacao.tipo || "");
      const tipoOk = gruposFiltro.tipoTexto.includes("todos")
        || (gruposFiltro.tipoTexto.includes("reavaliacao")
          ? tipo.includes("reavaliacao")
          : (tipo.includes("avaliacao") || tipo.includes("corporal")) && !tipo.includes("reavaliacao"));

      let dataOk = true;
      if (gruposFiltro.periodoTexto.includes("ultimo mes") && !gruposFiltro.periodoTexto.includes("3") && !gruposFiltro.periodoTexto.includes("6")) {
        dataOk = avaliacao.data >= buscarDataMesesAtras(1);
      } else if (gruposFiltro.periodoTexto.includes("3")) {
        dataOk = avaliacao.data >= buscarDataMesesAtras(3);
      } else if (gruposFiltro.periodoTexto.includes("6")) {
        dataOk = avaliacao.data >= buscarDataMesesAtras(6);
      } else if (gruposFiltro.periodoTexto.includes("personalizado")) {
        if (!gruposFiltro.dataInicio && !gruposFiltro.dataFim) return false;
        if (gruposFiltro.dataInicio) dataOk = dataOk && avaliacao.data >= gruposFiltro.dataInicio;
        if (gruposFiltro.dataFim) dataOk = dataOk && avaliacao.data <= gruposFiltro.dataFim;
      }

      return tipoOk && dataOk;
    });
  }

  /* codigo que atualiza tabela e resumo depois de filtrar o historico */
  function aplicarFiltrosHistorico() {
    const filtradas = filtrarAvaliacoesHistorico(buscarAvaliacoes());
    const corpoTabela = document.querySelector(".tabela-historico tbody");
    if (corpoTabela) renderizarTabelaHistorico(corpoTabela, filtradas, true);
    renderizarMetricasHistorico(filtradas);
    renderizarGraficosEvolucao(document, filtradas);
  }

  /* codigo que monta o texto usado no relatorio exportado */
  function montarTextoRelatorio(avaliacoes) {
    const nomeAluno = formatarNomeAluno ? formatarNomeAluno() : "Eliabe Monteiro";
    const linhas = [
      `Relatorio de historico - ${nomeAluno}`,
      `Gerado em: ${formatarData(new Date().toISOString().slice(0, 10))}`,
      "",
      `Avaliacoes encontradas: ${avaliacoes.length}`,
      "",
    ];

    avaliacoes.slice().reverse().forEach((avaliacao) => {
      linhas.push(`Data: ${formatarData(avaliacao.data)}`);
      linhas.push(`Tipo: ${formatarTipoAvaliacao(avaliacao.tipo)}`);
      linhas.push(`Peso: ${numeroOuTraco(avaliacao.peso, " kg")}`);
      linhas.push(`Gordura: ${numeroOuTraco(avaliacao.gordura, "%")}`);
      linhas.push(`Massa magra: ${numeroOuTraco(avaliacao.massaMagra, " kg")}`);
      linhas.push(`IMC: ${calcularImc(avaliacao)}`);
      linhas.push(`Observacoes: ${avaliacao.observacoes || "-"}`);
      linhas.push("");
    });

    return linhas.join("\n");
  }

  /* codigo do botao de exportar relatorio do historico */
  function prepararDownloadHistorico() {
    const linkDownload = document.querySelector(".export-modal-actions a[download]");
    if (!linkDownload) return;

    const filtradas = filtrarAvaliacoesHistorico(buscarAvaliacoes());
    const nomeAluno = formatarNomeAluno ? formatarNomeAluno() : "Eliabe Monteiro";
    const nomeArquivoSeguro = nomeAluno.replace(/\s+/g, "");
    const arquivoBlob = new Blob([montarTextoRelatorio(filtradas)], { type: "text/plain;charset=utf-8" });
    const hrefAnterior = linkDownload.getAttribute("href");

    if (hrefAnterior && hrefAnterior.startsWith("blob:")) {
      URL.revokeObjectURL(hrefAnterior);
    }

    linkDownload.href = URL.createObjectURL(arquivoBlob);
    linkDownload.download = `Historico_${nomeArquivoSeguro}.txt`;

    const nomeArquivo = document.querySelector(".export-file strong");
    const tipoArquivo = document.querySelector(".export-file span");
    if (nomeArquivo) nomeArquivo.textContent = linkDownload.download;
    if (tipoArquivo) tipoArquivo.textContent = "TXT";
  }

  /* codigo dos botoes, filtros, datas, ver mais e exportar no historico */
  function configurarInteracoesHistorico() {
    const gruposFiltro = document.querySelectorAll(".secao-filtros .opcoes-filtro");
    const camposData = document.querySelectorAll("#data-inicio, #data-fim");
    const botaoExportar = document.getElementById("export-history");
    const corpoTabela = document.querySelector(".tabela-historico tbody");

    gruposFiltro.forEach((grupo) => {
      grupo.querySelectorAll(".filtro-btn").forEach((botao) => {
        botao.addEventListener("click", () => {
          grupo.querySelectorAll(".filtro-btn").forEach((item) => item.classList.remove("ativo"));
          botao.classList.add("ativo");
          if (normalizarTexto(botao.textContent).includes("personalizado")) {
            document.getElementById("data-inicio")?.focus();
          }
          aplicarFiltrosHistorico();
        });
      });
    });

    camposData.forEach((campo) => {
      campo.addEventListener("change", () => {
        const grupoPeriodo = gruposFiltro[1];
        const botaoPersonalizado = Array.from(grupoPeriodo?.querySelectorAll(".filtro-btn") || [])
          .find((botao) => normalizarTexto(botao.textContent).includes("personalizado"));

        if (grupoPeriodo && botaoPersonalizado) {
          grupoPeriodo.querySelectorAll(".filtro-btn").forEach((item) => item.classList.remove("ativo"));
          botaoPersonalizado.classList.add("ativo");
        }

        aplicarFiltrosHistorico();
      });
    });

    if (corpoTabela) {
      corpoTabela.addEventListener("click", (evento) => {
        const botaoExcluir = evento.target.closest("[data-delete-avaliacao]");
        if (botaoExcluir) {
          const confirmou = confirm("Deseja excluir esta avaliacao? Esta acao nao pode ser desfeita.");
          if (!confirmou) return;

          excluirAvaliacao(botaoExcluir.dataset.deleteAvaliacao);
          aplicarFiltrosHistorico();
          return;
        }

        const botao = evento.target.closest("[data-view-avaliacao]");
        if (!botao) return;

        const avaliacao = buscarAvaliacoes().find((item) => item.id === botao.dataset.viewAvaliacao);
        if (avaliacao) abrirModalDetalhe(avaliacao);
      });
    }

    if (botaoExportar) {
      botaoExportar.addEventListener("click", prepararDownloadHistorico, true);
    }
  }

  /* codigo da tela de historico do profissional */
  function renderizarHistoricoProfissional() {
    if (!window.location.pathname.includes("historicoprofissional")) return;

    const avaliacoes = buscarAvaliacoes();
    const corpoTabela = document.querySelector(".tabela-historico tbody");
    if (corpoTabela) renderizarTabelaHistorico(corpoTabela, avaliacoes, true);
    aplicarFiltrosHistorico();
    configurarInteracoesHistorico();
  }

  Object.assign(app, {
    renderizarMetricasHistorico,
    buscarFiltrosHistorico,
    filtrarAvaliacoesHistorico,
    aplicarFiltrosHistorico,
    montarTextoRelatorio,
    prepararDownloadHistorico,
    configurarInteracoesHistorico,
    renderizarHistoricoProfissional,
  });
})(window.MyPersonal = window.MyPersonal || {});
