/* ============================================================
   avaliacoes-tabelas.js
   Cards, tabelas e modal de detalhes das avaliacoes.
   ============================================================ */
(function (app) {
  const {
    buscarAvaliacoes,
    calcularImc,
    escaparHtml,
    formatarData,
    formatarMesAno,
    formatarTipoAvaliacao,
    numeroOuTraco,
    renderizarGraficosEvolucao,
  } = app;

  /* codigo para atualizar os cartoes principais de metricas */
  function atualizarCardsMetricas(valores) {
    const cartoes = document.querySelectorAll(".estatisticas-grid .metric-card");
    valores.forEach((valor, indice) => {
      const alvo = cartoes[indice]?.querySelector(".metric-value");
      if (alvo) alvo.textContent = valor;
    });
  }

  /* codigo da tabela de historico de avaliacoes */
  function renderizarTabelaHistorico(corpoTabela, avaliacoes, incluirAcoes) {
    if (!avaliacoes.length) {
      const colunas = incluirAcoes ? 7 : 5;
      corpoTabela.innerHTML = `<tr><td colspan="${colunas}" data-label="Registros">Nenhum registro encontrado para os filtros selecionados.</td></tr>`;
      return;
    }

    corpoTabela.innerHTML = avaliacoes.slice().reverse().map((avaliacao) => `
      <tr>
        <td data-label="Data">${incluirAcoes ? formatarData(avaliacao.data) : formatarMesAno(avaliacao.data)}</td>
        ${incluirAcoes ? `<td data-label="Tipo">${escaparHtml(formatarTipoAvaliacao(avaliacao.tipo))}</td>` : ""}
        <td data-label="Peso">${numeroOuTraco(avaliacao.peso, " kg")}</td>
        <td data-label="% Gordura">${numeroOuTraco(avaliacao.gordura, "%")}</td>
        <td data-label="IMC">${calcularImc(avaliacao)}</td>
        ${incluirAcoes ? `<td data-label="Massa magra">${numeroOuTraco(avaliacao.massaMagra, " kg")}</td>` : `<td data-label="Observacao">${escaparHtml(avaliacao.observacoes || "-")}</td>`}
        ${incluirAcoes ? `
          <td data-label="Acoes">
            <div class="historico-actions">
              <button class="btn btn-secondary btn-sm" type="button" data-view-avaliacao="${escaparHtml(avaliacao.id)}">Ver mais</button>
              <button class="btn btn-secondary btn-sm btn-delete-avaliacao" type="button" data-delete-avaliacao="${escaparHtml(avaliacao.id)}">Excluir</button>
            </div>
          </td>
        ` : ""}
      </tr>
    `).join("");
  }

  /* codigo para criar o modal de detalhes da avaliacao */
  function garantirModalDetalhe() {
    let modalDetalhe = document.getElementById("avaliacao-detail-modal");
    if (modalDetalhe) return modalDetalhe;

    modalDetalhe = document.createElement("div");
    modalDetalhe.className = "success-modal";
    modalDetalhe.id = "avaliacao-detail-modal";
    modalDetalhe.setAttribute("aria-hidden", "true");
    modalDetalhe.innerHTML = `
      <div class="avaliacao-detail-card" role="dialog" aria-modal="true" aria-labelledby="avaliacao-detail-title">
        <div class="avaliacao-detail-header">
          <div class="avaliacao-detail-icon">i</div>
          <div>
            <h2 id="avaliacao-detail-title">Detalhes da avaliacao</h2>
            <p>Resumo completo das medidas registradas.</p>
          </div>
        </div>
        <div id="avaliacao-detail-content" class="avaliacao-detail-content"></div>
        <div class="success-modal-actions avaliacao-detail-actions">
          <button class="btn btn-primary" type="button" data-close-detail>Fechar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalDetalhe);

    modalDetalhe.addEventListener("click", (evento) => {
      if (evento.target === modalDetalhe || evento.target.hasAttribute("data-close-detail")) {
        fecharModalDetalhe();
      }
    });

    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape" && modalDetalhe.classList.contains("is-open")) {
        fecharModalDetalhe();
      }
    });

    return modalDetalhe;
  }

  /* codigo do botao Ver mais para abrir os detalhes da avaliacao */
  function abrirModalDetalhe(avaliacao) {
    const modalDetalhe = garantirModalDetalhe();
    const conteudo = document.getElementById("avaliacao-detail-content");
    if (!conteudo) return;

    const fotos = Array.isArray(avaliacao.fotos) ? avaliacao.fotos : [];
    const blocoFotos = fotos.length
      ? `
        <div class="avaliacao-detail-notes">
          <span>Fotos do progresso</span>
          <div class="avaliacao-fotos-grid">
            ${fotos.map((foto) => `
              <div class="avaliacao-foto-item">
                <img src="${foto.dados}" alt="Foto ${escaparHtml(foto.tipo || "progresso")}">
                <span>${escaparHtml(foto.tipo || "Foto")}</span>
              </div>
            `).join("")}
          </div>
        </div>
      `
      : "";

    conteudo.innerHTML = `
      <div class="avaliacao-detail-grid">
        <div class="avaliacao-detail-item"><span>Data</span><strong>${formatarData(avaliacao.data)}</strong></div>
        <div class="avaliacao-detail-item"><span>Tipo</span><strong>${escaparHtml(formatarTipoAvaliacao(avaliacao.tipo))}</strong></div>
        <div class="avaliacao-detail-item"><span>Peso</span><strong>${numeroOuTraco(avaliacao.peso, " kg")}</strong></div>
        <div class="avaliacao-detail-item"><span>Altura</span><strong>${numeroOuTraco(avaliacao.altura, " cm")}</strong></div>
        <div class="avaliacao-detail-item"><span>% Gordura</span><strong>${numeroOuTraco(avaliacao.gordura, "%")}</strong></div>
        <div class="avaliacao-detail-item"><span>Massa magra</span><strong>${numeroOuTraco(avaliacao.massaMagra, " kg")}</strong></div>
        <div class="avaliacao-detail-item"><span>IMC</span><strong>${calcularImc(avaliacao)}</strong></div>
        <div class="avaliacao-detail-item"><span>Cintura</span><strong>${numeroOuTraco(avaliacao.cintura, " cm")}</strong></div>
        <div class="avaliacao-detail-item"><span>Quadril</span><strong>${numeroOuTraco(avaliacao.quadril, " cm")}</strong></div>
      </div>
      <div class="avaliacao-detail-notes">
        <span>Observacoes</span>
        <p>${escaparHtml(avaliacao.observacoes || "Sem observacoes registradas.")}</p>
      </div>
      ${blocoFotos}
    `;

    modalDetalhe.classList.add("is-open");
    modalDetalhe.setAttribute("aria-hidden", "false");
    modalDetalhe.querySelector("[data-close-detail]")?.focus();
  }

  /* codigo para fechar o modal de detalhes */
  function fecharModalDetalhe() {
    const modalDetalhe = document.getElementById("avaliacao-detail-modal");
    if (!modalDetalhe) return;
    modalDetalhe.classList.remove("is-open");
    modalDetalhe.setAttribute("aria-hidden", "true");
  }

  /* codigo para atualizar a data da ultima avaliacao na tela */
  function atualizarDataUltima(ultima) {
    const dataUltima = document.querySelector(".data-ultima-avaliacao");
    if (dataUltima && ultima) {
      dataUltima.textContent = `Ultima avaliacao: ${formatarData(ultima.data)}`;
    }
  }

  /* codigo para limpar dados estaticos quando o aluno ainda nao tem avaliacoes */
  function renderizarEstadoSemAvaliacoes() {
    atualizarCardsMetricas(["-", "-", "-", "-"]);
    atualizarDataUltima(null);

    const dataUltima = document.querySelector(".data-ultima-avaliacao");
    if (dataUltima) dataUltima.textContent = "Nenhuma avaliacao cadastrada para este aluno.";

    const corpoTabela = document.querySelector(".tabela-avaliacoes tbody");
    if (corpoTabela) renderizarTabelaHistorico(corpoTabela, [], false);

    renderizarGraficosEvolucao(document, []);
  }

  /* codigo da tela de estatisticas do aluno */
  function renderizarEstatisticaAluno() {
    if (!document.body.dataset.profile || document.body.dataset.profile !== "aluno") return;
    if (!document.querySelector(".tabela-avaliacoes")) return;

    const avaliacoes = buscarAvaliacoes();
    const ultima = avaliacoes[avaliacoes.length - 1] || null;
    if (!ultima) {
      renderizarEstadoSemAvaliacoes();
      return;
    }

    atualizarCardsMetricas([
      numeroOuTraco(ultima.peso, " kg"),
      numeroOuTraco(ultima.gordura, "%"),
      numeroOuTraco(ultima.massaMagra, " kg"),
      "14",
    ]);

    atualizarDataUltima(ultima);

    const corpoTabela = document.querySelector(".tabela-avaliacoes tbody");
    if (corpoTabela) renderizarTabelaHistorico(corpoTabela, avaliacoes, false);
    renderizarGraficosEvolucao(document, avaliacoes);
  }

  /* codigo da tela de estatisticas vista pelo profissional */
  function renderizarEstatisticaProfissional() {
    if (!document.body.dataset.activePage || document.body.dataset.activePage !== "alunos") return;
    if (!document.querySelector(".estatisticas-grid")) return;
    if (!window.location.pathname.includes("estatisticaprofissional")) return;

    const avaliacoes = buscarAvaliacoes();
    const ultima = avaliacoes[avaliacoes.length - 1] || null;
    if (!ultima) {
      renderizarEstadoSemAvaliacoes();
      return;
    }

    atualizarCardsMetricas([
      numeroOuTraco(ultima.peso, " kg"),
      numeroOuTraco(ultima.gordura, "%"),
      numeroOuTraco(ultima.massaMagra, " kg"),
      calcularImc(ultima),
    ]);

    atualizarDataUltima(ultima);

    const corpoTabela = document.querySelector(".tabela-avaliacoes tbody");
    if (corpoTabela) renderizarTabelaHistorico(corpoTabela, avaliacoes, false);
    renderizarGraficosEvolucao(document, avaliacoes);
  }

  Object.assign(app, {
    atualizarCardsMetricas,
    renderizarTabelaHistorico,
    abrirModalDetalhe,
    fecharModalDetalhe,
    atualizarDataUltima,
    renderizarEstadoSemAvaliacoes,
    renderizarEstatisticaAluno,
    renderizarEstatisticaProfissional,
  });
})(window.MyPersonal = window.MyPersonal || {});
