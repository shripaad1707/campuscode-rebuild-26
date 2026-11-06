import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';

// Airport "split-flap" text: letters shuffle, then settle left → right
// once the row scrolls into view.
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export default function FlapText({ text, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [shown, setShown] = useState(text.replace(/[^ ]/g, '·'));

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(text);
      return;
    }
    let frame = 0;
    let timer;
    const start = setTimeout(() => {
      timer = setInterval(() => {
        frame++;
        const settled = Math.floor(frame / 2); // how many letters are final
        setShown(
          [...text]
            .map((ch, i) => (ch === ' ' || i < settled ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]))
            .join('')
        );
        if (settled >= text.length) clearInterval(timer);
      }, 28);
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [inView, text, delay]);

  return (
    <span ref={ref} className="flap" aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
