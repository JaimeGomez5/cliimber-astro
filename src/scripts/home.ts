// Interacción y animaciones de la home. Solo se carga en la home (GSAP no llega al blog ni a las legales).
// Todo el contenido está en el HTML: si este script falla, la página se ve y funciona completa.
// GSAP se carga bajo demanda: para la intro de escritorio, cuando ESCALA se acerca o al usar el formulario o el asistente.
// Mientras no está, todo funciona igual, solo que sin animar.
let gsap: any = null;
let gsapP: Promise<any> | null = null;
const loadGsap = () => (gsapP ||= import('gsap').then((m) => (gsap = m.gsap)));

const W = window as any;
const root = document.documentElement;
const $ = (id: string) => document.getElementById(id) as any;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const desk = () => matchMedia('(min-width:701px)').matches;
const mobile = () => matchMedia('(max-width:860px)').matches;
const WHATSAPP = 'https://wa.me/34609575722';

// Clases en su propia sección, no en <html>: cambiar <html> obliga a recalcular los estilos de toda la página
$('demos').classList.add('tabs-on');
$('cCard').classList.add('app-on');

/* ---------- Aparición al hacer scroll ---------- */
W.__rv = true;
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((es) => es.forEach((x) => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
} else document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));

/* ---------- Pestañas con teclado ---------- */
const tabs = [...document.querySelectorAll<HTMLButtonElement>('[role=tab]')];
function sel(t: HTMLButtonElement, focus = true) {
  tabs.forEach((x) => { const on = x === t; x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1; $(x.getAttribute('aria-controls')!).hidden = !on; });
  if (focus) t.focus();
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => sel(t));
  t.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') sel(tabs[(i + 1) % tabs.length]);
    if (e.key === 'ArrowLeft') sel(tabs[(i - 1 + tabs.length) % tabs.length]);
  });
});
if (tabs.length) sel(tabs[0], false);

/* ---------- Formulario inteligente (demo) ---------- */
function demoForm() {
  const m = $('f-motivo').value;
  ['piel', 'dig', 'peso'].forEach((k) => ($('q-' + k).hidden = k !== m));
  $('o-animal').textContent = $('f-animal').value;
  $('o-motivo').textContent = $('f-motivo').selectedOptions[0].text;
  const map: Record<string, string[]> = {
    piel: ['Zona', $('f-zona').value, 'Fotos de la zona'],
    dig: ['Dieta actual', $('f-dieta').value, 'Nombre del pienso o comida'],
    peso: ['Peso', ($('f-kg').value || '').replace('.', ',') + ' kg', 'Foto de perfil del animal'],
  };
  const [l, v, p] = map[m];
  $('o-extra-l').textContent = l; $('o-extra').textContent = v || '-'; $('o-pide').textContent = p;
}
['f-animal', 'f-motivo', 'f-zona', 'f-dieta', 'f-kg'].forEach((id) => $(id).addEventListener('input', demoForm));
demoForm();

/* ---------- Calculadora con validación: nutriente / (100 - humedad) * 100 ---------- */
function calc() {
  const h = parseFloat($('c-hum').value), n = parseFloat($('c-nut').value);
  $('c-label').textContent = $('c-tipo').value + ' en materia seca';
  let e = '';
  if (isNaN(h) || isNaN(n)) e = 'Rellena humedad y nutriente.';
  else if (h < 0 || h > 90) e = 'La humedad tiene que estar entre 0 y 90 %.';
  else if (n < 0) e = 'El nutriente no puede ser negativo.';
  else if (n + h > 100) e = 'Humedad y nutriente juntos no pueden superar el 100 %.';
  $('c-err').hidden = !e; $('c-err').textContent = e;
  $('c-res').textContent = e ? '-' : ((n / (100 - h)) * 100).toFixed(1).replace('.', ',') + ' %';
}
['c-hum', 'c-nut', 'c-tipo'].forEach((id) => $(id).addEventListener('input', calc));
calc();

