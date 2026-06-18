/* ============================================================
   aluno-contexto.js
   Funcoes compartilhadas para manter o mesmo ID de aluno em
   dieta, treino, estatisticas, compromissos e perfil.
   ============================================================ */
(function (global) {
  const USERS_KEY = 'mypersonal:usuarios';
  const LOGGED_USER_KEY = 'mypersonal:usuarioLogado';
  const SELECTED_STUDENT_SESSION_KEY = 'alunoSelecionado';
  const SELECTED_STUDENT_ID_KEY = 'mypersonal:alunoSelecionadoId';

  const ALUNO_PADRAO = {
    id: 'aluno-eliabe-monteiro',
    nome: 'Eliabe Monteiro',
    email: 'eliabe@email.com',
    telefone: '(11) 99999-0001',
    peso: '82',
    altura: '178',
    gordura: '18',
    objetivo: 'Hipertrofia',
    tipo: 'aluno',
    perfil: 'aluno',
    status: 'ativo',
  };

  function lerJsonLocal(chave, fallback) {
    try {
      const valor = localStorage.getItem(chave);
      return valor ? JSON.parse(valor) : fallback;
    } catch (erro) {
      return fallback;
    }
  }

  function salvarJsonLocal(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
  }

  function normalizarEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  function slugify(valor) {
    return String(valor || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'aluno';
  }

  function getUsuarios() {
    const dados = lerJsonLocal(USERS_KEY, {});
    if (!dados || typeof dados !== 'object') return {};

    if (Array.isArray(dados)) {
      const convertidos = {};
      dados.forEach((usuario) => {
        const id = usuario.id || `usuario-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        convertidos[id] = { ...usuario, id };
      });
      salvarUsuarios(convertidos);
      return convertidos;
    }

    return dados;
  }

  function salvarUsuarios(usuarios) {
    if (typeof global.salvarUsuarios === 'function') {
      global.salvarUsuarios(usuarios);
      return;
    }

    salvarJsonLocal(USERS_KEY, usuarios);
  }

  function getUsuarioLogado() {
    if (typeof global.getUsuarioLogado === 'function') {
      return global.getUsuarioLogado();
    }

    return lerJsonLocal(LOGGED_USER_KEY, null);
  }

  function isAluno(usuario) {
    return usuario && (usuario.tipo === 'aluno' || usuario.perfil === 'aluno');
  }

  function isProfissional(usuario) {
    return usuario && (usuario.tipo === 'profissional' || (usuario.perfil && usuario.perfil !== 'aluno'));
  }

  function limparNomeDuplicado(texto) {
    const partes = String(texto || '').trim().split(/\s+/).filter(Boolean);
    const limpas = [];

    partes.forEach((parte) => {
      const anterior = limpas[limpas.length - 1] || '';
      if (anterior.toLowerCase() !== parte.toLowerCase()) {
        limpas.push(parte);
      }
    });

    return limpas.join(' ');
  }

  function montarNomeCompleto(dados) {
    if (!dados) return '';

    const nomeBase = limparNomeDuplicado(dados.nome || dados.name || '');
    const sobrenome = limparNomeDuplicado(dados.sobrenome || '');

    if (!nomeBase) return sobrenome;
    if (!sobrenome) return nomeBase;

    const nomeLower = nomeBase.toLowerCase();
    const sobrenomeLower = sobrenome.toLowerCase();

    // Quando `nome` ja contem o nome completo, nao concatena o sobrenome de novo.
    // Isso evita casos como "Sarah Isabely Isabely Isabely" no perfil.
    if (nomeBase.split(/\s+/).length > 1 || nomeLower.endsWith(' ' + sobrenomeLower) || nomeLower === sobrenomeLower) {
      return nomeBase;
    }

    return `${nomeBase} ${sobrenome}`.trim();
  }

  function dividirNome(nomeCompleto) {
    const partes = String(nomeCompleto || '').trim().split(/\s+/).filter(Boolean);
    return {
      nome: partes[0] || '',
      sobrenome: partes.slice(1).join(' '),
    };
  }

  function encontrarAlunoExistente(dados, usuarios = getUsuarios()) {
    const id = dados?.id || dados?.alunoId;
    if (id && usuarios[id]) return usuarios[id];

    const email = normalizarEmail(dados?.email);
    if (email) {
      const porEmail = Object.values(usuarios).find((usuario) => normalizarEmail(usuario.email) === email);
      if (porEmail) return porEmail;
    }

    const nome = slugify(montarNomeCompleto(dados));
    if (nome) {
      const porNome = Object.values(usuarios).find((usuario) => slugify(montarNomeCompleto(usuario)) === nome);
      if (porNome) return porNome;
    }

    return null;
  }

  function gerarIdAluno(dados) {
    const email = normalizarEmail(dados?.email);
    if (email && !email.endsWith('@aluno.local')) return `aluno-${slugify(email.split('@')[0])}`;
    return `aluno-${slugify(montarNomeCompleto(dados) || dados?.nome || 'novo')}`;
  }

  function getProfissionalIdAtual() {
    const logado = getUsuarioLogado();
    if (isProfissional(logado) && logado.id) return logado.id;
    return localStorage.getItem('mypersonal:profissionalAtualId') || 'profissional-demo';
  }

  function normalizarAluno(dados = {}) {
    const nomeCompleto = montarNomeCompleto(dados) || dados.email || ALUNO_PADRAO.nome;
    const partes = dividirNome(nomeCompleto);

    return {
      ...dados,
      id: dados.id || dados.alunoId || gerarIdAluno({ ...dados, nome: nomeCompleto }),
      alunoId: dados.id || dados.alunoId || gerarIdAluno({ ...dados, nome: nomeCompleto }),
      nome: nomeCompleto,
      primeiroNome: partes.nome,
      sobrenome: partes.sobrenome,
      email: normalizarEmail(dados.email),
      telefone: dados.telefone || dados.tel || '',
      tel: dados.tel || dados.telefone || '',
      nascimento: dados.nascimento || dados.nasc || '',
      nasc: dados.nasc || dados.nascimento || '',
      tipo: 'aluno',
      perfil: 'aluno',
      status: dados.status || 'ativo',
    };
  }

  function salvarAlunoEmUsuarios(dados = {}) {
    const usuarios = getUsuarios();
    const existente = encontrarAlunoExistente(dados, usuarios);
    const id = existente?.id || dados.id || dados.alunoId || gerarIdAluno(dados);
    const profissionalId = dados.profissionalId || existente?.profissionalId || getProfissionalIdAtual();
    const aluno = normalizarAluno({
      ...existente,
      ...dados,
      id,
      alunoId: id,
      profissionalId,
    });

    usuarios[id] = {
      ...existente,
      ...aluno,
      id,
      alunoId: id,
      senha: dados.senha || existente?.senha || '123456',
      profissionalId,
    };

    salvarUsuarios(usuarios);
    return usuarios[id];
  }

  function setAlunoSelecionado(dados = {}) {
    const aluno = salvarAlunoEmUsuarios(dados);
    sessionStorage.setItem(SELECTED_STUDENT_SESSION_KEY, JSON.stringify(aluno));
    localStorage.setItem(SELECTED_STUDENT_ID_KEY, aluno.id);
    return aluno;
  }

  function buscarAlunoPorId(id) {
    if (!id) return null;
    const usuarios = getUsuarios();
    return usuarios[id] || Object.values(usuarios).find((usuario) => usuario.alunoId === id) || null;
  }

  function buscarAlunoSelecionado() {
    const idSelecionado = localStorage.getItem(SELECTED_STUDENT_ID_KEY);
    const porId = buscarAlunoPorId(idSelecionado);
    if (porId) return normalizarAluno(porId);

    try {
      const dados = JSON.parse(sessionStorage.getItem(SELECTED_STUDENT_SESSION_KEY));
      if (dados && (dados.id || dados.alunoId || dados.nome || dados.email)) {
        return normalizarAluno(salvarAlunoEmUsuarios(dados));
      }
    } catch (erro) {}

    return null;
  }

  function buscarAlunoLogado() {
    const logado = getUsuarioLogado();
    if (!isAluno(logado)) return null;

    const usuarioCompleto = buscarAlunoPorId(logado.id) || logado;
    return normalizarAluno(usuarioCompleto);
  }

  function buscarAlunoAtual(opcoes = {}) {
    const preferirUsuarioLogado = Boolean(opcoes.preferirUsuarioLogado);

    if (preferirUsuarioLogado) {
      const alunoLogado = buscarAlunoLogado();
      if (alunoLogado) return alunoLogado;
    }

    const alunoSelecionado = buscarAlunoSelecionado();
    if (alunoSelecionado) return alunoSelecionado;

    const alunoLogado = buscarAlunoLogado();
    if (alunoLogado) return alunoLogado;

    return { ...ALUNO_PADRAO };
  }

  function buscarAlunoIdAtual(opcoes = {}) {
    return buscarAlunoAtual(opcoes).id || ALUNO_PADRAO.id;
  }

  function gerarAliasesAluno(alunoOuId) {
    const aluno = typeof alunoOuId === 'string' ? buscarAlunoPorId(alunoOuId) || { id: alunoOuId } : alunoOuId;
    const aliases = new Set();

    if (typeof alunoOuId === 'string') aliases.add(alunoOuId);
    if (aluno?.id) aliases.add(aluno.id);
    if (aluno?.alunoId) aliases.add(aluno.alunoId);
    if (aluno?.email) aliases.add(`aluno-${slugify(String(aluno.email).split('@')[0])}`);

    const nomeCompleto = montarNomeCompleto(aluno);
    if (nomeCompleto) {
      const slug = slugify(nomeCompleto);
      aliases.add(slug);
      aliases.add(`aluno-${slug}`);
      if (slug.includes('eliabe')) aliases.add('eliabe');
      if (slug.includes('lucas')) aliases.add('lucas-rodrigues');
    }

    return Array.from(aliases).filter(Boolean);
  }

  function listarAlunosDoProfissional(profissionalId = getProfissionalIdAtual(), opcoes = {}) {
    const usuarios = getUsuarios();
    const vincularSemProfissional = opcoes.vincularSemProfissional !== false;
    const incluirInativos = Boolean(opcoes.incluirInativos);
    let alterou = false;

    const alunos = Object.values(usuarios).filter(isAluno).filter((aluno) => {
      if (!incluirInativos && aluno.status === 'inativo') return false;
      if (aluno.profissionalId === profissionalId) return true;
      if (!aluno.profissionalId && vincularSemProfissional) {
        usuarios[aluno.id] = { ...aluno, profissionalId };
        alterou = true;
        return true;
      }
      return false;
    });

    if (alterou) salvarUsuarios(usuarios);
    return alunos.map(normalizarAluno);
  }

  function atualizarUsuario(id, alteracoes = {}) {
    const usuarios = getUsuarios();
    const atual = buscarAlunoPorId(id) || usuarios[id];
    if (!atual) return null;

    const chave = atual.id || id;
    usuarios[chave] = {
      ...atual,
      ...alteracoes,
      id: chave,
      alunoId: alteracoes.alunoId || atual.alunoId || chave,
    };

    salvarUsuarios(usuarios);

    const selecionadoId = localStorage.getItem(SELECTED_STUDENT_ID_KEY);
    if (selecionadoId === chave || selecionadoId === atual.alunoId) {
      sessionStorage.setItem(SELECTED_STUDENT_SESSION_KEY, JSON.stringify(usuarios[chave]));
    }

    return usuarios[chave];
  }

  function inativarAluno(id) {
    const atualizado = atualizarUsuario(id, { status: 'inativo', inativadoEm: new Date().toISOString() });
    if (!atualizado) return null;

    const selecionadoId = localStorage.getItem(SELECTED_STUDENT_ID_KEY);
    if (selecionadoId === atualizado.id || selecionadoId === atualizado.alunoId) {
      sessionStorage.removeItem(SELECTED_STUDENT_SESSION_KEY);
      localStorage.removeItem(SELECTED_STUDENT_ID_KEY);
    }

    return atualizado;
  }

  global.AlunoContexto = {
    USERS_KEY,
    LOGGED_USER_KEY,
    SELECTED_STUDENT_SESSION_KEY,
    SELECTED_STUDENT_ID_KEY,
    ALUNO_PADRAO,
    lerJsonLocal,
    salvarJsonLocal,
    normalizarEmail,
    slugify,
    getUsuarios,
    salvarUsuarios,
    getUsuarioLogado,
    isAluno,
    isProfissional,
    limparNomeDuplicado,
    montarNomeCompleto,
    dividirNome,
    gerarIdAluno,
    salvarAlunoEmUsuarios,
    setAlunoSelecionado,
    buscarAlunoPorId,
    buscarAlunoSelecionado,
    buscarAlunoLogado,
    buscarAlunoAtual,
    buscarAlunoIdAtual,
    gerarAliasesAluno,
    listarAlunosDoProfissional,
    atualizarUsuario,
    inativarAluno,
    getProfissionalIdAtual,
  };
})(window);
