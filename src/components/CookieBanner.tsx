import { useEffect, useState } from "react";

const STORAGE_KEY = "cliimber_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) setVisible(true);
    } catch {
      // ignore
    }
  }, []);

  const save = (value: "all" | "necessary") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3 md:px-6 md:py-3"
      style={{ background: "#0f3347", color: "#ffffff" }}
      role="dialog"
      aria-label="Aviso de cookies"
    >
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 flex-wrap">
        <p className="text-sm leading-snug min-w-0 flex-1">
          Usamos cookies propias y de terceros para analítica y publicidad.{" "}
          <a
            href="/politica-de-cookies"
            className="underline font-medium"
            style={{ color: "#ffffff" }}
          >
            Ver política de cookies
          </a>
          .
        </p>
        <div className="flex flex-row flex-wrap gap-2 shrink-0">
          <button
            onClick={() => save("all")}
            className="px-3 py-1.5 rounded-md font-semibold text-xs transition-opacity hover:opacity-90"
            style={{ background: "var(--verde)", color: "#ffffff" }}
          >
            Aceptar todas
          </button>
          <button
            onClick={() => save("necessary")}
            className="px-3 py-1.5 rounded-md font-semibold text-xs transition-colors hover:bg-white/10"
            style={{
              background: "transparent",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.4)",
            }}
          >
            Solo necesarias
          </button>
        </div>
      </div>
    </div>
  );
}

export default CookieBanner;
