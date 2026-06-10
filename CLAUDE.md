# CLAUDE.md — Cliimber

> Cerebro permanente del proyecto. Se carga automáticamente en cada sesión de Claude Code.
> Última actualización: junio 2026

\---

## QUIÉN SOY

Jaime Gómez, desarrollador web freelance bajo la marca **Cliimber** (cliimber.com).
Madrid. Trabajo con toda España en remoto.

**Lo que hago:** Webs a medida, herramientas interactivas y software para empresas que necesitan algo que no existe en el mercado. SEO/SEM/AEO incluido. Sin WordPress, sin plantillas, sin intermediarios.

**Cómo lo hago:** Código puro HTML/CSS/JS + Astro para webs nuevas. IA como copiloto — Lovable para scaffolding, Claude Code para desarrollo local. El cliente siempre habla conmigo, no con un equipo anónimo.

**Segunda marca:** Virtual Vista (virtualvistatour.com) — agencia en Malta, tours 3D Matterport + marketing digital para hostelería e inmobiliaria. Negocio separado, no mezclar con Cliimber en comunicaciones.

\---

## STACK TÉCNICO

* **Framework:** Astro + Cloudflare Pages + GitHub
* **Estilos:** CSS puro con variables (sin Tailwind en producción)
* **Deploy:** git push → Cloudflare Pages despliega automáticamente
* **Imágenes:** WebP comprimidas con Sharp, máximo 100KB blog, máximo 200KB hero
* **Fuente:** Plus Jakarta Sans (400, 500, 600, 700, 800)
* **Sin:** WordPress, Webflow, CMS, plugins, dependencias innecesarias

### Paleta de colores

```
--azul-oscuro:   #0f3347
--verde-oscuro:  #0a5f4a
--verde:         #2a9770
--verde-claro:   #a8e063  (acento, usar con moderación)
--off-white:     #f5f8f9
--granate:       #a8332d  (solo badge "Más popular" y su CTA)
```

### Estructura de archivos clave

```
src/
  layouts/BaseLayout.astro   — layout base con SEO, JSON-LD, Clarity
  pages/
    index.astro              — home principal
    blog/                    — artículos del blog (crear si no existe)
    casos/
      laura-quintero.astro
      virtual-vista.astro
  components/
  styles/global.css
public/
  assets/                    — imágenes, logos, OG images
  robots.txt
  sitemap.xml
```

\---

## VOZ Y COPY

**Tono:** Directo, sin filtro corporativo, sin postureo. Momentos de autoridad cuando hay casos reales. Transparente sobre el proceso y el uso de IA y que tengaconexionuna frase con otra como sila hubiese escrito Jaime y no una  IA

**Reglas de copy estrictas:**

* Hablar siempre en consecuencias para el cliente, nunca en términos técnicos
* Nunca usar: "disruptivo", "innovador", "soluciones a medida", "equipo multidisciplinar", "llaves en mano", "resultados garantizados", "diseño web profesional", "optimizado para SEO" (sin demostrar)
* Sin emoticonos en web ni en copy profesional
* Sin em-dashes (—) en textos de cara al cliente
* Sin lenguaje corporativo ni frases que suenen a IA
* Los clientes no saben qué es WordPress — hablar de lo que pierden, no de la tecnología

**Frases que sí funcionan (VOC real):**

* "Llevo meses pagando y no sé qué están haciendo"
* "Tengo visitas pero ningún cliente"
* "Mi web no me trae clientes"
* "Siempre hablas con Jaime — mismo teléfono, mismo email"
* "El código es tuyo desde el día 1"
* "Sin permanencia. Sin sorpresas en la factura."

\---

## SEO / AEO — MÉTODO

### Principios clave

* **Nunca dar diagnóstico SEO sin confirmar primero:** ¿tiene GSC activo? ¿tiene GBP? ¿tiene dominio a su nombre?
* Los bloques AEO de 40-60 palabras al inicio de cada página son lo que las IAs extraen literalmente
* Keywords conversacionales ("llevo meses pagando una web y no vende") tienen intención altísima — agrupar en post pilar, no una página por keyword
* Listicles y tablas tienen 3x más probabilidad de ser citados por LLMs que prosa lineal

### Schema JSON-LD implementado

