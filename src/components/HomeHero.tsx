import { useEffect, useState } from "react";
import ParticleNetwork from "./ParticleNetwork";

const SCRAMBLE_FINAL = "por fin trae clientes.";
const SCRAMBLE_CHARS = "#$%@&?!0123456789";

function useScramble(final: string, delay = 400, duration = 1500) {
  const [text, setText] = useState(() =>
    final
      .split("")
      .map((c) => (c === " " ? " " : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]))
      .join("")
  );
  useEffect(() => {
    let raf = 0;
    let start = 0;
    const len = final.length;
    const startTimer = setTimeout(() => {
      const step = (ts: number) => {
        if (!start) start = ts;
        const elapsed = ts - start;
        const progress = Math.min(elapsed / duration, 1);
        let out = "";
        for (let i = 0; i < len; i++) {
          const charProgress = progress * len - i;
          if (final[i] === " ") {
            out += " ";
          } else if (charProgress >= 1) {
            out += final[i];
          } else {
            out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
          }
        }
        setText(out);
        if (progress < 1) raf = requestAnimationFrame(step);
        else setText(final);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(raf);
    };
  }, [final, delay, duration]);
  return text;
}

const PROFILES = [
  { label: "Tengo web pero no funciona", text: "Llevas meses pagando sin saber qué están haciendo, y tu web sigue sin traer un solo cliente. El problema no es tu negocio. Es que nadie analizó tu negocio antes de construir." },
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
        <p className="h-display max-w-4xl mb-2" style={{ color: "#f5f8f9" }}>Una web que</p>
        <div className="max-w-4xl mb-10" style={{ minHeight: '3.5rem' }}>
          <span
            className="h-display block"
            style={{ color: "var(--verde-claro)" }}
          >
            {typed}
          </span>
        </div>

        <div style={{ minHeight: '160px' }}>
          <div className="flex flex-wrap gap-2 mb-5">
            {PROFILES.map((p, idx) => (
              <button
                key={p.label}
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
          <p className="max-w-3xl text-[17px] leading-relaxed" style={{ color: "rgba(245,248,249,0.8)" }}>{PROFILES[profile].text}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <a href="/#contacto" className="btn btn-primary">Hablemos →</a>
          <a href="/#proyectos" className="btn" style={{ background: "transparent", color: "#fff", border: "2px solid #fff" }}>Ver proyectos</a>
        </div>
      </div>
    </section>
  );
}
