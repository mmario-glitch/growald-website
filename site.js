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

// Cookie consent + Google Analytics 4: GA loads only after "Akzeptieren"; ads features always denied (Mario 30.10.2026)
(() => {
  const GA_ID = "G-JGWY443WQZ";
  const KEY = "growald_consent_v1";
  const txt = isEn
    ? { text: "We would like to use Google Analytics to see how visitors use this website. This sets cookies and is only switched on with your consent.", more: "Privacy policy", yes: "Accept", no: "Decline", settings: "Cookie settings", privacy: "privacy-policy.html" }
    : { text: "Wir möchten mit Google Analytics sehen, wie Besucher diese Website nutzen. Dafür werden Cookies gesetzt, aber nur mit Ihrer Einwilligung.", more: "Datenschutzerklärung", yes: "Akzeptieren", no: "Ablehnen", settings: "Cookie-Einstellungen", privacy: "datenschutz.html" };
  const read = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const save = (v) => { try { localStorage.setItem(KEY, v); } catch (e) { /* private mode: ask again next visit */ } };

  function loadGa() {
    if (window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted" });
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
  }

  function dropGaCookies() {
    document.cookie.split(";").map((c) => c.trim().split("=")[0]).filter((n) => /^_ga/.test(n)).forEach((n) => {
      [location.hostname, "." + location.hostname.replace(/^www\./, "")].forEach((d) => {
        document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + d;
      });
      document.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    });
  }

  function showBanner() {
    if (document.querySelector(".consent-banner")) return;
    const box = document.createElement("div");
    box.className = "consent-banner";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", txt.settings);
    box.innerHTML = '<p></p><div class="consent-actions"><button type="button" data-c="denied"></button><button type="button" data-c="granted"></button></div>';
    const p = box.querySelector("p");
    p.textContent = txt.text + " ";
    const a = document.createElement("a");
    a.href = txt.privacy;
    a.textContent = txt.more;
    p.appendChild(a);
    box.querySelector('[data-c="denied"]').textContent = txt.no;
    box.querySelector('[data-c="granted"]').textContent = txt.yes;
    box.addEventListener("click", (e) => {
      const v = e.target.getAttribute && e.target.getAttribute("data-c");
      if (!v) return;
      const before = read();
      save(v);
      box.remove();
      if (v === "granted") loadGa();
      else if (before === "granted") { dropGaCookies(); location.reload(); }
    });
    document.body.appendChild(box);
  }

  const style = document.createElement("style");
  style.textContent = ".consent-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:1000;max-width:560px;margin:0 auto;background:#fff;color:#1d1d1b;border:1px solid rgba(0,0,0,.12);border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.15);padding:18px 20px;font-size:.92rem;line-height:1.5}.consent-banner p{margin:0 0 14px}.consent-banner a{color:inherit;text-decoration:underline}.consent-actions{display:flex;gap:10px;flex-wrap:wrap}.consent-actions button{flex:1 1 140px;padding:10px 16px;border-radius:999px;border:1px solid #1d1d1b;background:#fff;color:#1d1d1b;font:inherit;font-weight:600;cursor:pointer}.consent-settings{background:none;border:0;padding:0;color:inherit;font:inherit;text-decoration:underline;cursor:pointer}";
  document.head.appendChild(style);

  const footerLinks = document.querySelectorAll(".site-footer .footer-links");
  const host = footerLinks[footerLinks.length - 1];
  if (host) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "consent-settings";
    b.textContent = txt.settings;
    b.addEventListener("click", showBanner);
    host.appendChild(b);
  }

  // conversions: appointment and mail clicks (only counted when GA is loaded = consent given)
  document.addEventListener("click", (e) => {
    const link = e.target.closest && e.target.closest("a[href]");
    if (!link || !window.gtag) return;
    if (/calendly\.com/.test(link.href)) window.gtag("event", "termin_klick", { link_url: link.href });
    else if (link.href.startsWith("mailto:")) window.gtag("event", "mail_klick", { link_url: link.href.split("?")[0] });
  });

  const choice = read();
  if (choice === "granted") loadGa();
  else if (choice !== "denied") showBanner();
})();
