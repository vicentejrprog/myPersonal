const DIET_STORAGE_KEYS = {
  loggedUser: "mypersonal:usuarioLogado",
  users: "mypersonal:usuarios",
  diets: "mypersonal:dietas",
  selectedStudent: "mypersonal:alunoSelecionadoId",
}

const DIET_MOCK_STUDENT_ID = "aluno-eliabe-mock"
const DIET_MOCK_PROFESSIONAL_ID = "profissional-eliabe-mock"

const DIET_DAYS = [
  ["segunda", "Segunda", "Seg"],
  ["terca", "Terça", "Ter"],
  ["quarta", "Quarta", "Qua"],
  ["quinta", "Quinta", "Qui"],
  ["sexta", "Sexta", "Sex"],
  ["sabado", "Sábado", "Sáb"],
  ["domingo", "Domingo", "Dom"],
]

let selectedDietDay = "segunda"
let editorDraftDiet = null

function readStorageObject(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {}
  } catch (error) {
    return {}
  }
}

function writeStorageObject(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function getAlunoContextoDiet(preferirUsuarioLogado = false) {
  if (window.AlunoContexto && typeof window.AlunoContexto.buscarAlunoAtual === "function") {
    return window.AlunoContexto.buscarAlunoAtual({ preferirUsuarioLogado })
  }

  return null
}

function getAliasesAlunoDiet(studentId) {
  const student = getStudentById(studentId) || { id: studentId }

  if (window.AlunoContexto && typeof window.AlunoContexto.gerarAliasesAluno === "function") {
    return window.AlunoContexto.gerarAliasesAluno(student)
  }

  const aliases = new Set([studentId, student?.alunoId].filter(Boolean))
  if (student?.nome) {
    const slug = slugify(student.nome)
    aliases.add(slug)
    aliases.add(`aluno-${slug}`)
    if (slug.includes("eliabe")) aliases.add("eliabe")
  }

  return Array.from(aliases).filter(Boolean)
}

function ensureMockAccounts(requiredRole) {
  const users = readStorageObject(DIET_STORAGE_KEYS.users)

  users[DIET_MOCK_PROFESSIONAL_ID] ||= {
    id: DIET_MOCK_PROFESSIONAL_ID,
    tipo: "profissional",
    nome: "Profissional Mock Eliabe",
  }

  users[DIET_MOCK_STUDENT_ID] ||= {
    id: DIET_MOCK_STUDENT_ID,
    tipo: "aluno",
    nome: "Eliabe Mock",
    profissionalId: DIET_MOCK_PROFESSIONAL_ID,
  }

  writeStorageObject(DIET_STORAGE_KEYS.users, users)

  const loggedUser = readStorageObject(DIET_STORAGE_KEYS.loggedUser)
  if (!loggedUser.id || loggedUser.tipo !== requiredRole) {
    const fallbackId = requiredRole === "profissional" ? DIET_MOCK_PROFESSIONAL_ID : DIET_MOCK_STUDENT_ID
    writeStorageObject(DIET_STORAGE_KEYS.loggedUser, users[fallbackId])
    return users[fallbackId]
  }

  return loggedUser
}

function getStudentsForProfessional(professionalId) {
  if (window.AlunoContexto && typeof window.AlunoContexto.listarAlunosDoProfissional === "function") {
    return window.AlunoContexto.listarAlunosDoProfissional(professionalId)
  }

  const users = readStorageObject(DIET_STORAGE_KEYS.users)
  let changed = false

  const students = Object.values(users).filter((user) => {
    if (!(user.tipo === "aluno" || user.perfil === "aluno")) return false
    if (user.profissionalId === professionalId) return true

    if (!user.profissionalId && professionalId && users[user.id]) {
      users[user.id] = { ...users[user.id], profissionalId: professionalId }
      changed = true
      return true
    }

    return false
  })

  if (changed) writeStorageObject(DIET_STORAGE_KEYS.users, users)
  return students
}

function syncSelectedStudentFromProfile(professionalId) {
  try {
    const selectedProfileStudent = JSON.parse(sessionStorage.getItem("alunoSelecionado"))
    if (!selectedProfileStudent?.nome && !selectedProfileStudent?.id && !selectedProfileStudent?.email) return null

    if (window.AlunoContexto && typeof window.AlunoContexto.setAlunoSelecionado === "function") {
      const student = window.AlunoContexto.setAlunoSelecionado({
        ...selectedProfileStudent,
        profissionalId: selectedProfileStudent.profissionalId || professionalId,
      })

      localStorage.setItem(DIET_STORAGE_KEYS.selectedStudent, student.id)
      return student.id
    }

    const users = readStorageObject(DIET_STORAGE_KEYS.users)
    const studentId = selectedProfileStudent.id || selectedProfileStudent.alunoId || `aluno-${slugify(selectedProfileStudent.nome)}`

    users[studentId] = {
      ...users[studentId],
      id: studentId,
      alunoId: studentId,
      tipo: "aluno",
      perfil: "aluno",
      nome: selectedProfileStudent.nome,
      email: selectedProfileStudent.email || users[studentId]?.email || "",
      telefone: selectedProfileStudent.tel || selectedProfileStudent.telefone || "",
      nascimento: selectedProfileStudent.nasc || selectedProfileStudent.nascimento || "",
      sexo: selectedProfileStudent.sexo || "",
      cidade: selectedProfileStudent.cidade || "",
      peso: selectedProfileStudent.peso || "",
      altura: selectedProfileStudent.altura || "",
      gordura: selectedProfileStudent.gordura || "",
      objetivo: selectedProfileStudent.objetivo || "",
      status: selectedProfileStudent.status || "",
      profissionalId,
    }

    writeStorageObject(DIET_STORAGE_KEYS.users, users)
    localStorage.setItem(DIET_STORAGE_KEYS.selectedStudent, studentId)
    return studentId
  } catch (error) {
    return null
  }
}


function getStudentById(studentId) {
  const users = readStorageObject(DIET_STORAGE_KEYS.users)
  if (users[studentId]) return users[studentId]

  if (window.AlunoContexto && typeof window.AlunoContexto.buscarAlunoPorId === "function") {
    return window.AlunoContexto.buscarAlunoPorId(studentId)
  }

  return null
}

function getSelectedStudentId(professionalId) {
  const students = getStudentsForProfessional(professionalId)
  const selectedStudentId = localStorage.getItem(DIET_STORAGE_KEYS.selectedStudent)
  const selectedStudent = students.find((student) => student.id === selectedStudentId)

  if (selectedStudent) return selectedStudent.id

  if (students.length) {
    localStorage.setItem(DIET_STORAGE_KEYS.selectedStudent, students[0].id)
    return students[0].id
  }

  return null
}

function updateCurrentStudentName(studentId) {
  const student = getStudentById(studentId)
  const studentNameElement = document.querySelector("[data-current-student-name]")
  const avatarElement = document.querySelector(".student-header .avatar")

  if (studentNameElement && student) studentNameElement.textContent = student.nome
  if (avatarElement && student) {
    avatarElement.textContent = student.nome
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name[0])
      .join("")
      .toUpperCase()
  }
}

