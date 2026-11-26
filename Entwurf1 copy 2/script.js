const pfeilNachRechts = document.querySelector(".raster__pfeil--rechts");
const pfeilNachLinks = document.querySelector(".raster__pfeil--links");
const ersteSpalte = document.querySelector(".raster__spalte");
const zehnteSpalte = document.querySelector("#spalte-10");
const projektOverlay = document.querySelector("#london-overlay");
const pfeilImOverlay = projektOverlay.querySelector(".overlay-pfeil-unten");
const overlayScrollbar = projektOverlay.querySelector(".overlay-scrollbar");
const overlayScrollbarThumb = projektOverlay.querySelector(".overlay-scrollbar__thumb");
const startScrollbar = document.querySelector(".start-scrollbar");
const startScrollbarThumb = document.querySelector(".start-scrollbar__thumb");
const overlaySchliessen = projektOverlay.querySelector(".projekt-overlay__schliessen");
const prozessNachOben = projektOverlay.querySelector(".prozess-nach-oben");
const titel = projektOverlay.querySelector(".projekt-text");
const prozessTitel = projektOverlay.querySelector(".prozess-titel");
const prozessFlaechenRaster = projektOverlay.querySelector(".prozess-flaechen");
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

let schwebenLetzterScrollstand = 0;

function aktualisiereSchwebenTitelAnimation() {
  const dialogPosition = schwebenOverlay.getBoundingClientRect();
  const projekttitel = schwebenOverlay.querySelector(".projekt-text");
  const ausloesepunkt = dialogPosition.top + dialogPosition.height * 0.8;

  if (projekttitel && projekttitel.getBoundingClientRect().top <= ausloesepunkt) {
    projekttitel.classList.add("sichtbar");
  }

  if (prozessTitel) {
    const prozessTitelPosition = prozessTitel.getBoundingClientRect();
    const aktuellerScrollstand = schwebenOverlay.scrollTop;

    if (aktuellerScrollstand > schwebenLetzterScrollstand) {
      if (prozessTitelPosition.top <= ausloesepunkt) prozessTitel.classList.add("sichtbar");
    } else if (aktuellerScrollstand < schwebenLetzterScrollstand && prozessTitelPosition.top > ausloesepunkt) {
      prozessTitel.classList.remove("sichtbar");
    }

    schwebenLetzterScrollstand = aktuellerScrollstand;
  }
}

function aktualisiereSchwebenScrollbar() {
  const maxScroll = schwebenOverlay.scrollHeight - schwebenOverlay.clientHeight;
  const trackHeight = schwebenOverlayScrollbar.clientHeight;
  const thumbHeight = maxScroll > 0
    ? Math.max(32, trackHeight * schwebenOverlay.clientHeight / schwebenOverlay.scrollHeight)
    : trackHeight;
  const maxThumbWay = Math.max(0, trackHeight - thumbHeight);
  const progress = maxScroll > 0 ? schwebenOverlay.scrollTop / maxScroll : 0;
  schwebenOverlayThumb.style.height = `${thumbHeight}px`;
  schwebenOverlayThumb.style.transform = `translateY(${progress * maxThumbWay}px)`;
  schwebenOverlayScrollbar.hidden = maxScroll <= 0;
}

function oeffneSchwebenOverlay() {
  schwebenOverlay.scrollTop = 0;
  schwebenLetzterScrollstand = 0;
  schwebenOverlay.querySelector(".projekt-text").classList.remove("sichtbar");
  schwebenOverlay.querySelector(".prozess-titel").classList.remove("sichtbar");
  schwebenOverlay.showModal();
  requestAnimationFrame(() => {
    aktualisiereSchwebenTitelAnimation();
    aktualisiereSchwebenScrollbar();
  });
}

const schwebenSpalte = document.querySelector("#spalte-schweben");
const schwebenOverlay = document.querySelector("#schweben-overlay");
const schwebenOverlayScrollbar = schwebenOverlay.querySelector(".overlay-scrollbar");
const schwebenOverlayThumb = schwebenOverlay.querySelector(".overlay-scrollbar__thumb");
const schwebenClose = schwebenOverlay.querySelector(".projekt-overlay__schliessen");

schwebenSpalte.addEventListener("click", (event) => {
  if (event.target.closest(".raster__pfeil")) return;
  oeffneSchwebenOverlay();
});

schwebenSpalte.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    oeffneSchwebenOverlay();
  }
});

schwebenClose.addEventListener("click", () => schwebenOverlay.close());
schwebenOverlay.addEventListener("click", (event) => {
  if (event.target === schwebenOverlay) schwebenOverlay.close();
});
schwebenOverlay.addEventListener("scroll", () => {
  aktualisiereSchwebenTitelAnimation();
  aktualisiereSchwebenScrollbar();
});
window.addEventListener("resize", aktualisiereSchwebenScrollbar);

