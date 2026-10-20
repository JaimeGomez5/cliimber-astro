# Rediseño de la home de cliimber.com: prompt para Claude Code

> Cómo usarlo: copia la carpeta `rediseno-home/` en la raíz del repositorio como `_rediseno/` (no se publica: empieza por guion bajo y está fuera de `src/` y `public/`). Después pega este prompt entero en Claude Code.

---

Vas a rediseñar la home de cliimber.com (Astro estático en Cloudflare Pages). El diseño final ya está decidido y aprobado: es `_rediseno/home-v10-referencia.html`. Tu trabajo es **trasladarlo a Astro con la calidad de producción**, sin romper nada de lo que ya existe y con la posibilidad de volver a la web anterior en cualquier momento.

Trabaja **por fases**. Al final de cada fase marcada con **ALTO**, para, dame un informe corto y espera mi OK antes de seguir.

## Reglas de oro (no negociables)

1. **Ninguna URL existente cambia, se mueve ni se borra.** Blog, páginas legales, `/casos/…`, `/clinicas-veterinarias/` y cualquier otra ruta pública siguen exactamente igual. La lista de URLs del sitemap antes y después tiene que ser idéntica.
2. **Nada se borra del repositorio en este trabajo.** Si encuentras archivos o carpetas que parecen sobrar, haz una lista y dímelo; no los toques.
3. **En producción no puede aparecer ningún texto entre corchetes `[…]`.** En la referencia hay huecos pendientes (foto, notas de voz, frase de Laura, captura, vídeo de derivaciones, tarjeta de Dogtitude). Cada uno se implementa como componente que **no se renderiza** si no tiene contenido real. Nada de recuadros grises ni notas de producción.
4. **Todo el contenido de texto va en el HTML estático** que genera Astro. Las animaciones solo decoran: si JavaScript falla o el usuario pide reducir movimiento, la página se ve y funciona completa.
5. **Nada de CDN externos.** GSAP y ScrollTrigger se instalan con npm (`gsap@3.12.5`) y se importan en los scripts de los componentes. Las fuentes siguen alojadas en la propia web, como ahora.
6. **El formulario nunca dice «Recibido» si el envío no ha funcionado de verdad.**
7. No toques la configuración de Cloudflare, los DNS ni las variables de entorno. Si algo lo necesitara, dímelo.
8. Todo el rediseño entra en `main` con **un único merge** (`--no-ff`), para poder revertirlo de una vez sin perder artículos de blog publicados después.
9. Español de España en todos los textos. No uses rayas largas (—) en el copy.

---

## Fase 0: copia de seguridad e inventario (sin cambiar nada)

1. `git status` limpio. Si hay cambios sin confirmar, para y dímelo.
2. Crea la etiqueta `pre-rediseno-2026-10` sobre el `main` actual y súbela (`git push origin pre-rediseno-2026-10`).
3. Crea y sube la rama `web-anterior` desde ese mismo punto. Esa rama no se toca nunca.
4. Crea la rama de trabajo `rediseno-home` desde `main`.
5. Haz `npm run build` del estado actual y guarda la lista de URLs del sitemap generado en `_rediseno/urls-antes.txt` (ordenada).
6. Inventario y respuestas, en un informe corto:
   - ¿El proyecto de Cloudflare Pages está conectado a GitHub (cada rama genera una URL de previsualización) o se publica con Wrangler?
   - Rutas públicas actuales y qué componentes comparten (layout, header, footer).
   - Cómo envía hoy el formulario de contacto (Formspree, función de Cloudflare, mailto, nada). ¿Funciona?
   - Teléfono de WhatsApp y enlace de Instagram que usa la web actual.
   - Recursos que ya existen y se pueden reutilizar: logo en SVG, favicon, foto de Jaime, imagen Open Graph, capturas de proyectos.
   - Datos estructurados (JSON-LD) que hay ahora y dónde se generan.
   - Contenido de `_headers`, `_redirects` y `robots.txt`.
   - Archivos o carpetas que parecen no usarse (solo lista, sin borrar).

**ALTO. Envíame el informe de la Fase 0.**

---

## Fase 1: construir la home en la rama `rediseno-home`

### Estructura

Traslada la referencia a componentes de Astro en este orden, respetando textos, clases visuales y comportamiento:

1. `Intro` (animación del logo; ver más abajo)
2. `Header` (logo, menú de escritorio y menú móvil con `<details>`)
3. `Hero`: solo texto. H1 «Más clientes para tu negocio pet. Menos tareas que te frenan.», subtítulo, dos botones y la línea de proyectos (Laura Quintero, Virtual Vista).
4. `Problemas` (`id="problemas"`), con un enlace a su solución en cada tarjeta.
5. `Webs` (`id="webs"`): «Webs que ayudan a que te elijan», tres beneficios y capturas reales de una web en escritorio y móvil (ver «Capturas» más abajo).
6. `SeoGeo` (`id="seo"`)
7. `Herramientas` (`id="demos"`): pestañas accesibles con teclado; cada panel con la ficha «El problema / La herramienta / Qué cambia». Formulario inteligente con su vídeo y demo; calculadora de materia seca con validación; derivaciones con «Pide la demo completa».
8. `CasoLaura` (`id="caso"`): bloque corto con la línea de 5 pasos y enlace a `/casos/laura-quintero/`.
9. `Escala` (`id="como"`): escalera fija (sticky) y etapas en `<ol>` estático; el escalador sube con ScrollTrigger (scrub, **sin pin**).
10. `ComoTrabajo`: H2 «Tu negocio no necesita más tecnología. Necesita la adecuada.»
11. `Precios` (`id="precios"`): tres puertas, cada una con su botón «Empezar con esta opción», que rellena el mensaje del formulario.
12. `ParaQuien`
13. `SobreMi` y la banda «Proyectos en los que he trabajado» (Laura Quintero, Virtual Vista; la tarjeta de Dogtitude **no se renderiza** hasta que la confirme).
14. `Faq`
15. `Contacto` (`id="contacto"`): formulario con altímetro y asistente «¿No sabes qué necesitas?».
16. `Footer`

Los textos de la referencia son los definitivos. Si ves una errata, corrígela y dímelo; no reescribas copy.

### Capturas reales

- Para el bloque `Webs`, saca tú las capturas con Playwright de la web de Laura (`https://lauraquinteroveterinaria.com/`): una en escritorio (1440×900) y otra en móvil (390×844), solo la parte superior de la home. Guárdalas en `/public/img/proyectos/` en WebP optimizado, con `width`, `height`, `alt` descriptivo y `loading="lazy"`.
- Haz lo mismo con `https://virtualvistatour.com/` para la tarjeta de Virtual Vista en «Proyectos», si encaja visualmente.
- Si no puedes acceder a alguna, ese hueco no se renderiza y me lo dices.

### Afirmaciones sobre el sistema de derivaciones

Hasta que yo confirme que el sistema de derivaciones está funcionando en la web de Laura, en la pestaña de derivaciones cambia la etiqueta «Usada en un proyecto real» por «Demo bajo petición», y en el caso de Laura y en la tarjeta de Proyectos no lo cites como algo implantado. Pregúntamelo en el informe de la Fase 0.

### Intro

- Oculta por defecto. Un script en `<head>` añade la clase `js-intro` solo si no se ha visto en la sesión (`sessionStorage`) y no hay `prefers-reduced-motion`.
- Seguro: si la animación no ha arrancado en 2,5 s, se quita sola.
- Se salta con clic, con el botón «Saltar intro», con la rueda, con un toque o con el teclado.
- **Al saltarla solo se matan sus propios tweens** (no uses `gsap.killTweensOf('*')`, que rompe ESCALA). La referencia ya lo hace bien; respétalo.
- Si existe el logo en SVG, úsalo en el header y el footer. La intro necesita las dos «i» como elementos separados: si el SVG no las tiene separadas, mantén el logo recreado con HTML y CSS de la referencia solo para la intro y dímelo.

### Animaciones y rendimiento

- GSAP solo se carga en la home (no en el blog ni en las legales).
- Respeta `prefers-reduced-motion` en todas las piezas: sin intro, escalera estática sin escalador, sin saltos en el altímetro, vídeo sin reproducción automática.
- El vídeo del formulario va en `/public/videos/` (copia los archivos de `_rediseno/videos/`): fuente WebM y MP4, póster, `muted playsinline loop controls preload="none"`, y reproducción automática solo cuando se ve en pantalla (IntersectionObserver).
- Sin desplazamiento horizontal en móvil (prueba a 360 px).

### Formulario y asistente

