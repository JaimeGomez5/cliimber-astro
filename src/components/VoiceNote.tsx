import { useRef, useState } from "react";

const SPEEDS = [1, 1.5, 2] as const;
type Speed = (typeof SPEEDS)[number];

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
}

export function VoiceNote({ src }: { src?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState<Speed>(1);

  function getAudio() {
    if (!audioRef.current) {
      const a = new Audio(src);
      a.onended = () => { setPlaying(false); setProgress(0); setCurrentTime(0); };
      a.ontimeupdate = () => {
        setCurrentTime(a.currentTime);
        setProgress(a.duration ? a.currentTime / a.duration : 0);
      };
      a.onloadedmetadata = () => setDuration(a.duration);
      audioRef.current = a;
    }
    return audioRef.current;
  }

  function toggle() {
    if (!src) return;
    const a = getAudio();
    if (playing) { a.pause(); setPlaying(false); }
    else { a.playbackRate = speed; a.play(); setPlaying(true); }
  }

  function seek(e: React.MouseEvent<SVGSVGElement>) {
    if (!src) return;
    const a = getAudio();
    const rect = e.currentTarget.getBoundingClientRect();
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (a.duration) a.currentTime = fraction * a.duration;
    setProgress(fraction);
  }

  function cycleSpeed() {
    const next = SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length];
    setSpeed(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }

  return (
    <div className="max-w-md mx-auto">
      <div
        className="rounded-2xl rounded-br-sm p-3 shadow-md flex items-center gap-3"
        style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}
      >
        {/* Play/pause */}
        <button
          className="w-10 h-10 rounded-full grid place-items-center text-white flex-shrink-0"
          style={{ background: playing ? "#128C7E" : "#25D366" }}
          aria-label={playing ? "Pausar" : "Reproducir"}
          onClick={toggle}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
              <rect x="1" y="1" width="4" height="12" rx="1"/>
              <rect x="9" y="1" width="4" height="12" rx="1"/>
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
              <path d="M3 1.5l9 5.5-9 5.5z"/>
            </svg>
          )}
        </button>

        {/* Waveform */}
        <svg
          viewBox="0 0 200 32"
          className="flex-1 h-8"
          style={{ cursor: src ? "pointer" : "default" }}
          onClick={seek}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <rect
              key={i}
              x={i * 5}
              y={16 - (Math.abs(Math.sin(i * 0.8)) * 10 + 3) / 2}
              width="3"
              height={Math.abs(Math.sin(i * 0.8)) * 10 + 3}
              rx="1.5"
              fill={i / 40 < progress ? "#128C7E" : "#CBD5E1"}
            />
          ))}
        </svg>

        {/* Derecha: foto o velocidad */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          {playing ? (
            <button
              onClick={cycleSpeed}
              className="w-10 h-10 rounded-full grid place-items-center font-bold text-sm"
              style={{ background: "#25D366", color: "#fff" }}
            >
              {speed}x
            </button>
          ) : (
            <img
              src="/assets/jaime.jpeg"
              alt="Jaime"
              className="w-10 h-10 rounded-full object-cover"
              style={{ border: "2px solid #e5e7eb" }}
            />
          )}
          <span className="text-[10px]" style={{ color: "#94A3B8" }}>
            {playing ? fmt(currentTime) : duration ? fmt(duration) : "0:00"}
          </span>
        </div>
      </div>
    </div>
  );
}