const schwebenOverlayArrow = schwebenOverlay.querySelector(".overlay-pfeil-unten");
schwebenOverlayArrow.addEventListener("click", () => {
  schwebenOverlay.querySelector(".projekt-text").scrollIntoView({ behavior: "smooth", block: "start" });
});

const schwebenTopButton = schwebenOverlay.querySelector(".prozess-nach-oben");
schwebenTopButton.addEventListener("click", () => schwebenOverlay.scrollTo({ top: 0, behavior: "smooth" }));

function oeffneLondonOverlay() {
  projektOverlay.scrollTop = 0;
  letzterScrollstand = 0;
  titel.classList.remove("sichtbar");
  prozessTitel.classList.remove("sichtbar");
  projektOverlay.showModal();
  requestAnimationFrame(() => {
    aktualisiereTitelAnimation();
    aktualisiereOverlayScrollbar();
  });
}

zehnteSpalte.addEventListener("click", (event) => {
  if (event.target.closest(".raster__pfeil")) return;
  oeffneLondonOverlay();
});

zehnteSpalte.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    oeffneLondonOverlay();
  }
});

overlaySchliessen.addEventListener("click", () => projektOverlay.close());
projektOverlay.addEventListener("click", (event) => {
  if (event.target === projektOverlay) projektOverlay.close();
});
projektOverlay.addEventListener("scroll", () => {
  aktualisiereTitelAnimation();
  aktualisiereOverlayScrollbar();
});
window.addEventListener("resize", aktualisiereOverlayScrollbar);

pfeilImOverlay.addEventListener("click", () => {
  titel.scrollIntoView({ behavior: "smooth", block: "start" });
});

prozessNachOben.addEventListener("click", () => {
  projektOverlay.scrollTo({ top: 0, behavior: "smooth" });
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

function aktualisiereTitelAnimation() {
  const dialogPosition = projektOverlay.getBoundingClientRect();
  const ausloesepunkt = dialogPosition.top + dialogPosition.height * 0.8;

  if (titel.getBoundingClientRect().top <= ausloesepunkt) {
    titel.classList.add("sichtbar");
  } else {
    titel.classList.remove("sichtbar");
  }

  if (prozessTitel) {
    const prozessTitelPosition = prozessTitel.getBoundingClientRect();
    const aktuellerScrollstand = projektOverlay.scrollTop;

    if (aktuellerScrollstand > letzterScrollstand) {
      if (prozessTitelPosition.top <= ausloesepunkt) prozessTitel.classList.add("sichtbar");
    } else if (aktuellerScrollstand < letzterScrollstand && prozessTitelPosition.top > ausloesepunkt) {
      prozessTitel.classList.remove("sichtbar");
    }

    letzterScrollstand = aktuellerScrollstand;
  }
}

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
  const flaeche = event.target.closest(".prozess-flache");
  if (flaeche) verschiebeProzessFlaechen(flaeche, event);
});

prozessFlaechenRaster.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const flaeche = event.target.closest(".prozess-flaeche");
  if (!flaeche) return;
  event.preventDefault();
  verschiebeProzessFlaechen(flaeche, event);
});

(function gruppiereSchwebenVideos() {
  const overlayGrid = document.querySelector("#schweben-overlay-inhalt");
  if (!overlayGrid) return;

  const videoContainer = [...overlayGrid.querySelectorAll(".overlay-bild-zoom")].filter((element) =>
    element.querySelector('video[src^="data/Motion Graphics 1/"]')
  );

  if (videoContainer.length !== 12) return;

  const prozessTitel = overlayGrid.querySelector(".prozess-titel");

  for (let index = 0; index < videoContainer.length; index += 3) {
    const reihe = document.createElement("div");
    reihe.className = "motion-dreierreihe";
    if (index === 0) reihe.classList.add("projektlauftext-nachfolge");

    overlayGrid.insertBefore(reihe, prozessTitel);
    reihe.append(videoContainer[index], videoContainer[index + 1], videoContainer[index + 2]);
  }
})();

const zeitloseSpalte = document.querySelector("#spalte-zeitlose");
const zeitloseOverlay = document.querySelector("#zeitlose-overlay");
const zeitloseScrollbar = zeitloseOverlay.querySelector(".overlay-scrollbar");
const zeitloseScrollbarThumb = zeitloseOverlay.querySelector(".overlay-scrollbar__thumb");
const zeitloseClose = zeitloseOverlay.querySelector(".projekt-overlay__schliessen");
let zeitloseLetzterScrollstand = 0;

function aktualisiereZeitloseScrollbar() {
  const maxScroll = zeitloseOverlay.scrollHeight - zeitloseOverlay.clientHeight;
  const trackHeight = zeitloseScrollbar.clientHeight;
  const thumbHeight = maxScroll > 0
    ? Math.max(32, trackHeight * zeitloseOverlay.clientHeight / zeitloseOverlay.scrollHeight)
    : trackHeight;
  const maxThumbWay = Math.max(0, trackHeight - thumbHeight);
  const progress = maxScroll > 0 ? zeitloseOverlay.scrollTop / maxScroll : 0;

  zeitloseScrollbarThumb.style.height = `${thumbHeight}px`;
  zeitloseScrollbarThumb.style.transform = `translateY(${progress * maxThumbWay}px)`;
  zeitloseScrollbar.hidden = maxScroll <= 0;
}

