import { useEffect, useState } from 'react';
import { REGALO } from '../../lib/regalo';

// Cuenta atrás hasta el cierre. En el servidor (HTML estático) se pinta vacía y se rellena al hidratar,
// así no hay desajuste entre la hora del build y la del visitante.
function partes(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

export default function Countdown({ compact = false }: { compact?: boolean }) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const end = Date.parse(REGALO.cierreISO);
    const tick = () => setLeft(end - Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (left !== null && left <= 0) {
    return <span className="rg-cd rg-cd-closed">Candidaturas cerradas</span>;
  }

  const p = partes(left ?? 0);
  const pad = (n: number) => String(n).padStart(2, '0');

  if (compact) {
    return (
      <span className="rg-cd-compact" aria-live="off">
        {left === null ? 'Cierra el 9 de diciembre' : `Cierra en ${p.d}d ${pad(p.h)}h ${pad(p.m)}m`}
      </span>
    );
  }

  const items: [string, number][] = [['días', p.d], ['horas', p.h], ['min', p.m], ['seg', p.s]];
  return (
    <div className="rg-cd" role="timer" aria-label={`Cierra el ${REGALO.cierreTexto}`}>
      {items.map(([label, n]) => (
        <div className="rg-cd-cell" key={label}>
          <span className="rg-cd-num">{left === null ? '--' : pad(n)}</span>
          <span className="rg-cd-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
