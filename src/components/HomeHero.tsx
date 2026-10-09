import { useEffect, useState } from "react";
import ParticleNetwork from "./ParticleNetwork";

// El texto final ya está en el HTML estático; la animación solo lo "descifra".
// "por fin " solo se muestra en escritorio (en móvil queda "trae clientes.").
const SCRAMBLE_DESKTOP_ONLY = "por fin ";
const SCRAMBLE_REST = "trae clientes.";
const SCRAMBLE_FINAL = SCRAMBLE_DESKTOP_ONLY + SCRAMBLE_REST;
const SCRAMBLE_CHARS = "#$%@&?!0123456789";

function scrambleAt(final: string, progress: number) {
  const len = final.length;
  let out = "";
  for (let i = 0; i < len; i++) {
    const charProgress = progress * len - i;
    if (final[i] === " " || charProgress >= 1) {
      out += final[i];
    } else {
      out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
    }
  }
  return out;
}

function useScramble(final: string, delay = 400, duration = 1500) {
  // Estado inicial = texto final, para que el HTML servido lo contenga.
  const [text, setText] = useState(final);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let start = 0;
    setText(scrambleAt(final, 0));
    const startTimer = setTimeout(() => {
      const step = (ts: number) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        setText(progress < 1 ? scrambleAt(final, progress) : final);
        if (progress < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    // Salvaguarda: si el navegador no pinta frames (pestaña congelada), deja el texto final.
    const endTimer = setTimeout(() => {
      cancelAnimationFrame(raf);
      setText(final);
    }, delay + duration + 200);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
      cancelAnimationFrame(raf);
    };
  }, [final, delay, duration]);
  return text;
}

const PROFILES = [
  { label: "Tengo web pero no funciona", text: "Llevas meses pagando sin saber qué están haciendo, y tu web sigue sin traer un solo cliente. El problema no es tu negocio. Es que nadie lo analizó." },
  { label: "Solo tengo Instagram", text: "Instagram no es tu web, es un escaparate alquilado. El día que cambia el algoritmo, tu facturación cae con él." },
  { label: "Tengo un proyecto nuevo", text: "Necesitas a alguien que entienda tu idea a la primera, sin explicarla cinco veces ni recibir cuatro propuestas iguales cambiadas de color." },
];

export default function HomeHero() {
  const typed = useScramble(SCRAMBLE_FINAL);
  const [profile, setProfile] = useState(0);

  return (
    <section style={{ background: "var(--azul-oscuro)" }} className="pt-28 pb-20 relative overflow-hidden">
      <ParticleNetwork />
      <div className="container-x relative" style={{ zIndex: 1 }}>
        <h1 className="font-bold mb-6 max-w-4xl" style={{ fontSize: "clamp(1.4rem, 3vw, 2.2rem)", color: "#f5f8f9", opacity: 0.8, lineHeight: 1.25 }}>
          Web a medida para tu negocio. Sin cuotas, sin intermediarios, sin plantillas.
        </h1>
        <p className="h-display max-w-4xl mb-2" style={{ color: "#f5f8f9" }}>
          <span className="md:hidden">Consigue </span><span className="max-md:lowercase">U</span>na web que
        </p>
        <div className="max-w-4xl mb-10" style={{ minHeight: '1.2em' }}>
          <span
            className="h-display block"
            style={{ color: "var(--verde-claro)" }}
          >
            <span className="hidden md:inline">{typed.slice(0, SCRAMBLE_DESKTOP_ONLY.length)}</span>
            {typed.slice(SCRAMBLE_DESKTOP_ONLY.length)}
          </span>
        </div>

        <div style={{ minHeight: '160px' }}>
          <div className="flex flex-wrap gap-2 mb-5" role="tablist">
            {PROFILES.map((p, idx) => (
              <button
                key={p.label}
                id={`perfil-tab-${idx}`}
                role="tab"
                aria-selected={profile === idx}
                aria-controls={`perfil-panel-${idx}`}
                onClick={() => setProfile(idx)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all border whitespace-normal text-left max-w-full"
                style={{
                  background: profile === idx ? "var(--verde)" : "transparent",
                  color: "#f5f8f9",
                  borderColor: profile === idx ? "var(--verde)" : "#f5f8f9",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          {PROFILES.map((p, idx) => (
            <p
              key={p.label}
              id={`perfil-panel-${idx}`}
              role="tabpanel"
              aria-labelledby={`perfil-tab-${idx}`}
              className={`max-w-3xl text-[17px] leading-relaxed${profile === idx ? "" : " hidden"}`}
              style={{ color: "rgba(245,248,249,0.8)" }}
            >
              {p.text}
            </p>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start mt-6 sm:mt-0">
          <a href="/#contacto" className="btn btn-primary">Hablemos →</a>
          <a href="/#proyectos" className="btn" style={{ background: "transparent", color: "#fff", border: "2px solid #fff" }}>Ver proyectos</a>
        </div>
      </div>
    </section>
  );
}
