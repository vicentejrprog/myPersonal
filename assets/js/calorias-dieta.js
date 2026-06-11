function somarCampos(refeicao, nomeCampo) {
  const campos = refeicao.querySelectorAll(`input[aria-label="${nomeCampo}"]`)

  return Array.from(campos).reduce((soma, campo) => {
    return soma + (Number(campo.value) || 0)
  }, 0)
}

function atualizarTotais() {
  const refeicoes = document.querySelectorAll(".editor-card")
  let totalCalorias = 0
  let totalProteina = 0
  let totalCarboidrato = 0
  let totalGordura = 0

  refeicoes.forEach((refeicao) => {
    const caloriasRefeicao = somarCampos(refeicao, "Calorias")
    const totalTexto = refeicao.querySelector("[data-total-refeicao]")
    if (totalTexto) {
      totalTexto.textContent = `Total: ${caloriasRefeicao} kcal`
    }

    totalCalorias += caloriasRefeicao
    totalProteina += somarCampos(refeicao, "Proteína")
    totalCarboidrato += somarCampos(refeicao, "Carboidrato")
    totalGordura += somarCampos(refeicao, "Gordura")
  })

  const totais = {
    "[data-total-calorias]": `${totalCalorias} kcal`,
    "[data-total-proteina]": `${totalProteina} g`,
    "[data-total-carboidrato]": `${totalCarboidrato} g`,
    "[data-total-gordura]": `${totalGordura} g`,
  }

  Object.entries(totais).forEach(([seletor, texto]) => {
    const elemento = document.querySelector(seletor)
    if (elemento) {
      elemento.textContent = texto
    }
  })
}

function criarLinhaAlimento() {
  const linha = document.createElement("tr")

  linha.innerHTML = `
    <td><input type="text" aria-label="Alimento"></td>
    <td><input type="text" aria-label="Quantidade"></td>
    <td><input type="number" aria-label="Calorias" value="0"></td>
    <td><input type="number" aria-label="Proteína" value="0"></td>
    <td><input type="number" aria-label="Carboidrato" value="0"></td>
    <td><input type="number" aria-label="Gordura" value="0"></td>
  `

  return linha
}

document.addEventListener("input", (evento) => {
  if (evento.target.matches('input[type="number"]')) {
    atualizarTotais()
  }
})

document.querySelectorAll("[data-add-food]").forEach((botao) => {
  botao.addEventListener("click", () => {
    const refeicao = botao.closest(".editor-card")
    const tabela = refeicao.querySelector("tbody")
    const novaLinha = criarLinhaAlimento()

    tabela.appendChild(novaLinha)
    novaLinha.querySelector('input[aria-label="Alimento"]').focus()
    atualizarTotais()
  })
})

atualizarTotais()
