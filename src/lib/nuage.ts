/* Le nuage : passage d'une scène à la suivante.
   Entre deux scènes, le bain se trouble : un nuage de pigment (turquoise, jaune pastel, ivoire, sur vert pétrole) naît à la
   couture des deux scènes, enveloppe l'écran, puis s'éclaircit sur la scène suivante. Il est piloté par le
   défilement (donc réversible) ; si le visiteur s'arrête au milieu, le passage se termine seul. Les liens internes
   jouent le même nuage en un geste. C'est le seul moment de flou du système : il ne sert qu'aux passages.
   Sans WebGL : un voile de la même palette. En mouvement réduit : rien, la page défile normalement. */
import gsap from "gsap";

const VS = "attribute vec2 p;varying vec2 v;void main(){v=p*0.5+0.5;gl_Position=vec4(p,0.,1.);}";
const FS = `
precision highp float;
varying vec2 v;
uniform vec2 uRes;
uniform float uTime, uGrow, uClear, uSeam, uSeed;
uniform vec3 uA, uB, uC, uD;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float s = 0.0, a = 0.5; mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { s += a * noise(p); p = m * p; a *= 0.5; }
  return s / 0.96875;
}
void main(){
  float asp = uRes.x / uRes.y;
  float t = uTime;
  // Une fumée monte : tout le champ dérive vers le haut et ondule lentement sur les côtés
  vec2 p = vec2(v.x * asp, v.y) * 1.2 + uSeed;
  p.y -= t * 0.07;
  p.x += sin(t * 0.11 + v.y * 2.1) * 0.05;
  // Elle se replie sur elle-même : deux déformations de domaine, chacune emportée à sa vitesse
  vec2 q = vec2(fbm(p + vec2(0.0, -t * 0.05)), fbm(p + vec2(5.2, 1.3 + t * 0.035)));
  vec2 r = vec2(fbm(p + 2.1 * q + vec2(1.7, 9.2 - t * 0.075)), fbm(p + 2.1 * q + vec2(8.3 + t * 0.03, 2.8)));
  float n = fbm(p + 2.5 * r);
  float wisp = fbm(p * 2.4 + 2.8 * r - vec2(0.0, t * 0.16));
  // Couverture : la fumée naît à la couture des deux scènes et gagne l'écran, par volutes
  float dist = abs(v.y - uSeam);
  float D = uGrow * 2.5 - dist * (1.75 - uGrow * 0.75) + (n - 0.5) * 1.25 + (wisp - 0.5) * 0.4;
  float a = smoothstep(0.0, 0.9, D) * smoothstep(0.0, 0.1, uGrow);
  // Dissipation : elle s'amincit partout et se déchire là où elle est la plus fine
  float n2 = fbm(p * 0.7 + 1.6 * q + 11.0);
  a *= 1.0 - smoothstep(n2 - 0.36, n2 + 0.36, uClear * 1.75 - 0.38);
  a *= 1.0 - 0.3 * smoothstep(0.25, 1.0, uClear);
  // Nuances : le cœur est dense, les volutes fines s'éclaircissent ; teintes de la palette seulement
  vec3 col = mix(uA, uB, smoothstep(0.18, 0.82, n));
  col = mix(col, uC, smoothstep(0.34, 0.96, r.x) * 0.78);
  col = mix(col, uD, smoothstep(0.5, 1.0, q.y * 0.5 + wisp * 0.6) * 0.7);
  col = mix(col, uA, smoothstep(0.6, 0.12, n + r.y * 0.3) * 0.28);
  col += (hash(gl_FragCoord.xy + t) - 0.5) * 0.012;
  gl_FragColor = vec4(col * a, a);
}`;

const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
/* Chaque passage a sa dominante : turquoise, jaune pastel, puis turquoise sur noir pétrole. Toutes les
   teintes viennent des jetons : vert pétrole, turquoise, jaune pastel, ivoire. */
const PALETTES = [
  ["#1f5658", "#0d9da4", "#fce688", "#fffbea"],
  ["#1f5658", "#fce688", "#fffbea", "#0d9da4"],
  ["#0b2a2c", "#0d9da4", "#fffbea", "#fce688"],
].map((p) => p.map(rgb));

