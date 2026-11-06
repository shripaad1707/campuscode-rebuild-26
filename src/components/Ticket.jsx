// The core idea of this redesign: every card is a ticket / pass.
// A ticket = main part + stub, split by a dashed tear line with two notches.
// `vertical` puts the stub at the bottom instead of the right.
export default function Ticket({ children, stub, vertical = false, className = '', ...rest }) {
  return (
    <div className={`ticket ${vertical ? 'ticket--v' : ''} ${className}`} {...rest}>
      <div className="ticket__main">{children}</div>
      {stub && <div className="ticket__stub">{stub}</div>}
    </div>
  );
}
