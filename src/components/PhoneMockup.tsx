import type { ReactNode } from "react";

export function PhoneMockup({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto glow-green" style={{ width: 280 }}>
      <div className="rounded-[2.5rem] p-3 shadow-2xl" style={{ background: "#0a0a0a" }}>
        <div className="rounded-[2rem] overflow-hidden relative" style={{ background: "#000", aspectRatio: "9/19.5" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default PhoneMockup;
