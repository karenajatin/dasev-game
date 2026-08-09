// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Scroll reveal (game slots, etc.) ----------
const revealEls = document.querySelectorAll('[data-reveal]');
if (revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), i * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  revealEls.forEach(el => io.observe(el));
}

// ---------- Neon blue/red grid background ----------
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let w, h, horizon, t = 0;

function resize(){
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  horizon = h * 0.42;
}
window.addEventListener('resize', resize);
resize();

function drawGlow(){
  // soft dual-color glow behind the horizon: red above, blue below
  const grad = ctx.createRadialGradient(w / 2, horizon, 0, w / 2, horizon, w * 0.55);
  grad.addColorStop(0, 'rgba(255,22,60,0.10)');
  grad.addColorStop(0.5, 'rgba(10,132,255,0.06)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

function drawGrid(){
  // horizontal perspective lines moving toward the viewer (blue)
  const lineCount = 22;
  for (let i = 0; i < lineCount; i++) {
    const progress = ((i / lineCount) + t) % 1;
    const y = horizon + Math.pow(progress, 2.6) * (h - horizon);
    const alpha = 0.35 * (1 - progress) + 0.05;
    ctx.strokeStyle = `rgba(10,132,255,${alpha.toFixed(3)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // converging vertical lines (red)
  const vCount = 14;
  for (let i = 0; i <= vCount; i++) {
    const nx = (i / vCount) * 2 - 1; // -1..1
    const topX = w / 2 + nx * w * 0.06;
    const bottomX = w / 2 + nx * w * 0.9;
    ctx.strokeStyle = 'rgba(255,22,60,0.16)';
    ctx.beginPath();
    ctx.moveTo(topX, horizon);
    ctx.lineTo(bottomX, h);
    ctx.stroke();
  }

  // horizon line glow (red, to contrast the blue grid)
  ctx.strokeStyle = 'rgba(255,22,60,0.6)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, horizon);
  ctx.lineTo(w, horizon);
  ctx.stroke();
}

function tick(){
  ctx.clearRect(0, 0, w, h);
  drawGlow();
  drawGrid();
  t += 0.0025;
  if (!reduceMotion) requestAnimationFrame(tick);
}
tick();