/* ---------- Vídeos: arrancan en silencio al verse y se pausan al salir; nunca con «reducir movimiento» ---------- */
if ('IntersectionObserver' in window && !reduce) {
  const vo = new IntersectionObserver((es) => es.forEach((x) => {
    const v = x.target as HTMLVideoElement;
    if (x.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}); } else v.pause();
  }), { threshold: 0.5 });
  document.querySelectorAll('video[data-auto]').forEach((v) => vo.observe(v));
}

/* ---------- El WhatsApp flotante se aparta mientras se ve el formulario ---------- */
if ('IntersectionObserver' in window) {
  new IntersectionObserver((es) => es.forEach((x) => document.querySelector('.whatsapp-btn')?.classList.toggle('wa-off', x.isIntersecting)), { threshold: 0 }).observe($('contacto'));
}

/* ================= ANIMACIONES (GSAP) ================= */

/* ---------- INTRO: las «i» del logo real bajan la persiana y vuelan al logo del menú ---------- */
function runIntro() {
  const intro = $('intro');
  if (!intro) return;
  if (!root.classList.contains('js-intro') || !gsap) { intro.remove(); root.classList.remove('js-intro'); return; }
  W.__introOn = true;
  try { sessionStorage.setItem('cl-intro', '1'); } catch (e) {}
  const L = $('introLogo') as SVGSVGElement, nav = $('navLogo') as SVGSVGElement;
  const letters = L.querySelectorAll('.lt'), is = [...L.querySelectorAll<SVGGElement>('.i')];
  const dots = L.querySelectorAll('.dot'), stems = L.querySelectorAll('.stem');
  const navIs = [...nav.querySelectorAll<SVGGElement>('.i')];
  const ppu = () => L.getBoundingClientRect().height / 95; // píxeles por unidad del viewBox (alto 95)
  gsap.set(nav, { opacity: 0 });
  const clones: HTMLElement[] = [];
  const subs: any[] = [];
  let cap: ReturnType<typeof setTimeout> | undefined;
  const evs = ['wheel', 'touchmove', 'keydown'];
  const end = () => {
    clearTimeout(cap);
    gsap.globalTimeline.timeScale(1);
    subs.forEach((s) => s.kill());
    gsap.set(nav, { opacity: 1 });
    clones.forEach((c) => c.remove());
    intro.remove();
    root.classList.remove('js-intro');
    evs.forEach((ev) => removeEventListener(ev, skip));
  };
  // La intro tapa la web como mucho 2,2 s desde que empieza a cargar la página (unos 1,4 s de animación).
  // Si el script llega tarde, se acelera (hasta 1,6×) para acabar a tiempo; si ni así cabe, no se muestra.
  const TOPE = 2200;
  const k = 1400 / (TOPE - performance.now() - 50);
  if (k <= 0 || k > 1.6) { end(); return; }
  if (k > 1) gsap.globalTimeline.timeScale(k);
  // Deja de tapar la web: transparente, sin capturar clics y fuera del DOM
  const uncover = () => { intro.style.pointerEvents = 'none'; intro.remove(); root.classList.remove('js-intro'); };
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: end });
  tl.from(letters, { y: 50, opacity: 0, duration: 0.25, stagger: 0.015 })
    .from(stems, { scaleY: 0, transformOrigin: '50% 100%', duration: 0.18, stagger: 0.05 }, '-=.2')
    .from(dots, { y: -110, opacity: 0, duration: 0.26, stagger: 0.04, ease: 'bounce.out' }, '-=.08')
    .to(stems, { scaleY: 0.65, transformOrigin: '50% 100%', duration: 0.08, ease: 'power2.in' }, '+=.03')
    .to(is, { y: () => (14 - is[0].getBoundingClientRect().top) / ppu(), duration: 0.2, ease: 'power2.out' })
    .to(stems, { scaleY: 1, duration: 0.12 }, '<')
    .add(() => {
      // Cada «i» pasa a un clon fijo con su misma geometría, para poder salir del logo
      is.forEach((g) => {
        const r = g.getBoundingClientRect(), bb = g.getBBox();
        const c = document.createElement('span');
        c.className = 'intro-clone';
        c.style.cssText = `left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px`;
        c.innerHTML = `<svg viewBox="${bb.x} ${bb.y} ${bb.width} ${bb.height}" width="100%" height="100%" aria-hidden="true" style="display:block;overflow:visible">${g.innerHTML}</svg>`;
        document.body.appendChild(c);
        clones.push(c);
        g.style.opacity = '0';
      });
    })
    .add(() => {
      const top0 = clones[0].getBoundingClientRect().top, h = clones[0].getBoundingClientRect().height;
      const fall = innerHeight - h - 12 - top0;
      // la persiana sigue a las «i» sin medir el DOM en cada fotograma
      subs.push(gsap.to(clones, { y: fall, duration: 0.38, ease: 'power2.in', onUpdate: () => { intro.style.clipPath = 'inset(' + Math.max(0, top0 + (gsap.getProperty(clones[0], 'y') as number)) + 'px 0 0 0)'; } }));
      subs.push(gsap.to(intro, { opacity: 0, duration: 0.1, delay: 0.34, onComplete: uncover }));
      clones.forEach((c, k) => {
        const st = c.querySelector('.stem');
        subs.push(gsap.timeline({ delay: 0.38 })
          .to(st, { scaleY: 0.6, transformOrigin: '50% 100%', duration: 0.05, ease: 'power2.out' })
          .to(st, { scaleY: 1, duration: 0.08, ease: 'back.out(3)' })
          .add(() => {
            const a = c.getBoundingClientRect(), t = navIs[k].getBoundingClientRect();
            subs.push(gsap.to(c, { x: '+=' + (t.left - a.left), y: '+=' + (t.top - a.top), scale: t.width / a.width, transformOrigin: '0 0', duration: 0.32, ease: 'power3.inOut' }));
          }));
      });
      subs.push(gsap.to(nav, { opacity: 1, duration: 0.08, delay: 0.78 }));
    }, '+=.02')
    .to({}, { duration: 0.9 });
  // Tope duro: pase lo que pase, a los 2,2 s la intro deja de tapar la web.
  // Si las «i» ya vuelan hacia el header, solo se retira la capa y terminan de aterrizar.
  cap = setTimeout(() => { if (!intro.isConnected) return; if (clones.length) uncover(); else skip(); }, Math.max(0, TOPE - performance.now()));
  // Al saltarla solo se matan sus propios tweens (nunca killTweensOf('*'), que rompería ESCALA)
  function skip() {
    tl.kill();
    subs.forEach((s) => s.kill());
    gsap.killTweensOf([intro, L, nav, ...L.querySelectorAll('*'), ...clones, ...clones.flatMap((c) => [...c.querySelectorAll('*')])]);
    end();
  }
  $('skip').addEventListener('click', skip);
  intro.addEventListener('click', skip);
  // No es una barrera: cualquier intento de bajar o usar el teclado la salta
  evs.forEach((ev) => addEventListener(ev, skip, { passive: true, once: true }));
  $('skip').focus({ preventScroll: true });
}