function createEmptyDays() {
  return DIET_DAYS.reduce((days, [dayKey]) => {
    days[dayKey] = { refeicoes: [] }
    return days
  }, {})
}

function findCurrentDiet(studentId) {
  const diets = readStorageObject(DIET_STORAGE_KEYS.diets)
  const aliases = getAliasesAlunoDiet(studentId)
  const diet = Object.values(diets).find((item) => aliases.includes(item.alunoId) && item.atual) || null

  if (diet && diet.alunoId !== studentId) {
    diet.alunoId = studentId
    diets[diet.id] = diet
    writeStorageObject(DIET_STORAGE_KEYS.diets, diets)
  }

  return diet
}

function createEmptyDiet(studentId, professionalId) {
  const now = new Date().toISOString()
  const dietId = createId("dieta")

  return {
    id: dietId,
    alunoId: studentId,
    profissionalId: professionalId,
    atual: true,
    criadaEm: now,
    atualizadaEm: now,
    observacoesProfissional: "",
    dias: createEmptyDays(),
  }
}

function saveDiet(diet) {
  const diets = readStorageObject(DIET_STORAGE_KEYS.diets)
  diet.atualizadaEm = new Date().toISOString()
  diets[diet.id] = diet
  writeStorageObject(DIET_STORAGE_KEYS.diets, diets)
}

