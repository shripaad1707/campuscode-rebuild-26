import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

// ⌘K / Ctrl+K palette: jump anywhere, open any event, run quick actions.
export default function CommandPalette({ open, onClose, commands }) {
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const input = useRef(null);
  const list = useRef(null);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return commands;
    return commands
      .map(c => {
        const hay = `${c.label} ${c.hint || ''} ${c.group}`.toLowerCase();
        const score = hay.startsWith(t) ? 3 : c.label.toLowerCase().includes(t) ? 2 : t.split(' ').every(w => hay.includes(w)) ? 1 : 0;
        return { c, score };
      })
      .filter(r => r.score)
      .sort((a, b) => b.score - a.score)
      .map(r => r.c);
  }, [q, commands]);

  useEffect(() => {
    if (open) {
      setQ('');
      setI(0);
      setTimeout(() => input.current?.focus(), 30);
    }
  }, [open]);
  useEffect(() => setI(0), [q]);
  useEffect(() => {
    list.current?.querySelector(`[data-i="${i}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [i]);

  const run = c => {
    onClose();
    setTimeout(() => c.run(), 60);
  };

  const onKey = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setI(x => Math.min(x + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setI(x => Math.max(x - 1, 0)); }
    else if (e.key === 'Enter' && results[i]) { e.preventDefault(); run(results[i]); }
    else if (e.key === 'Escape') onClose();
  };

  let lastGroup = null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="cmdk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
          <motion.div
            className="cmdk__box"
            role="dialog"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={e => e.stopPropagation()}
          >
            <div className="cmdk__search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <input ref={input} value={q} onChange={e => setQ(e.target.value)} onKeyDown={onKey} placeholder="Search pages, events, actions…" aria-label="Search commands" />
              <kbd>Esc</kbd>
            </div>
            <div className="cmdk__list" ref={list}>
              {!results.length && <p className="cmdk__empty">No results for “{q}”</p>}
              {results.map((c, n) => {
                const head = c.group !== lastGroup ? (lastGroup = c.group) : null;
                return (
                  <div key={c.id}>
                    {head && <p className="label cmdk__group">{head}</p>}
                    <button data-i={n} className={`cmdk__item ${n === i ? 'is-on' : ''}`} onMouseMove={() => setI(n)} onClick={() => run(c)}>
                      <span className="cmdk__icon">{c.icon}</span>
                      <span className="cmdk__label">{c.label}</span>
                      {c.hint && <span className="cmdk__hint label">{c.hint}</span>}
                      {c.kbd && <kbd>{c.kbd}</kbd>}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="cmdk__foot label">
              <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
              <span><kbd>↵</kbd> open</span>
              <span><kbd>1</kbd><kbd>2</kbd><kbd>3</kbd> switch tabs</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
