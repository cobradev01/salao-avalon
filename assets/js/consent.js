// Aviso de cookies (LGPD): mostra uma vez e lembra a escolha do visitante no próprio navegador.
(() => {
  "use strict";

  const KEY = "avalon-cookies";

  let saved = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch (_) {
    // navegador sem acesso ao armazenamento: o aviso aparece normalmente
  }
  if (saved) return;

  const bar = document.createElement("div");
  bar.className = "cookie-bar";
  bar.setAttribute("role", "dialog");
  bar.setAttribute("aria-label", "Aviso de cookies");
  bar.innerHTML =
    '<p>Usamos cookies essenciais para o funcionamento do site. Saiba mais na <a href="privacidade.html">Política de Privacidade</a>.</p>' +
    '<div class="cookie-actions">' +
    '<button type="button" class="btn btn-sm" data-choice="aceitar">Aceitar</button>' +
    '<button type="button" class="btn btn-outline btn-sm" data-choice="recusar">Recusar</button>' +
    "</div>";

  bar.addEventListener("click", (e) => {
    const choice = e.target.closest("[data-choice]");
    if (!choice) return;
    try {
      localStorage.setItem(KEY, choice.dataset.choice);
    } catch (_) {
      // sem armazenamento, a escolha vale só nesta visita
    }
    bar.remove();
  });

  document.body.append(bar);
})();
