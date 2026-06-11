function irParaCadastro() {
  window.location.href = 'editar-aluno.html';
}

function getDadosAluno(linha) {
  return {
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

  sessionStorage.setItem('alunoSelecionado', JSON.stringify(getDadosAluno(linha)));
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
    'inputObjetivo'
  ].forEach(function(id) {
    var campo = document.getElementById(id);
    if (campo) campo.value = '';
  });
}

function voltarParaMeusAlunos() {
  window.location.href = 'meus-alunos.html';
}

function salvarAluno() {
  var inputNome = document.getElementById('inputNome');
  var overlaySuccesso = document.getElementById('overlaySuccesso');
  var modalSubtitulo = document.getElementById('modalSubtitulo');
  if (!inputNome || !overlaySuccesso || !modalSubtitulo) return;

  var nome = inputNome.value.trim();
  if (nome === '') {
    alert('Por favor, informe o nome do aluno.');
    return;
  }

  modalSubtitulo.textContent = nome + ' foi salvo com sucesso.';
  overlaySuccesso.classList.add('visivel');
  limparFormularioAluno();
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

function configurarExclusaoAluno() {
  var botoesExcluir = document.querySelectorAll('.btn-excluir');
  if (!botoesExcluir.length) return;

  var nomeAlunoEl = document.querySelector('.student-name');
  var nomeAluno = nomeAlunoEl ? nomeAlunoEl.textContent.trim() : 'este aluno';

  var overlay = document.createElement('div');
  overlay.className = 'confirm-delete-modal';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML =
    '<div class="confirm-delete-card" role="dialog" aria-modal="true" aria-labelledby="confirm-delete-title">' +
      '<div class="confirm-delete-icon">!</div>' +
      '<h2 id="confirm-delete-title">Excluir aluno?</h2>' +
      '<p>Deseja excluir ' + nomeAluno + '? Esta ação não pode ser desfeita.</p>' +
      '<div class="confirm-delete-actions">' +
        '<button type="button" class="btn btn-secondary" data-cancel-delete>Cancelar</button>' +
        '<button type="button" class="btn-confirmar-exclusao" data-confirm-delete>Sim, excluir</button>' +
      '</div>' +
    '</div>';

  document.body.appendChild(overlay);

  function abrirModal() {
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
      sessionStorage.removeItem('alunoSelecionado');
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
  configurarBuscaAlunos();
  configurarModalCadastroAluno();
  configurarExclusaoAluno();
});
