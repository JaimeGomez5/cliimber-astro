import type { ReactNode } from "react";

export function BrowserMockup({ children, url = "cliimber.com" }: { children: ReactNode; url?: string }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl border" style={{ borderColor: "var(--borde-oscuro)" }}>
      <div className="flex items-center gap-2 px-4 py-3" style={{ background: "#1c2a35" }}>
        <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
        <span className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
        <div className="ml-3 flex-1 px-3 py-1 rounded text-xs" style={{ background: "#0f1a22", color: "var(--texto-apagado)" }}>{url}</div>
      </div>
      <div style={{ background: "#000" }}>{children}</div>
    </div>
  );
}

export default BrowserMockup;
