// Mock data — frontend only, no backend.
// Every event is a "pass". `joined` events show up in My Events.

export const TEAM_NAME = 'Team Inevitable'; // tracking team name

export const demoUser = {
  name: 'Shripaad Koduri',
  email: 'shripaad@campus.dev',
  role: 'Student',
  college: 'JNTU Hyderabad',
  year: '3rd year',
  team: TEAM_NAME,
  id: 'CC-26-0417'
};

// phase: live | open | upcoming | completed
export const events = [
  {
    id: 'rebuild-26',
    title: "ReBuild '26",
    tagline: 'Recreate on Friday. Rebuild on Saturday.',
    track: 'Web Development',
    phase: 'live',
    starts: '2026-11-06T08:00:00+05:30',
    ends: '2026-11-07T20:00:00+05:30',
    mode: 'Online',
    team: 'Solo',
    seats: 500,
    registered: 486,
    perk: 'Internship · ₹15,000 stipend',
    host: 'Team CampusCode',
    rounds: [
      { name: 'R1 · Recreate', state: 'done' },
      { name: 'R2 · Rebuild', state: 'live' },
      { name: 'R3 · Interview', state: 'next' }
    ],
    progress: 66,
    joined: true
  },
  {
    id: 'firstcommit-quiz',
    title: "FirstCommit '26 Quiz",
    tagline: 'Rapid-fire CS fundamentals for first-years.',
    track: 'Quiz',
    phase: 'upcoming',
    starts: '2026-11-14T18:00:00+05:30',
    ends: '2026-11-14T19:30:00+05:30',
    mode: 'Online',
    team: 'Solo',
    seats: 1000,
    registered: 742,
    perk: 'Certificates for top 50',
    host: 'CampusCode Clubs',
    rounds: [
      { name: 'Prelims', state: 'next' },
      { name: 'Finals', state: 'next' }
    ],
    progress: 10,
    joined: true
  },
  {
    id: 'firstcommit-quiz-2',
    title: "FirstCommit '26 Quiz 2.0",
    tagline: 'The rematch. Harder questions, faster clock.',
    track: 'Quiz',
    phase: 'completed',
    starts: '2026-10-28T18:00:00+05:30',
    ends: '2026-10-28T19:30:00+05:30',
    mode: 'Online',
    team: 'Solo',
    seats: 800,
    registered: 800,
    perk: 'Certificate issued',
    host: 'CampusCode Clubs',
    rounds: [
      { name: 'Prelims', state: 'done' },
      { name: 'Finals', state: 'done' }
    ],
    progress: 100,
    joined: true
  },
  {
    id: 'ai-innovation',
    title: 'AI Innovation Challenge',
    tagline: 'Build intelligent solutions for problems that matter.',
    track: 'AI',
    phase: 'open',
    starts: '2026-11-12T10:00:00+05:30',
    ends: '2026-11-13T18:00:00+05:30',
    mode: 'Hybrid · Chennai',
    team: '1–4',
    seats: 600,
    registered: 412,
    perk: '₹50,000 in prizes',
    host: 'IIT Madras E-Cell',
    rounds: [],
    progress: 0,
    joined: false
  },
  {
    id: 'future-web',
    title: 'Future Web Sprint',
    tagline: 'Design and ship the next generation of the web.',
    track: 'Web Development',
    phase: 'open',
    starts: '2026-11-15T09:00:00+05:30',
    ends: '2026-11-16T21:00:00+05:30',
    mode: 'Online',
    team: '1–3',
    seats: 400,
    registered: 268,
    perk: 'Swag + mentorship',
    host: 'GDG On Campus',
    rounds: [],
    progress: 0,
    joined: false
  },
  {
    id: 'campus-tech',
    title: 'Campus Tech Build',
    tagline: 'Create technology that makes student life better.',
    track: 'Smart Tech',
    phase: 'upcoming',
    starts: '2026-11-22T09:00:00+05:30',
    ends: '2026-11-23T17:00:00+05:30',
    mode: 'Offline · Hyderabad',
    team: '2–4',
    seats: 300,
    registered: 97,
    perk: 'Incubation shortlist',
    host: 'T-Hub Student Labs',
    rounds: [],
    progress: 0,
    joined: false
  },
  {
    id: 'design-jam',
    title: 'UI Design Jam',
    tagline: 'Twelve hours, one brief, your best interface.',
    track: 'Design',
    phase: 'open',
    starts: '2026-11-18T10:00:00+05:30',
    ends: '2026-11-18T22:00:00+05:30',
    mode: 'Online',
    team: '1–2',
    seats: 250,
    registered: 154,
    perk: 'Figma Pro for winners',
    host: 'Design Circle',
    rounds: [],
    progress: 0,
    joined: false
  },
  {
    id: 'green-code',
    title: 'Green Code Hack',
    tagline: 'Software that cuts energy, waste and carbon.',
    track: 'AI',
    phase: 'upcoming',
    starts: '2026-12-02T09:00:00+05:30',
    ends: '2026-12-03T18:00:00+05:30',
    mode: 'Online',
    team: '1–4',
    seats: 500,
    registered: 61,
    perk: '₹30,000 in prizes',
    host: 'Climate Collective',
    rounds: [],
    progress: 0,
    joined: false
  }
];

export const TRACKS = ['All', 'AI', 'Web Development', 'Design', 'Smart Tech', 'Quiz'];

export const notifications = [
  { id: 1, title: 'Round 2 is live', body: "ReBuild '26 · submit by 8:00 PM IST", time: '2h' },
  { id: 2, title: 'You were shortlisted', body: 'Top performers from Round 1 move on', time: '12h' },
  { id: 3, title: 'Certificate ready', body: "FirstCommit '26 Quiz 2.0", time: '6d' }
];

// Small helpers used across pages
export const fmtDate = iso =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }).toUpperCase();

export const fmtTime = iso =>
  new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();

export const PHASE_LABEL = {
  live: 'Live now',
  open: 'Registrations open',
  upcoming: 'Upcoming',
  completed: 'Completed'
};