function aktualisiereZeitloseTitelAnimation() {
  const dialogPosition = zeitloseOverlay.getBoundingClientRect();
  const projektTitel = zeitloseOverlay.querySelector(".projekt-text");
  const prozessTitel = zeitloseOverlay.querySelector(".prozess-titel");
  const ausloesepunkt = dialogPosition.top + dialogPosition.height * 0.8;

  if (projektTitel.getBoundingClientRect().top <= ausloesepunkt) {
    projektTitel.classList.add("sichtbar");
  }

  if (prozessTitel) {
    const prozessPosition = prozessTitel.getBoundingClientRect();
    if (zeitloseOverlay.scrollTop > zeitloseLetzterScrollstand && prozessPosition.top <= ausloesepunkt) {
      prozessTitel.classList.add("sichtbar");
    } else if (zeitloseOverlay.scrollTop < zeitloseLetzterScrollstand && prozessPosition.top > ausloesepunkt) {
      prozessTitel.classList.remove("sichtbar");
    }
  }

  zeitloseLetzterScrollstand = zeitloseOverlay.scrollTop;
}

function oeffneZeitloseOverlay() {
  zeitloseOverlay.scrollTop = 0;
  zeitloseLetzterScrollstand = 0;
  zeitloseOverlay.querySelector(".projekt-text").classList.remove("sichtbar");
  zeitloseOverlay.querySelector(".prozess-titel").classList.remove("sichtbar");
  zeitloseOverlay.showModal();
  requestAnimationFrame(() => {
    aktualisiereZeitloseTitelAnimation();
    aktualisiereZeitloseScrollbar();
  });
}

zeitloseSpalte.addEventListener("click", (event) => {
  if (event.target.closest(".raster__pfeil")) return;
  oeffneZeitloseOverlay();
});
zeitloseSpalte.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    oeffneZeitloseOverlay();
  }
});
zeitloseClose.addEventListener("click", () => zeitloseOverlay.close());
zeitloseOverlay.addEventListener("click", (event) => {
  if (event.target === zeitloseOverlay) zeitloseOverlay.close();
});
zeitloseOverlay.addEventListener("scroll", () => {
  aktualisiereZeitloseTitelAnimation();
  aktualisiereZeitloseScrollbar();
});
window.addEventListener("resize", aktualisiereZeitloseScrollbar);

zeitloseOverlay.querySelector(".overlay-pfeil-unten").addEventListener("click", () => {
  zeitloseOverlay.querySelector(".projekt-text").scrollIntoView({ behavior: "smooth", block: "start" });
});
zeitloseOverlay.querySelector(".prozess-nach-oben").addEventListener("click", () => {
  zeitloseOverlay.scrollTo({ top: 0, behavior: "smooth" });
});

const einzigartigkeitSpalte = document.querySelector("#spalte-einzigartigkeit");
const einzigartigkeitOverlay = document.querySelector("#einzigartigkeit-overlay");
const einzigartigkeitScrollbar = einzigartigkeitOverlay.querySelector(".overlay-scrollbar");
const einzigartigkeitScrollbarThumb = einzigartigkeitOverlay.querySelector(".overlay-scrollbar__thumb");
const einzigartigkeitClose = einzigartigkeitOverlay.querySelector(".projekt-overlay__schliessen");
let einzigartigkeitLetzterScrollstand = 0;

function aktualisiereEinzigartigkeitScrollbar() {
  const maxScroll = einzigartigkeitOverlay.scrollHeight - einzigartigkeitOverlay.clientHeight;
  const trackHeight = einzigartigkeitScrollbar.clientHeight;
  const thumbHeight = maxScroll > 0
    ? Math.max(32, trackHeight * einzigartigkeitOverlay.clientHeight / einzigartigkeitOverlay.scrollHeight)
    : trackHeight;
  const maxThumbWay = Math.max(0, trackHeight - thumbHeight);
  const progress = maxScroll > 0 ? einzigartigkeitOverlay.scrollTop / maxScroll : 0;
  einzigartigkeitScrollbarThumb.style.height = `${thumbHeight}px`;
  einzigartigkeitScrollbarThumb.style.transform = `translateY(${progress * maxThumbWay}px)`;
  einzigartigkeitScrollbar.hidden = maxScroll <= 0;
}

