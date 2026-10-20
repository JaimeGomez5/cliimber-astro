# Cómo volver atrás tras el rediseño de la home

Publicado el 20 de octubre de 2026.

- **Commit de merge en `main`:** `05932fd0ff5439d70d106c5db2d2e94e469fd289` (corto: `05932fd`), «Rediseño de la home (octubre 2026)».
- **Último commit de la web anterior:** `87fb939`.

## Publicaciones posteriores

| Fecha | Merge en `main` | Qué incluye | Deshacer solo eso |
|---|---|---|---|
| 20/10/2026 | `52bac05354bf4effb4ca43d1c71982bbf4ca749e` | Mejoras 1: hero compacto en móvil y puntos del H1 pegados | `git revert -m 1 52bac05` |

Para volver al diseño anterior al rediseño completo, revierte primero las publicaciones posteriores (de la más nueva a la más antigua) y después el merge del rediseño, como se explica en el punto 2.

## 1. Emergencia del mismo día

Sin tocar el código:

1. Entra en el panel de Cloudflare, en **Workers & Pages → cliimber-astro → Deployments**.
2. Busca el despliegue de producción anterior, el del commit `87fb939`.
3. En su menú «…», elige **Rollback to this deployment**.

En unos segundos cliimber.com vuelve a la web anterior. El repositorio no cambia: el siguiente `git push` a `main` volvería a publicar lo que haya en `main`. Úsalo para ganar tiempo y después aplica el punto 2.

## 2. Volver al diseño anterior más adelante, sin perder artículos nuevos

Deshace solo el rediseño. Lo que se haya publicado después, como artículos del blog, se mantiene:

```bash
git checkout main
git pull
git revert -m 1 05932fd0ff5439d70d106c5db2d2e94e469fd289
npm run build
git push
```

`-m 1` le dice a Git que se quede con el lado de `main` anterior al merge. Cloudflare publica el resultado al hacer push.

Para recuperar después el rediseño, haz un revert de ese revert: `git revert <hash-del-commit-de-revert>`.

## 3. Copia intacta de la web anterior

- **Etiqueta `pre-rediseno-2026-10`:** el `main` exacto antes del rediseño, `87fb939`.
- **Rama `web-anterior`:** el mismo punto, en GitHub. No se toca nunca. Cloudflare la sirve como previsualización en https://web-anterior.cliimber-astro.pages.dev

Para ver o comparar el código anterior:

```bash
git checkout pre-rediseno-2026-10
```