/* ---------- ESCALA: el escalador sube mientras lees las etapas ---------- */
function runEscala(ScrollTrigger: any) {
  const stairs = $('escStairs'), cl = $('escClimber'), stem = cl.querySelector('.s');
  const steps = [...stairs.querySelectorAll('.esc-st')] as HTMLElement[], stages = [...document.querySelectorAll('.esc-stage')];
  let cur = -1;
  const show = (i: number) => {
    if (i === cur) return; cur = i;
    steps.forEach((s, j) => { s.classList.toggle('on', j === i); s.classList.toggle('done', j < i); });
    stages.forEach((s, j) => s.classList.toggle('on', j === i));
  };
  const pos = (i: number) => {
    const r = steps[i].getBoundingClientRect(), p = stairs.getBoundingClientRect();
    return { x: r.left - p.left + r.width / 2 - cl.offsetWidth / 2, y: r.top - p.top - cl.offsetHeight };
  };
  steps.forEach((b, i) => b.addEventListener('click', () => {
    const y = stages[i].getBoundingClientRect().top + scrollY - (desk() ? 260 : 280);
    scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  }));
  // En móvil la escalera se queda pegada justo debajo del menú
  const hh = () => $('como').style.setProperty('--hh', (document.querySelector('.site-header') as HTMLElement).offsetHeight + 'px');
  hh(); addEventListener('resize', hh);
  if (reduce || !ScrollTrigger || !gsap) { cl.style.display = 'none'; return; }
  gsap.registerPlugin(ScrollTrigger);
  $('como').classList.add('js-anim');
  show(0);
  const p0 = pos(0); gsap.set(cl, { x: p0.x, y: p0.y });
  const tl = gsap.timeline({ defaults: { ease: 'none' } }); tl.addLabel('s0');
  for (let i = 1; i < 6; i++) {
    const from = () => pos(i - 1), to = () => pos(i), peak = () => Math.min(from().y, to().y) - 55;
    tl.to(cl, { x: () => to().x, duration: 1, ease: 'power1.inOut' }, 'j' + i)
      .to(cl, { y: peak, duration: 0.5, ease: 'power2.out' }, 'j' + i)
      .to(cl, { y: () => to().y, duration: 0.5, ease: 'power2.in' }, 'j' + i + '+=.5')
      .to(stem, { scaleY: 0.7, duration: 0.08 }, 'j' + i + '+=.98').to(stem, { scaleY: 1, duration: 0.12 }).addLabel('s' + i);
  }
  ScrollTrigger.create({ trigger: '#escList', start: () => (desk() ? 'top 60%' : 'top 75%'), end: () => (desk() ? 'bottom 70%' : 'bottom 85%'), scrub: 0.5, animation: tl, invalidateOnRefresh: true });
  let burstDone = false;
  const burst = () => {
    burstDone = true; const p = pos(5);
    for (let k = 0; k < 14; k++) {
      const sp = document.createElement('span'); sp.className = 'spark'; stairs.appendChild(sp);
      gsap.set(sp, { x: p.x + cl.offsetWidth / 2, y: p.y + 10, opacity: 1 });
      gsap.to(sp, { x: '+=' + gsap.utils.random(-90, 90), y: '-=' + gsap.utils.random(40, 130), rotation: gsap.utils.random(-180, 180), opacity: 0, duration: gsap.utils.random(0.7, 1.2), ease: 'power2.out', onComplete: () => sp.remove() });
    }
    setTimeout(() => (burstDone = false), 1500);
  };
  tl.eventCallback('onUpdate', () => {
    const t = tl.time(); let i = 0;
    for (let k = 0; k < 6; k++) if (t >= tl.labels['s' + k] - 0.5) i = k;
    show(i);
    if (i === 5 && tl.progress() > 0.98 && !burstDone) burst();
  });
}