function aktualisiereEinzigartigkeitTitelAnimation() {
  const dialogPosition = einzigartigkeitOverlay.getBoundingClientRect();
  const projektTitel = einzigartigkeitOverlay.querySelector(".projekt-text");
  const prozessTitel = einzigartigkeitOverlay.querySelector(".prozess-titel");
  const ausloesepunkt = dialogPosition.top + dialogPosition.height * 0.8;

  if (projektTitel.getBoundingClientRect().top <= ausloesepunkt) projektTitel.classList.add("sichtbar");

  if (prozessTitel) {
    const prozessPosition = prozessTitel.getBoundingClientRect();
    if (einzigartigkeitOverlay.scrollTop > einzigartigkeitLetzterScrollstand && prozessPosition.top <= ausloesepunkt) {
      prozessTitel.classList.add("sichtbar");
    } else if (einzigartigkeitOverlay.scrollTop < einzigartigkeitLetzterScrollstand && prozessPosition.top > ausloesepunkt) {
      prozessTitel.classList.remove("sichtbar");
    }
  }
  einzigartigkeitLetzterScrollstand = einzigartigkeitOverlay.scrollTop;
}

function oeffneEinzigartigkeitOverlay() {
  einzigartigkeitOverlay.scrollTop = 0;
  einzigartigkeitLetzterScrollstand = 0;
  einzigartigkeitOverlay.querySelector(".projekt-text").classList.remove("sichtbar");
  einzigartigkeitOverlay.querySelector(".prozess-titel").classList.remove("sichtbar");
  einzigartigkeitOverlay.showModal();
  requestAnimationFrame(() => {
    aktualisiereEinzigartigkeitTitelAnimation();
    aktualisiereEinzigartigkeitScrollbar();
  });
}

einzigartigkeitSpalte.addEventListener("click", (event) => {
  if (event.target.closest(".raster__pfeil")) return;
  oeffneEinzigartigkeitOverlay();
});

einzigartigkeitSpalte.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    oeffneEinzigartigkeitOverlay();
  }
});

einzigartigkeitClose.addEventListener("click", () => einzigartigkeitOverlay.close());
einzigartigkeitOverlay.addEventListener("click", (event) => {
  if (event.target === einzigartigkeitOverlay) einzigartigkeitOverlay.close();
});
einzigartigkeitOverlay.addEventListener("scroll", () => {
  aktualisiereEinzigartigkeitTitelAnimation();
  aktualisiereEinzigartigkeitScrollbar();
});
window.addEventListener("resize", aktualisiereEinzigartigkeitScrollbar);

einzigartigkeitOverlay.querySelector(".overlay-pfeil-unten").addEventListener("click", () => {
  einzigartigkeitOverlay.querySelector(".projekt-text").scrollIntoView({ behavior: "smooth", block: "start" });
});
einzigartigkeitOverlay.querySelector(".prozess-nach-oben").addEventListener("click", () => {
  einzigartigkeitOverlay.scrollTo({ top: 0, behavior: "smooth" });
});

const semantischeSpalte = document.querySelector("#spalte-semantische");
const semantischeOverlay = document.querySelector("#semantische-overlay");
const semantischeScrollbar = semantischeOverlay.querySelector(".overlay-scrollbar");
const semantischeScrollbarThumb = semantischeOverlay.querySelector(".overlay-scrollbar__thumb");
const semantischeClose = semantischeOverlay.querySelector(".projekt-overlay__schliessen");
let semantischeLetzterScrollstand = 0;

function aktualisiereSemantischeScrollbar() {
  const maxScroll = semantischeOverlay.scrollHeight - semantischeOverlay.clientHeight;
  const trackHeight = semantischeScrollbar.clientHeight;
  const thumbHeight = maxScroll > 0
    ? Math.max(32, trackHeight * semantischeOverlay.clientHeight / semantischeOverlay.scrollHeight)
    : trackHeight;
  const maxThumbWay = Math.max(0, trackHeight - thumbHeight);
  const progress = maxScroll > 0 ? semantischeOverlay.scrollTop / maxScroll : 0;
  semantischeScrollbarThumb.style.height = `${thumbHeight}px`;
  semantischeScrollbarThumb.style.transform = `translateY(${progress * maxThumbWay}px)`;
  semantischeScrollbar.hidden = maxScroll <= 0;
}

function aktualisiereSemantischeTitelAnimation() {
  const dialogPosition = semantischeOverlay.getBoundingClientRect();
  const projektTitel = semantischeOverlay.querySelector(".projekt-text");
  const prozessTitel = semantischeOverlay.querySelector(".prozess-titel");
  const ausloesepunkt = dialogPosition.top + dialogPosition.height * 0.8;

  if (projektTitel.getBoundingClientRect().top <= ausloesepunkt) projektTitel.classList.add("sichtbar");

  if (prozessTitel) {
    const prozessPosition = prozessTitel.getBoundingClientRect();
    if (semantischeOverlay.scrollTop > semantischeLetzterScrollstand && prozessPosition.top <= ausloesepunkt) {
      prozessTitel.classList.add("sichtbar");
    } else if (semantischeOverlay.scrollTop < semantischeLetzterScrollstand && prozessPosition.top > ausloesepunkt) {
      prozessTitel.classList.remove("sichtbar");
    }
  }
  semantischeLetzterScrollstand = semantischeOverlay.scrollTop;
}

