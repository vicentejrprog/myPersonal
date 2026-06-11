/* ============================================================
   settings-alerts.js
   Controla os alerts/modais de sucesso da tela de configuracoes.
   ============================================================ */

const settingsModal = document.getElementById("settings-success-modal");
const settingsClose = document.getElementById("settings-success-close");
const settingsTitle = document.getElementById("settings-success-title");
const settingsMessage = document.getElementById("settings-success-message");
const settingsButtons = document.querySelectorAll("[data-open-settings-modal]");

function openSettingsModal(button) {
  settingsTitle.textContent = button.dataset.modalTitle;
  settingsMessage.textContent = button.dataset.modalMessage;
  settingsModal.classList.add("is-open");
  settingsModal.setAttribute("aria-hidden", "false");
  settingsClose.focus();
}

function closeSettingsModal() {
  settingsModal.classList.remove("is-open");
  settingsModal.setAttribute("aria-hidden", "true");
}

if (settingsModal && settingsClose && settingsTitle && settingsMessage && settingsButtons.length) {
  settingsButtons.forEach((button) => {
    button.addEventListener("click", () => openSettingsModal(button));
  });

  settingsClose.addEventListener("click", closeSettingsModal);

  settingsModal.addEventListener("click", (event) => {
    if (event.target === settingsModal) closeSettingsModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSettingsModal();
  });
}
