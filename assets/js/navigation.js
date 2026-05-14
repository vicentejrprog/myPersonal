/* ============================================================
   navigation.js — Highlight automático do menu ativo
   Detecta a página atual pela URL e marca o item correspondente
   da sidebar como ativo.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/").pop().replace(".html", "");
  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach((item) => {
    const link = item.getAttribute("data-page") || item.getAttribute("href");
    if (!link) return;

    const linkPage = link.split("/").pop().replace(".html", "");
    if (linkPage === currentPath) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
});
