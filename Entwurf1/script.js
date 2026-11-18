const pfeilNachRechts = document.querySelector(".raster__pfeil--rechts");
const pfeilNachLinks = document.querySelector(".raster__pfeil--links");
const ersteSpalte = document.querySelector("#spalte-1");
const zehnteSpalte = document.querySelector("#spalte-10");
const projektOverlay = document.querySelector(".projekt-overlay");
const overlaySchliessen = document.querySelector(".projekt-overlay__schliessen");

zehnteSpalte.addEventListener("click", (event) => {
  if (event.target.closest(".raster__pfeil")) return;
  projektOverlay.showModal();
});

zehnteSpalte.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    projektOverlay.showModal();
  }
});

overlaySchliessen.addEventListener("click", () => projektOverlay.close());

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
