/* ============================================================
   avaliacoes-graficos.js
   Cria e renderiza os graficos SVG das avaliacoes.
   ============================================================ */
(function (app) {
  const {
    buscarAvaliacoes,
    converterDecimal,
    formatarMesAno,
    formatarValorMetrica,
  } = app;

  /* codigo do grafico de linha */
  function criarGraficoLinha(avaliacoes, metrica, rotulo, sufixo) {
    const pontos = avaliacoes
      .map((avaliacao) => ({
        rotulo: formatarMesAno(avaliacao.data),
        valor: converterDecimal(avaliacao[metrica]),
      }))
      .filter((item) => item.valor !== null);

    if (pontos.length < 2) {
      return `<div class="chart-empty">Cadastre pelo menos duas avaliacoes para visualizar a evolucao.</div>`;
    }

    const largura = 640;
    const altura = 260;
    const espacamento = { top: 24, right: 28, bottom: 44, left: 54 };
    const valores = pontos.map((ponto) => ponto.valor);
    const valorMinimo = Math.min(...valores);
    const valorMaximo = Math.max(...valores);
    const intervalo = valorMaximo - valorMinimo || 1;

    const coordenadas = pontos.map((ponto, indice) => {
      const x = espacamento.left + (indice * (largura - espacamento.left - espacamento.right)) / (pontos.length - 1);
      const y = altura - espacamento.bottom - ((ponto.valor - valorMinimo) / intervalo) * (altura - espacamento.top - espacamento.bottom);
      return { ...ponto, x, y };
    });

    const caminho = coordenadas.map((ponto, indice) => `${indice === 0 ? "M" : "L"} ${ponto.x} ${ponto.y}`).join(" ");
    const area = `${caminho} L ${coordenadas[coordenadas.length - 1].x} ${altura - espacamento.bottom} L ${coordenadas[0].x} ${altura - espacamento.bottom} Z`;
    const linhasGrade = [0, 0.25, 0.5, 0.75, 1].map((passo) => {
      const y = espacamento.top + passo * (altura - espacamento.top - espacamento.bottom);
      const valor = valorMaximo - passo * intervalo;
      return `
        <line x1="${espacamento.left}" y1="${y}" x2="${largura - espacamento.right}" y2="${y}" class="chart-grid-line"></line>
        <text x="${espacamento.left - 10}" y="${y + 4}" class="chart-axis-label" text-anchor="end">${formatarValorMetrica(valor)}</text>
      `;
    }).join("");

    return `
      <svg class="evolution-chart" viewBox="0 0 ${largura} ${altura}" role="img" aria-label="${rotulo}">
        <defs>
          <linearGradient id="chart-fill-${metrica}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="var(--green-primary)" stop-opacity="0.22"></stop>
            <stop offset="100%" stop-color="var(--green-primary)" stop-opacity="0"></stop>
          </linearGradient>
        </defs>
        ${linhasGrade}
        <path d="${area}" fill="url(#chart-fill-${metrica})"></path>
        <path d="${caminho}" class="chart-line"></path>
        ${coordenadas.map((ponto) => `
          <g>
            <circle cx="${ponto.x}" cy="${ponto.y}" r="4.5" class="chart-ponto"></circle>
            <text x="${ponto.x}" y="${ponto.y - 10}" class="chart-value" text-anchor="middle">${formatarValorMetrica(ponto.valor)}${sufixo}</text>
            <text x="${ponto.x}" y="${altura - 16}" class="chart-axis-label" text-anchor="middle">${ponto.rotulo}</text>
          </g>
        `).join("")}
      </svg>
    `;
  }

  /* codigo que cria dois graficos juntos na tela de historico */
  function criarGraficoHistoricoCombinado(avaliacoes) {
    const graficoPeso = criarGraficoLinha(avaliacoes, "peso", "Evolucao do peso", " kg");
    const graficoGordura = criarGraficoLinha(avaliacoes, "gordura", "Evolucao do percentual de gordura", "%");
    return `<div class="history-chart-grid">${graficoPeso}${graficoGordura}</div>`;
  }

  /* codigo que insere os graficos nas areas das telas */
  function renderizarGraficosEvolucao(escopo, avaliacoesFiltradas) {
    const avaliacoes = avaliacoesFiltradas || buscarAvaliacoes();
    const areasGraficos = escopo.querySelectorAll(".chart-placeholder");
    if (!areasGraficos.length) return;

    if (areasGraficos[0]) {
      areasGraficos[0].classList.add("has-chart");
      areasGraficos[0].innerHTML = criarGraficoLinha(avaliacoes, "peso", "Evolucao do peso", " kg");
    }

    if (areasGraficos[1]) {
      areasGraficos[1].classList.add("has-chart");
      areasGraficos[1].innerHTML = criarGraficoLinha(avaliacoes, "gordura", "Evolucao do percentual de gordura", "%");
    } else if (areasGraficos[0] && window.location.pathname.includes("historicoprofissional")) {
      areasGraficos[0].classList.add("has-chart");
      areasGraficos[0].innerHTML = criarGraficoHistoricoCombinado(avaliacoes);
    }
  }

  Object.assign(app, {
    criarGraficoLinha,
    criarGraficoHistoricoCombinado,
    renderizarGraficosEvolucao,
  });
})(window.MyPersonal = window.MyPersonal || {});