function oeffneSemantischeOverlay() {
  semantischeOverlay.scrollTop = 0;
  semantischeLetzterScrollstand = 0;
  semantischeOverlay.querySelector(".projekt-text").classList.remove("sichtbar");
  semantischeOverlay.querySelector(".prozess-titel").classList.remove("sichtbar");
  semantischeOverlay.showModal();
  requestAnimationFrame(() => {
    aktualisiereSemantischeTitelAnimation();
    aktualisiereSemantischeScrollbar();
  });
}

semantischeSpalte.addEventListener("click", (event) => {
  if (event.target.closest(".raster__pfeil")) return;
  oeffneSemantischeOverlay();
});
semantischeSpalte.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    oeffneSemantischeOverlay();
  }
});
semantischeClose.addEventListener("click", () => semantischeOverlay.close());
semantischeOverlay.addEventListener("click", (event) => {
  if (event.target === semantischeOverlay) semantischeOverlay.close();
});
semantischeOverlay.addEventListener("scroll", () => {
  aktualisiereSemantischeTitelAnimation();
  aktualisiereSemantischeScrollbar();
});
window.addEventListener("resize", aktualisiereSemantischeScrollbar);

semantischeOverlay.querySelector(".overlay-pfeil-unten").addEventListener("click", () => {
  semantischeOverlay.querySelector(".projekt-text").scrollIntoView({ behavior: "smooth", block: "start" });
});
semantischeOverlay.querySelector(".prozess-nach-oben").addEventListener("click", () => {
  semantischeOverlay.scrollTo({ top: 0, behavior: "smooth" });
});

const improSpalte = document.querySelector("#spalte-impro");
const improOverlay = document.querySelector("#impro-overlay");
const improScrollbar = improOverlay.querySelector(".overlay-scrollbar");
const improScrollbarThumb = improOverlay.querySelector(".overlay-scrollbar__thumb");
const improClose = improOverlay.querySelector(".projekt-overlay__schliessen");
let improLetzterScrollstand = 0;

function aktualisiereImproScrollbar() {
  const maxScroll = improOverlay.scrollHeight - improOverlay.clientHeight;
  const trackHeight = improScrollbar.clientHeight;
  const thumbHeight = maxScroll > 0
    ? Math.max(32, trackHeight * improOverlay.clientHeight / improOverlay.scrollHeight)
    : trackHeight;
  const maxThumbWay = Math.max(0, trackHeight - thumbHeight);
  const progress = maxScroll > 0 ? improOverlay.scrollTop / maxScroll : 0;
  improScrollbarThumb.style.height = `${thumbHeight}px`;
  improScrollbarThumb.style.transform = `translateY(${progress * maxThumbWay}px)`;
  improScrollbar.hidden = maxScroll <= 0;
}

function aktualisiereImproTitelAnimation() {
  const dialogPosition = improOverlay.getBoundingClientRect();
  const projektTitel = improOverlay.querySelector(".projekt-text");
  const prozessTitel = improOverlay.querySelector(".prozess-titel");
  const ausloesepunkt = dialogPosition.top + dialogPosition.height * 0.8;

  if (projektTitel.getBoundingClientRect().top <= ausloesepunkt) projektTitel.classList.add("sichtbar");

  if (prozessTitel) {
    const prozessPosition = prozessTitel.getBoundingClientRect();
    if (improOverlay.scrollTop > improLetzterScrollstand && prozessPosition.top <= ausloesepunkt) {
      prozessTitel.classList.add("sichtbar");
    } else if (improOverlay.scrollTop < improLetzterScrollstand && prozessPosition.top > ausloesepunkt) {
      prozessTitel.classList.remove("sichtbar");
    }
  }
  improLetzterScrollstand = improOverlay.scrollTop;
}

function oeffneImproOverlay() {
  improOverlay.scrollTop = 0;
  improLetzterScrollstand = 0;
  improOverlay.querySelector(".projekt-text").classList.remove("sichtbar");
  improOverlay.querySelector(".prozess-titel").classList.remove("sichtbar");
  improOverlay.showModal();
  requestAnimationFrame(() => {
    aktualisiereImproTitelAnimation();
    aktualisiereImproScrollbar();
  });
}

improSpalte.addEventListener("click", (event) => {
  if (event.target.closest(".raster__pfeil")) return;
  oeffneImproOverlay();
});
improSpalte.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    oeffneImproOverlay();
  }
});
improClose.addEventListener("click", () => improOverlay.close());
improOverlay.addEventListener("click", (event) => {
  if (event.target === improOverlay) improOverlay.close();
});
improOverlay.addEventListener("scroll", () => {
  aktualisiereImproTitelAnimation();
  aktualisiereImproScrollbar();
});
window.addEventListener("resize", aktualisiereImproScrollbar);

improOverlay.querySelector(".overlay-pfeil-unten").addEventListener("click", () => {
  improOverlay.querySelector(".projekt-text").scrollIntoView({ behavior: "smooth", block: "start" });
});
improOverlay.querySelector(".prozess-nach-oben").addEventListener("click", () => {
  improOverlay.scrollTo({ top: 0, behavior: "smooth" });
});

