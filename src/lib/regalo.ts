// Campaña «Tuerca regala 8 horas» (diciembre 2026). Una sola fuente para fechas y textos que se repiten.
// Cierre: miércoles 9 de diciembre de 2026 a las 23:59 hora de Madrid (CET, UTC+1) = 22:59:59 UTC.
export const REGALO = {
  horas: 8,
  cierreISO: '2026-12-09T22:59:59Z',
  cierreTexto: 'miércoles 9 de diciembre a las 23:59',
  cierreCorto: 'hasta el 9 de diciembre',
  anuncioTexto: 'viernes 11 de diciembre',
  instagram: '@jaime.gomezgp',
  instagramUrl: 'https://www.instagram.com/jaime.gomezgp/',
  // Formulario de Formspree. Si creas uno propio para la campaña, cambia solo este id.
  formspreeId: 'xdajjggv',
};

export function cerrado(now = Date.now()): boolean {
  return now > Date.parse(REGALO.cierreISO);
}

// Eventos de Microsoft Clarity (ya instalado en BaseLayout). Nunca rompe si Clarity no ha cargado.
export function evento(nombre: string) {
  try {
    const w = window as unknown as { clarity?: (...a: unknown[]) => void };
    w.clarity?.('event', nombre);
  } catch {
    /* sin analítica no pasa nada */
  }
}
