import ScrollVelocity from '../components/rb/ScrollVelocity.jsx';

const WORDS = ['IDEAS', 'PEOPLE', 'PRODUCTS', 'INNOVATION', 'COMMUNITY'];

const Row = () => (
  <span className="marquee__row">
    {WORDS.map(w => (
      <span key={w} className="marquee__word">
        {w}
        <span className="marquee__star">✦</span>
      </span>
    ))}
  </span>
);

export default function Marquee() {
  return (
    <div className="marquee" aria-label="Ideas, people, products, innovation, community">
      <div className="marquee__band marquee__band--b" aria-hidden="true">
        <ScrollVelocity texts={[<Row key="b" />]} velocity={-30} numCopies={4} parallaxClassName="marquee__parallax" scrollerClassName="marquee__scroller" />
      </div>
      <div className="marquee__band marquee__band--a">
        <ScrollVelocity texts={[<Row key="a" />]} velocity={36} numCopies={4} skewWithVelocity={5} parallaxClassName="marquee__parallax" scrollerClassName="marquee__scroller" />
      </div>
    </div>
  );
}
