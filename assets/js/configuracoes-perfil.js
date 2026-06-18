/* ============================================================
   configuracoes-perfil.js
   Carrega, valida e salva configuracoes conforme o perfil da pagina.
   ============================================================ */
(function (app) {
  const {
    buscarConfigAluno,
    buscarConfigProfissional,
    salvarConfigAluno,
    salvarConfigProfissional,
    validarCampoEmail,
    validarTextoObrigatorio,
  } = app;

  const CONFIGURACOES_POR_PERFIL = {
    aluno: {
      idPadrao: "eliabe",
      buscar: buscarConfigAluno,
      salvar: salvarConfigAluno,
      rota: "/aluno/configuracoes",
    },
    profissional: {
      idPadrao: "pierre",
      buscar: buscarConfigProfissional,
      salvar: salvarConfigProfissional,
      rota: "/profissional/configuracoes",
    },
  };

  function detectarConfigPerfil() {
    const caminho = window.location.pathname;
    if (caminho.includes(CONFIGURACOES_POR_PERFIL.aluno.rota)) return CONFIGURACOES_POR_PERFIL.aluno;
    if (caminho.includes(CONFIGURACOES_POR_PERFIL.profissional.rota)) return CONFIGURACOES_POR_PERFIL.profissional;
    return null;
  }

  /* codigo de validacao das configuracoes do perfil */
  function validarConfiguracoesPerfil() {
    const validacoes = [
      validarTextoObrigatorio("nome", "Informe o nome."),
      validarTextoObrigatorio("sobrenome", "Informe o sobrenome."),
      validarCampoEmail("email", "Informe um e-mail valido."),
      validarTextoObrigatorio("telefone", "Informe o telefone."),
      validarTextoObrigatorio("cidade", "Informe a cidade."),
    ];

    const valido = validacoes.every(Boolean);
    if (!valido) {
      document.querySelector(".configuracoes-page .is-invalid")?.focus();
    }

    return valido;
  }

  function preencherCampos(configuracao) {
    const mapaCampos = {
      nome: configuracao.nome,
      sobrenome: configuracao.sobrenome,
      email: configuracao.email,
      telefone: configuracao.telefone,
      cidade: configuracao.cidade,
    };

    Object.entries(mapaCampos).forEach(([id, valor]) => {
      const campo = document.getElementById(id);
      if (campo) campo.value = valor || "";
    });
  }

  function aplicarPreferencias(configuracao, preferencias) {
    if (preferencias[0]) preferencias[0].checked = Boolean(configuracao.preferencias?.email);
    if (preferencias[1]) preferencias[1].checked = Boolean(configuracao.preferencias?.agenda);
    if (preferencias[2]) preferencias[2].checked = Boolean(configuracao.preferencias?.mensagens);
  }

  function montarConfiguracao(idPadrao, preferencias) {
    return {
      id: idPadrao,
      nome: document.getElementById("nome")?.value || "",
      sobrenome: document.getElementById("sobrenome")?.value || "",
      email: document.getElementById("email")?.value || "",
      telefone: document.getElementById("telefone")?.value || "",
      cidade: document.getElementById("cidade")?.value || "",
      preferencias: {
        email: Boolean(preferencias[0]?.checked),
        agenda: Boolean(preferencias[1]?.checked),
        mensagens: Boolean(preferencias[2]?.checked),
      },
    };
  }

  function lerJsonSeguroConfig(chave, fallback) {
    try {
      const valor = localStorage.getItem(chave);
      return valor ? JSON.parse(valor) : fallback;
    } catch (erro) {
      return fallback;
    }
  }

  function salvarJsonSeguroConfig(chave, valor) {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch (erro) {}
  }

  function dividirNomeCompletoConfig(nomeCompleto) {
    const partes = String(nomeCompleto || "").trim().split(/\s+/).filter(Boolean);
    return {
      nome: partes[0] || "",
      sobrenome: partes.slice(1).join(" "),
    };
  }

  function paginaConfigAluno(configPerfil) {
    return configPerfil === CONFIGURACOES_POR_PERFIL.aluno;
  }

  function usuarioCombinaComPagina(usuario, configPerfil) {
    if (!usuario) return false;
    const isAluno = usuario.tipo === "aluno" || usuario.perfil === "aluno";
    const isProfissional = usuario.tipo === "profissional" || (usuario.perfil && usuario.perfil !== "aluno");
    return paginaConfigAluno(configPerfil) ? isAluno : isProfissional;
  }

  function buscarUsuarioLogadoConfig(configPerfil) {
    const usuario = lerJsonSeguroConfig("mypersonal:usuarioLogado", null);
    return usuarioCombinaComPagina(usuario, configPerfil) ? usuario : null;
  }

  function montarConfiguracaoInicial(configPerfil) {
    const configuracao = configPerfil.buscar();
    const usuario = buscarUsuarioLogadoConfig(configPerfil);
    if (!usuario) return configuracao;

    const nomeCompleto = usuario.nome || `${configuracao.nome || ""} ${configuracao.sobrenome || ""}`.trim();
    const partes = dividirNomeCompletoConfig(nomeCompleto);

    return {
      ...configuracao,
      id: usuario.id || configuracao.id,
      nome: partes.nome || configuracao.nome || "",
      sobrenome: partes.sobrenome || configuracao.sobrenome || "",
      email: usuario.email || configuracao.email || "",
      telefone: usuario.telefone || usuario.tel || configuracao.telefone || "",
      cidade: usuario.cidade || configuracao.cidade || "",
    };
  }


  function limparErrosSenha() {
    ["senha-atual", "nova-senha", "confirmar-senha"].forEach((id) => {
      const campo = document.getElementById(id);
      if (!campo) return;
      campo.classList.remove("is-invalid");
      const grupo = campo.closest(".input-group");
      if (grupo) grupo.classList.remove("has-error");
    });
  }

  function marcarErroSenha(id, mensagem) {
    const campo = document.getElementById(id);
    if (!campo) return;
    campo.classList.add("is-invalid");
    const grupo = campo.closest(".input-group");
    if (grupo) grupo.classList.add("has-error");
    alert(mensagem);
    campo.focus();
  }

  function salvarNovaSenhaLocalStorage(configPerfil) {
    limparErrosSenha();

    const senhaAtual = document.getElementById("senha-atual")?.value || "";
    const novaSenha = document.getElementById("nova-senha")?.value || "";
    const confirmarSenha = document.getElementById("confirmar-senha")?.value || "";
    const usuarioLogado = buscarUsuarioLogadoConfig(configPerfil);
    const usuarios = lerJsonSeguroConfig("mypersonal:usuarios", {});
    const id = usuarioLogado?.id;
    const usuario = id && usuarios && typeof usuarios === "object" ? usuarios[id] : null;

    if (!usuario) {
      marcarErroSenha("senha-atual", "Nao foi possivel identificar o usuario logado.");
      return false;
    }

    if (!senhaAtual) {
      marcarErroSenha("senha-atual", "Informe a senha atual.");
      return false;
    }

    if (usuario.senha && usuario.senha !== senhaAtual) {
      marcarErroSenha("senha-atual", "A senha atual esta incorreta.");
      return false;
    }

    if (novaSenha.length < 4) {
      marcarErroSenha("nova-senha", "A nova senha deve ter pelo menos 4 caracteres.");
      return false;
    }

    if (novaSenha !== confirmarSenha) {
      marcarErroSenha("confirmar-senha", "A confirmacao da senha nao confere.");
      return false;
    }

    usuarios[id] = {
      ...usuario,
      senha: novaSenha,
    };

    salvarJsonSeguroConfig("mypersonal:usuarios", usuarios);

    ["senha-atual", "nova-senha", "confirmar-senha"].forEach((idCampo) => {
      const campo = document.getElementById(idCampo);
      if (campo) campo.value = "";
    });

    return true;
  }

  function sincronizarConfiguracaoComUsuario(configuracao, configPerfil) {
    const usuarioLogado = buscarUsuarioLogadoConfig(configPerfil);
    const usuarios = lerJsonSeguroConfig("mypersonal:usuarios", {});
    const id = usuarioLogado?.id || configuracao.id;
    const nomeCompleto = `${configuracao.nome || ""} ${configuracao.sobrenome || ""}`.trim();

    if (id && usuarios && typeof usuarios === "object" && !Array.isArray(usuarios) && usuarios[id]) {
      usuarios[id] = {
        ...usuarios[id],
        nome: nomeCompleto || usuarios[id].nome || "",
        email: configuracao.email || usuarios[id].email || "",
        telefone: configuracao.telefone || usuarios[id].telefone || "",
        tel: configuracao.telefone || usuarios[id].tel || "",
        cidade: configuracao.cidade || usuarios[id].cidade || "",
      };
      salvarJsonSeguroConfig("mypersonal:usuarios", usuarios);
    }

    if (usuarioLogado) {
      salvarJsonSeguroConfig("mypersonal:usuarioLogado", {
        ...usuarioLogado,
        nome: nomeCompleto || usuarioLogado.nome || "",
        email: configuracao.email || usuarioLogado.email || "",
        telefone: configuracao.telefone || usuarioLogado.telefone || "",
        tel: configuracao.telefone || usuarioLogado.tel || "",
        cidade: configuracao.cidade || usuarioLogado.cidade || "",
      });
    }
  }

  /* codigo para carregar e salvar configuracoes conforme o perfil */
  function configurarConfiguracoesPerfil() {
    const configPerfil = detectarConfigPerfil();
    if (!configPerfil || !configPerfil.buscar || !configPerfil.salvar) return;

    const configuracao = montarConfiguracaoInicial(configPerfil);
    const preferencias = document.querySelectorAll(".preferencia-item input[type='checkbox']");
    preencherCampos(configuracao);
    aplicarPreferencias(configuracao, preferencias);

    const botoesConfiguracoes = Array.from(document.querySelectorAll("[data-open-settings-modal]"));
    const botaoSalvar = botoesConfiguracoes.find((botao) => {
      return (botao.dataset.modalTitle || "").toLowerCase().includes("configura");
    });

    if (botaoSalvar) {
      botaoSalvar.addEventListener("click", (evento) => {
        if (!validarConfiguracoesPerfil()) {
          evento.stopImmediatePropagation();
          return;
        }

        const novaConfiguracao = montarConfiguracao(configuracao.id || configPerfil.idPadrao, preferencias);
        configPerfil.salvar(novaConfiguracao);
        sincronizarConfiguracaoComUsuario(novaConfiguracao, configPerfil);
      }, true);
    }

    const botaoSenha = botoesConfiguracoes.find((botao) => {
      return (botao.dataset.modalTitle || "").toLowerCase().includes("senha");
    });

    if (botaoSenha) {
      botaoSenha.addEventListener("click", (evento) => {
        if (!salvarNovaSenhaLocalStorage(configPerfil)) {
          evento.stopImmediatePropagation();
        }
      }, true);
    }
  }

  Object.assign(app, {
    validarConfiguracoesPerfil,
    configurarConfiguracoesPerfil,
  });
})(window.MyPersonal = window.MyPersonal || {});
