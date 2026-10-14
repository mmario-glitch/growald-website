/* growald calculators - run entirely client-side.
   No input is transmitted, stored or evaluated. */
(function () {
  "use strict";

  var EN = document.documentElement.lang === "en";
  var LOC = EN ? "en-US" : "de-DE";
  var PC = EN ? "%" : " %";
  var euro = new Intl.NumberFormat(LOC, { style: "currency", currency: "EUR" });
  var pct = new Intl.NumberFormat(LOC, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  var num = new Intl.NumberFormat(LOC, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var stk = new Intl.NumberFormat(LOC, { maximumFractionDigits: 0 });

  function val(scope, name) {
    var el = scope.querySelector('[data-field="' + name + '"]');
    if (!el) return 0;
    var n = parseFloat(EN ? String(el.value).replace(/,/g, "") : String(el.value).replace(",", "."));
    return isFinite(n) ? n : 0;
  }

  function show(scope, name, text, tone) {
    var el = scope.querySelector('[data-out="' + name + '"]');
    if (!el) return;
    el.textContent = text;
    if (tone) el.dataset.tone = tone;
  }

  /* Break-even ACoS: at which ACoS is the whole contribution margin consumed? */
  function acos(scope) {
    var brutto = val(scope, "preis");
    var ust = val(scope, "ust");
    var cogs = val(scope, "cogs");
    var gebuehr = val(scope, "gebuehr");
    var versand = val(scope, "versand");
    var retoure = val(scope, "retoure");

    var netto = brutto / (1 + ust / 100);
    var gebuehrEuro = brutto * (gebuehr / 100);
    var retoureEuro = (cogs + versand) * (retoure / 100);
    var db = netto - cogs - gebuehrEuro - versand - retoureEuro;
    var marge = netto > 0 ? (db / netto) * 100 : 0;

    show(scope, "netto", euro.format(netto));
    show(scope, "db", euro.format(db), db > 0 ? "good" : "bad");
    show(scope, "marge", pct.format(marge) + PC, marge > 0 ? "good" : "bad");

    if (db <= 0) {
      show(scope, "beacos", EN ? "no profitable ACoS" : "kein profitabler ACoS", "bad");
      show(scope, "beroas", "–", "bad");
      show(scope, "hinweis", EN
        ? "With this cost structure the product loses money even without advertising. Ads add to the loss instead of offsetting it."
        : "Bei dieser Kostenstruktur ist das Produkt schon ohne Werbung defizitär. "
        + "Werbung verstärkt den Verlust, statt ihn auszugleichen.");
      return;
    }

    var beAcos = marge;
    var beRoas = 100 / beAcos;
    show(scope, "beacos", pct.format(beAcos) + PC, "good");
    show(scope, "beroas", num.format(beRoas), "good");
    show(scope, "hinweis", EN
      ? "At an ACoS of " + pct.format(beAcos) + "% advertising uses up the entire contribution margin. "
        + "To make a profit you have to stay below it. A ROAS of at least " + num.format(beRoas) + " marks the same threshold."
      : "Ab einem ACoS von " + pct.format(beAcos) + " % ist der Deckungsbeitrag "
      + "vollständig von der Werbung aufgezehrt. Wer Gewinn will, muss darunter bleiben – "
      + "ein ROAS von mindestens " + num.format(beRoas) + " markiert dieselbe Schwelle.");
  }

  /* Contribution margin after ads, per unit and per month */
  function db(scope) {
    var brutto = val(scope, "preis");
    var ust = val(scope, "ust");
    var cogs = val(scope, "cogs");
    var gebuehr = val(scope, "gebuehr");
    var versand = val(scope, "versand");
    var retoure = val(scope, "retoure");
    var acosWert = val(scope, "acos");
    var menge = val(scope, "menge");

    var netto = brutto / (1 + ust / 100);
    var vorAds = netto - cogs - brutto * (gebuehr / 100) - versand - (cogs + versand) * (retoure / 100);
    var adKosten = netto * (acosWert / 100);
    var nachAds = vorAds - adKosten;

    show(scope, "vorads", euro.format(vorAds), vorAds > 0 ? "good" : "bad");
    show(scope, "adkosten", euro.format(adKosten));
    show(scope, "nachads", euro.format(nachAds), nachAds > 0 ? "good" : "bad");
    show(scope, "monat", euro.format(nachAds * menge), nachAds > 0 ? "good" : "bad");
    show(scope, "hinweis", EN ? (nachAds > 0
      ? "At " + stk.format(menge) + " units sold per month, " + euro.format(nachAds * menge)
        + " contribution margin remains, before fixed costs such as staff, rent and software."
      : "No contribution margin is left after advertising. Either ACoS has to fall, the price has to rise "
        + "or the cost structure has to change.") : nachAds > 0
      ? "Bei " + stk.format(menge) + " verkauften Einheiten im Monat bleiben "
        + euro.format(nachAds * menge) + " Deckungsbeitrag – vor Fixkosten wie Personal, "
        + "Miete und Software."
      : "Nach Werbung bleibt kein Deckungsbeitrag. Entweder der ACoS muss sinken, der Preis steigen "
        + "oder die Kostenstruktur sich ändern.");
  }

  /* Vendor Central vs Seller Central, per unit */
  function vendor(scope) {
    var vk = val(scope, "vk");
    var ust = val(scope, "ust");
    var cogs = val(scope, "cogs");
    var einkauf = val(scope, "einkauf");
    var konditionen = val(scope, "konditionen");
    var gebuehr = val(scope, "gebuehr");
    var versand = val(scope, "versand");
    var logistik = val(scope, "logistik");

    var vendorDb = einkauf - einkauf * (konditionen / 100) - cogs - logistik;
    var netto = vk / (1 + ust / 100);
    var sellerDb = netto - vk * (gebuehr / 100) - versand - cogs;
    var diff = sellerDb - vendorDb;

    show(scope, "vendordb", euro.format(vendorDb), vendorDb > 0 ? "good" : "bad");
    show(scope, "sellerdb", euro.format(sellerDb), sellerDb > 0 ? "good" : "bad");
    show(scope, "diff", (diff >= 0 ? "+" : "−") + euro.format(Math.abs(diff)),
      diff >= 0 ? "good" : "bad");
    show(scope, "hinweis", EN ? (Math.abs(diff) < 0.01
      ? "Both models are practically even. Then the numbers don't decide; control, effort and pricing authority do."
      : (diff > 0 ? "Seller Central" : "Vendor Central") + " is ahead by "
        + euro.format(Math.abs(diff)) + " per unit sold. This is a pure contribution margin calculation: "
        + "effort, pricing authority, advertising costs and payment terms are not included.") : Math.abs(diff) < 0.01
      ? "Beide Modelle liegen praktisch gleichauf. Dann entscheiden nicht die Zahlen, sondern "
        + "Steuerbarkeit, Aufwand und Preishoheit."
      : (diff > 0 ? "Seller Central" : "Vendor Central") + " liegt je verkaufter Einheit um "
        + euro.format(Math.abs(diff)) + " vorn. Das ist eine reine Deckungsbeitragsrechnung: "
        + "Aufwand, Preishoheit, Werbekosten und Zahlungsziele sind darin nicht enthalten.");
  }

  var MODES = { acos: acos, db: db, vendor: vendor };

  document.querySelectorAll("[data-calc]").forEach(function (scope) {
    var run = MODES[scope.dataset.calc];
    if (!run) return;
    scope.addEventListener("input", function () { run(scope); });
    var reset = scope.querySelector("[data-reset]");
    if (reset) {
      reset.addEventListener("click", function () {
        scope.querySelectorAll("input[data-field]").forEach(function (i) { i.value = i.defaultValue; });
        run(scope);
      });
    }
    run(scope);
  });
})();