const heatSpalte = document.querySelector("#spalte-heat");
const heatOverlay = document.querySelector("#heat-overlay");
const heatScrollbar = heatOverlay.querySelector(".overlay-scrollbar");
const heatScrollbarThumb = heatOverlay.querySelector(".overlay-scrollbar__thumb");
const heatClose = heatOverlay.querySelector(".projekt-overlay__schliessen");
let heatLetzterScrollstand = 0;

function aktualisiereHeatScrollbar() {
  const maxScroll = heatOverlay.scrollHeight - heatOverlay.clientHeight;
  const trackHeight = heatScrollbar.clientHeight;
  const thumbHeight = maxScroll > 0
    ? Math.max(32, trackHeight * heatOverlay.clientHeight / heatOverlay.scrollHeight)
    : trackHeight;
  const maxThumbWay = Math.max(0, trackHeight - thumbHeight);
  const progress = maxScroll > 0 ? heatOverlay.scrollTop / maxScroll : 0;
  heatScrollbarThumb.style.height = `${thumbHeight}px`;
  heatScrollbarThumb.style.transform = `translateY(${progress * maxThumbWay}px)`;
  heatScrollbar.hidden = maxScroll <= 0;
}

function aktualisiereHeatTitelAnimation() {
  const dialogPosition = heatOverlay.getBoundingClientRect();
  const projektTitel = heatOverlay.querySelector(".projekt-text");
  const ausloesepunkt = dialogPosition.top + dialogPosition.height * 0.8;

  if (projektTitel.getBoundingClientRect().top <= ausloesepunkt) projektTitel.classList.add("sichtbar");
}

function oeffneHeatOverlay() {
  heatOverlay.scrollTop = 0;
  heatOverlay.querySelector(".projekt-text").classList.remove("sichtbar");
  heatOverlay.showModal();
  requestAnimationFrame(() => {
    aktualisiereHeatTitelAnimation();
    aktualisiereHeatScrollbar();
  });
}

heatSpalte.addEventListener("click", (event) => {
  if (event.target.closest(".raster__pfeil")) return;
  oeffneHeatOverlay();
});
heatSpalte.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    oeffneHeatOverlay();
  }
});
heatClose.addEventListener("click", () => heatOverlay.close());
heatOverlay.addEventListener("click", (event) => {
  if (event.target === heatOverlay) heatOverlay.close();
});
heatOverlay.addEventListener("scroll", () => {
  aktualisiereHeatTitelAnimation();
  aktualisiereHeatScrollbar();
});
window.addEventListener("resize", aktualisiereHeatScrollbar);

heatOverlay.querySelector(".overlay-pfeil-unten").addEventListener("click", () => {
  heatOverlay.querySelector(".projekt-text").scrollIntoView({ behavior: "smooth", block: "start" });
});
heatOverlay.querySelector(".prozess-nach-oben").addEventListener("click", () => {
  heatOverlay.scrollTo({ top: 0, behavior: "smooth" });
});

const parisSpalte = document.querySelector("#spalte-paris");
const parisOverlay = document.querySelector("#paris-overlay");
const parisScrollbar = parisOverlay.querySelector(".overlay-scrollbar");
const parisScrollbarThumb = parisOverlay.querySelector(".overlay-scrollbar__thumb");
let parisLetzterScrollstand = 0;

function aktualisiereParisScrollbar() {
  const maxScroll = parisOverlay.scrollHeight - parisOverlay.clientHeight;
  const trackHeight = parisScrollbar.clientHeight;
  const thumbHeight = maxScroll > 0
    ? Math.max(32, trackHeight * parisOverlay.clientHeight / parisOverlay.scrollHeight)
    : trackHeight;
  const maxThumbWay = Math.max(0, trackHeight - thumbHeight);
  const progress = maxScroll > 0 ? parisOverlay.scrollTop / maxScroll : 0;
  parisScrollbarThumb.style.height = `${thumbHeight}px`;
  parisScrollbarThumb.style.transform = `translateY(${progress * maxThumbWay}px)`;
  parisScrollbar.hidden = maxScroll <= 0;
}

function aktualisiereParisTitelAnimation() {
  const dialogPosition = parisOverlay.getBoundingClientRect();
  const projektTitel = parisOverlay.querySelector(".projekt-text");
  const prozessTitel = parisOverlay.querySelector(".prozess-titel");
  const ausloesepunkt = dialogPosition.top + dialogPosition.height * 0.8;

  if (projektTitel.getBoundingClientRect().top <= ausloesepunkt) {
    projektTitel.classList.add("sichtbar");
  } else {
    projektTitel.classList.remove("sichtbar");
  }

  if (prozessTitel) {
    const prozessTitelPosition = prozessTitel.getBoundingClientRect();
    if (parisOverlay.scrollTop > parisLetzterScrollstand && prozessTitelPosition.top <= ausloesepunkt) {
      prozessTitel.classList.add("sichtbar");
    } else if (parisOverlay.scrollTop < parisLetzterScrollstand && prozessTitelPosition.top > ausloesepunkt) {
      prozessTitel.classList.remove("sichtbar");
    }
  }
  parisLetzterScrollstand = parisOverlay.scrollTop;
}

