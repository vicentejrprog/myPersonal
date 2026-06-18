document.addEventListener('DOMContentLoaded', () => {
    const TREINOS_STORAGE_KEY = 'mypersonal_treinos_alunos';
    const REGISTROS_STORAGE_KEY = 'mypersonal_registros_treino';
    const ALUNO_PADRAO = {
        id: 'aluno-eliabe-monteiro',
        nome: 'Eliabe Monteiro'
    };

    const modal = document.getElementById('modal-video');
    const modalTitulo = document.getElementById('modal-titulo-exercicio');
    const modalIframe = document.getElementById('modal-iframe-video');
    const modalSeries = document.getElementById('modal-info-series');
    const modalReps = document.getElementById('modal-info-reps');
    const modalDesc = document.getElementById('modal-info-desc');
    const modalDica = document.getElementById('modal-dica-professor');
    const btnFecharX = document.getElementById('btn-fechar-x');
    const btnFecharMaster = document.getElementById('btn-fechar-master');
    const containerExercicios = document.getElementById('container-exercicios');
    const grupoAbas = document.querySelector('.grupo-abas-treino');
    const botoesStatus = document.querySelectorAll('.btn-status');
    const botoesEmoji = document.querySelectorAll('.btn-emoji-aluno');
    const botaoSalvar = document.querySelector('.botao-principal-verde');
    const botaoCancelar = document.querySelector('.btn-voltar-simples');
    const campoObservacoes = document.querySelector('.card-observacoes textarea');
    const dataAtual = formatarData(new Date());

    let treinoAtual = carregarTreinoAluno();
    let grupoAtivoId = treinoAtual.grupos[0].id;
    let statusAtual = 'Em andamento';
    let sensacaoSelecionada = 'Boa';

    document.querySelector('.valor-data').textContent = dataAtual;

    function slugify(valor) {
        return String(valor || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') || 'aluno-padrao';
    }

    function formatarData(data) {
        return data.toLocaleDateString('pt-BR');
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

    function getAlunoAtual() {
        if (window.AlunoContexto && typeof window.AlunoContexto.buscarAlunoAtual === 'function') {
            return window.AlunoContexto.buscarAlunoAtual({ preferirUsuarioLogado: true });
        }

        try {
            const usuarioLogado = JSON.parse(localStorage.getItem('mypersonal:usuarioLogado'));
            if (usuarioLogado && (usuarioLogado.tipo === 'aluno' || usuarioLogado.perfil === 'aluno')) {
                return usuarioLogado;
            }

            const alunoSessao = JSON.parse(sessionStorage.getItem('alunoSelecionado'));
            if (alunoSessao && alunoSessao.nome) return alunoSessao;
        } catch (erro) {
            console.warn('Nao foi possivel ler o aluno atual.', erro);
        }

        return ALUNO_PADRAO;
    }

    function getAlunoId() {
        const aluno = getAlunoAtual();
        return aluno.id || aluno.alunoId || slugify(aluno.nome) || ALUNO_PADRAO.id;
    }

    function getAliasesAluno() {
        const aluno = getAlunoAtual();
        if (window.AlunoContexto && typeof window.AlunoContexto.gerarAliasesAluno === 'function') {
            return window.AlunoContexto.gerarAliasesAluno(aluno);
        }

        return [getAlunoId(), slugify(aluno.nome), 'aluno-' + slugify(aluno.nome), ALUNO_PADRAO.id, 'eliabe-monteiro'].filter(Boolean);
    }


    function criarTreinoPadrao() {
        const aluno = getAlunoAtual();

        return {
            alunoId: getAlunoId(),
            alunoNome: aluno.nome || ALUNO_PADRAO.nome,
            atualizadoEm: new Date().toISOString(),
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
        const alunoId = getAlunoId();
        const aluno = getAlunoAtual();
        const treinos = lerJson(TREINOS_STORAGE_KEY, {});
        const aliases = getAliasesAluno();
        const chaveExistente = aliases.find(chave => treinos[chave] && treinos[chave].grupos && treinos[chave].grupos.length);

        if (chaveExistente) {
            const treinoEncontrado = { ...treinos[chaveExistente], alunoId, alunoNome: aluno.nome || treinos[chaveExistente].alunoNome };
            treinos[alunoId] = treinoEncontrado;
            salvarJson(TREINOS_STORAGE_KEY, treinos);
            return treinoEncontrado;
        }

        const treinoPadrao = criarTreinoPadrao();
        treinos[alunoId] = treinoPadrao;
        salvarJson(TREINOS_STORAGE_KEY, treinos);
        return treinoPadrao;
    }


    function getGrupoAtivo() {
        return treinoAtual.grupos.find(grupo => grupo.id === grupoAtivoId) || treinoAtual.grupos[0];
    }

    function renderizarAbas() {
        grupoAbas.innerHTML = '';

        treinoAtual.grupos.forEach(grupo => {
            const botao = document.createElement('button');
            botao.type = 'button';
            botao.className = 'aba-treino' + (grupo.id === grupoAtivoId ? ' ativa' : '');
            botao.textContent = grupo.aba || grupo.nome || 'Treino';
            botao.dataset.grupoId = grupo.id;
            botao.addEventListener('click', () => {
                grupoAtivoId = grupo.id;
                renderizarAbas();
                renderizarExercicios();
                carregarRegistroDoDia();
            });
            grupoAbas.appendChild(botao);
        });
    }

    function renderizarExercicios() {
        const grupo = getGrupoAtivo();
        const exercicios = grupo.exercicios || [];
        containerExercicios.innerHTML = '';

        if (!exercicios.length) {
            containerExercicios.innerHTML = '<div class="linha-treino linha-vazia"><div class="w-ex">Nenhum exercicio cadastrado neste grupo.</div></div>';
            return;
        }

        exercicios.forEach((exercicio, index) => {
            const linha = document.createElement('div');
            linha.className = 'linha-treino';
            linha.dataset.index = String(index);
            linha.innerHTML = `
                <div class="w-num">${index + 1}</div>
                <div class="w-ex">
                    <div class="nome-treino">${exercicio.nome || 'Exercicio sem nome'}</div>
                    <div class="dica-prof">${exercicio.observacao || 'Sem observacao do profissional'}</div>
                </div>
                <div class="w-alvo alvo-series">${exercicio.series || '-'}</div>
                <div class="w-alvo alvo-reps">${exercicio.reps || '-'}</div>
                <div class="w-alvo alvo-desc">${exercicio.descanso || '-'}</div>
                <div class="w-video">
                    <button type="button" class="btn-play" ${exercicio.video ? '' : 'disabled'}>▶</button>
                </div>
                <div class="w-reg"><input type="text" class="registro-series" placeholder="-"></div>
                <div class="w-reg"><input type="text" class="registro-reps" placeholder="-"></div>
                <div class="w-reg"><input type="text" class="registro-carga" placeholder="-"></div>
                <div class="w-obs"><input type="text" class="registro-obs" placeholder="Notas..."></div>
            `;

            const botaoVideo = linha.querySelector('.btn-play');
            botaoVideo.addEventListener('click', () => abrirModalVideo(exercicio));
            containerExercicios.appendChild(linha);
        });
    }

    function converterYoutubeParaEmbed(url) {
        if (!url) return '';
        let embedUrl = url.trim();

        if (embedUrl.includes('youtube.com/watch?v=')) {
            const videoId = embedUrl.split('v=')[1].split('&')[0];
            embedUrl = 'https://www.youtube.com/embed/' + videoId;
        } else if (embedUrl.includes('youtu.be/')) {
            const videoId = embedUrl.split('youtu.be/')[1].split('?')[0];
            embedUrl = 'https://www.youtube.com/embed/' + videoId;
        }

        return embedUrl;
    }

    function abrirModalVideo(exercicio) {
        modalTitulo.textContent = exercicio.nome || 'Exercicio';
        modalSeries.textContent = exercicio.series || '-';
        modalReps.textContent = exercicio.reps || '-';
        modalDesc.textContent = exercicio.descanso || '-';
        modalDica.textContent = exercicio.observacao || 'Sem observacao do profissional.';
        modalIframe.setAttribute('src', converterYoutubeParaEmbed(exercicio.video));
        modal.classList.add('ativo');
    }

    function fecharModalVideo() {
        modal.classList.remove('ativo');
        modalIframe.setAttribute('src', '');
    }

    function getChaveRegistro() {
        return [getAlunoId(), getGrupoAtivo().id, dataAtual].join('|');
    }

    function lerRegistros() {
        return lerJson(REGISTROS_STORAGE_KEY, {});
    }

    function carregarRegistroDoDia() {
        const registros = lerRegistros();
        const registro = registros[getChaveRegistro()];

        if (!registro) {
            campoObservacoes.value = '';
            return;
        }

        statusAtual = registro.statusTreino || statusAtual;
        sensacaoSelecionada = registro.sensacaoFinal || sensacaoSelecionada;
        campoObservacoes.value = registro.feedbackGeral || '';

        botoesStatus.forEach(botao => {
            botao.classList.toggle('ativo', botao.textContent.trim() === statusAtual);
        });

        botoesEmoji.forEach(botao => {
            const texto = botao.querySelector('.emoji-txt').textContent.trim();
            botao.classList.toggle('selecionado', texto === sensacaoSelecionada);
        });

        document.querySelectorAll('.linha-treino').forEach((linha, index) => {
            const exercicio = registro.exercicios[index];
            if (!exercicio) return;

            linha.querySelector('.registro-series').value = exercicio.seriesRealizadas || '';
            linha.querySelector('.registro-reps').value = exercicio.repeticoesRealizadas || '';
            linha.querySelector('.registro-carga').value = exercicio.cargaUtilizada || '';
            linha.querySelector('.registro-obs').value = exercicio.observacaoParticular || '';
        });
    }

    botoesStatus.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesStatus.forEach(b => b.classList.remove('ativo'));
            botao.classList.add('ativo');
            statusAtual = botao.textContent.trim();
        });
    });

    botoesEmoji.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesEmoji.forEach(b => b.classList.remove('selecionado'));
            botao.classList.add('selecionado');
            sensacaoSelecionada = botao.querySelector('.emoji-txt').textContent.trim();
        });
    });

    btnFecharX.addEventListener('click', fecharModalVideo);
    btnFecharMaster.addEventListener('click', fecharModalVideo);
    modal.addEventListener('click', event => {
        if (event.target === modal) fecharModalVideo();
    });

    botaoSalvar.addEventListener('click', () => {
        const grupo = getGrupoAtivo();
        const registroExercicios = [];

        document.querySelectorAll('.linha-treino').forEach((linha, index) => {
            const exercicioBase = grupo.exercicios[index];
            if (!exercicioBase) return;

            registroExercicios.push({
                exercicio: exercicioBase.nome,
                seriesRealizadas: linha.querySelector('.registro-series').value.trim() || null,
                repeticoesRealizadas: linha.querySelector('.registro-reps').value.trim() || null,
                cargaUtilizada: linha.querySelector('.registro-carga').value.trim() || null,
                observacaoParticular: linha.querySelector('.registro-obs').value.trim()
            });
        });

        const registros = lerRegistros();
        registros[getChaveRegistro()] = {
            alunoId: getAlunoId(),
            alunoNome: getAlunoAtual().nome || treinoAtual.alunoNome || ALUNO_PADRAO.nome,
            treinoSelecionado: grupo.aba || grupo.nome,
            grupoId: grupo.id,
            statusTreino: statusAtual,
            dataRegistro: dataAtual,
            exercicios: registroExercicios,
            feedbackGeral: campoObservacoes.value.trim(),
            sensacaoFinal: sensacaoSelecionada,
            salvoEm: new Date().toISOString()
        };

        salvarJson(REGISTROS_STORAGE_KEY, registros);
        alert('Registro de treino salvo com sucesso!');
    });

    botaoCancelar.addEventListener('click', () => {
        if (confirm('Deseja realmente descartar as alteracoes do treino de hoje?')) {
            carregarRegistroDoDia();
        }
    });

    renderizarAbas();
    renderizarExercicios();
    carregarRegistroDoDia();
});