- **Envío:** mantén el mecanismo que usa la web hoy si funciona (pásale todos los campos: nombre, email, tipo, web, mensaje). Si hoy no hay un envío que funcione, no inventes uno: deja el formulario visible con un aviso y destaca WhatsApp y el email como vía principal, y dímelo. Más adelante lo conectaremos a Resend con una Pages Function; no lo hagas ahora.
- El estado «Recibido» y la ráfaga del altímetro solo aparecen cuando el servicio confirma el envío. Si falla: mensaje claro y enlace a WhatsApp.
- Añade un campo trampa invisible contra spam (honeypot).
- Asistente: copia la lógica de la referencia tal cual (herramienta si el problema es el tiempo; lanzar si no tiene web o empieza; SEO si no le encuentran; revisión inicial si llegan pocas consultas). Foco atrapado dentro mientras está abierto, Esc para cerrar.
- Datos de contacto (WhatsApp, email, Instagram): **los de la web actual** según el inventario de la Fase 0.

### SEO

- `<title>`: «Webs, SEO local y herramientas para el sector pet | Cliimber».
- Meta description, canonical y Open Graph/Twitter como en la referencia. Si ya existe una imagen OG, reutilízala; si no, crea una de 1200×630 con el logo y el H1 sobre el azul de marca (`#0f3347`) y guárdala en `/public/og-cliimber.png`.
- Favicon: reutiliza el actual; si no hay versión SVG, deja el que exista.
- JSON-LD: conserva lo que ya haya y asegúrate de que la home tenga, con datos reales y sin inventar nada: `ProfessionalService` (o `Organization`) de Cliimber, `Person` (Jaime Gómez de Alvaré) y `FAQPage` con **exactamente** las preguntas visibles. Sin direcciones postales ni NIF.
- Un único H1. Jerarquía de encabezados correcta.
- No toques `robots.txt` en este trabajo; solo dime qué contiene.

### Páginas que comparten header y footer

El header y el footer nuevos se verán en toda la web. Comprueba que el blog, las legales, `/casos/…` y `/clinicas-veterinarias/` siguen viéndose bien con ellos (sin intro ni GSAP en esas páginas).

---

## Fase 2: comprobaciones (en la rama, antes de enseñármelo)

1. `npm run build` sin errores ni avisos nuevos.
2. Genera `_rediseno/urls-despues.txt` del sitemap nuevo y compáralo con `urls-antes.txt`: **tienen que ser idénticos.**
3. Rastrea `dist/` y comprueba que no hay enlaces internos rotos (incluidas las anclas `#…` de la home).
4. Busca en `dist/` cualquier `[` seguido de texto en contenido visible: **cero resultados** de huecos pendientes.
5. Prueba con Playwright, en 1366 px y en 390 px:
   - intro completa y saltada con la rueda: después, ESCALA sigue moviendo el escalador al hacer scroll;
   - página con JavaScript desactivado: todo el contenido visible y sin capas que tapen la web;
   - con `reducedMotion: 'reduce'`;
   - pestañas, calculadora (validaciones), asistente (los cuatro caminos) y botones de precios;
   - formulario: envío correcto y envío fallido (simulado).
6. Lighthouse en móvil sobre la home de previsualización o sobre `astro preview`: rendimiento, accesibilidad, buenas prácticas y SEO. Objetivo ≥ 90 en todas; si alguna no llega, dime por qué.
7. Revisa que `_headers` (CSP en Report-Only) no bloquee nada nuevo; ya no hay scripts de CDN.

---

## Fase 3: previsualización

1. Haz commits pequeños y claros en `rediseno-home` y súbela.
2. Dame la URL de previsualización de Cloudflare de esa rama (o, si se publica con Wrangler, publícala como previsualización con `wrangler pages deploy --branch rediseno-home`, nunca a producción).
3. Informe final: qué has hecho, resultados de la Fase 2, lista de huecos ocultos pendientes de contenido, archivos que parecen sobrar y cualquier decisión que hayas tomado por tu cuenta.

**ALTO. No publiques nada en producción hasta que yo revise la previsualización en el móvil y te dé el OK.**

---

## Fase 4: publicación (solo con mi OK)

1. `git checkout main && git merge --no-ff rediseno-home -m "Rediseño de la home (octubre 2026)"` y push.
2. Comprueba en producción: home, un artículo del blog, una página legal y `/sitemap-index.xml` (o el sitemap que use la web).
3. Dime el hash del commit de merge y deja escrito en `_rediseno/COMO_VOLVER_ATRAS.md`:
   - **Emergencia del mismo día:** en Cloudflare Pages, Deployments, la publicación anterior, «Rollback to this deployment».
   - **Volver al diseño anterior más adelante sin perder artículos nuevos:** `git revert -m 1 <hash-del-merge>` y push.
   - **Copia intacta de la web anterior:** etiqueta `pre-rediseno-2026-10` y rama `web-anterior`.