$('replayIntro')?.addEventListener('click', () => {
  try { sessionStorage.removeItem('cl-intro'); } catch (e) {}
  scrollTo(0, 0); location.reload();
});
// ESCALA se prepara cuando la sección se acerca a la pantalla, para no cargar el arranque (ni la intro) con sus medidas
function lazyEscala() {
  const sec = $('como');
  const go = () => { if (reduce) { runEscala(null); return; } Promise.all([loadGsap(), import('gsap/ScrollTrigger')]).then(([, m]) => runEscala(m.ScrollTrigger)).catch(() => runEscala(null)); };
  if (!('IntersectionObserver' in window)) { go(); return; }
  const io = new IntersectionObserver((es) => { if (es.some((x) => x.isIntersecting)) { io.disconnect(); go(); } }, { rootMargin: '100% 0px' });
  io.observe(sec);
}
// La intro (solo escritorio) pide GSAP en cuanto arranca el script; en móvil no se descarga al cargar la página
// (el script ya ha llegado: el seguro de 1 s de <head> deja de hacer falta; el tope de 2,2 s lo aplica runIntro)
if (root.classList.contains('js-intro')) W.__introOn = true;
const introG = root.classList.contains('js-intro') ? loadGsap() : null;
Promise.all([document.fonts ? document.fonts.ready : null, introG]).catch(() => {}).then(() => { runIntro(); lazyEscala(); });

