// Cloudflare Pages Function: POST /api/regalo
// Candidaturas de la campaña «8 horas de regalo».
//
// Variables de entorno (Cloudflare Pages > Settings > Variables and secrets):
//   RESEND_API_KEY     obligatoria para usar este envío. Sin ella responde 503 y el formulario usa Formspree.
//   RESEND_FROM        remitente verificado en Resend, p. ej. «Jaime de Cliimber <hola@cliimber.com>».
//   NOTIFY_TO          a quién llegan las candidaturas (por defecto jaimegomez@cliimber.com).
//   SHEET_WEBHOOK_URL  opcional: URL del Apps Script que añade una fila a la hoja de Google.
// Binding opcional (Settings > Bindings > KV): RATE_LIMIT, para limitar envíos por IP.

interface KV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
}
interface Env {
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  NOTIFY_TO?: string;
  SHEET_WEBHOOK_URL?: string;
  RATE_LIMIT?: KV;
}
interface Ctx {
  request: Request;
  env: Env;
  waitUntil(p: Promise<unknown>): void;
}

const ORIGENES = ['https://cliimber.com', 'https://www.cliimber.com'];
const CIERRE = Date.parse('2026-12-09T22:59:59Z');
const LIMITE_POR_HORA = 5;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const limpio = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function origenValido(origin: string | null): boolean {
  if (!origin) return false;
  if (ORIGENES.includes(origin)) return true;
  // Vistas previas de Cloudflare Pages del propio proyecto.
  return /^https:\/\/[a-z0-9-]+\.cliimber-astro\.pages\.dev$/.test(origin);
}

async function enviarEmail(env: Env, payload: Record<string, unknown>) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
}

export const onRequestPost = async ({ request, env, waitUntil }: Ctx): Promise<Response> => {
  // Sin clave de Resend: el cliente cae a Formspree.
  if (!env.RESEND_API_KEY || !env.RESEND_FROM) return json({ ok: false, fallback: true }, 503);

  if (!origenValido(request.headers.get('origin'))) return json({ ok: false, error: 'Origen no permitido' }, 403);
  if (Date.now() > CIERRE) return json({ ok: false, error: 'Las candidaturas están cerradas.' }, 410);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'Datos no válidos' }, 400);
  }

  // Campo trampa: si viene relleno, fingimos éxito y no hacemos nada.
  if (limpio(body._gotcha, 200)) return json({ ok: true });

  const d = {
    negocio: limpio(body.negocio, 120),
    sector: limpio(body.sector, 60),
    web: limpio(body.web, 200),
    problema: limpio(body.problema, 2000),
    nombre: limpio(body.nombre, 120),
    email: limpio(body.email, 160),
    telefono: limpio(body.telefono, 40),
    acepta_bases: body.acepta_bases === 'sí',
    acepta_comercial: body.acepta_comercial === 'sí',
    utm_source: limpio(body.utm_source, 80),
    utm_medium: limpio(body.utm_medium, 80),
    utm_campaign: limpio(body.utm_campaign, 80),
    utm_content: limpio(body.utm_content, 80),
  };

  const faltan = (['negocio', 'sector', 'web', 'problema', 'nombre', 'email'] as const).filter((k) => !d[k]);
  if (faltan.length) return json({ ok: false, error: 'Faltan campos obligatorios.' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) return json({ ok: false, error: 'El email no parece válido.' }, 400);
  if (d.problema.length < 15) return json({ ok: false, error: 'Cuéntanos el problema con un poco más de detalle.' }, 400);
  if (!d.acepta_bases) return json({ ok: false, error: 'Tienes que aceptar las bases.' }, 400);

  // Límite por IP (si hay KV).
  const ip = request.headers.get('cf-connecting-ip') || 'sin-ip';
  if (env.RATE_LIMIT) {
    const key = `regalo:${ip}:${new Date().toISOString().slice(0, 13)}`;
    const n = Number((await env.RATE_LIMIT.get(key)) || '0');
    if (n >= LIMITE_POR_HORA) return json({ ok: false, error: 'Demasiados envíos. Prueba dentro de un rato.' }, 429);
    await env.RATE_LIMIT.put(key, String(n + 1), { expirationTtl: 3700 });
  }

  const fecha = new Date().toLocaleString('es-ES', { timeZone: 'Europe/Madrid' });
  const filas = [
    ['Negocio', d.negocio],
    ['Sector', d.sector],
    ['Web o Instagram', d.web],
    ['Problema', d.problema],
    ['Nombre', d.nombre],
    ['Email', d.email],
    ['Teléfono', d.telefono || '(no lo ha dejado)'],
    ['Acepta comunicaciones', d.acepta_comercial ? 'Sí' : 'No'],
    ['Origen', [d.utm_source, d.utm_medium, d.utm_campaign, d.utm_content].filter(Boolean).join(' / ') || 'directo u orgánico'],
    ['Fecha', fecha],
  ];
  const tabla = filas
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#7a8e96;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;color:#0d2838;white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join('');

  try {
    // Aviso a Jaime: si falla, el usuario ve error y puede reintentar (o el cliente cae a Formspree).
    await enviarEmail(env, {
      from: env.RESEND_FROM,
      to: [env.NOTIFY_TO || 'jaimegomez@cliimber.com'],
      reply_to: d.email,
      subject: `Candidatura 8 horas: ${d.negocio} (${d.sector})`,
      html: `<div style="font-family:system-ui,sans-serif;font-size:15px"><h2 style="margin:0 0 12px">Nueva candidatura: ${esc(d.negocio)}</h2><table>${tabla}</table></div>`,
    });
  } catch (e) {
    console.error(e);
    return json({ ok: false, fallback: true }, 502);
  }

  // Confirmación al candidato y fila en la hoja: no bloquean la respuesta.
  waitUntil(
    enviarEmail(env, {
      from: env.RESEND_FROM,
      to: [d.email],
      reply_to: env.NOTIFY_TO || 'jaimegomez@cliimber.com',
      subject: 'He recibido tu candidatura para las 8 horas',
      html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#0d2838">
        <p>Hola, ${esc(d.nombre)}:</p>
        <p>He recibido la candidatura de <b>${esc(d.negocio)}</b>. La leo yo.</p>
        <p>El viernes 11 de diciembre anuncio el negocio elegido en Instagram (@jaime.gomezgp) y te escribo con el resultado, salga o no el tuyo.</p>
        <p>Si quieres añadir algo, responde a este correo.</p>
        <p>Jaime<br/>Cliimber · cliimber.com</p></div>`,
    }).catch((e) => console.error('confirmación', e)),
  );
  if (env.SHEET_WEBHOOK_URL) {
    waitUntil(
      fetch(env.SHEET_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaña: '8 horas', fecha, ...d }),
      }).catch((e) => console.error('hoja', e)),
    );
  }

  return json({ ok: true });
};

// Cualquier otro método.
export const onRequest = async () => json({ ok: false, error: 'Método no permitido' }, 405);
