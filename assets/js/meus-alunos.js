function gerarIdAlunoLocal() {
  return 'aluno-' + Date.now() + '-' + Math.random().toString(16).slice(2);
}

function normalizarEmailAluno(email) {
  return (email || '').trim().toLowerCase();
}

function slugAluno(texto) {
  return (texto || 'aluno')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '') || 'aluno';
}

function getUsuariosAlunosStore() {
  if (typeof getUsuarios === 'function') {
    return getUsuarios();
  }

  try {
    var dados = JSON.parse(localStorage.getItem('mypersonal:usuarios'));
    return dados && typeof dados === 'object' && !Array.isArray(dados) ? dados : {};
  } catch (err) {
    return {};
  }
}


function encontrarUsuarioPorEmailAluno(email) {
  var alvo = normalizarEmailAluno(email);
  if (!alvo) return null;

  return Object.values(getUsuariosAlunosStore()).find(function(usuario) {
    return normalizarEmailAluno(usuario.email) === alvo;
  }) || null;
}

function salvarUsuariosAlunosStore(usuarios) {
  if (typeof salvarUsuarios === 'function') {
    salvarUsuarios(usuarios);
    return;
  }

  try {
    localStorage.setItem('mypersonal:usuarios', JSON.stringify(usuarios));
  } catch (err) {}
}

function getProfissionalLogadoIdAlunos() {
  if (window.AlunoContexto && typeof window.AlunoContexto.getProfissionalIdAtual === 'function') {
    return window.AlunoContexto.getProfissionalIdAtual();
  }

  try {
    var usuarioLogado = JSON.parse(localStorage.getItem('mypersonal:usuarioLogado'));
    if (usuarioLogado && usuarioLogado.id) return usuarioLogado.id;
  } catch (err) {}

  return 'profissional-demo';
}

function salvarAlunoNoLocalStorage(dados) {
  if (window.AlunoContexto && typeof window.AlunoContexto.salvarAlunoEmUsuarios === 'function') {
    return window.AlunoContexto.salvarAlunoEmUsuarios({
      ...dados,
      profissionalId: dados.profissionalId || getProfissionalLogadoIdAlunos(),
    });
  }

  var usuarios = getUsuariosAlunosStore();
  var email = normalizarEmailAluno(dados.email) || (slugAluno(dados.nome) + '@aluno.local');
  var idExistente = Object.keys(usuarios).find(function(id) {
    return normalizarEmailAluno(usuarios[id].email) === email;
  });
  var id = dados.id || dados.alunoId || idExistente || gerarIdAlunoLocal();

  usuarios[id] = {
    id: id,
    alunoId: id,
    nome: dados.nome || '',
    email: email,
    senha: dados.senha || (usuarios[id] && usuarios[id].senha ? usuarios[id].senha : '123456'),
    tipo: 'aluno',
    perfil: 'aluno',
    telefone: dados.tel || dados.telefone || '',
    tel: dados.tel || dados.telefone || '',
    nascimento: dados.nasc || dados.nascimento || '',
    nasc: dados.nasc || dados.nascimento || '',
    sexo: dados.sexo || '',
    cidade: dados.cidade || '',
    peso: dados.peso || '',
    altura: dados.altura || '',
    gordura: dados.gordura || '',
    objetivo: dados.objetivo || '',
    status: dados.status || 'ativo',
    profissionalId: dados.profissionalId || getProfissionalLogadoIdAlunos()
  };

  salvarUsuariosAlunosStore(usuarios);
  return usuarios[id];
}


function getAlunosDoLocalStorage() {
  if (window.AlunoContexto && typeof window.AlunoContexto.listarAlunosDoProfissional === 'function') {
    return window.AlunoContexto.listarAlunosDoProfissional(getProfissionalLogadoIdAlunos());
  }

  return Object.values(getUsuariosAlunosStore())
    .filter(function(usuario) {
      return usuario.tipo === 'aluno' || usuario.perfil === 'aluno';
    })
    .filter(function(usuario) {
      return usuario.status !== 'inativo';
    })
    .filter(function(usuario) {
      return usuario.nome || usuario.email;
    });
}