/* ---------- Botones de precios: rellenan el mensaje del formulario ---------- */
document.querySelectorAll<HTMLElement>('.plan-cta').forEach((b) => b.addEventListener('click', () => {
  const q = $('f-q');
  if (!q.value.trim()) q.value = 'Me interesa: ' + b.dataset.plan + '.\n';
  setTimeout(() => { $('f-n').focus({ preventScroll: true }); alti(); }, 600);
}));

/* ---------- ALTÍMETRO ---------- */
const req = ['f-n', 'f-e', 'f-t', 'f-q', 'f-p'];
const msgs = ['Campamento base. Empieza por tu nombre.', 'Buen arranque. Sigue subiendo.', 'Vas por la mitad de la pared.', 'Ya se ve la cima.', 'Último tramo: acepta la privacidad.', 'Listo para hacer cumbre. Pulsa Enviar.'];
function filled(id: string) {
  const el = $(id);
  if (el.type === 'checkbox') return el.checked;
  if (el.type === 'email') return /\S+@\S+\.\S+/.test(el.value);
  return el.value.trim().length > (id === 'f-q' ? 9 : 1);
}
function alti(force?: number) {
  const n = force != null ? force : req.filter(filled).length, p = n / req.length;
  req.forEach((id) => $(id).closest('.field')?.classList.toggle('ok', filled(id)));
  $('pct').textContent = Math.round(p * 100) + ' %'; $('amsg').textContent = msgs[n];
  const tr = $('aTrack').getBoundingClientRect(), cl = $('aClimber');
  if (!reduce && gsap) {
    if (mobile()) {
      const max = tr.width - cl.offsetWidth - 44;
      gsap.to('#aFill', { width: p * 100 + '%', duration: 0.5, ease: 'power2.out' });
      hop(cl, { x: max * p, y: 0 });
    } else {
      const max = tr.height - cl.offsetHeight - 14;
      gsap.to('#aFill', { height: p * 100 + '%', duration: 0.5, ease: 'power2.out' });
      hop(cl, { x: 0, y: -max * p });
    }
  } else {
    if (mobile()) { $('aFill').style.width = p * 100 + '%'; cl.style.transform = 'translateX(' + (tr.width - 66) * p + 'px)'; }
    else { $('aFill').style.height = p * 100 + '%'; cl.style.transform = 'translateY(' + -(tr.height - 62) * p + 'px)'; }
  }
}
// El escalador da un saltito en cada tramo
function hop(cl: HTMLElement, to: { x: number; y: number }) {
  const st = cl.querySelector('.stem');
  gsap.timeline()
    .to(st, { scaleY: 0.65, duration: 0.1, ease: 'power2.in' })
    .to(cl, { x: to.x, y: to.y, duration: 0.45, ease: 'back.out(1.6)' })
    .to(st, { scaleY: 1, duration: 0.2, ease: 'back.out(3)' }, '<.05');
}
req.forEach((id) => { $(id).addEventListener('input', () => alti()); $(id).addEventListener('change', () => alti()); });
// Al empezar a usar el formulario se descarga GSAP para los saltos del altímetro
if (!reduce) form0().addEventListener('focusin', () => { loadGsap(); }, { once: true });
function form0() { return $('cCard') as HTMLElement; }
addEventListener('resize', () => alti());
// (sin llamada inicial: el CSS ya parte de 0 %, y así no se fuerza una maquetación al cargar)

