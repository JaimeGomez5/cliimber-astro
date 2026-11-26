import { useEffect, useRef, useState } from 'react';
import { REGALO, cerrado, evento } from '../../lib/regalo';

// Candidatura en dos pasos: primero el negocio y el problema (lo fácil y lo que engancha), luego el contacto.
// Envío: primero /api/regalo (Resend + hoja de Google, functions/api/regalo.ts). Si esa función no está
// configurada o falla, se envía por Formspree, igual que el contacto de la web. Así nunca se pierde una candidatura.

const SECTORES = ['Sector pet', 'Tienda o ecommerce', 'Clínica o consulta', 'Reformas u obras', 'Academia o formación', 'Servicios profesionales', 'Hostelería', 'Otro'];
const PISTAS = [
  'Me hacen siempre las mismas preguntas',
  'Pierdo llamadas o mensajes',
  'Los presupuestos me llevan horas',
  'Hago a mano tareas que se repiten',
  'Llegan visitas pero no piden nada',
];

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];

export default function RegaloForm() {
  const [state, setState] = useState<{ submitting: boolean; succeeded: boolean; error: string }>({ submitting: false, succeeded: false, error: '' });
  const [paso, setPaso] = useState<1 | 2>(1);
  const [sector, setSector] = useState('');
  const [problema, setProblema] = useState('');
  const [aviso, setAviso] = useState('');
  const [isClosed, setIsClosed] = useState(false);
  const [utm, setUtm] = useState<Record<string, string>>({});
  const empezado = useRef(false);
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClosed(cerrado());
    const q = new URLSearchParams(window.location.search);
    const found: Record<string, string> = {};
    UTM_KEYS.forEach((k) => {
      const v = q.get(k);
      if (v) found[k] = v.slice(0, 80);
    });
    setUtm(found);
  }, []);

  useEffect(() => {
    if (state.succeeded) {
      evento('regalo_candidatura_enviada');
      raiz.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [state.succeeded]);

  const marcarInicio = () => {
    if (!empezado.current) {
      empezado.current = true;
      evento('regalo_formulario_iniciado');
    }
  };

  const anadirPista = (p: string) => {
    marcarInicio();
    setProblema((t) => (t.trim() ? `${t.trim()}. ${p}` : p));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setState({ submitting: true, succeeded: false, error: '' });
    const fd = new FormData(form);
    const datos: Record<string, string> = {};
    fd.forEach((v, k) => {
      if (typeof v === 'string') datos[k] = v;
    });

    try {
      const r = await fetch('/api/regalo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(datos),
      });
      const res = await r.json().catch(() => ({}));
      if (r.ok && res.ok) {
        setState({ submitting: false, succeeded: true, error: '' });
        return;
      }
      if (!res.fallback && r.status !== 404) {
        setState({ submitting: false, succeeded: false, error: res.error || 'No se ha podido enviar. Prueba otra vez.' });
        return;
      }
    } catch {
      /* sin función o sin red: probamos con Formspree */
    }

    try {
      const r = await fetch(`https://formspree.io/f/${REGALO.formspreeId}`, { method: 'POST', body: fd, headers: { Accept: 'application/json' } });
      if (r.ok) setState({ submitting: false, succeeded: true, error: '' });
      else {
        const res = await r.json().catch(() => ({}));
        const msg = res?.errors?.[0]?.message;
        setState({ submitting: false, succeeded: false, error: msg || 'No se ha podido enviar. Prueba otra vez o escríbeme a jaimegomez@cliimber.com.' });
      }
    } catch {
      setState({ submitting: false, succeeded: false, error: 'Sin conexión. Prueba otra vez en un momento.' });
    }
  };

  const siguiente = () => {
    const form = raiz.current?.querySelector('form');
    const campos = form ? Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-paso="1"]')) : [];
    const malo = campos.find((c) => !c.checkValidity());
    if (malo) {
      malo.reportValidity();
      return;
    }
    if (!sector) {
      setAviso('Elige a qué se dedica tu negocio.');
      return;
    }
    if (problema.trim().length < 15) {
      setAviso('Cuéntame el problema con un poco más de detalle (una o dos frases).');
      return;
    }
    setAviso('');
    setPaso(2);
    evento('regalo_paso_2');
    raiz.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (isClosed) {
    return (
      <div className="rg-form rg-done" ref={raiz}>
        <p className="rg-done-big">Candidaturas cerradas</p>
        <p>El {REGALO.anuncioTexto} anuncio el negocio elegido en Instagram.</p>
        <a className="rg-btn rg-btn-lima" href={REGALO.instagramUrl} target="_blank" rel="noopener">Verlo en {REGALO.instagram}</a>
      </div>
    );
  }

  if (state.succeeded) {
    const compartir = async () => {
      const data = { title: 'Regalan 8 horas para crear una herramienta para tu negocio', url: 'https://cliimber.com/regalo/' };
      evento('regalo_compartir');
      try {
        if (navigator.share) await navigator.share(data);
        else {
          await navigator.clipboard.writeText(data.url);
          setAviso('Enlace copiado. Pégaselo a quien quieras.');
        }
      } catch {
        /* el usuario cerró el menú de compartir */
      }
    };
    return (
      <div className="rg-form rg-done" ref={raiz}>
        <div className="rg-check" aria-hidden="true">
          <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><path d="M15 27l7 7 15-16" /></svg>
        </div>
        <p className="rg-done-big">Candidatura recibida</p>
        <p>La leo yo, Jaime. El {REGALO.anuncioTexto} anuncio el negocio elegido y te escribo con el resultado, salga o no el tuyo.</p>
        <div className="rg-done-actions">
          <a className="rg-btn rg-btn-lima" href={REGALO.instagramUrl} target="_blank" rel="noopener">Seguir a {REGALO.instagram}</a>
          <button type="button" className="rg-btn rg-btn-ghost" onClick={compartir}>Pásaselo a otro negocio</button>
        </div>
        {aviso && <p className="rg-note">{aviso}</p>}
      </div>
    );
  }

  return (
    <div className="rg-form" ref={raiz}>
      <div className="rg-steps" aria-hidden="true">
        <span className={paso >= 1 ? 'on' : ''}>1 · Tu negocio</span>
        <span className={paso >= 2 ? 'on' : ''}>2 · Contacto</span>
        <i style={{ width: paso === 1 ? '50%' : '100%' }} />
      </div>

      <form onSubmit={handleSubmit} onFocus={marcarInicio} noValidate={false}>
        <input type="hidden" name="_subject" value="Candidatura: 8 horas de regalo" />
        <input type="hidden" name="campaña" value="Tuerca regala 8 horas (dic 2026)" />
        <input type="hidden" name="sector" value={sector} />
        {Object.entries(utm).map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
        {/* Campo trampa para bots (Formspree descarta los envíos que lo rellenan). */}
        <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="rg-hp" aria-hidden="true" />

        <fieldset className={paso === 1 ? 'rg-fs' : 'rg-fs rg-hidden'}>
          <label className="rg-label" htmlFor="rg-negocio">¿Cómo se llama tu negocio?</label>
          <input id="rg-negocio" data-paso="1" required name="negocio" placeholder="Ej.: Clínica Huellas" className="rg-input" />

          <span className="rg-label">¿A qué se dedica?</span>
          <div className="rg-chips" role="radiogroup" aria-label="Sector">
            {SECTORES.map((s) => (
              <button
                type="button"
                key={s}
                role="radio"
                aria-checked={sector === s}
                className={sector === s ? 'rg-chip on' : 'rg-chip'}
                onClick={() => {
                  marcarInicio();
                  setSector(s);
                  setAviso('');
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <label className="rg-label" htmlFor="rg-web">Tu web o tu Instagram</label>
          <input id="rg-web" data-paso="1" required name="web" placeholder="tuweb.com o @tunegocio" className="rg-input" autoCapitalize="off" />

          <label className="rg-label" htmlFor="rg-problema">¿Qué te gustaría resolver?</label>
          <p className="rg-help">No necesitas saber qué herramienta te hace falta. Cuéntame qué tarea te hace perder tiempo o dónde crees que pierdes clientes. Toca una idea si te encaja.</p>
          <div className="rg-chips rg-chips-sm">
            {PISTAS.map((p) => (
              <button type="button" key={p} className="rg-chip" onClick={() => anadirPista(p)}>
                + {p}
              </button>
            ))}
          </div>
          <textarea
            id="rg-problema"
            data-paso="1"
            required
            minLength={15}
            name="problema"
            rows={4}
            value={problema}
            onChange={(e) => setProblema(e.target.value)}
            placeholder="Ej.: a mediodía no cojo el teléfono y esa gente ya no vuelve a llamar"
            className="rg-input"
          />

          {aviso && <p className="rg-error" role="alert">{aviso}</p>}
          <button type="button" className="rg-btn rg-btn-lima rg-btn-full" onClick={siguiente}>
            Siguiente: tu contacto
          </button>
          <p className="rg-micro">2 pasos. Menos de un minuto.</p>
        </fieldset>

        <fieldset className={paso === 2 ? 'rg-fs' : 'rg-fs rg-hidden'}>
          <label className="rg-label" htmlFor="rg-nombre">Tu nombre</label>
          <input id="rg-nombre" required={paso === 2} name="nombre" autoComplete="name" placeholder="Nombre" className="rg-input" />

          <label className="rg-label" htmlFor="rg-email">Email</label>
          <input id="rg-email" required={paso === 2} type="email" name="email" autoComplete="email" placeholder="tu@email.com" className="rg-input" />

          <label className="rg-label" htmlFor="rg-tel">Teléfono o WhatsApp <span className="rg-opt">(opcional)</span></label>
          <input id="rg-tel" type="tel" inputMode="tel" name="telefono" autoComplete="tel" placeholder="600 000 000" className="rg-input" />

          <label className="rg-check-row">
            <input type="checkbox" name="acepta_bases" value="sí" required={paso === 2} />
            <span>He leído y acepto las <a href="/regalo/bases/" target="_blank" rel="noopener">bases</a> y la <a href="/politica-de-privacidad/" target="_blank" rel="noopener">política de privacidad</a>.</span>
          </label>
          <label className="rg-check-row">
            <input type="checkbox" name="acepta_comercial" value="sí" />
            <span>Acepto que Jaime contacte conmigo para compartir recomendaciones y propuestas de servicios de Cliimber relacionadas con mi negocio (opcional).</span>
          </label>

          {state.error && <p className="rg-error" role="alert">{state.error}</p>}
          <button type="submit" disabled={state.submitting} className="rg-btn rg-btn-lima rg-btn-full">
            {state.submitting ? 'Enviando…' : 'Presentar mi negocio'}
          </button>
          <button type="button" className="rg-back" onClick={() => setPaso(1)}>Volver al paso 1</button>
        </fieldset>
      </form>
    </div>
  );
}
