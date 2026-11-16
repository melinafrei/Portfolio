const pfeilNachRechts = document.querySelector(".raster__pfeil--rechts");
const pfeilNachLinks = document.querySelector(".raster__pfeil--links");
const ersteSpalte = document.querySelector("#spalte-1");
const zehnteSpalte = document.querySelector("#spalte-10");

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
