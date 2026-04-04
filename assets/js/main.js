const music = document.getElementById("bg-music");
const musicToggle = document.getElementById("music-toggle");
const neocitiTrigger = document.getElementById("neociti-trigger");
const neocitiBuilder = document.getElementById("neociti-builder");
const closeBuilder = document.getElementById("close-builder");
const clearCanvas = document.getElementById("clear-canvas");
const canvas = document.getElementById("neociti-canvas");

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

if (neocitiTrigger && neocitiBuilder) {
  neocitiTrigger.addEventListener("click", () => {
    neocitiBuilder.classList.add("is-open");
    neocitiBuilder.setAttribute("aria-hidden", "false");
    neocitiBuilder.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

if (closeBuilder && neocitiBuilder) {
  closeBuilder.addEventListener("click", () => {
    neocitiBuilder.classList.remove("is-open");
    neocitiBuilder.setAttribute("aria-hidden", "true");
  });
}

if (canvas) {
  const context = canvas.getContext("2d");
  const spacing = 24;
  const dotRadius = 1.8;
  const pathRadius = 5;
  const paths = [];
  let activePath = null;
  let isDrawing = false;

  const snapPoint = (event) => {
    const bounds = canvas.getBoundingClientRect();
    const scaleX = canvas.width / bounds.width;
    const scaleY = canvas.height / bounds.height;
    const x = (event.clientX - bounds.left) * scaleX;
    const y = (event.clientY - bounds.top) * scaleY;
    const origin = spacing / 2;
    const maxX = origin + Math.floor((canvas.width - origin) / spacing) * spacing;
    const maxY = origin + Math.floor((canvas.height - origin) / spacing) * spacing;

    return {
      x: Math.min(maxX, Math.max(origin, origin + Math.round((x - origin) / spacing) * spacing)),
      y: Math.min(maxY, Math.max(origin, origin + Math.round((y - origin) / spacing) * spacing)),
    };
  };

  const samePoint = (a, b) => a && b && a.x === b.x && a.y === b.y;

  const drawGrid = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#04040a";
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let x = spacing / 2; x < canvas.width; x += spacing) {
      for (let y = spacing / 2; y < canvas.height; y += spacing) {
        context.beginPath();
        context.fillStyle = "rgba(207, 255, 248, 0.5)";
        context.arc(x, y, dotRadius, 0, Math.PI * 2);
        context.fill();
      }
    }
  };

  const drawPaths = () => {
    paths.forEach((path, index) => {
      if (path.length < 1) {
        return;
      }

      context.strokeStyle = index % 2 === 0 ? "#ff3b6b" : "#00ffd0";
      context.lineWidth = 4;
      context.shadowBlur = 18;
      context.shadowColor = context.strokeStyle;
      context.lineJoin = "round";
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(path[0].x, path[0].y);

      for (let i = 1; i < path.length; i += 1) {
        context.lineTo(path[i].x, path[i].y);
      }

      context.stroke();

      path.forEach((point) => {
        context.beginPath();
        context.fillStyle = "#fff3a8";
        context.arc(point.x, point.y, pathRadius, 0, Math.PI * 2);
        context.fill();
      });
    });

    context.shadowBlur = 0;
  };

  const render = () => {
    drawGrid();
    drawPaths();
  };

  const extendPath = (event) => {
    if (!isDrawing || !activePath) {
      return;
    }

    const point = snapPoint(event);
    const lastPoint = activePath[activePath.length - 1];

    if (!samePoint(lastPoint, point)) {
      activePath.push(point);
      render();
    }
  };

  canvas.addEventListener("pointerdown", (event) => {
    isDrawing = true;
    const start = snapPoint(event);
    activePath = [start];
    paths.push(activePath);
    canvas.setPointerCapture(event.pointerId);
    render();
  });

  canvas.addEventListener("pointermove", extendPath);

  const stopDrawing = (event) => {
    if (!isDrawing) {
      return;
    }

    extendPath(event);
    isDrawing = false;
    activePath = null;
  };

  canvas.addEventListener("pointerup", stopDrawing);
  canvas.addEventListener("pointerleave", stopDrawing);

  if (clearCanvas) {
    clearCanvas.addEventListener("click", () => {
      paths.length = 0;
      activePath = null;
      isDrawing = false;
      render();
    });
  }

  render();
}
