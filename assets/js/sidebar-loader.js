/* ============================================================
   sidebar-loader.js
   Injeta a sidebar conforme o perfil do usuário.
   Funciona detectando ?perfil= na URL ou data-profile no <body>.
   ============================================================ */

const PROFILE_MENUS = {
  "personal-trainer": {
    label: "Personal Trainer",
    initial: "P",
    items: [
      { label: "Dashboard",    href: "dashboard.html",      key: "dashboard" },
      { label: "Meus Alunos",  href: "meus-alunos.html",     key: "meus-alunos" },
      { label: "Agenda",       href: "agenda.html",          key: "agenda" },
      { label: "Mensagens",    href: "mensagens.html",       key: "mensagens" },
    ],
  },
  "nutricionista": {
    label: "Nutricionista",
    initial: "N",
    items: [
      { label: "Dashboard",    href: "dashboard.html",      key: "dashboard" },
      { label: "Meus Alunos",  href: "meus-alunos.html",    key: "meus-alunos" },
      { label: "Agenda",       href: "agenda.html",          key: "agenda" },
      { label: "Mensagens",    href: "mensagens.html",       key: "mensagens" },
    ],
  },
  "personal-nutricionista": {
    label: "Personal Nutricionista",
    initial: "PN",
    items: [
      { label: "Dashboard",    href: "dashboard.html",      key: "dashboard" },
      { label: "Meus Alunos",  href: "meus-alunos.html",    key: "meus-alunos" },
      { label: "Agenda",       href: "agenda.html",          key: "agenda" },
      { label: "Mensagens",    href: "mensagens.html",       key: "mensagens" },
    ],
  },
  "aluno": {
    label: "Aluno",
    initial: "A",
    items: [
      { label: "Início",       href: "../aluno/home.html",            key: "home" },
      { label: "Meu Treino",   href: "../aluno/meu-treino.html",      key: "meu-treino" },
      { label: "Minha Dieta",  href: "../aluno/minha-dieta.html",     key: "minha-dieta" },
      { label: "Estatísticas", href: "../aluno/estatisticaaluno.html", key: "estatisticas" },
      { label: "Agenda",       href: "../profissional/agenda.html?perfil=aluno", key: "agenda" },
      { label: "Mensagens",    href: "../profissional/mensagens.html?perfil=aluno", key: "mensagens" },
    ],
  },
};

/**
 * Detecta o perfil ativo. Ordem:
 *   1. data-profile no <body>
 *   2. ?perfil= na URL
 *   3. localStorage 'mypersonal:perfil'
 *   4. fallback: personal-trainer
 */
function detectProfile() {
  const body = document.body;
  if (body.dataset.profile) return body.dataset.profile;

  const url = new URLSearchParams(window.location.search);
  if (url.get("perfil")) {
    localStorage.setItem("mypersonal:perfil", url.get("perfil"));
    return url.get("perfil");
  }

  const stored = localStorage.getItem("mypersonal:perfil");
  if (stored) return stored;

  return "personal-trainer";
}

/**
 * Detecta a página ativa pelo nome do arquivo
 */
function detectActivePage() {
  if (document.body.dataset.activePage) {
    return document.body.dataset.activePage === "alunos" ? "meus-alunos" : document.body.dataset.activePage;
  }

  const path = window.location.pathname;
  const file = path.split("/").pop().replace(".html", "");
  if (file === "estatisticaaluno") return "estatisticas";
  return file || "dashboard";
}

function getSettingsHref() {
  if (detectProfile() === "aluno") return "../aluno/configuracoes.html";
  return "configuracoes.html";
}

/**
 * Renderiza a sidebar no elemento #sidebar-mount
 */
