// CampusCode delivery truck: drives an idea along the route and parks at SHIPPED.
export default function Truck() {
  return (
    <span className="truck" aria-hidden="true">
      <span className="truck__puff truck__puff--1" />
      <span className="truck__puff truck__puff--2" />
      <svg className="truck__svg" viewBox="0 0 100 46" width="100" height="46">
        <g className="truck__body">
          {/* cargo box */}
          <rect x="3" y="3" width="58" height="29" rx="3" fill="#ffffff" stroke="#111111" strokeWidth="2" />
          {/* brand stripes, like the /// in the logo */}
          <path d="M12 27 L18 8 H23 L17 27 Z" fill="#7665ff" />
          <path d="M21 27 L27 8 H32 L26 27 Z" fill="#7665ff" />
          <path d="M30 27 L36 8 H41 L35 27 Z" fill="#a8e62e" />
          <text x="44" y="15" fontFamily="DM Mono, monospace" fontSize="5.4" fill="#111111" letterSpacing="0.3">CC</text>
          <text x="44" y="22" fontFamily="DM Mono, monospace" fontSize="4.2" fill="#6b6b66" letterSpacing="0.2">'26</text>
          {/* cab */}
          <path d="M61 12 H80 L93 25 V33 H61 Z" fill="#7665ff" stroke="#111111" strokeWidth="2" strokeLinejoin="round" />
          <path d="M66 16 H78 L86 24 H66 Z" fill="#f7f7f4" stroke="#111111" strokeWidth="1.5" strokeLinejoin="round" />
          <rect x="89" y="26" width="4" height="3" rx="1" fill="#a8e62e" />
          {/* chassis */}
          <rect x="2" y="32" width="94" height="3.2" rx="1.6" fill="#111111" />
        </g>
        {/* wheels */}
        {[22, 76].map(cx => (
          <g key={cx} className="truck__wheel" style={{ transformOrigin: `${cx}px 37px` }}>
            <circle cx={cx} cy="37" r="7.2" fill="#111111" />
            <circle cx={cx} cy="37" r="3.2" fill="#ffffff" />
            <rect x={cx - 0.9} y="30.5" width="1.8" height="3.4" fill="#a8e62e" />
          </g>
        ))}
      </svg>
    </span>
  );
}
