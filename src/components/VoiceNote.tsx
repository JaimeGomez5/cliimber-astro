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
  const [speed, setSpeed] = useState<Speed>(1);

  function getAudio() {
    if (!audioRef.current) {
      const a = new Audio(src);
      a.onended = () => { setPlaying(false); setProgress(0); setCurrentTime(0); };
      a.ontimeupdate = () => {
        setCurrentTime(a.currentTime);
        setProgress(a.duration ? a.currentTime / a.duration : 0);
      };
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

  const DOT_X = progress * 200;

  return (
    <div className="max-w-md mx-auto flex items-center gap-2">
      {/* Bubble */}
      <div
        className="flex-1 rounded-2xl rounded-bl-sm px-3 pt-3 pb-2 shadow-sm"
        style={{ background: "#ffffff", border: "1px solid #f0f0f0" }}
      >
        <div className="flex items-center gap-2">
          {/* Play/pause — no circle, just icon */}
          <button
            className="flex-shrink-0 flex items-center justify-center"
            style={{ width: 28, height: 28 }}
            aria-label={playing ? "Pausar" : "Reproducir"}
            onClick={toggle}
          >
            {playing ? (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="4" y="3" width="5" height="16" rx="1.5" fill="#54656F"/>
                <rect x="13" y="3" width="5" height="16" rx="1.5" fill="#54656F"/>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M5 3.5l14 7.5-14 7.5z" fill="#54656F"/>
              </svg>
            )}
          </button>

          {/* Waveform + dot */}
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
                fill={i / 40 < progress ? "#53BDEB" : "#C4C4C4"}
              />
            ))}
            {progress > 0 && (
              <circle cx={Math.min(DOT_X, 198)} cy="16" r="5" fill="#53BDEB" />
            )}
          </svg>

          {/* Speed pill — only while playing */}
          {playing && (
            <button
              onClick={cycleSpeed}
              className="flex-shrink-0 font-bold text-[11px] px-2 py-0.5 rounded-full"
              style={{ background: "#717D85", color: "#fff", minWidth: 36 }}
            >
              {speed}x
            </button>
          )}
        </div>

        {/* Current time bottom-left */}
        <div className="text-[10px] mt-0.5 ml-8" style={{ color: "#8696A0" }}>
          {fmt(currentTime)}
        </div>
      </div>

      {/* Profile photo with mic overlay */}
      <div className="relative flex-shrink-0">
        <img
          src="/assets/jaime.jpeg"
          alt="Jaime"
          className="rounded-full object-cover"
          style={{ width: 44, height: 44 }}
        />
        <div
          className="absolute bottom-0 right-0 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: "#8696A0" }}
        >
          <svg width="9" height="9" viewBox="0 0 24 24" fill="white">
            <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
            <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default VoiceNote;
