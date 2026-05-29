import { useState, useRef } from 'react';

const LANDINGS = [
  { sector: "Hostelería", info: "G Hotel by JL · St Julian's · Boutique hotel", obj: "Reducir la fricción entre ver el hotel online y hacer la reserva. Tour 3D por cada tipo de habitación.", tools: ["Tour por habitación", "CTA reserva directa", "Room types con preview 3D"], emoji: "🏨", bg: "linear-gradient(135deg,#2a9770,#0a5f4a)", img: "/assets/jhotel.png", alt: "G Hotel Malta Virtual Experience" },
  { sector: "Inmobiliaria de lujo", info: "Mercury Tower · Full Floor · Zaha Hadid", obj: "Captar compradores internacionales de alto poder adquisitivo antes de que viajen a Malta para la visita presencial.", tools: ["Tour 3D embebido", "Stats de propiedad", "Formulario Secure Private Viewing"], emoji: "🏙️", bg: "linear-gradient(135deg,#1a4052,#0f3347)", img: "/assets/mercury.png", alt: "Mercury Tower Malta" },
  { sector: "Nightlife · Venue", info: "Tigullio Complex · Spinola Bay · 2.000 personas", obj: "Vender entradas y cerrar alquileres del venue para eventos privados.", tools: ["Tour por salas", "Agenda de eventos", "Formulario de alquiler"], emoji: "🎶", bg: "linear-gradient(135deg,#a8332d,#5a1a16)", img: "/assets/tigullio.png", alt: "Tigullio Complex Malta" },
  { sector: "Retail · Servicios", info: "The Blind Stag · St Julian's · Est. 2018", obj: "Captar citas online directamente y diferenciarse con una experiencia digital premium.", tools: ["Tour del local", "Menú de servicios", "Reserva en Fresha"], emoji: "💈", bg: "linear-gradient(135deg,#0d2838,#1a4052)", img: "/assets/dubliner.png", alt: "The Dubliner Malta" },
];

export default function LandingSlider() {
  const [slide, setSlide] = useState(0);
  const touchStartX = useRef<number>(0);
  const pk = LANDINGS[slide];

  return (
    <div>
      <div
        className="h-[260px] md:h-[520px] rounded-t-xl overflow-hidden relative"
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (diff > 50) setSlide((slide + 1) % LANDINGS.length);
          else if (diff < -50) setSlide((slide - 1 + LANDINGS.length) % LANDINGS.length);
        }}
      >
        <img
          src={pk.img}
          alt={pk.alt}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
        />
        <button
          onClick={() => setSlide((slide - 1 + LANDINGS.length) % LANDINGS.length)}
          aria-label="Anterior"
          style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: 16, background: "rgba(0,0,0,0.45)", color: "#fff", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >‹</button>
        <button
          onClick={() => setSlide((slide + 1) % LANDINGS.length)}
          aria-label="Siguiente"
          style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: 16, background: "rgba(0,0,0,0.45)", color: "#fff", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >›</button>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mt-6 p-6 bg-white rounded-2xl border" style={{ borderColor: "var(--borde)" }}>
        <div>
          <span className="tag mb-3">{pk.sector}</span>
          <p className="text-sm font-bold mt-3" style={{ color: "var(--texto-oscuro)" }}>Objetivo</p>
          <p className="text-sm mt-1" style={{ color: "var(--texto-medio)" }}>{pk.obj}</p>
        </div>
        <div>
          <p className="text-sm font-bold mb-2" style={{ color: "var(--texto-oscuro)" }}>Herramientas construidas</p>
          <ul className="space-y-1">
            {pk.tools.map((t) => (
              <li key={t} className="flex items-center gap-2 text-sm" style={{ color: "var(--texto-medio)" }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--verde)" }} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-center gap-2 mt-4">
        {LANDINGS.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className="rounded-full transition-all"
            style={{ background: i === slide ? "var(--verde)" : "var(--borde)", width: i === slide ? 20 : 8, height: 8 }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
