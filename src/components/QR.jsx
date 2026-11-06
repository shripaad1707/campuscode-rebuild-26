// A QR-style pattern for the Digital ID (decorative, not scannable).
// 3 corner "finder" squares + a grid of cells switched on by a simple hash.
export default function QR({ value = 'CC', size = 96 }) {
  const n = 21;
  let seed = [...value].reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const inFinder = (r, c) => (r < 7 && c < 7) || (r < 7 && c > n - 8) || (r > n - 8 && c < 7);
  const cells = [];
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (!inFinder(r, c) && rand() > 0.52) cells.push(<rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" />);
  const finder = (x, y) => (
    <g key={`${x}${y}`}>
      <rect x={x} y={y} width="7" height="7" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" />
    </g>
  );
  return (
    <svg className="qr" viewBox={`0 0 ${n} ${n}`} width={size} height={size} shapeRendering="crispEdges" aria-label="Digital ID QR code" role="img">
      {cells}
      {finder(0, 0)}
      {finder(n - 7, 0)}
      {finder(0, n - 7)}
    </svg>
  );
}
