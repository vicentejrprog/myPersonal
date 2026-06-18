/* ============================================================
   formularios-validacao.js
   Funcoes compartilhadas de validacao visual dos formularios.
   ============================================================ */
(function (app) {
  /* codigo para exibir ou limpar mensagem de erro em um campo */
  function definirErroCampo(campo, mensagem) {
    const grupoCampo = campo.closest(".input-group");
    let erro = grupoCampo?.querySelector(".error-message");
    campo.classList.toggle("is-invalid", Boolean(mensagem));
    grupoCampo?.classList.toggle("has-error", Boolean(mensagem));

    if (grupoCampo && !erro) {
      erro = document.createElement("span");
      erro.className = "error-message";
      grupoCampo.appendChild(erro);
    }

    if (erro) erro.textContent = mensagem || "";
  }

  /* codigo para validar texto obrigatorio */
  function validarTextoObrigatorio(id, mensagem) {
    const campo = document.getElementById(id);
    if (!campo) return true;

    const invalido = campo.value.trim() === "";
    definirErroCampo(campo, invalido ? mensagem : "");
    return !invalido;
  }

  /* codigo para validar e-mail */
  function validarCampoEmail(id, mensagem) {
    const campo = document.getElementById(id);
    if (!campo) return true;

    const valor = campo.value.trim();
    const invalido = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    definirErroCampo(campo, invalido ? mensagem : "");
    return !invalido;
  }

  Object.assign(app, {
    definirErroCampo,
    validarTextoObrigatorio,
    validarCampoEmail,
  });
})(window.MyPersonal = window.MyPersonal || {});