function inativarAlunoNoLocalStorage(idAluno) {
  if (!idAluno) return false;

  if (window.AlunoContexto && typeof window.AlunoContexto.inativarAluno === 'function') {
    return Boolean(window.AlunoContexto.inativarAluno(idAluno));
  }

  var usuarios = getUsuariosAlunosStore();
  var idReal = usuarios[idAluno] ? idAluno : Object.keys(usuarios).find(function(id) {
    return usuarios[id].alunoId === idAluno;
  });

  if (!idReal) return false;

  usuarios[idReal] = {
    ...usuarios[idReal],
    status: 'inativo',
    inativadoEm: new Date().toISOString()
  };

  salvarUsuariosAlunosStore(usuarios);
  sessionStorage.removeItem('alunoSelecionado');
  localStorage.removeItem('mypersonal:alunoSelecionadoId');
  return true;
}


function criarCelulaTexto(texto) {
  var td = document.createElement('td');
  td.textContent = texto || '—';
  return td;
}

function sincronizarLinhasEstaticasComStorage(corpoTabela) {
  var usuarios = getUsuariosAlunosStore();
  var linhas = Array.from(corpoTabela.querySelectorAll('tr'));

  linhas.forEach(function(linha) {
    var email = normalizarEmailAluno(linha.dataset.email);
    var idLinha = linha.dataset.id || linha.dataset.alunoId || '';
    var usuario = usuarios[idLinha] || Object.values(usuarios).find(function(item) {
      return normalizarEmailAluno(item.email) === email;
    });

    if (!usuario) return;

    if (usuario.status === 'inativo') {
      linha.remove();
      return;
    }

    linha.dataset.id = usuario.id || usuario.alunoId || idLinha;
    linha.dataset.alunoId = usuario.alunoId || usuario.id || idLinha;
    linha.dataset.profissionalId = usuario.profissionalId || linha.dataset.profissionalId || '';
    linha.dataset.status = usuario.status || linha.dataset.status || 'ativo';
  });
}

function renderizarAlunosDoLocalStorage() {
  var corpoTabela = document.getElementById('corpoCompleta');
  if (!corpoTabela) return;

  // A tabela agora e alimentada pelo localStorage.
  // As linhas antigas do HTML nao sao usadas como fonte visual.
  corpoTabela.innerHTML = '';

  var emailsExistentes = [];

  getAlunosDoLocalStorage().forEach(function(aluno) {
    var emailAluno = normalizarEmailAluno(aluno.email);
    if (emailAluno && emailsExistentes.includes(emailAluno)) return;

    var tr = document.createElement('tr');
    tr.dataset.id = aluno.id || aluno.alunoId || '';
    tr.dataset.alunoId = aluno.id || aluno.alunoId || '';
    tr.dataset.profissionalId = aluno.profissionalId || '';
    tr.dataset.nome = aluno.nome || aluno.email || '';
    tr.dataset.status = aluno.status || 'ativo';
    tr.dataset.email = aluno.email || '';
    tr.dataset.tel = aluno.telefone || aluno.tel || '';
    tr.dataset.nasc = aluno.nascimento || aluno.nasc || '';
    tr.dataset.sexo = aluno.sexo || '';
    tr.dataset.cidade = aluno.cidade || '';
    tr.dataset.peso = aluno.peso || '';
    tr.dataset.altura = aluno.altura || '';
    tr.dataset.gordura = aluno.gordura || '';
    tr.dataset.objetivo = aluno.objetivo || '';

    tr.appendChild(criarCelulaTexto(aluno.nome || aluno.email));
    tr.appendChild(criarCelulaTexto('—'));
    tr.appendChild(criarCelulaTexto('—'));
    tr.appendChild(criarCelulaTexto('—'));
    tr.appendChild(criarCelulaTexto('—'));

    var tdStatus = document.createElement('td');
    var status = document.createElement('span');
    status.className = 'status ' + (aluno.status || 'ativo');
    status.textContent = aluno.status === 'novo' ? 'Novo' : 'Ativo';
    tdStatus.appendChild(status);
    tr.appendChild(tdStatus);

    var tdAcoes = document.createElement('td');
    var botao = document.createElement('button');
    botao.className = 'btn-perfil';
    botao.textContent = 'Ver perfil';
    botao.addEventListener('click', function() {
      verPerfil(botao);
    });
    tdAcoes.appendChild(botao);
    tr.appendChild(tdAcoes);

    corpoTabela.appendChild(tr);
    if (emailAluno) emailsExistentes.push(emailAluno);
  });
}

