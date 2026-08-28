const toggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");

if (toggle && navigation) {
  toggle.addEventListener("click", () => {
    const open = navigation.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Navigation schließen" : "Navigation öffnen");
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Navigation öffnen");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      navigation.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

document.querySelectorAll(".site-footer").forEach((footer) => {
  if (footer.querySelector(".ai-disclosure")) return;

  const disclosure = document.createElement("p");
  disclosure.className = "ai-disclosure";
  disclosure.textContent = "Transparenzhinweis: Teile der Inhalte dieser Website wurden mithilfe künstlicher Intelligenz erstellt und von Mario Moosbauer redaktionell geprüft und verantwortet.";
  footer.append(disclosure);
});
