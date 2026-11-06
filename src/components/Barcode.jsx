// Decorative barcode: bar widths come from the characters of `value`,
// so every pass gets its own (stable) pattern.
export default function Barcode({ value = 'CAMPUSCODE', height = 44, vertical = false }) {
  const bars = [];
  let x = 0;
  for (let i = 0; i < 34; i++) {
    const code = value.charCodeAt(i % value.length) + i * 7;
    const w = 1 + (code % 3); // 1–3 px bar
    if (i % 2 === 0) bars.push(<rect key={i} x={x} y="0" width={w} height={height} />);
    x += w + 1;
  }
  return (
    <svg
      className={`barcode ${vertical ? 'barcode--v' : ''}`}
      viewBox={`0 0 ${x} ${height}`}
      width={x}
      height={height}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {bars}
    </svg>
  );
}
