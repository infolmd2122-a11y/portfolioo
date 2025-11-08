// ===========================
// Background "neurones" animé
// ===========================
(() => {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let width = 0, height = 0, dpi = window.devicePixelRatio || 1;
  let nodes = [];
  let animationId = null;

  const CONFIG = {
    NODE_COUNT: 60,
    MAX_LINK_DIST: 160,
    SPEED: 0.2,
    NODE_RADIUS: 1.2,
    COLOR_A: { r: 26, g: 184, b: 255 },
    COLOR_B: { r: 162, g: 89, b: 255 },
    LINE_ALPHA: 0.18,
    NODE_ALPHA: 0.9
  };

  function resize() {
    dpi = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * dpi);
    canvas.height = Math.floor(height * dpi);
    ctx.setTransform(dpi, 0, 0, dpi, 0, 0);
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createNodes() {
    nodes = [];
    let count = CONFIG.NODE_COUNT;
    if (window.innerWidth <= 600) count = Math.floor(count * 0.45);
    if (window.innerWidth <= 900) count = Math.floor(count * 0.7);

    for (let i = 0; i < count; i++) {
      nodes.push({
        x: rand(0, width),
        y: rand(0, height),
        vx: rand(-CONFIG.SPEED, CONFIG.SPEED),
        vy: rand(-CONFIG.SPEED, CONFIG.SPEED),
        r: rand(CONFIG.NODE_RADIUS * 0.8, CONFIG.NODE_RADIUS * 1.8)
      });
    }
  }

  function mixColor(t, A, B) {
    return {
      r: Math.round(A.r + (B.r - A.r) * t),
      g: Math.round(A.g + (B.g - A.g) * t),
      b: Math.round(A.b + (B.b - A.b) * t)
    };
  }

  function colorToStr(c, a = 1) { return `rgba(${c.r},${c.g},${c.b},${a})`; }

  function draw(timestamp) {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < nodes.length; i++) {
      const ni = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const nj = nodes[j];
        const dx = ni.x - nj.x;
        const dy = ni.y - nj.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.MAX_LINK_DIST) {
          const a = (1 - dist / CONFIG.MAX_LINK_DIST) * CONFIG.LINE_ALPHA;
          const t = (ni.x + ni.y + nj.x + nj.y) / (4 * (width + height));
          const col = mixColor(t, CONFIG.COLOR_A, CONFIG.COLOR_B);
          ctx.beginPath();
          ctx.moveTo(ni.x, ni.y);
          ctx.lineTo(nj.x, nj.y);
          ctx.strokeStyle = colorToStr(col, a);
          ctx.lineWidth = 1;
          ctx.shadowBlur = 6;
          ctx.shadowColor = colorToStr(col, a * 0.9);
          ctx.stroke();
          ctx.closePath();
        }
      }
    }

    nodes.forEach((n, i) => {
      const pulse = 0.6 + 0.4 * Math.sin((timestamp / 1000) + i);
      const t = (n.x + n.y) / (width + height);
      const col = mixColor(t, CONFIG.COLOR_A, CONFIG.COLOR_B);
      ctx.beginPath();
      ctx.fillStyle = colorToStr(col, CONFIG.NODE_ALPHA * pulse);
      ctx.shadowBlur = 10;
      ctx.shadowColor = colorToStr(col, 0.9 * pulse);
      ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();

      n.x += n.vx;
      n.y += n.vy;

      if (n.x < -20 || n.x > width + 20) n.vx *= -1;
      if (n.y < -20 || n.y > height + 20) n.vy *= -1;

      n.vx += rand(-0.02, 0.02);
      n.vy += rand(-0.02, 0.02);
      const maxs = CONFIG.SPEED * 2.5;
      n.vx = Math.max(-maxs, Math.min(maxs, n.vx));
      n.vy = Math.max(-maxs, Math.min(maxs, n.vy));
    });

    animationId = requestAnimationFrame(draw);
  }

  function start() {
    cancelAnimationFrame(animationId);
    resize();
    createNodes();
    animationId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    clearTimeout(window._bgResizeTimer);
    window._bgResizeTimer = setTimeout(() => {
      resize();
      createNodes();
    }, 120);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animationId);
    else animationId = requestAnimationFrame(draw);
  });

  start();
  window.__neuronsBg = { restart: start, config: CONFIG };
})();

// ========== Langue ==========

const langToggle = document.getElementById("lang-toggle");
let currentLang = "fr";

langToggle.addEventListener("click", () => {
  currentLang = currentLang === "fr" ? "en" : "fr";
  langToggle.textContent = currentLang === "fr" ? "EN" : "FR";

  document.querySelectorAll("[data-fr]").forEach(el => {
    el.textContent = el.getAttribute(`data-${currentLang}`);
  });
});

// ========== Projets dynamiques ==========
const projects = [
  {id:1, title:"Projet Blender 1", desc:"Modélisation 3D et rendu réaliste.", blend:"assets/projects/projet1.blend", report:"assets/projects/rapport1.pdf"},
  {id:2, title:"Projet Data 2", desc:"Analyse de données et visualisation.", blend:"assets/projects/projet2.blend", report:"assets/projects/rapport2.pdf"}
];

const projectList = document.getElementById("projects-list");
projects.forEach(p => {
  const card = document.createElement("div");
  card.classList.add("project-card");
  card.innerHTML = `
    <h3>${p.title}</h3>
    <p>${p.desc}</p>
    <div class="project-links">
      <a href="${p.blend}" download>Télécharger le modèle (.blend)</a>
      <a href="${p.report}" target="_blank">Voir le rapport (.pdf)</a>
    </div>
  `;
  projectList.appendChild(card);
});

// ========== EmailJS ==========
(function() { emailjs.init("TON_USER_ID"); })();
document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();
  emailjs.sendForm("TON_SERVICE_ID","TON_TEMPLATE_ID",this)
    .then(()=>alert("Message envoyé !"))
    .catch(err=>alert("Erreur : " + JSON.stringify(err)));
});
