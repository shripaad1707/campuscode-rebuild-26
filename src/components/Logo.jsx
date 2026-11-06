// Official CampusCode mark (the exact PNG from the rules pack) + wordmark.
export default function Logo({ href = '#/' }) {
  return (
    <a href={href} className="logo" aria-label="CampusCode home">
      <img src="/campuscode-logo.png" alt="" width="29" height="24" />
      <span className="logo__type">
        <strong>CAMPUSCODE</strong>
        <small>HACKATHON ARENA</small>
      </span>
    </a>
  );
}
