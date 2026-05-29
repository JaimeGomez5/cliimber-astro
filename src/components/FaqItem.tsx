import { useState } from "react";

export function FaqItem({ question, answer, highlight, dark }: { question: string; answer: string; highlight?: string; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const borderColor = dark ? "rgba(255,255,255,0.15)" : "var(--borde)";
  const qColor = dark ? "#f5f8f9" : "var(--texto-oscuro)";
  const aColor = dark ? "#7a8e96" : "var(--texto-medio)";
  return (
    <div className="border-b" style={{ borderColor }}>
      <button
        className="w-full flex justify-between items-center gap-4 py-5 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-semibold text-[16px]" style={{ color: qColor }}>{question}</span>
        <span className="text-xl flex-shrink-0 transition-transform" style={{ color: "var(--verde-claro)", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <p className="text-[15px] leading-relaxed" style={{ color: aColor }}>{answer}</p>
          {highlight && (
            <p className="mt-3 text-[14px] leading-relaxed p-3 rounded-lg border-l-4" style={{ background: dark ? "rgba(42,151,112,0.12)" : "var(--verde-fondo)", borderColor: "var(--verde)", color: dark ? "#f5f8f9" : "var(--texto-oscuro)" }}>
              {highlight}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FaqItem;