function oeffneParisOverlay() {
  parisOverlay.scrollTop = 0;
  parisLetzterScrollstand = 0;
  parisOverlay.querySelector(".projekt-text").classList.remove("sichtbar");
  parisOverlay.querySelector(".prozess-titel").classList.remove("sichtbar");
  parisOverlay.showModal();
  requestAnimationFrame(() => {
    aktualisiereParisTitelAnimation();
    aktualisiereParisScrollbar();
  });
}

parisSpalte.addEventListener("click", (event) => {
  if (event.target.closest(".raster__pfeil")) return;
  oeffneParisOverlay();
});
parisSpalte.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    oeffneParisOverlay();
  }
});

parisOverlay.querySelector(".projekt-overlay__schliessen").addEventListener("click", () => parisOverlay.close());
parisOverlay.addEventListener("click", (event) => {
  if (event.target === parisOverlay) parisOverlay.close();
});
parisOverlay.addEventListener("scroll", () => {
  aktualisiereParisTitelAnimation();
  aktualisiereParisScrollbar();
});
window.addEventListener("resize", aktualisiereParisScrollbar);
parisOverlay.querySelector(".overlay-pfeil-unten").addEventListener("click", () => {
  parisOverlay.querySelector(".projekt-text").scrollIntoView({ behavior: "smooth", block: "start" });
});
parisOverlay.querySelector(".prozess-nach-oben").addEventListener("click", () => {
  parisOverlay.scrollTo({ top: 0, behavior: "smooth" });
});

const masterabschlussSpalte = document.querySelector("#spalte-masterabschluss");
const masterabschlussOverlay = document.querySelector("#masterabschluss-overlay");
const masterabschlussScrollbar = masterabschlussOverlay.querySelector(".overlay-scrollbar");
const masterabschlussScrollbarThumb = masterabschlussOverlay.querySelector(".overlay-scrollbar__thumb");
let masterabschlussLetzterScrollstand = 0;

function aktualisiereMasterabschlussScrollbar() {
  const maxScroll = masterabschlussOverlay.scrollHeight - masterabschlussOverlay.clientHeight;
  const trackHeight = masterabschlussScrollbar.clientHeight;
  const thumbHeight = maxScroll > 0
    ? Math.max(32, trackHeight * masterabschlussOverlay.clientHeight / masterabschlussOverlay.scrollHeight)
    : trackHeight;
  const maxThumbWay = Math.max(0, trackHeight - thumbHeight);
  const progress = maxScroll > 0 ? masterabschlussOverlay.scrollTop / maxScroll : 0;
  masterabschlussScrollbarThumb.style.height = `${thumbHeight}px`;
  masterabschlussScrollbarThumb.style.transform = `translateY(${progress * maxThumbWay}px)`;
  masterabschlussScrollbar.hidden = maxScroll <= 0;
}

function aktualisiereMasterabschlussTitelAnimation() {
  const dialogPosition = masterabschlussOverlay.getBoundingClientRect();
  const projektTitel = masterabschlussOverlay.querySelector(".projekt-text");
  const prozessTitel = masterabschlussOverlay.querySelector(".prozess-titel");
  const ausloesepunkt = dialogPosition.top + dialogPosition.height * 0.8;

  if (projektTitel.getBoundingClientRect().top <= ausloesepunkt) {
    projektTitel.classList.add("sichtbar");
  } else {
    projektTitel.classList.remove("sichtbar");
  }

  if (prozessTitel) {
    const prozessPosition = prozessTitel.getBoundingClientRect();
    if (masterabschlussOverlay.scrollTop > masterabschlussLetzterScrollstand && prozessPosition.top <= ausloesepunkt) {
      prozessTitel.classList.add("sichtbar");
    } else if (masterabschlussOverlay.scrollTop < masterabschlussLetzterScrollstand && prozessPosition.top > ausloesepunkt) {
      prozessTitel.classList.remove("sichtbar");
    }
  }
  masterabschlussLetzterScrollstand = masterabschlussOverlay.scrollTop;
}

function oeffneMasterabschlussOverlay() {
  masterabschlussOverlay.scrollTop = 0;
  masterabschlussLetzterScrollstand = 0;
  masterabschlussOverlay.querySelector(".projekt-text").classList.remove("sichtbar");
  masterabschlussOverlay.querySelector(".prozess-titel").classList.remove("sichtbar");
  masterabschlussOverlay.showModal();
  requestAnimationFrame(() => {
    aktualisiereMasterabschlussTitelAnimation();
    aktualisiereMasterabschlussScrollbar();
  });
}