function irParaCadastro() {
  sessionStorage.removeItem('alunoSelecionado');
  localStorage.removeItem('mypersonal:alunoSelecionadoId');
  window.location.href = 'editar-aluno.html?novo=1';
}

function getDadosAluno(linha) {
  return {
    id: linha.dataset.id || linha.dataset.alunoId || '',
    alunoId: linha.dataset.alunoId || linha.dataset.id || '',
    profissionalId: linha.dataset.profissionalId || getProfissionalLogadoIdAlunos(),
    nome: linha.dataset.nome || '',
    email: linha.dataset.email || '',
    tel: linha.dataset.tel || '',
    nasc: linha.dataset.nasc || '',
    sexo: linha.dataset.sexo || '',
    cidade: linha.dataset.cidade || '',
    peso: linha.dataset.peso || '',
    altura: linha.dataset.altura || '',
    gordura: linha.dataset.gordura || '',
    objetivo: linha.dataset.objetivo || '',
    status: linha.dataset.status || ''
  };
}

function verPerfil(botao) {
  var linha = botao.closest('tr');
  if (!linha) return;

  var dadosAluno = getDadosAluno(linha);
  var alunoSelecionado = window.AlunoContexto && typeof window.AlunoContexto.setAlunoSelecionado === 'function'
    ? window.AlunoContexto.setAlunoSelecionado(dadosAluno)
    : salvarAlunoNoLocalStorage(dadosAluno);

  sessionStorage.setItem('alunoSelecionado', JSON.stringify(alunoSelecionado));
  localStorage.setItem('mypersonal:alunoSelecionadoId', alunoSelecionado.id || alunoSelecionado.alunoId || dadosAluno.id);
  window.location.href = 'perfilaluno.html';
}

function limparFormularioAluno() {
  [
    'inputNome',
    'inputEmail',
    'inputTel',
    'inputNasc',
    'inputSexo',
    'inputCidade',
    'inputPeso',
    'inputAltura',
    'inputGordura',
    'inputObjetivo',
    'inputSenhaAluno',
    'inputConfirmarSenhaAluno'
  ].forEach(function(id) {
    var campo = document.getElementById(id);
    if (campo) campo.value = '';
  });
}

function voltarParaMeusAlunos() {
  window.location.href = 'meus-alunos.html';
}


function validarEmailAlunoCadastro(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || '');
}

function configurarCredenciaisAluno() {
  var inputEmail = document.getElementById('inputEmail');
  var inputLogin = document.getElementById('inputLoginAcesso');

  if (!inputEmail || !inputLogin) return;

  function atualizarLogin() {
    inputLogin.value = inputEmail.value.trim() || 'Será o e-mail informado';
  }

  inputEmail.addEventListener('input', atualizarLogin);
  atualizarLogin();
}

function getAlunoSelecionadoParaEdicao() {
  if (!window.location.pathname.includes('editar-aluno')) return null;
  if (new URLSearchParams(window.location.search).get('novo') === '1') return null;

  if (window.AlunoContexto && typeof window.AlunoContexto.buscarAlunoAtual === 'function') {
    var alunoContexto = window.AlunoContexto.buscarAlunoAtual({ preferirUsuarioLogado: false });
    if (alunoContexto && (alunoContexto.id || alunoContexto.alunoId || alunoContexto.nome || alunoContexto.email)) {
      return alunoContexto;
    }
  }

  try {
    var alunoSessao = JSON.parse(sessionStorage.getItem('alunoSelecionado'));
    if (alunoSessao && (alunoSessao.id || alunoSessao.alunoId || alunoSessao.nome || alunoSessao.email)) {
      return alunoSessao;
    }
  } catch (erro) {}

  var alunoId = localStorage.getItem('mypersonal:alunoSelecionadoId');
  return alunoId ? { id: alunoId, alunoId: alunoId } : null;
}

