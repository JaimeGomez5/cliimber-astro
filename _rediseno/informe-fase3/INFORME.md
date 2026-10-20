# Rediseño de la home: informe antes de la Fase 4

Previsualización: https://rediseno-home.cliimber-astro.pages.dev (rama `rediseno-home`, commit `894a66e`).
Producción sigue intacta. Etiqueta `pre-rediseno-2026-10` y rama `web-anterior` como copia de seguridad.

## Efecto «caos a orden» en móvil

Capturas de la previsualización a 390 px, con la animación congelada en cada instante.

| Inicio (0 s) | Mitad (0,42 s) | Final | Destello en «pet» |
|---|---|---|---|
| ![Inicio](efecto-movil-principio.png) | ![Mitad](efecto-movil-mitad.png) | ![Final](efecto-movil-final.png) | ![Destello](efecto-movil-destello-pet.png) |

- Solo en móvil (menos de 701 px o pantalla táctil) y nunca con «reducir movimiento». Sin GSAP: un script de unas 20 líneas justo después del H1 y CSS.
- Cada letra parte desplazada (hasta ±120 px en horizontal, de -40 a +60 px en vertical) y girada (±60°), en lima semitransparente, sin salir de la caja del titular.
- Vuelve a su sitio con transform y un rebote suave: 0,32 s de escalonado + 0,5 s = 0,82 s. Después pasa a su color normal y «pet» hace un destello de 0,4 s.
- Nunca opacity 0: el titular se pinta desde el primer fotograma.
- El texto entero sigue en el HTML; el H1 lleva `aria-label` con la frase completa y los spans de las letras van con `aria-hidden`.

## Lighthouse móvil: medianas

Siete pasadas de cada una, alternando home nueva y producción para que la variación de la red les afecte por igual.

| Métrica | Home nueva (previsualización) | Producción actual |
|---|---|---|
| **Rendimiento** | **86** (de 80 a 95) | **84** (de 70 a 87) |
| Accesibilidad | 100 | 92 |
| Buenas prácticas | 100 | 100 |
| SEO | 69 (*) | 100 |
| First Contentful Paint | 1,9 s | 1,6 s |
| Largest Contentful Paint | 3,9 s | 3,8 s |
| Total Blocking Time | 140 ms | 220 ms |
| Speed Index | 3,0 s | 4,3 s |
| Cumulative Layout Shift | 0 | 0 |

(*) El único fallo de SEO es `is-crawlable`: Cloudflare sirve las previsualizaciones con `x-robots-tag: noindex`. En cliimber.com no existe esa cabecera; en las pruebas locales el SEO daba 100.

## Cambios de esta ronda

1. **Intro de escritorio:** más corta (unos 1,4 s de animación). Tope duro: como mucho 2,2 s desde que empieza a cargar la página. Si el script llega tarde, se acelera hasta 1,6×; si ni así cabe, no se muestra. Medido en la previsualización: deja de tapar la web a los 2,1 s, y las «i» siguen aterrizando sobre las del header (error de 0,002 px).
2. **Móvil:** sin intro a pantalla completa; en su lugar, el efecto del H1.
3. **Footer:** vuelven el email `jaimegomez@cliimber.com` (enlace mailto) y la línea «© 2026 Cliimber · Jaime Gómez de Alvaré». «Repetir la intro» se oculta en móvil, donde no hay intro.
4. **Rendimiento:**
   - GSAP se descarga bajo demanda: para la intro de escritorio, cuando ESCALA se acerca a la pantalla, o al empezar a usar el formulario o el asistente. El script inicial de la home pasa de 128 KB a 16 KB.
   - Las clases de estado se aplican en su propia sección en vez de en `<html>`, para no recalcular los estilos de toda la página.
   - Sin maquetación forzada al cargar.

## Pruebas

**118 de 118** superadas en la previsualización, a 1366 y a 390 px. Incluyen las de la ronda anterior y estas nuevas:

- En escritorio, la intro deja de tapar la web antes de 2,2 s.
- En móvil no hay intro.
- En móvil, el H1 es visible y legible desde el primer fotograma: opacidad 1 y texto en su caja.
- En ningún fotograma una letra sale más de 2 px de la zona del titular, ni tapa el subtítulo o los botones.
- Todas las letras encajan en menos de 0,9 s desde el primer fotograma: 914 ms medidos, de los que unos 30 ms son los dos fotogramas previos al arranque.
- El destello en «pet» llega al encajar la última letra.
- Con «reducir movimiento», el H1 sale sin efecto.

## Detalle menor

En móvil, como cada letra va en su propia caja, el navegador no aplica el ajuste fino de espaciado entre algunos pares (se nota un poco entre «pet» y el punto). En escritorio no pasa.