function numberValue(value) {
  return Number(value) || 0
}

function calculateTotals(meals) {
  return meals.reduce(
    (totals, meal) => {
      meal.alimentos.forEach((food) => {
        totals.calorias += numberValue(food.calorias)
        totals.proteina += numberValue(food.proteina)
        totals.carboidrato += numberValue(food.carboidrato)
        totals.gordura += numberValue(food.gordura)
      })

      return totals
    },
    { calorias: 0, proteina: 0, carboidrato: 0, gordura: 0 }
  )
}

function formatDate(value) {
  if (!value) return "-"

  return new Intl.DateTimeFormat("pt-BR").format(new Date(value))
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

function renderTotals(container, totals) {
  container.innerHTML = `
    <div class="total-card"><span>Calorias</span><strong>${totals.calorias} kcal</strong></div>
    <div class="total-card"><span>Proteína</span><strong>${totals.proteina} g</strong></div>
    <div class="total-card"><span>Carboidrato</span><strong>${totals.carboidrato} g</strong></div>
    <div class="total-card"><span>Gordura</span><strong>${totals.gordura} g</strong></div>
  `
}

function setupDayTabs(onChange) {
  document.querySelectorAll(".days").forEach((daysContainer) => {
    const shortLabels = daysContainer.dataset.shortDays === "true"
    daysContainer.innerHTML = DIET_DAYS.map(([dayKey, longLabel, shortLabel]) => {
      const label = shortLabels ? shortLabel : longLabel
      const activeClass = dayKey === selectedDietDay ? " active" : ""
      return `<button class="day${activeClass}" type="button" data-diet-day="${dayKey}">${label}</button>`
    }).join("")
  })

  document.querySelectorAll("[data-diet-day]").forEach((button) => {
    button.addEventListener("click", () => {
      if (typeof captureEditorDay === "function" && editorDraftDiet) captureEditorDay()
      selectedDietDay = button.dataset.dietDay
      setupDayTabs(onChange)
      onChange()
    })
  })
}

function renderEmptyState(container, message) {
  container.innerHTML = `<div class="muted-box medium-box"><p class="note-box">${escapeHtml(message)}</p></div>`
}

function renderMealCards(meals, container) {
  if (!meals.length) {
    renderEmptyState(container, "Nenhuma refeição cadastrada para este dia.")
    return
  }

  container.innerHTML = meals.map((meal) => `
    <article class="card meal-card">
      <h2>${escapeHtml(meal.nome)}</h2>
      <span class="time">${escapeHtml(meal.horario)}</span>
      <div class="muted-box">
        <ul class="food-list">
          ${meal.alimentos.map((food) => `
            <li><span>${escapeHtml(food.nome)}</span><strong>${escapeHtml(food.quantidade)} / ${numberValue(food.calorias)} kcal</strong></li>
          `).join("") || "<li><span>Nenhum alimento cadastrado</span><strong>0 kcal</strong></li>"}
        </ul>
      </div>
    </article>
  `).join("")
}

function renderStudentDiet() {
  const currentStudent = getAlunoContextoDiet(true) || ensureMockAccounts("aluno")
  const diet = findCurrentDiet(currentStudent.id)
  const mealsContainer = document.querySelector("[data-diet-meals]")
  const totalsContainer = document.querySelector("[data-diet-totals]")
  const notesContainer = document.querySelector("[data-diet-notes]")
  const historyContainer = document.querySelector("[data-diet-history]")

  if (!diet) {
    renderEmptyState(mealsContainer, "Nenhuma dieta cadastrada ainda. Quando o profissional salvar uma dieta, ela aparecerá aqui.")
    renderTotals(totalsContainer, calculateTotals([]))
    notesContainer.textContent = "Nenhuma observação cadastrada."
    historyContainer.innerHTML = "<li><span>-</span><strong>Sem histórico</strong></li>"
    return
  }

  const meals = diet.dias[selectedDietDay]?.refeicoes || []
  renderMealCards(meals, mealsContainer)
  renderTotals(totalsContainer, calculateTotals(meals))
  notesContainer.textContent = diet.observacoesProfissional || "Nenhuma observação cadastrada."
  historyContainer.innerHTML = `<li><span>${formatDate(diet.atualizadaEm)}</span><strong>Dieta atual</strong></li>`
}

function renderProfessionalDiet() {
  const loggedUser = ensureMockAccounts("profissional")
  syncSelectedStudentFromProfile(loggedUser.id)

  const studentId = getSelectedStudentId(loggedUser.id)
  const diet = findCurrentDiet(studentId)
  const summaryContainer = document.querySelector("[data-diet-summary]")
  const totalsContainer = document.querySelector("[data-diet-totals]")
  const notesContainer = document.querySelector("[data-diet-notes]")
  const historyContainer = document.querySelector("[data-diet-history]")

  updateCurrentStudentName(studentId)

  if (!studentId) {
    renderEmptyState(summaryContainer, "Nenhum aluno selecionado para visualizar a dieta.")
    renderTotals(totalsContainer, calculateTotals([]))
    notesContainer.textContent = "Nenhuma observação cadastrada."
    historyContainer.innerHTML = "<li><span>-</span><strong>Sem histórico</strong></li>"
    return
  }

  if (!diet) {
    renderEmptyState(summaryContainer, "Nenhuma dieta cadastrada para este aluno. Use Editar dieta para criar a primeira dieta.")
    renderTotals(totalsContainer, calculateTotals([]))
    notesContainer.textContent = "Nenhuma observação cadastrada."
    historyContainer.innerHTML = "<li><span>-</span><strong>Sem histórico</strong></li>"
    return
  }

  const meals = diet.dias[selectedDietDay]?.refeicoes || []
  if (!meals.length) {
    renderEmptyState(summaryContainer, "Nenhuma refeição cadastrada para este dia.")
  } else {
    summaryContainer.innerHTML = meals.map((meal) => `
      <div class="summary-item">
        <strong>${escapeHtml(meal.nome)} — ${escapeHtml(meal.horario)}</strong>
        <div class="muted-box">
          <ul class="food-list">
            ${meal.alimentos.map((food) => `
              <li><span>${escapeHtml(food.nome)}</span><strong>${numberValue(food.calorias)} kcal</strong></li>
            `).join("") || "<li><span>Nenhum alimento cadastrado</span><strong>0 kcal</strong></li>"}
          </ul>
        </div>
      </div>
    `).join("")
  }

  renderTotals(totalsContainer, calculateTotals(meals))
  notesContainer.textContent = diet.observacoesProfissional || "Nenhuma observação cadastrada."
  historyContainer.innerHTML = `<li><span>${formatDate(diet.atualizadaEm)}</span><strong>Dieta atual</strong></li>`
}

function foodRowTemplate(food = {}) {
  return `
    <tr>
      <td><input type="text" aria-label="Alimento" value="${escapeHtml(food.nome)}"></td>
      <td><input type="text" aria-label="Quantidade" value="${escapeHtml(food.quantidade)}"></td>
      <td><input type="number" aria-label="Calorias" value="${numberValue(food.calorias)}"></td>
      <td><input type="number" aria-label="Proteína" value="${numberValue(food.proteina)}"></td>
      <td><input type="number" aria-label="Carboidrato" value="${numberValue(food.carboidrato)}"></td>
      <td><input type="number" aria-label="Gordura" value="${numberValue(food.gordura)}"></td>
      <td><button class="add-food" type="button" data-remove-food>Remover</button></td>
    </tr>
  `
}

function mealEditorTemplate(meal = {}) {
  return `
    <article class="card editor-card" data-meal-id="${escapeHtml(meal.id || createId("refeicao"))}">
      <div class="meal-editor-head">
        <input type="text" aria-label="Nome da refeição" value="${escapeHtml(meal.nome || "Nova refeição")}">
        <input type="time" aria-label="Horário da refeição" value="${escapeHtml(meal.horario || "08:00")}">
      </div>
      <table class="food-table">
        <colgroup>
          <col class="col-alimento">
          <col class="col-qtd">
          <col class="col-numero">
          <col class="col-numero">
          <col class="col-numero">
          <col class="col-numero">
          <col class="col-acao">
        </colgroup>
        <thead>
          <tr><th>Alimento</th><th>Qtd</th><th>Cal</th><th>Prot</th><th>Carb</th><th>Gord</th><th>Ação</th></tr>
        </thead>
        <tbody>
          ${(meal.alimentos || []).map(foodRowTemplate).join("")}
        </tbody>
      </table>
      <div class="meal-actions">
        <button class="add-food" type="button" data-add-food>+ Adicionar alimento</button>
        <button class="add-food" type="button" data-remove-meal>Remover refeição</button>
        <span data-total-refeicao>Total: 0 kcal</span>
      </div>
    </article>
  `
}

function renderDietEditor() {
  const editorContainer = document.querySelector("[data-diet-editor]")
  const notesField = document.getElementById("observacoes")
  const meals = editorDraftDiet.dias[selectedDietDay]?.refeicoes || []

  if (!meals.length) {
    renderEmptyState(editorContainer, "Nenhuma refeição cadastrada para este dia. Clique em Adicionar refeição para começar.")
  } else {
    editorContainer.innerHTML = meals.map(mealEditorTemplate).join("")
  }

  notesField.value = editorDraftDiet.observacoesProfissional || ""
  resizeDietNotes()
  updateEditorTotals()
}

function readMealFromCard(card) {
  return {
    id: card.dataset.mealId || createId("refeicao"),
    nome: card.querySelector('[aria-label="Nome da refeição"]').value.trim() || "Refeição sem nome",
    horario: card.querySelector('[aria-label="Horário da refeição"]').value || "00:00",
    alimentos: Array.from(card.querySelectorAll("tbody tr")).map((row) => ({
      id: createId("alimento"),
      nome: row.querySelector('[aria-label="Alimento"]').value.trim() || "Alimento sem nome",
      quantidade: row.querySelector('[aria-label="Quantidade"]').value.trim(),
      calorias: numberValue(row.querySelector('[aria-label="Calorias"]').value),
      proteina: numberValue(row.querySelector('[aria-label="Proteína"]').value),
      carboidrato: numberValue(row.querySelector('[aria-label="Carboidrato"]').value),
      gordura: numberValue(row.querySelector('[aria-label="Gordura"]').value),
    })),
  }
}

function captureEditorDay() {
  if (!editorDraftDiet) return

  const notesField = document.getElementById("observacoes")
  editorDraftDiet.observacoesProfissional = notesField.value.trim()
  editorDraftDiet.dias[selectedDietDay] = {
    refeicoes: Array.from(document.querySelectorAll(".editor-card[data-meal-id]")).map(readMealFromCard),
  }
}

function updateEditorTotals() {
  document.querySelectorAll(".editor-card").forEach((card) => {
    const meal = readMealFromCard(card)
    const total = calculateTotals([meal])
    card.querySelector("[data-total-refeicao]").textContent = `Total: ${total.calorias} kcal`
  })

  const allMeals = Array.from(document.querySelectorAll(".editor-card[data-meal-id]")).map(readMealFromCard)
  renderTotals(document.querySelector("[data-diet-totals]"), calculateTotals(allMeals))
}

function resizeDietNotes() {
  const dietNotes = document.getElementById("observacoes")
  if (!dietNotes) return

  dietNotes.style.height = "auto"
  dietNotes.style.height = `${dietNotes.scrollHeight}px`
}

function initDietEditor() {
  const loggedUser = ensureMockAccounts("profissional")
  syncSelectedStudentFromProfile(loggedUser.id)

  const studentId = getSelectedStudentId(loggedUser.id)
  editorDraftDiet = studentId ? findCurrentDiet(studentId) || createEmptyDiet(studentId, loggedUser.id) : null

  if (!editorDraftDiet) {
    renderEmptyState(document.querySelector("[data-diet-editor]"), "Nenhum aluno associado a este profissional foi encontrado.")
    renderTotals(document.querySelector("[data-diet-totals]"), calculateTotals([]))
    return
  }

  setupDayTabs(renderDietEditor)
  renderDietEditor()

  document.addEventListener("input", (event) => {
    if (event.target.closest("[data-diet-editor]") || event.target.id === "observacoes") {
      updateEditorTotals()
      resizeDietNotes()
    }
  })

  document.addEventListener("click", (event) => {
    const addFoodButton = event.target.closest("[data-add-food]")
    if (addFoodButton) {
      addFoodButton.closest(".editor-card").querySelector("tbody").insertAdjacentHTML("beforeend", foodRowTemplate())
      updateEditorTotals()
    }

    const removeFoodButton = event.target.closest("[data-remove-food]")
    if (removeFoodButton) {
      removeFoodButton.closest("tr").remove()
      updateEditorTotals()
    }

    const removeMealButton = event.target.closest("[data-remove-meal]")
    if (removeMealButton) {
      removeMealButton.closest(".editor-card").remove()
      updateEditorTotals()
    }

    if (event.target.closest("[data-add-meal]")) {
      const editorContainer = document.querySelector("[data-diet-editor]")
      if (!editorContainer.querySelector(".editor-card")) editorContainer.innerHTML = ""
      editorContainer.insertAdjacentHTML("beforeend", mealEditorTemplate({ alimentos: [] }))
      updateEditorTotals()
    }

    if (event.target.closest("[data-save-diet]")) {
      captureEditorDay()
      saveDiet(editorDraftDiet)
      openDietModal()
    }
  })
}

function openDietModal() {
  const dietModal = document.getElementById("diet-success-modal")
  if (!dietModal) return

  dietModal.classList.add("is-open")
  dietModal.setAttribute("aria-hidden", "false")
  dietModal.querySelector(".modal-card a")?.focus()
}

function closeDietModal() {
  const dietModal = document.getElementById("diet-success-modal")
  if (!dietModal) return

  dietModal.classList.remove("is-open")
  dietModal.setAttribute("aria-hidden", "true")
}

function initDietPage() {
  const page = document.body.dataset.dietPage

  if (page === "student") {
    setupDayTabs(renderStudentDiet)
    renderStudentDiet()
  }

  if (page === "professional-view") {
    setupDayTabs(renderProfessionalDiet)
    renderProfessionalDiet()
  }

  if (page === "professional-editor") {
    initDietEditor()
  }

  const dietModal = document.getElementById("diet-success-modal")
  if (dietModal) {
    dietModal.addEventListener("click", (event) => {
      if (event.target === dietModal) closeDietModal()
    })
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeDietModal()
  })
}

document.addEventListener("DOMContentLoaded", initDietPage)
