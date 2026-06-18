const TREINOS_STORAGE_KEY = 'mypersonal_treinos_alunos';
let contadorLinhas = 0;
let grupoAtivoId = 'treino-a';
let treinoAtual = null;

function slugify(valor) {
    return String(valor || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'aluno-padrao';
}

function getAlunoSelecionado() {
    if (window.AlunoContexto && typeof window.AlunoContexto.buscarAlunoAtual === 'function') {
        return window.AlunoContexto.buscarAlunoAtual({ preferirUsuarioLogado: false });
    }

    try {
        const aluno = JSON.parse(sessionStorage.getItem('alunoSelecionado'));
        if (aluno && aluno.nome) return aluno;
    } catch (erro) {
        console.warn('Nao foi possivel ler o aluno selecionado.', erro);
    }

    return {
        id: 'aluno-eliabe-monteiro',
        nome: 'Eliabe Monteiro',
        objetivo: 'Hipertrofia',
        peso: '82',
        altura: '178',
        gordura: '18'
    };
}


function getAlunoId() {
    const aluno = getAlunoSelecionado();
    return aluno.id || aluno.alunoId || slugify(aluno.nome);
}

function getAliasesAluno() {
    const aluno = getAlunoSelecionado();
    if (window.AlunoContexto && typeof window.AlunoContexto.gerarAliasesAluno === 'function') {
        return window.AlunoContexto.gerarAliasesAluno(aluno);
    }

    return [getAlunoId(), slugify(aluno.nome), 'aluno-' + slugify(aluno.nome)].filter(Boolean);
}


function lerTreinos() {
    try {
        return JSON.parse(localStorage.getItem(TREINOS_STORAGE_KEY)) || {};
    } catch (erro) {
        console.warn('Nao foi possivel ler os treinos salvos.', erro);
        return {};
    }
}

function salvarTreinos(treinos) {
    localStorage.setItem(TREINOS_STORAGE_KEY, JSON.stringify(treinos));
}

function criarTreinoPadrao() {
    const aluno = getAlunoSelecionado();

    return {
        alunoId: getAlunoId(),
        alunoNome: aluno.nome,
        atualizadoEm: new Date().toISOString(),
        observacoesProfissional: '',
        grupos: [
            {
                id: 'treino-a',
                aba: 'Treino A',
                nome: 'Treino A - Peito e Triceps',
                musculatura: 'Peitoral, Triceps, Ombros',
                observacoesGerais: 'Priorizar execucao controlada e registrar cargas ao final.',
                exercicios: [
                    {
                        nome: 'Supino reto com barra',
                        series: '4',
                        reps: '12',
                        descanso: '60s',
                        observacao: 'Manter escapulas retraidas',
                        video: 'https://www.youtube.com/watch?v=sqOw2Y6Ju9A'
                    }
                ]
            },
            {
                id: 'treino-b',
                aba: 'Treino B',
                nome: 'Treino B - Costas e Biceps',
                musculatura: 'Costas, Biceps',
                observacoesGerais: '',
                exercicios: []
            },
            {
                id: 'treino-c',
                aba: 'Treino C',
                nome: 'Treino C - Pernas',
                musculatura: 'Quadriceps, Posterior, Gluteos',
                observacoesGerais: '',
                exercicios: []
            }
        ]
    };
}

function carregarTreinoAluno() {
    const todosTreinos = lerTreinos();
    const alunoId = getAlunoId();
    const treinoPadrao = criarTreinoPadrao();
    const aliases = getAliasesAluno();
    const chaveExistente = aliases.find(chave => todosTreinos[chave] && todosTreinos[chave].grupos && todosTreinos[chave].grupos.length);

    if (!todosTreinos[alunoId]) {
        todosTreinos[alunoId] = chaveExistente ? { ...todosTreinos[chaveExistente], alunoId } : treinoPadrao;
        salvarTreinos(todosTreinos);
    }

    treinoAtual = todosTreinos[alunoId];
    treinoAtual.alunoId = alunoId;
    treinoAtual.alunoNome = getAlunoSelecionado().nome;
    treinoAtual.grupos = treinoAtual.grupos && treinoAtual.grupos.length
        ? treinoAtual.grupos
        : treinoPadrao.grupos;

    treinoPadrao.grupos.forEach(grupoPadrao => {
        if (!treinoAtual.grupos.some(grupo => grupo.id === grupoPadrao.id)) {
            treinoAtual.grupos.push(grupoPadrao);
        }
    });

    todosTreinos[alunoId] = treinoAtual;
    salvarTreinos(todosTreinos);
}


function atualizarCabecalhoAluno() {
    const aluno = getAlunoSelecionado();
    document.body.dataset.pageTitle = 'Editar Treino - ' + aluno.nome;
    const titulo = document.querySelector('.topbar-title');
    if (titulo) titulo.textContent = document.body.dataset.pageTitle;
}

function getGrupoAtivo() {
    return treinoAtual.grupos.find(grupo => grupo.id === grupoAtivoId) || treinoAtual.grupos[0];
}

function renderizarAbas() {
    const grupoAbas = document.querySelector('.grupo-abas-treino');
    const botaoNovo = grupoAbas.querySelector('.botao-novo-grupo');
    grupoAbas.querySelectorAll('.aba-treino:not(.botao-novo-grupo)').forEach(aba => aba.remove());

    treinoAtual.grupos.forEach(grupo => {
        const botao = document.createElement('button');
        botao.type = 'button';
        botao.className = 'aba-treino' + (grupo.id === grupoAtivoId ? ' ativa' : '');
        botao.textContent = grupo.aba;
        botao.dataset.grupoId = grupo.id;
        botao.onclick = function() { selecionarAba(this); };
        grupoAbas.insertBefore(botao, botaoNovo);
    });
}

function preencherFormularioGrupo() {
    const grupo = getGrupoAtivo();
    document.getElementById('nomeGrupo').value = grupo.nome || grupo.aba || '';
    document.getElementById('musculaturaAlvo').value = grupo.musculatura || '';
    document.getElementById('obsGerais').value = grupo.observacoesGerais || '';

    const corpo = document.getElementById('corpoTabela');
    corpo.innerHTML = '';
    contadorLinhas = 0;

    const exercicios = grupo.exercicios && grupo.exercicios.length ? grupo.exercicios : [{}];
    exercicios.forEach(exercicio => adicionarLinha(exercicio));
}

function coletarGrupoDoFormulario() {
    const grupo = getGrupoAtivo();
    grupo.nome = document.getElementById('nomeGrupo').value.trim();
    grupo.musculatura = document.getElementById('musculaturaAlvo').value.trim();
    grupo.observacoesGerais = document.getElementById('obsGerais').value.trim();
    grupo.aba = grupo.nome ? grupo.nome.split('-')[0].trim() : grupo.aba;
    grupo.exercicios = [];

    document.querySelectorAll('#corpoTabela .linha-corpo').forEach(linha => {
        const nome = linha.querySelector('.input-exercicio').value.trim();
        if (!nome) return;

        grupo.exercicios.push({
            nome,
            series: linha.querySelector('.input-series').value.trim(),
            reps: linha.querySelector('.input-reps').value.trim(),
            descanso: linha.querySelector('.input-desc').value.trim(),
            observacao: linha.querySelector('.input-obs').value.trim(),
            video: linha.querySelector('.input-video').value.trim()
        });
    });
}

function persistirTreino() {
    treinoAtual.atualizadoEm = new Date().toISOString();
    treinoAtual.alunoId = getAlunoId();
    treinoAtual.alunoNome = getAlunoSelecionado().nome;

    const todosTreinos = lerTreinos();
    todosTreinos[getAlunoId()] = treinoAtual;
    salvarTreinos(todosTreinos);
}

function selecionarAba(botao) {
    coletarGrupoDoFormulario();
    grupoAtivoId = botao.dataset.grupoId;
    persistirTreino();
    renderizarAbas();
    preencherFormularioGrupo();
}

function criarNovoGrupo() {
    coletarGrupoDoFormulario();

    const nome = prompt('Digite o nome do novo grupo de treino:');
    if (!nome || !nome.trim()) return;

    const idBase = slugify(nome);
    let id = idBase;
    let sufixo = 2;
    while (treinoAtual.grupos.some(grupo => grupo.id === id)) {
        id = idBase + '-' + sufixo;
        sufixo++;
    }

    treinoAtual.grupos.push({
        id,
        aba: nome.trim(),
        nome: nome.trim(),
        musculatura: '',
        observacoesGerais: '',
        exercicios: []
    });

    grupoAtivoId = id;
    persistirTreino();
    renderizarAbas();
    preencherFormularioGrupo();
}

function adicionarLinha(exercicio = {}) {
    contadorLinhas++;
    const corpo = document.getElementById('corpoTabela');

    const novaLinha = document.createElement('div');
    novaLinha.className = 'linha-corpo';
    novaLinha.id = 'linha_' + contadorLinhas;

    novaLinha.innerHTML = `
        <div class="col-num numero-indice">${corpo.children.length + 1}</div>
        <div class="col-exercicio"><input type="text" class="input-exercicio" placeholder="Ex: Supino Reto"></div>
        <div class="col-dados"><input type="text" class="input-series" placeholder="4"></div>
        <div class="col-dados"><input type="text" class="input-reps" placeholder="12"></div>
        <div class="col-dados"><input type="text" class="input-desc" placeholder="60s"></div>
        <div class="col-obs"><input type="text" class="input-obs" placeholder="Foco na cadencia"></div>
        <div class="col-video"><input type="text" class="input-video" placeholder="URL do video"></div>
        <div class="col-remover">
            <button type="button" class="btn-remover" title="Remover exercicio" onclick="removerLinha('${novaLinha.id}')">x</button>
        </div>
    `;

    novaLinha.querySelector('.input-exercicio').value = exercicio.nome || '';
    novaLinha.querySelector('.input-series').value = exercicio.series || '';
    novaLinha.querySelector('.input-reps').value = exercicio.reps || '';
    novaLinha.querySelector('.input-desc').value = exercicio.descanso || '';
    novaLinha.querySelector('.input-obs').value = exercicio.observacao || '';
    novaLinha.querySelector('.input-video').value = exercicio.video || '';

    corpo.appendChild(novaLinha);
}

function removerLinha(idLinha) {
    const linha = document.getElementById(idLinha);
    if (linha) {
        linha.remove();
        reindexarLinhas();
    }
}

function reindexarLinhas() {
    document.querySelectorAll('.numero-indice').forEach((elemento, chave) => {
        elemento.textContent = chave + 1;
    });
}

function limparFormulario() {
    if (!confirm('Tem certeza de que deseja limpar todos os dados preenchidos?')) return;

    document.getElementById('formTreino').reset();
    document.getElementById('corpoTabela').innerHTML = '';
    adicionarLinha();
}

function salvarDados(notificarAluno) {
    coletarGrupoDoFormulario();

    const grupo = getGrupoAtivo();
    if (!grupo.nome) {
        alert('Por favor, informe pelo menos o Nome do Grupo de Treino.');
        document.getElementById('nomeGrupo').focus();
        return;
    }

    if (!grupo.exercicios.length) {
        alert('Cadastre pelo menos um exercicio para este grupo de treino.');
        return;
    }

    treinoAtual.notificarAluno = Boolean(notificarAluno);
    persistirTreino();
    renderizarAbas();
    document.getElementById('modalConfirmacao').classList.add('visivel');
}

document.addEventListener('DOMContentLoaded', function() {
    atualizarCabecalhoAluno();
    carregarTreinoAluno();
    grupoAtivoId = treinoAtual.grupos[0].id;
    renderizarAbas();
    preencherFormularioGrupo();
});
