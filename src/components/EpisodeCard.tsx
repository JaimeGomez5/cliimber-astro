interface Props {
  num: string;
  sector: string;
  title: string;
  client: string;
  synopsis: string;
  stats: { value: string; label: string }[];
  href: string;
  emoji: string;
  bg: string;
  featured?: boolean;
  logoSrc?: string;
}

export function EpisodeCard({ num, sector, title, client, synopsis, stats, href, emoji, bg, featured, logoSrc }: Props) {
  return (
    <a href={href} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
    <article
      className="grid md:grid-cols-[280px_1fr] gap-0 rounded-2xl overflow-hidden border transition-all hover:scale-[1.005]"
      style={{ background: "var(--fondo-card)", borderColor: "var(--borde)", cursor: "pointer" }}
    >
      <div
        className="relative grid place-items-center min-h-[200px] md:min-h-full"
        style={{ background: logoSrc ? "#fff" : bg }}
      >
        {logoSrc ? (
          <img
            src={logoSrc}
            alt={client}
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: "16px", position: "absolute", inset: 0 }}
          />
        ) : (
          <>
            <div className="text-7xl">{emoji}</div>
            <button className="absolute w-14 h-14 rounded-full grid place-items-center text-white text-xl shadow-xl" style={{ background: "var(--verde)" }} aria-label="Play">
              ▶
            </button>
          </>
        )}
      </div>
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="tag">Ep. {num}</span>
          {featured && <span className="tag" style={{ background: "var(--verde-lima)", color: "var(--azul-oscuro)" }}>Destacado</span>}
        </div>
        <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--texto-apagado)" }}>{sector}</p>
        <h3 className="text-2xl md:text-3xl font-extrabold mb-2" style={{ color: "var(--texto-oscuro)" }}>{title}</h3>
        <p className="text-sm font-semibold mb-3" style={{ color: "var(--verde)" }}>{client}</p>
        <p className="text-[15px] leading-relaxed mb-5" style={{ color: "var(--texto-medio)" }}>{synopsis}</p>
        <div className="flex flex-wrap gap-4 mb-5">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-xl font-extrabold" style={{ color: "var(--verde)" }}>{s.value}</div>
              <div className="text-[11px] uppercase tracking-wider" style={{ color: "var(--texto-apagado)" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <span className="btn btn-primary text-sm">Ver caso →</span>
      </div>
    </article>
    </a>
  );
}

export default EpisodeCard;
