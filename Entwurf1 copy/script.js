const pfeilNachRechts = document.querySelector(".raster__pfeil--rechts");
const pfeilNachLinks = document.querySelector(".raster__pfeil--links");
const pfeilImOverlay = document.querySelector(".overlay-pfeil-unten");
const ersteSpalte = document.querySelector("#spalte-1");
const zehnteSpalte = document.querySelector("#spalte-10");
const projektOverlay = document.querySelector(".projekt-overlay");
const overlayScrollbar = document.querySelector(".overlay-scrollbar");
const overlayScrollbarThumb = document.querySelector(".overlay-scrollbar__thumb");
const startScrollbar = document.querySelector(".start-scrollbar");
const startScrollbarThumb = document.querySelector(".start-scrollbar__thumb");
const overlaySchliessen = document.querySelector(".projekt-overlay__schliessen");
const prozessNachOben = document.querySelector(".prozess-nach-oben");
const titel = document.querySelector(".projekt-text");
const prozessTitel = document.querySelector(".prozess-titel");
const prozessFlaechenRaster = document.querySelector(".prozess-flaechen");
const prozessFlaechen = [...prozessFlaechenRaster.querySelectorAll(".prozess-flaeche")];
let prozessAnimationLaeuft = false;
let ersteProzessFlaeche = 0;

prozessFlaechen.forEach((flaeche, index) => {
  flaeche.dataset.position = ["links", "mitte", "rechts"][index] || "ausgang-rechts";
});

let letzterScrollstand = 0;

function aktualisiereStartScrollbar() {
  const maxScroll = document.body.scrollWidth - document.body.clientWidth;
  const trackBreite = startScrollbar.clientWidth;
  const thumbBreite = maxScroll > 0
    ? Math.max(32, trackBreite * document.body.clientWidth / document.body.scrollWidth)
    : trackBreite;
  const maxThumbWeg = Math.max(0, trackBreite - thumbBreite);
  const fortschritt = maxScroll > 0 ? document.body.scrollLeft / maxScroll : 0;

  startScrollbarThumb.style.width = `${thumbBreite}px`;
  startScrollbarThumb.style.transform = `translateX(${fortschritt * maxThumbWeg}px)`;
  startScrollbar.setAttribute("aria-valuenow", String(Math.round(fortschritt * 100)));
  startScrollbar.hidden = maxScroll <= 0;
}

let startScrollbarPointerId = null;
let startScrollbarGrabOffset = 0;

function setzeStartScrollstand(clientX, grabOffset = 0) {
  const trackRect = startScrollbar.getBoundingClientRect();
  const thumbBreite = startScrollbarThumb.offsetWidth;
  const maxThumbWeg = Math.max(0, trackRect.width - thumbBreite);
  const maxScroll = document.body.scrollWidth - document.body.clientWidth;
  const thumbPosition = Math.max(0, Math.min(maxThumbWeg, clientX - trackRect.left - grabOffset));

  document.body.scrollLeft = maxThumbWeg > 0 ? thumbPosition / maxThumbWeg * maxScroll : 0;
}

startScrollbar.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  const thumbRect = startScrollbarThumb.getBoundingClientRect();
  startScrollbarPointerId = event.pointerId;
  startScrollbarGrabOffset = event.target === startScrollbarThumb
    ? event.clientX - thumbRect.left
    : startScrollbarThumb.offsetWidth / 2;
  startScrollbar.setPointerCapture(event.pointerId);
  setzeStartScrollstand(event.clientX, startScrollbarGrabOffset);
});

startScrollbar.addEventListener("pointermove", (event) => {
  if (event.pointerId === startScrollbarPointerId) {
    setzeStartScrollstand(event.clientX, startScrollbarGrabOffset);
  }
});

function beendeStartScrollbarZiehen(event) {
  if (event.pointerId === startScrollbarPointerId) startScrollbarPointerId = null;
}

startScrollbar.addEventListener("pointerup", beendeStartScrollbarZiehen);
startScrollbar.addEventListener("pointercancel", beendeStartScrollbarZiehen);

startScrollbar.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "PageDown") {
    document.body.scrollLeft += event.key === "PageDown" ? document.body.clientWidth * 0.9 : 40;
  } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
    document.body.scrollLeft -= event.key === "PageUp" ? document.body.clientWidth * 0.9 : 40;
  } else if (event.key === "Home") {
    document.body.scrollLeft = 0;
  } else if (event.key === "End") {
    document.body.scrollLeft = document.body.scrollWidth;
  } else {
    return;
  }
  event.preventDefault();
});