function renderSidebar() {
  const mount = document.getElementById("sidebar-mount");
  if (!mount) return;

  const profile = detectProfile();
  const active  = detectActivePage();
  const menu    = PROFILE_MENUS[profile] || PROFILE_MENUS["personal-trainer"];
  const settingsHref = getSettingsHref();

  const itemsHTML = menu.items.map((item) => {
    const isActive = item.key === active;
    return `
      <a href="${item.href}" class="menu-item ${isActive ? "active" : ""}" data-page="${item.key}">
        <span>${item.label}</span>
      </a>
    `;
  }).join("");

  mount.innerHTML = `
    <button class="sidebar-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="app-sidebar">
      <span></span>
      <span></span>
      <span></span>
    </button>
    <div class="sidebar-backdrop" data-sidebar-close></div>
    <aside class="sidebar" id="app-sidebar">
      <div class="sidebar-header">
        <div class="brand">
          <div class="logo">MP</div>
          <span>MyPersonal</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        ${itemsHTML}
      </nav>

      <div class="user-profile-sidebar profile-menu" data-profile-menu>
        <button class="profile-menu-trigger profile-menu-trigger-sidebar" type="button" aria-label="Abrir menu do perfil" aria-haspopup="true" aria-expanded="false">
          <span class="side-avatar">${menu.initial}</span>
          <span class="side-info">
            <span class="side-name">Usuário</span>
            <span class="side-role">${menu.label}</span>
          </span>
        </button>

        <div class="profile-dropdown" role="menu">
          <a href="${settingsHref}" class="profile-dropdown-item" role="menuitem">Configurações</a>
          <a href="../../index.html" class="profile-dropdown-item profile-dropdown-logout" role="menuitem">Sair</a>
        </div>
      </div>
    </aside>
  `;
}

/**
 * Renderiza a topbar
 * Usa data-page-title no <body> ou um título padrão
 */
function renderTopbar() {
  const mount = document.getElementById("topbar-mount");
  if (!mount) return;

  const title = document.body.dataset.pageTitle || "MyPersonal";
  const back  = document.body.dataset.back;
  const initial = (PROFILE_MENUS[detectProfile()] || {}).initial || "U";
  const settingsHref = getSettingsHref();

  mount.innerHTML = `
    <header class="topbar">
      <div>
        ${back ? `<a href="${back.split("|")[0]}" class="back-link">← ${back.split("|")[1] || "Voltar"}</a>` : ""}
        <h1 class="topbar-title">${title}</h1>
      </div>
      <div class="topbar-actions">
        <div class="profile-menu profile-menu-topbar" data-profile-menu>
          <button class="profile-menu-trigger" type="button" aria-label="Abrir menu do perfil" aria-haspopup="true" aria-expanded="false">
            <span class="avatar avatar-sm">${initial}</span>
          </button>

          <div class="profile-dropdown" role="menu">
            <a href="${settingsHref}" class="profile-dropdown-item" role="menuitem">Configurações</a>
            <a href="../../index.html" class="profile-dropdown-item profile-dropdown-logout" role="menuitem">Sair</a>
          </div>
        </div>
      </div>
    </header>
  `;
}

function setupProfileMenus() {
  const profileMenus = document.querySelectorAll("[data-profile-menu]");
  if (!profileMenus.length) return;
  const mobileQuery = window.matchMedia("(max-width: 768px)");

  function closeProfileMenus(exceptMenu = null) {
    profileMenus.forEach((menu) => {
      if (menu === exceptMenu) return;

      menu.classList.remove("is-open");
      const trigger = menu.querySelector(".profile-menu-trigger");
      if (trigger) trigger.setAttribute("aria-expanded", "false");
    });
  }

  function updateProfileMenuAvailability() {
    const isMobile = mobileQuery.matches;

    profileMenus.forEach((menu) => {
      const trigger = menu.querySelector(".profile-menu-trigger");
      if (!trigger || !menu.classList.contains("user-profile-sidebar")) return;

      trigger.disabled = !isMobile;

      if (!isMobile) {
        menu.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  profileMenus.forEach((menu) => {
    const trigger = menu.querySelector(".profile-menu-trigger");
    if (!trigger) return;

    trigger.addEventListener("click", (event) => {
      if (trigger.disabled) return;

      event.stopPropagation();
      const isOpen = menu.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));
      closeProfileMenus(menu);
    });
  });

  document.addEventListener("click", () => closeProfileMenus());

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeProfileMenus();
  });

  updateProfileMenuAvailability();
  mobileQuery.addEventListener("change", updateProfileMenuAvailability);
}

function setupSidebarToggle() {
  const toggle = document.querySelector(".sidebar-toggle");
  const backdrop = document.querySelector(".sidebar-backdrop");
  const sidebarLinks = document.querySelectorAll(".sidebar .menu-item");
  if (!toggle) return;

  function setSidebarOpen(isOpen) {
    document.body.classList.toggle("sidebar-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  }

  toggle.addEventListener("click", () => {
    setSidebarOpen(!document.body.classList.contains("sidebar-open"));
  });

  if (backdrop) {
    backdrop.addEventListener("click", () => setSidebarOpen(false));
  }

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => setSidebarOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setSidebarOpen(false);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderSidebar();
  renderTopbar();
  setupProfileMenus();
  setupSidebarToggle();
});
