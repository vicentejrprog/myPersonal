/* ============================================================
   aluno-estatisticas-config.js
   Inicializa as telas que usam avaliacoes e configuracoes.
   ============================================================ */
(function (app) {
  /* codigo que inicia todas as funcoes quando a pagina termina de carregar */
  document.addEventListener("DOMContentLoaded", () => {
    app.garantirDadosIniciais?.();
    app.atualizarContextoAlunoNaTela?.();
    app.configurarNovaAvaliacao?.();
    app.configurarConfiguracoesPerfil?.();
    app.renderizarEstatisticaAluno?.();
    app.renderizarEstatisticaProfissional?.();
    app.renderizarHistoricoProfissional?.();
  });
})(window.MyPersonal = window.MyPersonal || {});