/* ---------- ENVÍO (Formspree): «Recibido» solo si el servicio confirma el envío ---------- */
const form = $('cform') as HTMLFormElement, cerr = $('cerr'), send = $('cSend');
form.noValidate = true;
const showErr = (html: string) => { cerr.className = 'c-note c-err'; cerr.innerHTML = html; };
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!form.checkValidity() || req.some((id) => !filled(id))) { showErr('Te falta algún campo obligatorio.'); return; }
  cerr.className = 'c-note'; cerr.textContent = '';
  send.disabled = true; send.textContent = 'Enviando…';
  let ok = false;
  try {
    const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
    ok = r.ok;
  } catch (err) { ok = false; }
  send.disabled = false; send.textContent = 'Enviar';
  if (!ok) {
    showErr(`No se ha podido enviar el mensaje. Vuelve a intentarlo o escríbeme por <a href="${WHATSAPP}" target="_blank" rel="noopener">WhatsApp</a>.`);
    return;
  }
  form.style.display = 'none';
  $('sent').classList.add('on');
  $('sent').focus({ preventScroll: true });
  alti(5);
  if (!reduce && gsap) {
    const tr = $('aTrack').getBoundingClientRect();
    for (let k = 0; k < 16; k++) {
      const s = document.createElement('span'); s.className = 'spark-a';
      s.style.cssText = 'left:50%;top:' + (mobile() ? '50%' : '0');
      $('aTrack').appendChild(s);
      gsap.fromTo(s, { x: mobile() ? tr.width / 2 - 30 : 0, y: 0, opacity: 1 }, { x: '+=' + gsap.utils.random(-80, 80), y: gsap.utils.random(-120, -30), rotation: gsap.utils.random(-180, 180), opacity: 0, duration: gsap.utils.random(0.7, 1.2), ease: 'power2.out', onComplete: () => s.remove() });
    }
    gsap.from('#sent > *', { y: 12, opacity: 0, stagger: 0.08, duration: 0.4 });
  }
  $('amsg').textContent = '¡Cumbre! Mensaje enviado.';
});

