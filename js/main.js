const $ = s => document.querySelector(s), root = document.documentElement;
const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;

/* loader */
(() => {
  const l = $("#load"), p = $("#pc"); let n = 0;
  const done = () => { l.classList.add("out"); setTimeout(() => l.remove(), 900); };
  if (reduce) return l.remove();
  const t = setInterval(() => { n = Math.min(100, n + 7 + Math.random() * 14 | 0); p.textContent = "cargando… " + n + "%"; if (n >= 100) { clearInterval(t); setTimeout(done, 250); } }, 60);
})();

/* modo código / modo diseño */
const ml = $("#ml");
function setMode(m) { root.dataset.mode = m; ml.textContent = m === "code" ? "modo código" : "modo diseño"; try { localStorage.setItem("mode", m); } catch (e) {} }
try { const s = localStorage.getItem("mode"); if (s) setMode(s); } catch (e) {}
$("#mode").addEventListener("click", e => {
  const next = root.dataset.mode === "code" ? "design" : "code";
  if (!document.startViewTransition || reduce) return setMode(next);
  const x = e.clientX, y = e.clientY;
  const t = document.startViewTransition(() => setMode(next));
  t.ready.then(() => root.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(150vmax at ${x}px ${y}px)`] }, { duration: 750, easing: "ease-in", pseudoElement: "::view-transition-new(root)" }));
});
const vt = document.createElement("style");
vt.textContent = "::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}";
document.head.append(vt);

/* texto que se escribe */
(() => {
  const w = ["aplicaciones multiplataforma", "consultas SQL", "dashboards con datos", "interfaces con criterio"], el = $("#tw");
  if (reduce) { el.textContent = w[0]; return; }
  let i = 0, c = 0, del = false;
  (function tick() {
    const s = w[i]; c += del ? -1 : 1; el.textContent = s.slice(0, c);
    let d = del ? 28 : 65;
    if (!del && c === s.length) { del = true; d = 1500; }
    else if (del && c === 0) { del = false; i = (i + 1) % w.length; d = 300; }
    setTimeout(tick, d);
  })();
})();

/* cursor personalizado */
if (matchMedia("(pointer:fine)").matches && !reduce) {
  root.classList.add("has-cursor");
  const dot = $("#dot"), ring = $("#ring"); let mx = 0, my = 0, rx = 0, ry = 0;
  addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px)`; dot.classList.add("on"); ring.classList.add("on"); });
  document.addEventListener("mouseleave", () => { dot.classList.remove("on"); ring.classList.remove("on"); });
  (function f() { rx += (mx - rx) * .16; ry += (my - ry) * .16; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(f); })();
  document.querySelectorAll("a,button,.chips span,tbody tr,.code").forEach(el => {
    el.addEventListener("mouseenter", () => { const t = el.dataset.cur; if (t) { ring.classList.add("big"); ring.textContent = t; } else ring.style.scale = 1.6; });
    el.addEventListener("mouseleave", () => { ring.classList.remove("big"); ring.textContent = ""; ring.style.scale = 1; });
  });
}

/* tarjetas: inclinación y foco de luz */
document.querySelectorAll(".card").forEach(c => {
  c.addEventListener("mousemove", e => {
    const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    c.style.setProperty("--mx", x + "px"); c.style.setProperty("--my", y + "px");
    if (!c.classList.contains("flat") && !reduce) { c.style.setProperty("--ry", ((x / r.width - .5) * 6).toFixed(2) + "deg"); c.style.setProperty("--rx", ((.5 - y / r.height) * 6).toFixed(2) + "deg"); }
  });
  c.addEventListener("mouseleave", () => { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); });
});

/* barra de progreso */
addEventListener("scroll", () => { $("#bar").style.width = (scrollY / (root.scrollHeight - innerHeight) * 100) + "%"; }, { passive: true });

/* galería de HotelApp */
(() => {
  const img = document.getElementById("shot"), btns = document.querySelectorAll(".tabs button");
  btns.forEach(b => b.addEventListener("click", () => {
    btns.forEach(x => x.setAttribute("aria-pressed", x === b));
    img.style.opacity = 0;
    setTimeout(() => { img.src = b.dataset.src; img.alt = b.dataset.alt; img.style.opacity = 1; }, 160);
  }));
})();
