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
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      a.playbackRate = speed;
      a.play();
      setPlaying(true);
    }
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
    <div className="max-w-md mx-auto rounded-2xl p-3 shadow-lg" style={{ background: "#dcf8c6" }}>
      <div className="flex items-center gap-3">
        <button
          className="w-10 h-10 rounded-full grid place-items-center text-white flex-shrink-0"
          style={{ background: "var(--verde)" }}
          aria-label={playing ? "Pausar" : "Reproducir"}
          onClick={toggle}
        >
          {playing ? "⏸" : "▶"}
        </button>
        <svg
          viewBox="0 0 200 32"
          className="flex-1 h-8"
          aria-label="Barra de progreso"
          style={{ cursor: src ? "pointer" : "default" }}
          onClick={seek}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <rect
              key={i}
              x={i * 5}
              y={16 - (Math.sin(i) * 8 + 8) / 2}
              width="2.5"
              height={Math.abs(Math.sin(i) * 8 + 8)}
              rx="1"
              fill="#0a5f4a"
              opacity={i / 40 < progress ? 1 : 0.4}
            />
          ))}
        </svg>
        <button
          onClick={cycleSpeed}
          className="px-1.5 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0"
          style={{ background: "var(--verde)", color: "#fff" }}
        >
          {speed}x
        </button>
      </div>
      <div className="text-[10px] mt-1 text-right" style={{ color: "var(--verde-hover)" }}>
        {fmt(currentTime)} / {duration ? fmt(duration) : "0:00"}
      </div>
    </div>
  );
}

export default VoiceNote;