masterabschlussSpalte.addEventListener("click", (event) => {
  if (event.target.closest(".raster__pfeil")) return;
  oeffneMasterabschlussOverlay();
});
masterabschlussSpalte.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    oeffneMasterabschlussOverlay();
  }
});

masterabschlussOverlay.querySelector(".projekt-overlay__schliessen").addEventListener("click", () => masterabschlussOverlay.close());
masterabschlussOverlay.addEventListener("click", (event) => {
  if (event.target === masterabschlussOverlay) masterabschlussOverlay.close();
});
masterabschlussOverlay.addEventListener("scroll", () => {
  aktualisiereMasterabschlussTitelAnimation();
  aktualisiereMasterabschlussScrollbar();
});
window.addEventListener("resize", aktualisiereMasterabschlussScrollbar);
masterabschlussOverlay.querySelector(".overlay-pfeil-unten").addEventListener("click", () => {
  masterabschlussOverlay.querySelector(".projekt-text").scrollIntoView({ behavior: "smooth", block: "start" });
});
masterabschlussOverlay.querySelector(".prozess-nach-oben").addEventListener("click", () => {
  masterabschlussOverlay.scrollTo({ top: 0, behavior: "smooth" });
});

const stundenSpalte = document.querySelector("#spalte-stunden");
const stundenOverlay = document.querySelector("#stunden-overlay");
const stundenScrollbar = stundenOverlay.querySelector(".overlay-scrollbar");
const stundenScrollbarThumb = stundenOverlay.querySelector(".overlay-scrollbar__thumb");
let stundenLetzterScrollstand = 0;

function aktualisiereStundenScrollbar() {
  const maxScroll = stundenOverlay.scrollHeight - stundenOverlay.clientHeight;
  const trackHeight = stundenScrollbar.clientHeight;
  const thumbHeight = maxScroll > 0
    ? Math.max(32, trackHeight * stundenOverlay.clientHeight / stundenOverlay.scrollHeight)
    : trackHeight;
  const maxThumbWay = Math.max(0, trackHeight - thumbHeight);
  const progress = maxScroll > 0 ? stundenOverlay.scrollTop / maxScroll : 0;
  stundenScrollbarThumb.style.height = `${thumbHeight}px`;
  stundenScrollbarThumb.style.transform = `translateY(${progress * maxThumbWay}px)`;
  stundenScrollbar.hidden = maxScroll <= 0;
}

function aktualisiereStundenTitelAnimation() {
  const dialogPosition = stundenOverlay.getBoundingClientRect();
  const projektTitel = stundenOverlay.querySelector(".projekt-text");
  const prozessTitel = stundenOverlay.querySelector(".prozess-titel");
  const ausloesepunkt = dialogPosition.top + dialogPosition.height * 0.8;

  if (projektTitel.getBoundingClientRect().top <= ausloesepunkt) projektTitel.classList.add("sichtbar");
  else projektTitel.classList.remove("sichtbar");

  if (stundenOverlay.scrollTop > stundenLetzterScrollstand && prozessTitel.getBoundingClientRect().top <= ausloesepunkt) {
    prozessTitel.classList.add("sichtbar");
  } else if (stundenOverlay.scrollTop < stundenLetzterScrollstand && prozessTitel.getBoundingClientRect().top > ausloesepunkt) {
    prozessTitel.classList.remove("sichtbar");
  }
  stundenLetzterScrollstand = stundenOverlay.scrollTop;
}

function oeffneStundenOverlay() {
  stundenOverlay.scrollTop = 0;
  stundenLetzterScrollstand = 0;
  stundenOverlay.querySelector(".projekt-text").classList.remove("sichtbar");
  stundenOverlay.querySelector(".prozess-titel").classList.remove("sichtbar");
  stundenOverlay.showModal();
  requestAnimationFrame(() => {
    aktualisiereStundenTitelAnimation();
    aktualisiereStundenScrollbar();
  });
}

stundenSpalte.addEventListener("click", (event) => {
  if (event.target.closest(".raster__pfeil")) {
    ersteSpalte.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    return;
  }
  oeffneStundenOverlay();
});
stundenSpalte.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    oeffneStundenOverlay();
  }
});

stundenOverlay.querySelector(".projekt-overlay__schliessen").addEventListener("click", () => stundenOverlay.close());
stundenOverlay.addEventListener("click", (event) => {
  if (event.target === stundenOverlay) stundenOverlay.close();
});
stundenOverlay.addEventListener("scroll", () => {
  aktualisiereStundenTitelAnimation();
  aktualisiereStundenScrollbar();
});
window.addEventListener("resize", aktualisiereStundenScrollbar);
stundenOverlay.querySelector(".overlay-pfeil-unten").addEventListener("click", () => {
  stundenOverlay.querySelector(".projekt-text").scrollIntoView({ behavior: "smooth", block: "start" });
});
stundenOverlay.querySelector(".prozess-nach-oben").addEventListener("click", () => {
  stundenOverlay.scrollTo({ top: 0, behavior: "smooth" });
});