document.body.addEventListener("scroll", aktualisiereStartScrollbar);
window.addEventListener("resize", aktualisiereStartScrollbar);
window.addEventListener("load", aktualisiereStartScrollbar);
requestAnimationFrame(aktualisiereStartScrollbar);

function aktualisiereOverlayScrollbar() {
  const maxScroll = projektOverlay.scrollHeight - projektOverlay.clientHeight;
  const trackHoehe = overlayScrollbar.clientHeight;
  const thumbHoehe = maxScroll > 0
    ? Math.max(32, trackHoehe * projektOverlay.clientHeight / projektOverlay.scrollHeight)
    : trackHoehe;
  const maxThumbWeg = Math.max(0, trackHoehe - thumbHoehe);
  const fortschritt = maxScroll > 0 ? projektOverlay.scrollTop / maxScroll : 0;

  overlayScrollbarThumb.style.height = `${thumbHoehe}px`;
  overlayScrollbarThumb.style.transform = `translateY(${fortschritt * maxThumbWeg}px)`;
  overlayScrollbar.setAttribute("aria-valuenow", String(Math.round(fortschritt * 100)));
  overlayScrollbar.hidden = maxScroll <= 0;
}

let scrollbarPointerId = null;
let scrollbarGrabOffset = 0;

function setzeOverlayScrollstand(clientY, grabOffset = 0) {
  const trackRect = overlayScrollbar.getBoundingClientRect();
  const thumbHoehe = overlayScrollbarThumb.offsetHeight;
  const maxThumbWeg = Math.max(0, trackRect.height - thumbHoehe);
  const maxScroll = projektOverlay.scrollHeight - projektOverlay.clientHeight;
  const thumbPosition = Math.max(0, Math.min(maxThumbWeg, clientY - trackRect.top - grabOffset));

  projektOverlay.scrollTop = maxThumbWeg > 0 ? thumbPosition / maxThumbWeg * maxScroll : 0;
}

overlayScrollbar.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  const thumbRect = overlayScrollbarThumb.getBoundingClientRect();
  scrollbarPointerId = event.pointerId;
  scrollbarGrabOffset = event.target === overlayScrollbarThumb
    ? event.clientY - thumbRect.top
    : overlayScrollbarThumb.offsetHeight / 2;
  overlayScrollbar.setPointerCapture(event.pointerId);
  setzeOverlayScrollstand(event.clientY, scrollbarGrabOffset);
});

overlayScrollbar.addEventListener("pointermove", (event) => {
  if (event.pointerId === scrollbarPointerId) {
    setzeOverlayScrollstand(event.clientY, scrollbarGrabOffset);
  }
});

function beendeScrollbarZiehen(event) {
  if (event.pointerId === scrollbarPointerId) scrollbarPointerId = null;
}

overlayScrollbar.addEventListener("pointerup", beendeScrollbarZiehen);
overlayScrollbar.addEventListener("pointercancel", beendeScrollbarZiehen);

overlayScrollbar.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "PageDown") {
    projektOverlay.scrollTop += event.key === "PageDown" ? projektOverlay.clientHeight * 0.9 : 40;
  } else if (event.key === "ArrowUp" || event.key === "PageUp") {
    projektOverlay.scrollTop -= event.key === "PageUp" ? projektOverlay.clientHeight * 0.9 : 40;
  } else if (event.key === "Home") {
    projektOverlay.scrollTop = 0;
  } else if (event.key === "End") {
    projektOverlay.scrollTop = projektOverlay.scrollHeight;
  } else {
    return;
  }
  event.preventDefault();
});

function aktualisiereTitelAnimation() {
  const dialogPosition = projektOverlay.getBoundingClientRect();
  const titelPosition = titel.getBoundingClientRect();
  const prozessTitelPosition = prozessTitel.getBoundingClientRect();
  const ausloesepunkt = dialogPosition.top + dialogPosition.height * 0.8;
  const aktuellerScrollstand = projektOverlay.scrollTop;

  if (aktuellerScrollstand > letzterScrollstand) {
    if (titelPosition.top <= ausloesepunkt) titel.classList.add("sichtbar");
    if (prozessTitelPosition.top <= ausloesepunkt) prozessTitel.classList.add("sichtbar");
  } else if (aktuellerScrollstand < letzterScrollstand && prozessTitelPosition.top > ausloesepunkt) {
    prozessTitel.classList.remove("sichtbar");
  }

  letzterScrollstand = aktuellerScrollstand;
}