function preencherFormularioEdicaoAluno() {
  var aluno = getAlunoSelecionadoParaEdicao();
  if (!aluno) return;

  var campos = {
    inputNome: aluno.nome || '',
    inputEmail: aluno.email || '',
    inputTel: aluno.telefone || aluno.tel || '',
    inputNasc: aluno.nascimento || aluno.nasc || '',
    inputSexo: aluno.sexo || '',
    inputCidade: aluno.cidade || '',
    inputPeso: aluno.peso || '',
    inputAltura: aluno.altura || '',
    inputGordura: aluno.gordura || '',
    inputObjetivo: aluno.objetivo || ''
  };

  Object.keys(campos).forEach(function(id) {
    var campo = document.getElementById(id);
    if (campo) campo.value = campos[id];
  });

  var botaoSalvar = document.querySelector('.btn-salvar');
  if (botaoSalvar) botaoSalvar.textContent = 'Salvar alteracoes';

  var tituloModal = document.querySelector('#overlaySuccesso .modal-titulo');
  if (tituloModal) tituloModal.textContent = 'Aluno atualizado!';

  var senha = document.getElementById('inputSenhaAluno');
  var confirmarSenha = document.getElementById('inputConfirmarSenhaAluno');
  if (senha) senha.placeholder = 'Deixe em branco para manter a senha atual';
  if (confirmarSenha) confirmarSenha.placeholder = 'Repita somente se alterar a senha';

  document.body.dataset.pageTitle = 'Editar Aluno - ' + (aluno.nome || 'Aluno');
  var topbarTitle = document.querySelector('.topbar-title');
  if (topbarTitle) topbarTitle.textContent = document.body.dataset.pageTitle;

  configurarCredenciaisAluno();
}

function salvarAluno() {
  var inputNome = document.getElementById('inputNome');
  var inputEmail = document.getElementById('inputEmail');
  var inputSenha = document.getElementById('inputSenhaAluno');
  var inputConfirmarSenha = document.getElementById('inputConfirmarSenhaAluno');
  var overlaySuccesso = document.getElementById('overlaySuccesso');
  var modalSubtitulo = document.getElementById('modalSubtitulo');
  if (!inputNome || !overlaySuccesso || !modalSubtitulo) return;

  var nome = inputNome.value.trim();
  var email = inputEmail ? inputEmail.value.trim().toLowerCase() : '';
  var senha = inputSenha ? inputSenha.value : '';
  var confirmarSenha = inputConfirmarSenha ? inputConfirmarSenha.value : '';

  if (nome === '') {
    alert('Por favor, informe o nome do aluno.');
    return;
  }

  if (!validarEmailAlunoCadastro(email)) {
    alert('Por favor, informe um e-mail válido para o login do aluno.');
    if (inputEmail) inputEmail.focus();
    return;
  }

  if (!senha || senha.length < 6) {
    alert('A senha do aluno deve ter pelo menos 6 caracteres.');
    if (inputSenha) inputSenha.focus();
    return;
  }

  if (senha !== confirmarSenha) {
    alert('A confirmação da senha não confere.');
    if (inputConfirmarSenha) inputConfirmarSenha.focus();
    return;
  }

  var usuarioExistente = encontrarUsuarioPorEmailAluno(email);
  if (usuarioExistente && usuarioExistente.status !== 'inativo') {
    alert('Já existe um usuário ativo cadastrado com este e-mail.');
    if (inputEmail) inputEmail.focus();
    return;
  }

  var alunoSalvo = salvarAlunoNoLocalStorage({
    id: usuarioExistente && usuarioExistente.id ? usuarioExistente.id : undefined,
    nome: nome,
    email: email,
    senha: senha,
    tel: document.getElementById('inputTel')?.value.trim() || '',
    nasc: document.getElementById('inputNasc')?.value.trim() || '',
    sexo: document.getElementById('inputSexo')?.value.trim() || '',
    cidade: document.getElementById('inputCidade')?.value.trim() || '',
    peso: document.getElementById('inputPeso')?.value.trim() || '',
    altura: document.getElementById('inputAltura')?.value.trim() || '',
    gordura: document.getElementById('inputGordura')?.value.trim() || '',
    objetivo: document.getElementById('inputObjetivo')?.value.trim() || '',
    status: 'ativo'
  });

  modalSubtitulo.textContent = alunoSalvo.nome + ' foi salvo com sucesso. Login: ' + alunoSalvo.email + '. A senha foi definida pelo profissional.';
  overlaySuccesso.classList.add('visivel');
  limparFormularioAluno();
  configurarCredenciaisAluno();
}