* **Home:** ProfessionalService + Person + FAQPage ✅
* **Casos:** Article + BreadcrumbList ✅
* **Blog (pendiente):** Article + BreadcrumbList por artículo

### robots.txt — bots permitidos

GPTBot, ClaudeBot, PerplexityBot, Google-Extended, ChatGPT-User, CCBot

### Top 10 keywords objetivo (validar volumen en Google Keyword Planner)

1. mi web no me trae clientes
2. web a medida sin wordpress
3. cuánto cuesta una web profesional pyme España
4. web para nutricionista canina
5. qué preguntar antes de contratar diseñador web
6. wordpress vs web a medida
7. necesito web si tengo instagram
8. diseño web sector pet España
9. calculadora interactiva para web pyme
10. kit digital opiniones pyme

### Clusters semánticos prioritarios

* Diagnóstico de web rota (post pilar)
* WordPress vs a medida (comparativa)
* Precio web pyme (tabla + calculadora)
* Instagram → web propia (Perfil 2)
* Kit Digital crítico-honesto
* Herramientas interactivas
* Web sector pet (hub de nicho)

\---

## CLIENTES ACTIVOS

### Laura Quintero — @LauraQuinteroVeterinaria

* Sector: nutricionista canina
* Retainer: 150€/mes
* Web live con calculadora de raciones BARF + sistema de derivación para clínicas
* GBP activo con reseñas reales
* Pendiente: componente de reseñas Google en su web, OG image del caso

### Dogtitude (Elena)

* Sector: accesorios mascotas, Shopify
* Propuesta enviada: 800€ drop verano "Primer Baño Juntos — Jávea Edition"
* Estado: pendiente respuesta

### Ooskels

* Sector: pienso premium
* Demo quiz enviada
* Estado: pendiente respuesta

### OFGU — clínica fisioterapia

* Pipeline activo: PWA gestión pacientes Pilates
* Contacto interno: Héctor (no es el decisor final)
* Estrategia: cerrar portal pacientes primero, luego módulos + retainer

\---

## ESTADO DE CLIIMBER.COM

**Web live en producción.** Deploy: Astro + Cloudflare Pages + GitHub (rama main).

### Lo que está hecho ✅

* Schema JSON-LD completo validado en Google Rich Results Test (3 elementos home, 2 en cada caso)
* FAQ con 10 preguntas VOC reales
* robots.txt con bots IA permitidos
* Sitemap correcto (3 URLs indexadas)
* GSC conectado y procesado correctamente
* Imágenes optimizadas (Sharp)
* Interlinks descriptivos entre home y casos
* BreadcrumbList + Article en páginas de casos
* Logo PNG en schema de Organización
* PageSpeed móvil: 93 ✅

### Pendiente (no urgente)

* OG images para casos (og-laura.jpg, og-virtualvista.jpg) — 1200x630px
* `datePublished` en schema Article de los casos
* Title tags optimizados con keywords validadas en Keyword Planner
* Headers de seguridad `\_headers` en Cloudflare
* Blog — estructura pendiente de montar

\---

## BLOG — ESTRUCTURA OBJETIVO

### Ruta

* Listado: `cliimber.com/blog/`
* Artículos: `cliimber.com/blog/\[slug]/`
* Entrada en menú de navegación: entre FAQ y Hablamos →

### Frontmatter estándar de cada artículo

```yaml
---
title: ""
description: ""         # 150-160 chars, keyword al inicio, orientado a beneficio
slug: ""
date: "YYYY-MM-DD"
author: "Jaime Gómez"
keywords: \[]
cluster: ""             # cluster semántico al que pertenece
draft: false
---
```

### Estructura AEO de cada artículo

1. **Bloque respuesta directa** (40-60 palabras) — lo que extrae la IA literalmente
2. **H2 con keyword** — problema principal
3. **Listicle o tabla** — 3x más citado por LLMs
4. **Desarrollo** — con datos verificables y experiencia propia
5. **CTA** — auditoría gratuita o WhatsApp
6. **Schema:** Article + BreadcrumbList + FAQPage si aplica

### Quick wins — primeros 5 artículos

