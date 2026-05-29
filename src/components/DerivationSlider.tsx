import { useState, useRef } from 'react';

const SLIDES = [
  { title: "Deriva un caso de nutrición", src: "/assets/deriva1.png", alt: "Sistema de derivación - Centro remisor" },
  { title: "Datos del tutor y paciente", src: "/assets/deriva2.png", alt: "Sistema de derivación - Datos del tutor" },
  { title: "Información clínica", src: "/assets/deriva3.png", alt: "Sistema de derivación - Información clínica" },
  { title: "Documentación adjunta", src: "/assets/deriva4.png", alt: "Sistema de derivación - Documentación adjunta" },
];

export default function DerivationSlider() {
  const [slide, setSlide] = useState(0);
  const touchStartX = useRef<number>(0);

  return (
    <div className="bg-white rounded-2xl border shadow-xl" style={{ borderColor: "var(--borde)" }}>
      <p className="text-xs font-bold uppercase tracking-widest px-6 pt-6 mb-3" style={{ color: "var(--verde)" }}>{SLIDES[slide].title}</p>
      <div
        style={{ position: "relative", overflow: "hidden", minHeight: 280 }}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (diff > 50) setSlide((slide + 1) % SLIDES.length);
          else if (diff < -50) setSlide((slide - 1 + SLIDES.length) % SLIDES.length);
        }}
      >
        <img
          src={SLIDES[slide].src}
          alt={SLIDES[slide].alt}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", position: "absolute", inset: 0, minHeight: 280 }}
        />
        <button
          onClick={() => setSlide((slide - 1 + SLIDES.length) % SLIDES.length)}
          aria-label="Anterior"
          style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", left: 12, background: "rgba(0,0,0,0.45)", color: "#fff", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >‹</button>
        <button
          onClick={() => setSlide((slide + 1) % SLIDES.length)}
          aria-label="Siguiente"
          style={{ position: "absolute", top: "50%", transform: "translateY(-50%)", right: 12, background: "rgba(0,0,0,0.45)", color: "#fff", border: "none", borderRadius: "50%", width: 36, height: 36, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >›</button>
      </div>
      <div className="flex justify-center gap-1.5 py-4">
        {SLIDES.map((_, i) => (
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
