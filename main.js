const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.addEventListener("DOMContentLoaded", () => {
  updateBeamCount();

  if (reduceMotion) {
    return;
  }

  loopChant();
});

function updateBeamCount() {
  const countNode = document.getElementById("beam-count");
  if (!countNode) {
    return;
  }

  const randomCount = Math.floor(Math.random() * 401);
  countNode.textContent = String(randomCount);
}

function loopChant() {
  const lines = Array.from(document.querySelectorAll(".chant li"));
  if (!lines.length) {
    return;
  }

  const cycleMs = 4000;
  const stepMs = Math.max(200, Math.floor(cycleMs / lines.length));
  let index = 0;

  window.setInterval(() => {
    lines.forEach((line) => line.classList.remove("active"));
    lines[index].classList.add("active");
    index = (index + 1) % lines.length;
  }, stepMs);
}