1. "Mi web no me trae clientes: 9 diagnósticos y qué hacer" (cluster 1)
2. "Cuánto cuesta una web a medida en España en 2026 (con precios reales)" (cluster 3)
3. "WordPress o web a medida: la decisión honesta para una pyme en 2026" (cluster 2)
4. "¿Necesito web si tengo Instagram? La respuesta honesta" (cluster 6)
5. "Qué preguntar antes de contratar un desarrollador web (las 12 preguntas)" (cluster 5)

\---

## REGLAS DE DESARROLLO

* **Antes de cualquier cambio:** leer el archivo afectado completo
* **Imágenes nuevas:** siempre WebP, comprimir con Sharp antes de añadir
* **Schema nuevo:** validar en Google Rich Results Test antes de dar por hecho
* **Commit messages:** en español, descriptivos (`blog: añadir artículo X`, `schema: añadir datePublished a casos`)
* **Deploy:** siempre `npm run build` antes de `git push` para confirmar que compila
* **Sin cambios en archivos de políticas** (politica-de-cookies.astro, politica-de-privacidad.astro) sin revisión manual
* **OG images:** 1200x630px, formato JPG o PNG, menos de 200KB

\---

## HERRAMIENTAS Y ACCESOS

* **GSC:** conectado, sitemap procesado, 3 URLs indexadas
* **Microsoft Clarity:** instalado (tag: v90mg5jlqz)
* **Cloudflare Pages:** deploy automático en push a main
* **GitHub:** repositorio principal del proyecto
* **Google Keyword Planner:** para validar volumen de keywords (registrarse pendiente)
* **Ahrefs:** NO disponible — usar Keyword Planner + Screaming Frog free

\---

## LO QUE NO HACE CLIIMBER

* Ecommerce propio → recomienda Shopify
* WordPress / Webflow / CMS genéricos
* Proyectos de menos de 350€
* Prometer posicionamiento garantizado en Google
* Aceptar trabajos que dañen el posicionamiento como especialista

\---

## INVESTIGACIÓN — CÓMO USARLA

Los archivos de investigación están en `/research/`. El agente debe leerlos según la tarea:

|Tarea|Archivo a leer|
|-|-|
|Escribir artículo de blog|`02\_keywords\_AEO.md` + `01\_VOC\_redes\_sociales.md`|
|Escribir copy de servicios o propuestas|`01\_VOC\_redes\_sociales.md` + `04\_buyer\_personas.md`|
|Posicionar Cliimber vs competencia|`03\_competencia\_huecos.md`|
|Elegir tema de artículo|`02\_keywords\_AEO.md` (sección Quick Wins)|
|Escribir para sector pet|`02\_keywords\_AEO.md` (sección sector pet) + `04\_buyer\_personas.md`|
|Crear anuncio o post de redes|`01\_VOC\_redes\_sociales.md` (tabla 25 frases)|
|Definir garantías o copy de confianza|`01\_VOC\_redes\_sociales.md` (sección Garantías)|

### Archivos disponibles

* `research/01\_VOC\_redes\_sociales.md` — 25 frases literales de clientes, garantías, lenguaje a evitar/usar, 5 posts virales
* `research/02\_keywords\_AEO.md` — Top 10 keywords, 15 clusters semánticos, quick wins, señales AEO, preguntas a IAs
* `research/03\_competencia\_huecos.md` — Análisis de 15+ competidores, 6 huecos de posicionamiento, dolores no cubiertos
* `research/04\_buyer\_personas.md` — 3 perfiles completos (María, Juan, Fundador) con dolores, objeciones, falsas creencias y búsquedas exactas

### Regla de uso

**Nunca generar contenido de blog o copy sin leer primero el archivo relevante.** El contenido que no usa las frases literales del cliente suena genérico y no posiciona.

\---

## NOTAS ESTRATÉGICAS

* Los prototipos reales ganan siempre a los pitches abstractos — construir durante el outreach
* No aceptar trabajo trivial de bajo presupuesto — mejor ofrecer un tutorial y mantener la relación
* Precio correcto: 800-900€ donde la tendencia natural es 600€
* Pet sector como especialización sin cerrarse a otros sectores
* LinkedIn es el canal prioritario para tickets altos (constructoras, SaaS, proyectos grandes)
* Instagram: 1 reel/semana, cadencia constante > virales puntuales
* Reel pendiente: Reel 2 (historia Malta) y Reel 3 (nueva web live)