/* ---------- ASISTENTE (3 preguntas, sin IA: reglas claras) ---------- */
const Q = [
  { t: '¿Tienes web ahora mismo?', o: [['si', 'Sí, y me gusta'], ['regular', 'Sí, pero no me convence'], ['no', 'No tengo']] },
  { t: '¿Qué es lo que más te frena?', o: [['visib', 'No me encuentran en Google ni en las IAs'], ['consultas', 'Llegan pocas consultas o mal enfocadas'], ['tiempo', 'Pierdo tiempo con tareas o información desordenada'], ['lanzar', 'Quiero lanzar o renovar mi negocio']] },
  { t: '¿Cuándo te gustaría empezar?', o: [['ya', 'Cuanto antes'], ['pronto', 'En 1 a 3 meses'], ['mirando', 'Solo estoy mirando']] },
];
const R: Record<string, { k: string; h: string; p: string; price: string; tipo?: string }> = {
  lanzar: { k: '01 · LANZAR', h: 'Web de lanzamiento', p: 'Una web profesional y preparada para Google desde el primer día, para crecer sobre ella sin rehacerla.', price: 'desde 900 €', tipo: 'Negocio pet que empieza' },
  visib: { k: '02 · GANAR VISIBILIDAD', h: 'SEO local y visibilidad en IAs', p: 'Antes de invertir en SEO, reviso si tu web tiene una base suficiente. A veces bastan algunas mejoras; otras, compensa renovarla. Lo decidimos después de ver tu caso.', price: 'desde 300 €/mes' },
  tool: { k: '03 · RESOLVER UN PROBLEMA', h: 'Herramienta a medida', p: 'Un formulario inteligente, una calculadora o un pequeño sistema que ordena la información antes de que llegue a tu equipo.', price: 'desde 400 €' },
  conv: { k: 'EMPEZAR POR UNA REVISIÓN', h: 'Vemos dónde se pierden las consultas', p: 'Con pocas consultas, lo primero es saber si falla que te encuentren o que te elijan. Te hago una revisión inicial gratuita y te digo cuál es la prioridad.', price: 'revisión inicial gratuita' },
};
let ans: string[] = [];
const scrollA = () => { $('assist').scrollTop = $('assist').scrollHeight; };
function bot(html: string, delay?: number): Promise<HTMLElement> {
  return new Promise((res) => {
    const t = document.createElement('div'); t.className = 'bub bot';
    t.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
    $('log').appendChild(t); scrollA();
    setTimeout(() => { t.innerHTML = html; if (!reduce && gsap) gsap.from(t, { y: 8, opacity: 0, duration: 0.25 }); scrollA(); res(t); }, reduce ? 0 : delay || 550);
  });
}
function me(txt: string) { const b = document.createElement('div'); b.className = 'bub me'; b.textContent = txt; $('log').appendChild(b); scrollA(); }
async function ask(i: number) {
  const q = Q[i]; const b = await bot(q.t);
  const o = document.createElement('div'); o.className = 'opts';
  q.o.forEach(([v, l]) => {
    const btn = document.createElement('button'); btn.type = 'button'; btn.textContent = l;
    btn.onclick = () => { o.remove(); me(l); ans[i] = v; i < 2 ? ask(i + 1) : finish(); };
    o.appendChild(btn);
  });
  b.appendChild(o); (o.querySelector('button') as HTMLElement).focus(); scrollA();
}
function pick() {
  const [web, freno] = ans;
  if (freno === 'tiempo') return 'tool'; // tenga o no web
  if (freno === 'lanzar' || web === 'no') return 'lanzar';
  if (freno === 'visib') return 'visib'; // SEO se valora primero; no se prescribe rediseño
  return 'conv'; // pocas consultas: revisión inicial
}
async function finish() {
  const key = pick(), r = R[key], when = ans[2];
  const extra = when === 'mirando' ? ' Sin prisa: la observación es gratis y no te compromete a nada.' : when === 'ya' ? ' Si te encaja, en 24 horas laborables te digo los siguientes pasos.' : '';
  await bot('Por lo que me cuentas, yo empezaría por aquí.' + extra, 700);
  const c = document.createElement('div'); c.className = 'reco'; c.dataset.key = key;
  c.innerHTML = '<div class="k">' + r.k + '</div><h4>' + r.h + '</h4><p>' + r.p + ' <strong>' + r.price + '</strong>.</p><button type="button">Rellenar el formulario con esto</button>';
  $('log').appendChild(c); if (!reduce && gsap) gsap.from(c, { y: 12, opacity: 0, duration: 0.35 }); scrollA();
  const btn = c.querySelector('button') as HTMLButtonElement;
  btn.onclick = () => {
    const labels = ans.map((v, i) => Q[i].o.find((o) => o[0] === v)![1]);
    $('f-q').value = 'Me interesa: ' + r.h + '.\n¿Tengo web? ' + labels[0] + '.\nLo que más me frena: ' + labels[1] + '.\nCuándo: ' + labels[2] + '.';
    if (r.tipo) $('f-t').value = r.tipo;
    closeA(); alti(); $('f-n').focus();
  };
  btn.focus();
}
function openA() { if (!reduce) loadGsap(); ans = []; $('log').innerHTML = ''; $('assist').classList.add('open'); ask(0); }
// El foco no sale del asistente mientras está abierto
$('assist').addEventListener('keydown', (e: KeyboardEvent) => {
  if (e.key !== 'Tab') return;
  const f = [...$('assist').querySelectorAll('button')].filter((b: HTMLElement) => b.offsetParent);
  if (!f.length) return;
  const a = f[0], z = f[f.length - 1];
  if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
  else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
});
function closeA() { $('assist').classList.remove('open'); $('openAssist').focus(); }
$('openAssist').onclick = openA;
$('closeAssist').onclick = closeA;
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && $('assist').classList.contains('open')) closeA(); });
