import { useEffect, useState } from 'react';

// Returns { d, h, m, s, done } counting down to `target` (ISO string). Ticks every second.
export default function useCountdown(target) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  const pad = v => String(v).padStart(2, '0');
  return {
    d: Math.floor(diff / 86400000),
    h: pad(Math.floor(diff / 3600000) % 24),
    m: pad(Math.floor(diff / 60000) % 60),
    s: pad(Math.floor(diff / 1000) % 60),
    done: diff === 0
  };
}
