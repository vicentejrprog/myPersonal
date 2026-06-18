/* ============================================================
   auth-storage.js — Persistência simples de usuários
   Projeto acadêmico front-end (sem back-end).

   Estrutura:
   localStorage["mypersonal:usuarios"] = {
     "usuario-id": {
       id,
       nome,
       email,
       senha,
       tipo,
       perfil
     }
   }

   Observação: senha em texto puro — NÃO use este padrão em produção.
   ============================================================ */

const USERS_KEY = "mypersonal:usuarios";
const LOGGED_USER_KEY = "mypersonal:usuarioLogado";

function gerarIdUsuario() {
  return `usuario-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizarEmail(email) {
  return (email || "").trim().toLowerCase();
}

function getUsuarios() {
  try {
    const dados = JSON.parse(localStorage.getItem(USERS_KEY));

    if (!dados) {
      return {};
    }

    // Migração automática: se já existir usuário no formato antigo de array,
    // converte para objeto sem perder os cadastros existentes.
    if (Array.isArray(dados)) {
      const usuariosConvertidos = {};

      dados.forEach((usuario) => {
        const id = usuario.id || gerarIdUsuario();

        usuariosConvertidos[id] = {
          id,
          nome: usuario.nome || "",
          email: normalizarEmail(usuario.email),
          senha: usuario.senha || "",
          tipo: usuario.tipo || "",
          perfil: usuario.perfil || "",
        };
      });

      salvarUsuarios(usuariosConvertidos);
      return usuariosConvertidos;
    }

    return dados;
  } catch (err) {
    return {};
  }
}

function salvarUsuarios(usuarios) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
  } catch (err) {
    // localStorage indisponível (ex.: navegação privada): ignora
  }
}

function encontrarUsuario(email) {
  const alvo = normalizarEmail(email);

  return (
    Object.values(getUsuarios()).find((usuario) => {
      return normalizarEmail(usuario.email) === alvo;
    }) || null
  );
}

/* Retorna { ok: true, usuario } ou { ok: false, erro: "..." } */
function cadastrarUsuario(usuario) {
  if (encontrarUsuario(usuario.email)) {
    return { ok: false, erro: "Este e-mail já está cadastrado." };
  }

  const usuarios = getUsuarios();
  const id = usuario.id || gerarIdUsuario();

  usuarios[id] = {
    id,
    nome: usuario.nome || "",
    email: normalizarEmail(usuario.email),
    senha: usuario.senha || "",
    tipo: usuario.tipo || "",
    perfil: usuario.perfil || "",
  };

  salvarUsuarios(usuarios);

  return { ok: true, usuario: usuarios[id] };
}

function salvarUsuarioLogado(usuario) {
  const usuarioLogado = {
    id: usuario.id,
    nome: usuario.nome || "",
    email: normalizarEmail(usuario.email),
    tipo: usuario.tipo || "",
    perfil: usuario.perfil || "",
  };

  localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(usuarioLogado));
  return usuarioLogado;
}

function getUsuarioLogado() {
  try {
    return JSON.parse(localStorage.getItem(LOGGED_USER_KEY)) || null;
  } catch (err) {
    return null;
  }
}

function limparUsuarioLogado() {
  localStorage.removeItem(LOGGED_USER_KEY);
}

function tipoPorPerfil(perfil) {
  return perfil === "aluno" ? "aluno" : "profissional";
}

function atualizarPerfilUsuarioLogado(perfil) {
  const usuarioLogado = getUsuarioLogado();

  if (!usuarioLogado || !usuarioLogado.id) {
    return {
      ok: false,
      erro: "Nenhum usuário logado encontrado.",
    };
  }

  const tipo = tipoPorPerfil(perfil);
  const usuarioAtualizado = {
    ...usuarioLogado,
    tipo,
    perfil,
  };

  localStorage.setItem(LOGGED_USER_KEY, JSON.stringify(usuarioAtualizado));
  localStorage.setItem("mypersonal:perfil", perfil);

  const usuarios = getUsuarios();

  if (usuarios[usuarioLogado.id]) {
    usuarios[usuarioLogado.id] = {
      ...usuarios[usuarioLogado.id],
      tipo,
      perfil,
    };
  } else {
    const usuarioEncontrado = Object.values(usuarios).find((usuario) => {
      return normalizarEmail(usuario.email) === normalizarEmail(usuarioLogado.email);
    });

    if (usuarioEncontrado && usuarioEncontrado.id) {
      usuarios[usuarioEncontrado.id] = {
        ...usuarios[usuarioEncontrado.id],
        tipo,
        perfil,
      };
    }
  }

  salvarUsuarios(usuarios);

  return {
    ok: true,
    usuario: usuarioAtualizado,
  };
}

/* Cria uma conta de demonstração na 1ª execução — pode remover.
   Garante que o login funcione mesmo antes de qualquer cadastro. */
function seedDemo() {
  const usuarios = getUsuarios();

  if (Object.keys(usuarios).length === 0) {
    usuarios["usuario-demo"] = {
      id: "usuario-demo",
      nome: "Usuário Demo",
      email: "demo@mypersonal.com",
      senha: "123456",
      tipo: "",
      perfil: "",
    };

    salvarUsuarios(usuarios);
  }
}

window.getUsuarios = getUsuarios;
window.salvarUsuarios = salvarUsuarios;
window.encontrarUsuario = encontrarUsuario;
window.cadastrarUsuario = cadastrarUsuario;
window.salvarUsuarioLogado = salvarUsuarioLogado;
window.getUsuarioLogado = getUsuarioLogado;
window.limparUsuarioLogado = limparUsuarioLogado;
window.tipoPorPerfil = tipoPorPerfil;
window.atualizarPerfilUsuarioLogado = atualizarPerfilUsuarioLogado;
window.seedDemo = seedDemo;
