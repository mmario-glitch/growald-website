const toggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const isEn = document.documentElement.lang === "en";
const labelOpen = isEn ? "Open navigation" : "Navigation öffnen";
const labelClose = isEn ? "Close navigation" : "Navigation schließen";

if (toggle && navigation) {
  toggle.addEventListener("click", () => {
    const open = navigation.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? labelClose : labelOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", labelOpen);
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
