const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");

if (music && musicToggle) {
  musicToggle.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await music.play();
        musicToggle.classList.add("is-playing");
      } catch {
        musicToggle.title = "Audio could not start";
      }
      return;
    }

    music.pause();
    musicToggle.classList.remove("is-playing");
  });
}
