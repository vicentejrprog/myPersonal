document.addEventListener('DOMContentLoaded', function() {
    const TREINOS_STORAGE_KEY = 'mypersonal_treinos_alunos';
    const REGISTROS_STORAGE_KEY = 'mypersonal_registros_treino';

    const aluno = getAlunoSelecionado();
    const alunoId = getAlunoId(aluno);
    const treino = getTreinoAluno(alunoId, aluno);

    atualizarCabecalho(aluno);
    renderizarTreino(treino);
    renderizarAvaliacao(aluno);
    configurarObservacoes(treino, alunoId);
    renderizarUltimoRegistro(alunoId);

    function slugify(valor) {
        return String(valor || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || 'aluno-padrao';
    }

    function lerJson(chave, fallback) {
        try {
            return JSON.parse(localStorage.getItem(chave)) || fallback;
        } catch (erro) {
            console.warn('Nao foi possivel ler ' + chave + '.', erro);
            return fallback;
        }
    }

    function salvarJson(chave, valor) {
        localStorage.setItem(chave, JSON.stringify(valor));
    }

    function getAlunoSelecionado() {
        if (window.AlunoContexto && typeof window.AlunoContexto.buscarAlunoAtual === 'function') {
            return window.AlunoContexto.buscarAlunoAtual({ preferirUsuarioLogado: false });
        }

        try {
            const alunoSessao = JSON.parse(sessionStorage.getItem('alunoSelecionado'));
            if (alunoSessao && alunoSessao.nome) return alunoSessao;
        } catch (erro) {
            console.warn('Nao foi possivel ler o aluno selecionado.', erro);
        }

        return {
            id: 'aluno-eliabe-monteiro',
            nome: 'Eliabe Monteiro',
            status: 'ativo',
            peso: '82',
            altura: '178',
            gordura: '18',
            objetivo: 'Hipertrofia'
        };
    }

    function getAlunoId(alunoBase) {
        return alunoBase.id || alunoBase.alunoId || slugify(alunoBase.nome);
    }

    function getAliasesAluno(alunoBase) {
        if (window.AlunoContexto && typeof window.AlunoContexto.gerarAliasesAluno === 'function') {
            return window.AlunoContexto.gerarAliasesAluno(alunoBase);
        }

        return [getAlunoId(alunoBase), slugify(alunoBase.nome), 'aluno-' + slugify(alunoBase.nome)].filter(Boolean);
    }


    function criarTreinoPadrao(alunoBase) {
        return {
            alunoId: getAlunoId(alunoBase),
            alunoNome: alunoBase.nome,
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

    function getTreinoAluno(id, alunoBase) {
        const treinos = lerJson(TREINOS_STORAGE_KEY, {});
        const aliases = getAliasesAluno(alunoBase);
        const chaveExistente = aliases.find(chave => treinos[chave] && treinos[chave].grupos && treinos[chave].grupos.length);

        if (!treinos[id]) {
            treinos[id] = chaveExistente
                ? { ...treinos[chaveExistente], alunoId: id, alunoNome: alunoBase.nome }
                : criarTreinoPadrao(alunoBase);
            salvarJson(TREINOS_STORAGE_KEY, treinos);
        }

        return treinos[id];
    }

    function atualizarCabecalho(alunoBase) {
        const nome = alunoBase.nome || 'Aluno';
        const iniciais = nome
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(parte => parte.charAt(0).toUpperCase())
            .join('');

        const avatar = document.querySelector('.student-header .avatar');
        const nomeEl = document.querySelector('.student-name');
        const subtitulo = document.querySelector('.page-subtitle');

        if (avatar) avatar.textContent = iniciais || 'AL';
        if (nomeEl) nomeEl.textContent = nome;
        if (subtitulo) subtitulo.textContent = 'Objetivo: ' + (alunoBase.objetivo || 'Nao informado');

        document.body.dataset.pageTitle = 'Perfil do Aluno - ' + nome;
        const titulo = document.querySelector('.topbar-title');
        if (titulo) titulo.textContent = document.body.dataset.pageTitle;
    }

    function renderizarTreino(treinoAluno) {
        const container = document.getElementById('perfilTreinoAtual');
        if (!container) return;

        const grupos = treinoAluno.grupos || [];
        if (!grupos.length) {
            container.innerHTML = '<div class="texto-interno-placeholder">Nenhum treino cadastrado.</div>';
            return;
        }

        container.innerHTML = grupos.map(grupo => {
            const linhas = (grupo.exercicios || []).map(exercicio => `
                <tr>
                    <td>${exercicio.nome || '-'}</td>
                    <td>${exercicio.series || '-'}</td>
                    <td>${exercicio.reps || '-'}</td>
                    <td>${exercicio.observacao || '-'}</td>
                    <td>${exercicio.video ? '<a href="' + exercicio.video + '" target="_blank" rel="noreferrer">Abrir</a>' : '-'}</td>
                </tr>
            `).join('');

            return `
                <article class="perfil-grupo-treino">
                    <header>
                        <strong>${grupo.nome || grupo.aba || 'Treino'}</strong>
                        <span>${grupo.musculatura || 'Musculatura nao informada'}</span>
                    </header>
                    <table class="perfil-tabela-treino">
                        <thead>
                            <tr>
                                <th>Exercicio</th>
                                <th>Series</th>
                                <th>Reps</th>
                                <th>Observacao</th>
                                <th>Video</th>
                            </tr>
                        </thead>
                        <tbody>${linhas || '<tr><td colspan="5">Sem exercicios cadastrados.</td></tr>'}</tbody>
                    </table>
                    ${grupo.observacoesGerais ? '<p class="perfil-obs-grupo">' + grupo.observacoesGerais + '</p>' : ''}
                </article>
            `;
        }).join('');
    }

    function renderizarAvaliacao(alunoBase) {
        const container = document.getElementById('perfilUltimaAvaliacao');
        if (!container) return;

        const app = window.MyPersonal || {};
        const ultimaAvaliacao = typeof app.buscarUltimaAvaliacao === 'function'
            ? app.buscarUltimaAvaliacao()
            : null;

        const dadosAvaliacao = ultimaAvaliacao || alunoBase;
        const formatarNumero = typeof app.formatarValorMetrica === 'function'
            ? app.formatarValorMetrica
            : function(valor) {
                if (valor === '' || valor === null || valor === undefined) return '-';
                const numero = Number(String(valor).replace(',', '.'));
                return Number.isNaN(numero) ? String(valor) : numero.toLocaleString('pt-BR');
            };

        const dataAvaliacao = ultimaAvaliacao && typeof app.formatarData === 'function'
            ? `<p>Última avaliação: ${app.formatarData(ultimaAvaliacao.data)}</p>`
            : '';

        container.innerHTML = `
            <div class="perfil-metricas">
                <span><strong>${formatarNumero(dadosAvaliacao.peso)}</strong> kg</span>
                <span><strong>${formatarNumero(dadosAvaliacao.altura)}</strong> cm</span>
                <span><strong>${formatarNumero(dadosAvaliacao.gordura)}</strong> % gordura</span>
            </div>
            ${dataAvaliacao}
            <p>Objetivo: ${alunoBase.objetivo || 'Nao informado'}</p>
        `;
    }

    function configurarObservacoes(treinoAluno, id) {
        const campo = document.getElementById('perfilObservacoesProf');
        const botao = document.getElementById('btnSalvarObservacoesPerfil');
        if (!campo || !botao) return;

        campo.value = treinoAluno.observacoesProfissional || '';

        botao.addEventListener('click', function() {
            const treinos = lerJson(TREINOS_STORAGE_KEY, {});
            treinos[id] = treinos[id] || treinoAluno;
            treinos[id].observacoesProfissional = campo.value.trim();
            treinos[id].atualizadoEm = new Date().toISOString();
            salvarJson(TREINOS_STORAGE_KEY, treinos);
            alert('Observacoes salvas com sucesso!');
        });
    }

    function renderizarUltimoRegistro(id) {
        const registros = Object.values(lerJson(REGISTROS_STORAGE_KEY, {}))
            .filter(registro => registro.alunoId === id)
            .sort((a, b) => new Date(b.salvoEm || 0) - new Date(a.salvoEm || 0));

        if (!registros.length) return;

        const container = document.getElementById('perfilUltimaAvaliacao');
        const ultimo = registros[0];
        container.insertAdjacentHTML('beforeend', `
            <div class="perfil-ultimo-registro">
                <strong>Último treino registrado</strong>
                <span>${ultimo.treinoSelecionado} - ${ultimo.statusTreino} - ${ultimo.sensacaoFinal}</span>
            </div>
        `);
    }
});