function salvarAluno() {
  var inputNome = document.getElementById('inputNome');
  var inputEmail = document.getElementById('inputEmail');
  var inputSenha = document.getElementById('inputSenhaAluno');
  var inputConfirmarSenha = document.getElementById('inputConfirmarSenhaAluno');
  var overlaySuccesso = document.getElementById('overlaySuccesso');
  var modalSubtitulo = document.getElementById('modalSubtitulo');
  if (!inputNome || !overlaySuccesso || !modalSubtitulo) return;

  var nome = inputNome.value.trim();
  var email = inputEmail ? inputEmail.value.trim().toLowerCase() : '';
  var senha = inputSenha ? inputSenha.value : '';
  var confirmarSenha = inputConfirmarSenha ? inputConfirmarSenha.value : '';
  var alunoEdicao = getAlunoSelecionadoParaEdicao();
  var modoEdicao = Boolean(alunoEdicao && (alunoEdicao.id || alunoEdicao.alunoId));
  var idEdicao = modoEdicao ? (alunoEdicao.id || alunoEdicao.alunoId) : '';

  if (nome === '') {
    alert('Por favor, informe o nome do aluno.');
    return;
  }

  if (!validarEmailAlunoCadastro(email)) {
    alert('Por favor, informe um e-mail valido para o login do aluno.');
    if (inputEmail) inputEmail.focus();
    return;
  }

  if (!modoEdicao && (!senha || senha.length < 6)) {
    alert('A senha do aluno deve ter pelo menos 6 caracteres.');
    if (inputSenha) inputSenha.focus();
    return;
  }

  if (modoEdicao && senha && senha.length < 6) {
    alert('A nova senha do aluno deve ter pelo menos 6 caracteres.');
    if (inputSenha) inputSenha.focus();
    return;
  }

  if (senha !== confirmarSenha) {
    alert('A confirmacao da senha nao confere.');
    if (inputConfirmarSenha) inputConfirmarSenha.focus();
    return;
  }

  var usuarioExistente = encontrarUsuarioPorEmailAluno(email);
  var emailPertenceAoAlunoAtual = usuarioExistente && [usuarioExistente.id, usuarioExistente.alunoId].includes(idEdicao);
  if (usuarioExistente && usuarioExistente.status !== 'inativo' && !emailPertenceAoAlunoAtual) {
    alert('Ja existe um usuario ativo cadastrado com este e-mail.');
    if (inputEmail) inputEmail.focus();
    return;
  }

  var dadosAluno = {
    id: modoEdicao ? idEdicao : (usuarioExistente && usuarioExistente.id ? usuarioExistente.id : undefined),
    alunoId: modoEdicao ? idEdicao : undefined,
    profissionalId: alunoEdicao?.profissionalId || getProfissionalLogadoIdAlunos(),
    nome: nome,
    email: email,
    senha: senha || alunoEdicao?.senha,
    tel: document.getElementById('inputTel')?.value.trim() || '',
    nasc: document.getElementById('inputNasc')?.value.trim() || '',
    sexo: document.getElementById('inputSexo')?.value.trim() || '',
    cidade: document.getElementById('inputCidade')?.value.trim() || '',
    peso: document.getElementById('inputPeso')?.value.trim() || '',
    altura: document.getElementById('inputAltura')?.value.trim() || '',
    gordura: document.getElementById('inputGordura')?.value.trim() || '',
    objetivo: document.getElementById('inputObjetivo')?.value.trim() || '',
    status: 'ativo'
  };

  var alunoSalvo = window.AlunoContexto && typeof window.AlunoContexto.setAlunoSelecionado === 'function'
    ? window.AlunoContexto.setAlunoSelecionado(dadosAluno)
    : salvarAlunoNoLocalStorage(dadosAluno);

  sessionStorage.setItem('alunoSelecionado', JSON.stringify(alunoSalvo));
  localStorage.setItem('mypersonal:alunoSelecionadoId', alunoSalvo.id || alunoSalvo.alunoId || idEdicao);

  modalSubtitulo.textContent = alunoSalvo.nome + (modoEdicao
    ? ' foi atualizado com sucesso.'
    : ' foi salvo com sucesso. Login: ' + alunoSalvo.email + '. A senha foi definida pelo profissional.');
  overlaySuccesso.classList.add('visivel');

  if (!modoEdicao) {
    limparFormularioAluno();
    configurarCredenciaisAluno();
  }
}

