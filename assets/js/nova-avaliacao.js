/* ============================================================
   nova-avaliacao.js
   Cadastro de avaliacao, comparativo e fotos opcionais.
   ============================================================ */
(function (app) {
  const {
    buscarUltimaAvaliacao,
    calcularImc,
    converterDecimal,
    definirErroCampo,
    formatarData,
    numeroOuTraco,
    salvarAvaliacao,
    validarTextoObrigatorio,
  } = app;

  /* codigo para validar numeros positivos e faixas permitidas */
  function validarNumeroPositivo(id, mensagem, opcoes = {}) {
    const campo = document.getElementById(id);
    if (!campo) return true;

    if (opcoes.optional && campo.value.trim() === "") {
      definirErroCampo(campo, "");
      return true;
    }

    const numero = converterDecimal(campo.value);
    const invalido = numero === null
      || numero <= 0
      || (opcoes.max !== undefined && numero > opcoes.max)
      || (opcoes.min !== undefined && numero < opcoes.min);

    definirErroCampo(campo, invalido ? mensagem : "");
    return !invalido;
  }

  /* codigo de validacao da nova avaliacao */
  function validarNovaAvaliacao() {
    const validacoes = [
      validarTextoObrigatorio("data-avaliacao", "Informe a data da avaliacao."),
      validarNumeroPositivo("peso", "Informe um peso maior que zero."),
      validarNumeroPositivo("altura", "Informe uma altura maior que zero."),
      validarNumeroPositivo("gordura", "Informe um percentual entre 0 e 100.", { min: 0, max: 100 }),
      validarNumeroPositivo("massa-magra", "Informe uma massa magra maior que zero."),
      validarNumeroPositivo("cintura", "Informe uma cintura maior que zero.", { optional: true }),
      validarNumeroPositivo("quadril", "Informe um quadril maior que zero.", { optional: true }),
      validarNumeroPositivo("braco-direito", "Informe uma medida maior que zero.", { optional: true }),
      validarNumeroPositivo("braco-esquerdo", "Informe uma medida maior que zero.", { optional: true }),
      validarNumeroPositivo("coxa-direita", "Informe uma medida maior que zero.", { optional: true }),
      validarNumeroPositivo("coxa-esquerda", "Informe uma medida maior que zero.", { optional: true }),
    ];

    const valido = validacoes.every(Boolean);

    if (!valido) {
      const primeiroInvalido = document.querySelector("#form-avaliacao .is-invalid");
      primeiroInvalido?.focus();
    }

    return valido;
  }

  /* codigo para formatar diferencas no comparativo da avaliacao */
  function formatarDiferenca(valor, sufixo) {
    if (valor === null || valor === undefined || Number.isNaN(valor)) return "-";
    return `${valor > 0 ? "+" : ""}${valor.toLocaleString("pt-BR")}${sufixo}`;
  }

  /* codigo para ler uma foto escolhida pelo usuario */
  function lerFotoComoDataUrl(arquivo) {
    return new Promise((resolve, reject) => {
      const leitor = new FileReader();
      leitor.onload = () => resolve(leitor.result);
      leitor.onerror = () => reject(leitor.error);
      leitor.readAsDataURL(arquivo);
    });
  }

  /* codigo para diminuir a foto antes de salvar no localStorage */
  function compactarFoto(arquivo) {
    return new Promise((resolve) => {
      const imagem = new Image();
      const leitor = new FileReader();

      leitor.onload = () => {
        imagem.onload = () => {
          const limite = 900;
          const escala = Math.min(1, limite / Math.max(imagem.width, imagem.height));
          const largura = Math.round(imagem.width * escala);
          const altura = Math.round(imagem.height * escala);
          const canvas = document.createElement("canvas");
          const contexto = canvas.getContext("2d");

          if (!contexto) {
            resolve(leitor.result);
            return;
          }

          canvas.width = largura;
          canvas.height = altura;
          contexto.drawImage(imagem, 0, 0, largura, altura);
          resolve(canvas.toDataURL("image/jpeg", 0.76));
        };

        imagem.onerror = async () => resolve(await lerFotoComoDataUrl(arquivo));
        imagem.src = leitor.result;
      };

      leitor.onerror = async () => resolve(await lerFotoComoDataUrl(arquivo));
      leitor.readAsDataURL(arquivo);
    });
  }

  /* codigo para configurar previews e remocao das fotos da nova avaliacao */
  function configurarFotosNovaAvaliacao() {
    const entradaFotos = document.getElementById("fotos-avaliacao");
    const botaoAdicionar = document.getElementById("adicionar-fotos");
    const botoesFoto = Array.from(document.querySelectorAll("[data-foto-tipo]"));
    if (!entradaFotos || !botaoAdicionar || !botoesFoto.length) return () => [];

    const rotulos = {
      frente: "Frente",
      lado: "Lado",
      costas: "Costas",
    };
    const fotosSelecionadas = {
      frente: null,
      lado: null,
      costas: null,
    };
    let tipoAtual = "frente";

    function renderizarFoto(tipo) {
      const botaoFoto = botoesFoto.find((botao) => botao.dataset.fotoTipo === tipo);
      const foto = fotosSelecionadas[tipo];
      if (!botaoFoto) return;

      botaoFoto.classList.toggle("is-filled", Boolean(foto));
      botaoFoto.innerHTML = foto
        ? `<img src="${foto.dados}" alt="Foto ${rotulos[tipo]}"><span>${rotulos[tipo]}</span><button class="remover-foto" type="button" aria-label="Remover foto ${rotulos[tipo]}" data-remover-foto="${tipo}">x</button>`
        : `<span>${rotulos[tipo]}</span>`;
    }

    function buscarProximoTipoLivre() {
      return Object.keys(fotosSelecionadas).find((tipo) => !fotosSelecionadas[tipo]) || "frente";
    }

    botaoAdicionar.addEventListener("click", () => {
      tipoAtual = buscarProximoTipoLivre();
      entradaFotos.multiple = true;
      entradaFotos.click();
    });

    botoesFoto.forEach((botaoFoto) => {
      botaoFoto.addEventListener("click", (evento) => {
        const botaoRemover = evento.target.closest("[data-remover-foto]");
        if (botaoRemover) {
          evento.stopPropagation();
          fotosSelecionadas[botaoRemover.dataset.removerFoto] = null;
          renderizarFoto(botaoRemover.dataset.removerFoto);
          return;
        }

        tipoAtual = botaoFoto.dataset.fotoTipo;
        entradaFotos.multiple = false;
        entradaFotos.click();
      });

      botaoFoto.addEventListener("keydown", (evento) => {
        if (evento.key !== "Enter" && evento.key !== " ") return;
        evento.preventDefault();
        botaoFoto.click();
      });
    });

    entradaFotos.addEventListener("change", async () => {
      const arquivos = Array.from(entradaFotos.files || []).filter((arquivo) => arquivo.type.startsWith("image/"));
      if (!arquivos.length) return;

      const tipos = entradaFotos.multiple
        ? Object.keys(fotosSelecionadas).filter((tipo) => !fotosSelecionadas[tipo])
        : [tipoAtual];
      const tiposDestino = tipos.length ? tipos : Object.keys(fotosSelecionadas);

      for (const [indice, arquivo] of arquivos.slice(0, tiposDestino.length).entries()) {
        const tipo = tiposDestino[indice];
        fotosSelecionadas[tipo] = {
          tipo,
          nome: arquivo.name,
          dados: await compactarFoto(arquivo),
        };
        renderizarFoto(tipo);
      }

      entradaFotos.value = "";
    });

    return () => Object.values(fotosSelecionadas).filter(Boolean);
  }

  /* codigo do comparativo em tempo real da nova avaliacao */
  function configurarComparativoNovaAvaliacao() {
    const formulario = document.getElementById("form-avaliacao");
    const comparativo = document.querySelector(".comparativo-lista");
    if (!formulario || !comparativo) return;

    const ultima = buscarUltimaAvaliacao();
    if (!ultima) {
      comparativo.innerHTML = `
        <div class="item-comparativo">
          <span>Avaliacao anterior</span>
          <strong>Nenhum registro</strong>
        </div>
      `;
      return;
    }

    comparativo.innerHTML = `
      <div class="item-comparativo">
        <span>Data anterior</span>
        <strong>${formatarData(ultima.data)}</strong>
      </div>
      <div class="item-comparativo">
        <span>Peso</span>
        <strong data-comparativo="peso"></strong>
      </div>
      <div class="item-comparativo">
        <span>% Gordura</span>
        <strong data-comparativo="gordura"></strong>
      </div>
      <div class="item-comparativo">
        <span>Massa magra</span>
        <strong data-comparativo="massa-magra"></strong>
      </div>
      <div class="item-comparativo">
        <span>IMC anterior</span>
        <strong>${calcularImc(ultima)}</strong>
      </div>
    `;

    const campos = [
      { id: "peso", chave: "peso", anterior: ultima.peso, sufixo: " kg" },
      { id: "gordura", chave: "gordura", anterior: ultima.gordura, sufixo: "%" },
      { id: "massa-magra", chave: "massa-magra", anterior: ultima.massaMagra, sufixo: " kg" },
    ];

    function atualizarComparativo() {
      campos.forEach((item) => {
        const atual = converterDecimal(document.getElementById(item.id)?.value);
        const anterior = converterDecimal(item.anterior);
        const alvo = comparativo.querySelector(`[data-comparativo="${item.chave}"]`);
        if (!alvo) return;

        const valorAnterior = numeroOuTraco(item.anterior, item.sufixo);
        if (atual === null || anterior === null) {
          alvo.textContent = `Anterior: ${valorAnterior}`;
          return;
        }

        alvo.textContent = `Anterior: ${valorAnterior} (${formatarDiferenca(atual - anterior, item.sufixo)})`;
      });
    }

    campos.forEach((item) => {
      document.getElementById(item.id)?.addEventListener("input", atualizarComparativo);
    });

    atualizarComparativo();
  }

  /* codigo para salvar a nova avaliacao */
  function configurarNovaAvaliacao() {
    const formulario = document.getElementById("form-avaliacao");
    if (!formulario) return;

    configurarComparativoNovaAvaliacao();
    const buscarFotosSelecionadas = configurarFotosNovaAvaliacao();

    formulario.addEventListener("submit", (evento) => {
      if (!validarNovaAvaliacao()) {
        evento.preventDefault();
        evento.stopImmediatePropagation();
        return;
      }

      const data = document.getElementById("data-avaliacao")?.value || new Date().toISOString().slice(0, 10);

      const avaliacaoSalva = salvarAvaliacao({
        id: `avaliacao-${Date.now()}`,
        data,
        tipo: document.getElementById("tipo-avaliacao")?.value || "Avaliação corporal",
        peso: document.getElementById("peso")?.value || "",
        altura: document.getElementById("altura")?.value || "",
        gordura: document.getElementById("gordura")?.value || "",
        massaMagra: document.getElementById("massa-magra")?.value || "",
        cintura: document.getElementById("cintura")?.value || "",
        quadril: document.getElementById("quadril")?.value || "",
        bracoDireito: document.getElementById("braco-direito")?.value || "",
        bracoEsquerdo: document.getElementById("braco-esquerdo")?.value || "",
        coxaDireita: document.getElementById("coxa-direita")?.value || "",
        coxaEsquerda: document.getElementById("coxa-esquerda")?.value || "",
        observacoes: document.getElementById("obs-avaliacao")?.value || "",
        fotos: buscarFotosSelecionadas(),
      });

      if (!avaliacaoSalva) {
        evento.preventDefault();
        evento.stopImmediatePropagation();
      }
    }, true);
  }

  Object.assign(app, {
    validarNumeroPositivo,
    validarNovaAvaliacao,
    formatarDiferenca,
    lerFotoComoDataUrl,
    compactarFoto,
    configurarFotosNovaAvaliacao,
    configurarComparativoNovaAvaliacao,
    configurarNovaAvaliacao,
  });
})(window.MyPersonal = window.MyPersonal || {});