const clamp = (x: number, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
const smooth = (x: number) => { x = clamp(x); return x * x * (3 - 2 * x); };

export type SceneInfo = { index: number; tone: string };
type Handle = { go: (target: HTMLElement | number) => void; destroy: () => void };
let current: Handle | null = null;

/** Va à un élément de la page en jouant le nuage (ou en défilant simplement si le nuage n'est pas monté). */
export function goTo(target: HTMLElement | number) {
  if (current) current.go(target);
  else if (typeof target === "number") window.scrollTo(0, target);
  else target.scrollIntoView();
}

/**
 * Monte le nuage sur la page. `still` (mouvement réduit) : aucun nuage, aucun défilement automatique ; seule la
 * scène courante est suivie, et les liens internes amènent directement à leur cible.
 */
export function mountNuage(main: HTMLElement, canvas: HTMLCanvasElement, onScene: (s: SceneInfo) => void, still = false): () => void {
  const scenes = Array.from(main.querySelectorAll<HTMLElement>("[data-scene]"));
  let tops: number[] = [];
  const measure = () => { const y = window.scrollY; tops = scenes.map((s) => s.getBoundingClientRect().top + y); };

  /* ── WebGL ── */
  let gl: WebGLRenderingContext | null = null;
  let U: Record<string, WebGLUniformLocation | null> = {};
  if (!still) try { gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: "low-power" }); } catch { gl = null; }
  if (gl) {
    const sh = (type: number, src: string) => { const s = gl!.createShader(type)!; gl!.shaderSource(s, src); gl!.compileShader(s); return s; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) gl = null;
    else {
      gl.useProgram(prog);
      const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      for (const n of ["uRes", "uTime", "uGrow", "uClear", "uSeam", "uSeed", "uA", "uB", "uC", "uD"]) U[n] = gl.getUniformLocation(prog, n);
      gl.clearColor(0, 0, 0, 0);
    }
  }
  if (!gl && !still) canvas.classList.add("nuage--voile");

  const size = () => {
    const w = window.innerWidth, h = window.innerHeight;
    // Un nuage n'a pas de détail fin : la toile est rendue sous la résolution de l'écran, puis étirée
    const k = Math.min(1, 1200 / Math.max(w, h));
    const cw = Math.max(2, Math.round(w * k)), ch = Math.max(2, Math.round(h * k));
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    if (gl) gl.viewport(0, 0, cw, ch);
  };

  /* ── État ── */
  /* Le défilement fixe une cible (tg) ; ce qui est dessiné (st) la rejoint en douceur, image après image.
     Une molette avance par crans : sans cet amorti la fumée grandirait par à-coups. */
  const st = { grow: 0, clear: 0, seam: 0.5, pal: 0, seed: 0, d: 0 };
  const tg = { grow: 0, clear: 0, seam: 0.5, pal: 0, seed: 0, d: 0, k: -1 };
  const over = { on: false, grow: 0, clear: 0, seam: 1.02, pal: 0, seed: 0 };
  let shownK = -1;
  let pair = -1, sceneIndex = -1, running = false, raf = 0, time = 0, last = 0, lastY = window.scrollY, dir = 1;
  let touching = false, idle = 0, auto: gsap.core.Tween | null = null, jump: gsap.core.Timeline | null = null;

  const setVars = (k: number, d: number) => {
    if (k !== pair) {
      if (pair > 0) for (const s of [scenes[pair - 1], scenes[pair]]) { s.style.removeProperty("--out"); s.style.removeProperty("--in"); s.classList.remove("is-moving"); }
      pair = k;
      if (k > 0) { scenes[k - 1].classList.add("is-moving"); scenes[k].classList.add("is-moving"); }
    }
    if (k > 0) {
      scenes[k - 1].style.setProperty("--out", clamp(d / 0.45).toFixed(3));
      scenes[k].style.setProperty("--in", (1 - smooth((d - 0.5) / 0.5)).toFixed(3));
    }
  };

  const shown = (s: { grow: number; clear: number }) => s.grow > 0.001 && s.clear < 0.999;
  const visible = () => (over.on ? shown(over) : shown(st) || shown(tg) || Math.abs(st.d - tg.d) > 0.002);

  /** Ce qui est dessiné rejoint la cible du défilement (constante de temps : 0,17 s). */
  const follow = (dt: number) => {
    if (!shown(st)) {
      // rien à l'écran : on se cale sur le passage demandé sans que cela se voie
      if (st.grow <= 0.001) { st.clear = tg.clear; st.seam = tg.seam; st.pal = tg.pal; st.seed = tg.seed; if (tg.k !== shownK) st.d = tg.d; }
      else if (tg.k > 0 && tg.k !== shownK) { st.grow = 0; st.clear = tg.clear; st.seam = tg.seam; st.pal = tg.pal; st.seed = tg.seed; st.d = tg.d; }
      if (tg.k > 0) shownK = tg.k;
    }
    const f = 1 - Math.exp(-dt / 0.17);
    st.grow += (tg.grow - st.grow) * f; st.clear += (tg.clear - st.clear) * f;
    st.seam += (tg.seam - st.seam) * f; st.d += (tg.d - st.d) * f;
    setVars(tg.k, st.d);
  };

  const draw = (now: number) => {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now; time += dt;
    if (!over.on) follow(dt);
    const s = over.on ? over : st;
    if (!visible()) { canvas.style.visibility = "hidden"; running = false; return; }
    canvas.style.visibility = shown(s) ? "visible" : "hidden";
    if (!shown(s)) { raf = requestAnimationFrame(draw); return; }
    if (gl) {
      const pal = PALETTES[s.pal % PALETTES.length];
      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      gl.uniform1f(U.uTime, time); gl.uniform1f(U.uGrow, s.grow); gl.uniform1f(U.uClear, s.clear);
      gl.uniform1f(U.uSeam, 1 - s.seam); gl.uniform1f(U.uSeed, s.seed);
      gl.uniform3fv(U.uA, pal[0]); gl.uniform3fv(U.uB, pal[1]); gl.uniform3fv(U.uC, pal[2]); gl.uniform3fv(U.uD, pal[3]);
      gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      canvas.style.opacity = String(clamp(s.grow * 1.25) * (1 - smooth(s.clear)));
    }
    raf = requestAnimationFrame(draw);
  };
  const kick = () => { if (!running && visible()) { running = true; last = performance.now(); raf = requestAnimationFrame(draw); } };

  /** Lit le défilement : quelle couture traverse l'écran, et où en est le passage. */
  const update = () => {
    const y = window.scrollY, vh = window.innerHeight;
    let k = -1, d = 0;
    for (let i = 1; i < tops.length; i++) {
      const di = (y + vh - tops[i]) / vh;
      if (di > 0 && di < 1) { k = i; d = di; break; }
    }
    let idx = 0;
    for (let i = 0; i < tops.length; i++) if (tops[i] <= y + vh * 0.5) idx = i;
    if (idx !== sceneIndex) { sceneIndex = idx; onScene({ index: idx, tone: scenes[idx].dataset.tone || "dark" }); }
    if (over.on || still) return { k, d };
    if (k > 0) { tg.k = k; tg.d = d; tg.grow = smooth((d - 0.05) / 0.4); tg.clear = clamp((d - 0.56) / 0.42); tg.seam = 1 - d; tg.pal = k - 1; tg.seed = k * 3.7; }
    else {
      // la couture a quitté l'écran : vers le bas le passage est fini (la fumée se dissipe), vers le haut il est annulé
      if (tg.d > 0.5) { tg.grow = 1; tg.clear = 1; tg.d = 1; } else { tg.grow = 0; tg.clear = 0; tg.d = 0; }
      tg.k = -1;
    }
    if (!running) setVars(tg.k, st.d);
    kick();
    return { k, d };
  };

  /** Le visiteur s'est arrêté au milieu d'un passage : on le termine dans le sens où il allait. */
  const settle = () => {
    if (still || over.on || touching || auto) return;
    const { k, d } = update();
    if (k < 1 || d < 0.12 || d > 0.985) return;
    const vh = window.innerHeight;
    const target = dir >= 0 ? Math.ceil(tops[k]) : Math.floor(tops[k] - vh);
    const span = Math.abs(target - window.scrollY) / vh;
    auto = gsap.to(window, {
      scrollTo: { y: target, autoKill: true }, duration: 0.7 + span * 0.9, ease: "sine.inOut",
      onComplete: () => { auto = null; }, onInterrupt: () => { auto = null; },
    });
  };

  const onScroll = () => {
    const y = window.scrollY;
    if (y !== lastY) { dir = y > lastY ? 1 : -1; lastY = y; }
    update();
    window.clearTimeout(idle);
    idle = window.setTimeout(settle, 150);
  };
  const onResize = () => { size(); measure(); update(); };
  const onTouchStart = () => { touching = true; if (auto) { auto.kill(); auto = null; } };
  const onTouchEnd = () => { touching = false; window.clearTimeout(idle); idle = window.setTimeout(settle, 220); };

  const go = (target: HTMLElement | number) => {
    measure();
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const top = Math.min(max, typeof target === "number" ? target : Math.ceil(target.getBoundingClientRect().top + window.scrollY));
    if (Math.abs(top - window.scrollY) < 4) return;
    if (still) { window.scrollTo(0, top); return; }
    if (auto) { auto.kill(); auto = null; }
    if (jump) jump.kill();
    setVars(-1, 0);
    Object.assign(st, { grow: 0, clear: 0, d: 0 }); Object.assign(tg, { grow: 0, clear: 0, d: 0, k: -1 });
    Object.assign(over, { on: true, grow: 0, clear: 0, seam: top > window.scrollY ? 1.02 : -0.02, pal: (over.pal + 1) % PALETTES.length, seed: over.seed + 2.3 });
    kick();
    // la fumée monte du bord vers le centre et couvre l'écran, la page change dessous, puis elle se dissipe
    jump = gsap.timeline({ onComplete: () => { over.on = false; jump = null; update(); } })
      .to(over, { grow: 1, seam: 0.5, duration: 0.8, ease: "sine.inOut", onUpdate: kick })
      .add(() => { window.scrollTo(0, top); lastY = top; })
      .to(over, { clear: 1, duration: 1.25, ease: "sine.inOut" }, "+=0.05");
  };

  size(); measure(); update();
  const ro = new ResizeObserver(() => { measure(); update(); });
  ro.observe(main);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });
  window.addEventListener("touchcancel", onTouchEnd, { passive: true });

  const handle: Handle = {
    go,
    destroy: () => {
      window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onResize);
      window.removeEventListener("touchstart", onTouchStart); window.removeEventListener("touchend", onTouchEnd); window.removeEventListener("touchcancel", onTouchEnd);
      ro.disconnect(); window.clearTimeout(idle); cancelAnimationFrame(raf);
      if (auto) auto.kill(); if (jump) jump.kill();
      setVars(-1, 0); canvas.style.visibility = "hidden";
      if (current === handle) current = null;
    },
  };
  current = handle;
  return handle.destroy;
}