function configurarBuscaAlunos() {
  var searchInput = document.getElementById('searchInput');
  var corpoTabela = document.getElementById('corpoCompleta');
  if (!searchInput || !corpoTabela) return;

  searchInput.addEventListener('input', function() {
    var termo = searchInput.value.trim().toLowerCase();
    var linhas = corpoTabela.querySelectorAll('tr');

    linhas.forEach(function(linha) {
      var nome = (linha.dataset.nome || '').toLowerCase();
      linha.style.display = nome.includes(termo) ? '' : 'none';
    });
  });
}

function configurarModalCadastroAluno() {
  var overlaySuccesso = document.getElementById('overlaySuccesso');
  if (!overlaySuccesso) return;

  overlaySuccesso.addEventListener('click', function(event) {
    if (event.target === overlaySuccesso) {
      overlaySuccesso.classList.remove('visivel');
    }
  });
}

function getAlunoAtualParaExclusao() {
  if (window.AlunoContexto && typeof window.AlunoContexto.buscarAlunoAtual === 'function') {
    var alunoContexto = window.AlunoContexto.buscarAlunoAtual({ preferirUsuarioLogado: false });
    if (alunoContexto && (alunoContexto.id || alunoContexto.alunoId || alunoContexto.nome)) {
      return alunoContexto;
    }
  }

  try {
    var alunoSessao = JSON.parse(sessionStorage.getItem('alunoSelecionado'));
    if (alunoSessao && (alunoSessao.id || alunoSessao.alunoId || alunoSessao.nome)) {
      return alunoSessao;
    }
  } catch (erro) {}

  var nomeAlunoEl = document.querySelector('.student-name');
  return {
    id: localStorage.getItem('mypersonal:alunoSelecionadoId') || '',
    nome: nomeAlunoEl ? nomeAlunoEl.textContent.trim() : 'este aluno'
  };
}

function configurarExclusaoAluno() {
  var botoesExcluir = document.querySelectorAll('.btn-excluir');
  if (!botoesExcluir.length) return;

  var overlay = document.createElement('div');
  overlay.className = 'confirm-delete-modal';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML =
    '<div class="confirm-delete-card" role="dialog" aria-modal="true" aria-labelledby="confirm-delete-title">' +
      '<div class="confirm-delete-icon">!</div>' +
      '<h2 id="confirm-delete-title">Excluir aluno?</h2>' +
      '<p>Deseja excluir <strong data-delete-student-name>este aluno</strong>? O aluno ficará inativo e deixará de aparecer nas listas.</p>' +
      '<div class="confirm-delete-actions">' +
        '<button type="button" class="btn btn-secondary" data-cancel-delete>Cancelar</button>' +
        '<button type="button" class="btn-confirmar-exclusao" data-confirm-delete>Sim, excluir</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  function atualizarNomeNoModal() {
    var alunoAtual = getAlunoAtualParaExclusao();
    var nomeAlunoEl = document.querySelector('.student-name');
    var nomeAluno = alunoAtual && alunoAtual.nome ? alunoAtual.nome : (nomeAlunoEl ? nomeAlunoEl.textContent.trim() : 'este aluno');
    var spanNome = overlay.querySelector('[data-delete-student-name]');
    if (spanNome) spanNome.textContent = nomeAluno || 'este aluno';
  }

  function abrirModal() {
    atualizarNomeNoModal();
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    var cancelar = overlay.querySelector('[data-cancel-delete]');
    if (cancelar) cancelar.focus();
  }

  function fecharModal() {
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
  }

  botoesExcluir.forEach(function(botao) {
    botao.addEventListener('click', abrirModal);
  });

  overlay.addEventListener('click', function(event) {
    if (event.target === overlay || event.target.hasAttribute('data-cancel-delete')) {
      fecharModal();
    }

    if (event.target.hasAttribute('data-confirm-delete')) {
      var alunoAtual = getAlunoAtualParaExclusao();
      var idAluno = alunoAtual && (alunoAtual.id || alunoAtual.alunoId);

      if (!idAluno) {
        alert('Não foi possível identificar o aluno selecionado para exclusão.');
        fecharModal();
        return;
      }

      inativarAlunoNoLocalStorage(idAluno);
      window.location.href = 'meus-alunos.html';
    }
  });

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) {
      fecharModal();
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  renderizarAlunosDoLocalStorage();
  configurarBuscaAlunos();
  configurarModalCadastroAluno();
  configurarCredenciaisAluno();
  preencherFormularioEdicaoAluno();
  configurarExclusaoAluno();
});
