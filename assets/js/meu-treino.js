document.addEventListener('DOMContentLoaded', () => {

    // Dados simulados do treino configurado pelo profissional.
    const dadosDoTreinoConfigurado = {
        "1": {
            nome: "Supino reto com barra",
            series: "4",
            reps: "12",
            descanso: "60s",
            dica: "Obs: Manter escápulas retraídas durante o movimento.",
            videoUrl: "https://www.youtube.com/watch?v=sqOw2Y6Ju9A"
        }
    };


    // Referencias dos elementos exibidos dentro do modal de video.
    const modal = document.getElementById('modal-video');
    const modalTitulo = document.getElementById('modal-titulo-exercicio');
    const modalIframe = document.getElementById('modal-iframe-video');
    const modalSeries = document.getElementById('modal-info-series');
    const modalReps = document.getElementById('modal-info-reps');
    const modalDesc = document.getElementById('modal-info-desc');
    const modalDica = document.getElementById('modal-dica-professor');
    const btnFecharX = document.getElementById('btn-fechar-x');
    const btnFecharMaster = document.getElementById('btn-fechar-master');

    // Controles principais usados para registrar o estado do treino do aluno.
    const abas = document.querySelectorAll('.aba-treino');
    const botoesStatus = document.querySelectorAll('.btn-status');
    const botoesEmoji = document.querySelectorAll('.btn-emoji-aluno');
    const botaoSalvar = document.querySelector('.botao-principal-verde');
    const botaoCancelar = document.querySelector('.btn-voltar-simples');
    const botoesPlay = document.querySelectorAll('.btn-play');


    // Guarda as escolhas atuais para compor o payload no momento de salvar.
    let statusAtual = "Em andamento";
    let sensacaoSelecionada = "Boa";


    // Alterna a aba ativa e indica qual treino deve ser carregado.
    abas.forEach(aba => {
        aba.addEventListener('click', () => {
            abas.forEach(a => a.classList.remove('ativa'));
            aba.classList.add('ativa');
            console.log(`Carregando dados do: ${aba.textContent}`);
        });
    });


    // Atualiza o status geral do treino selecionado pelo aluno.
    botoesStatus.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesStatus.forEach(b => b.classList.remove('ativo'));
            botao.classList.add('ativo');
            statusAtual = botao.textContent;
            console.log(`Status alterado para: ${statusAtual}`);
        });
    });


    // Registra a sensacao do aluno ao final ou durante o treino.
    botoesEmoji.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesEmoji.forEach(b => b.classList.remove('selecionado'));
            botao.classList.add('selecionado');
            sensacaoSelecionada = botao.querySelector('.emoji-txt').textContent;
            console.log(`Sensação selecionada: ${sensacaoSelecionada}`);
        });
    });


    // Abre o modal do exercicio com os dados e o video configurados.
    botoesPlay.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const linha = e.target.closest('.linha-treino');
            const idExercicio = linha.getAttribute('data-id');

            const dadosConfigurados = dadosDoTreinoConfigurado[idExercicio];

            if (dadosConfigurados) {
                // Preenche o modal com as informacoes do exercicio escolhido.
                modalTitulo.textContent = dadosConfigurados.nome;
                modalSeries.textContent = dadosConfigurados.series;
                modalReps.textContent = dadosConfigurados.reps;
                modalDesc.textContent = dadosConfigurados.descanso;
                modalDica.textContent = dadosConfigurados.dica;

                // Converte link comum do YouTube para o formato usado pelo iframe.
                let embedUrl = dadosConfigurados.videoUrl;
                if (embedUrl.includes("youtube.com/watch?v=")) {
                    const videoId = embedUrl.split("v=")[1].split("&")[0];
                    embedUrl = `https://www.youtube.com/embed/${videoId}`;
                } else if (embedUrl.includes("youtu.be/")) {
                    const videoId = embedUrl.split("youtu.be/")[1].split("?")[0];
                    embedUrl = `https://www.youtube.com/embed/${videoId}`;
                }

                modalIframe.setAttribute('src', embedUrl);

                modal.classList.add('ativo');
            }
        });
    });


    // Fecha o modal e interrompe o video em reproducao.
    function fecharModalVideo() {
        modal.classList.remove('ativo');
        modalIframe.setAttribute('src', ''); // Limpa o src para cortar o audio imediatamente.
    }

    btnFecharX.addEventListener('click', fecharModalVideo);
    btnFecharMaster.addEventListener('click', fecharModalVideo);

    // Fecha o modal quando o clique acontece fora do card principal.
    modal.addEventListener('click', (e) => {
        if(e.target === modal) fecharModalVideo();
    });


    // Coleta os dados preenchidos pelo aluno e monta o registro do treino.
    botaoSalvar.addEventListener('click', () => {
        const linhasTreino = document.querySelectorAll('.linha-treino');
        const registroExercicios = [];

        linhasTreino.forEach(linha => {
            const nomeExercicios = linha.querySelector('.nome-treino').textContent;
            const inputs = linha.querySelectorAll('.w-reg input');
            const obsInput = linha.querySelector('.w-obs input');

            const dadosExercicio = {
                exercicio: nomeExercicios,
                seriesRealizadas: inputs[0].value || null,
                repeticoesRealizadas: inputs[1].value || null,
                cargaUtilizada: inputs[2].value || null,
                observacaoParticular: obsInput.value || ""
            };

            registroExercicios.push(dadosExercicio);
        });

        const observacoesGerais = document.querySelector('textarea').value;


        const payloadTreino = {
            treinoSelecionado: document.querySelector('.aba-treino.ativa').textContent,
            statusTreino: statusAtual,
            dataRegistro: document.querySelector('.valor-data').textContent,
            exercicios: registroExercicios,
            feedbackGeral: observacoesGerais,
            sensacaoFinal: sensacaoSelecionada
        };

        console.log("Enviando dados do treino para o servidor:", payloadTreino);
        alert("Registro de treino salvo com sucesso!");
    });


    // Cancela as alteracoes e retorna para a pagina principal do treino.
    botaoCancelar.addEventListener('click', () => {
        if(confirm("Deseja realmente descartar as alterações do treino de hoje?")) {
            window.location.href = "meu-treino.html";
        }
    });
});