projektOverlay.addEventListener("scroll", () => {
  aktualisiereTitelAnimation();
  aktualisiereOverlayScrollbar();
});
window.addEventListener("resize", aktualisiereOverlayScrollbar);

zehnteSpalte.addEventListener("click", (event) => {
  if (event.target.closest(".raster__pfeil")) return;
  letzterScrollstand = 0;
  titel.classList.remove("sichtbar");
  prozessTitel.classList.remove("sichtbar");
  projektOverlay.showModal();
  requestAnimationFrame(() => {
    aktualisiereTitelAnimation();
    aktualisiereOverlayScrollbar();
  });
});

zehnteSpalte.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    letzterScrollstand = 0;
    titel.classList.remove("sichtbar");
    prozessTitel.classList.remove("sichtbar");
    projektOverlay.showModal();
    requestAnimationFrame(() => {
      aktualisiereTitelAnimation();
      aktualisiereOverlayScrollbar();
    });
  }
});

overlaySchliessen.addEventListener("click", () => projektOverlay.close());

pfeilImOverlay.addEventListener("click", () => {
  titel.scrollIntoView({ behavior: "smooth", block: "start" });
});

prozessNachOben.addEventListener("click", () => {
  projektOverlay.scrollTo({ top: 0, behavior: "smooth" });
});

projektOverlay.addEventListener("click", (event) => {
  if (event.target === projektOverlay) projektOverlay.close();
});

pfeilNachRechts.addEventListener("click", () => {
  zehnteSpalte.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "start",
  });
});

pfeilNachLinks.addEventListener("click", () => {
  ersteSpalte.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "start",
  });
});

function verschiebeProzessFlaechen(flaeche, event) {
  if (prozessAnimationLaeuft) return;

  const aktuellePosition = flaeche.dataset.position;
  let richtung = aktuellePosition === "rechts" ? -1 : aktuellePosition === "links" ? 1 : 1;

  if (aktuellePosition === "mitte" && event.clientX) {
    const mitte = flaeche.getBoundingClientRect().left + flaeche.offsetWidth / 2;
    richtung = event.clientX < mitte ? -1 : 1;
  }

  prozessAnimationLaeuft = true;
  const anzahl = prozessFlaechen.length;
  const aktiveFlaechen = [0, 1, 2].map((abstand) => prozessFlaechen[(ersteProzessFlaeche + abstand) % anzahl]);
  const eintretenderIndex = richtung > 0
    ? (ersteProzessFlaeche - 1 + anzahl) % anzahl
    : (ersteProzessFlaeche + 3) % anzahl;
  const ausgehendeFlaeche = richtung > 0 ? aktiveFlaechen[2] : aktiveFlaechen[0];
  const eintretendeFlaeche = prozessFlaechen[eintretenderIndex] === ausgehendeFlaeche
    ? ausgehendeFlaeche.cloneNode(false)
    : prozessFlaechen[eintretenderIndex];
  const istKopie = eintretendeFlaeche !== prozessFlaechen[eintretenderIndex];
  if (istKopie) prozessFlaechen[eintretenderIndex] = eintretendeFlaeche;

  eintretendeFlaeche.dataset.position = richtung > 0 ? "ausgang-links" : "ausgang-rechts";
  eintretendeFlaeche.classList.add("ohne-transition");
  if (istKopie) prozessFlaechenRaster.append(eintretendeFlaeche);
  void prozessFlaechenRaster.offsetWidth;
  eintretendeFlaeche.classList.remove("ohne-transition");

  requestAnimationFrame(() => {
    const neuePositionen = richtung > 0
      ? ["mitte", "rechts", "ausgang-rechts"]
      : ["ausgang-links", "links", "mitte"];
    aktiveFlaechen.forEach((element, index) => {
      element.dataset.position = neuePositionen[index];
    });
    eintretendeFlaeche.dataset.position = richtung > 0 ? "links" : "rechts";
  });

  ausgehendeFlaeche.addEventListener("transitionend", () => {
    if (istKopie) ausgehendeFlaeche.remove();
    ersteProzessFlaeche = richtung > 0
      ? eintretenderIndex
      : (ersteProzessFlaeche + 1) % anzahl;
    prozessAnimationLaeuft = false;
  }, { once: true });
}

prozessFlaechenRaster.addEventListener("click", (event) => {
  const flaeche = event.target.closest(".prozess-flaeche");
  if (flaeche) verschiebeProzessFlaechen(flaeche, event);
});

prozessFlaechenRaster.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const flaeche = event.target.closest(".prozess-flaeche");
  if (!flaeche) return;
  event.preventDefault();
  verschiebeProzessFlaechen(flaeche, event);
});

