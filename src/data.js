// Content data for the homepage — mirrors the live anthropic.com structure.

export const WORDMARK = 'ANTHROP\\C'; // rendered as ANTHROP\C

export const navLinks = [
  { label: 'Research', href: '#' },
  { label: 'Policy', href: '#' },
  { label: 'Commitments', href: '#', caret: true },
  { label: 'Learn', href: '#', caret: true },
  { label: 'News', href: '#' },
];

export const releases = [
  {
    title: 'Redeploying Fable 5',
    body: 'The export controls on Fable 5 and Mythos 5 have been lifted. Fable 5 will be available starting tomorrow, Wednesday, July 1, to users globally.',
    inlineLink: null,
    date: 'June 30, 2026',
    category: 'Announcements',
  },
  {
    title: 'Introducing Sonnet 5',
    body: 'Our most agentic Sonnet yet, with top tier intelligence for coding and everyday professional work.',
    inlineLink: { label: 'Model details', href: '#' },
    date: 'June 30, 2026',
    category: 'Announcements',
  },
  {
    title: 'Announcing Claude Science',
    body: 'Claude Science is a customizable app that integrates the tools and packages researchers most often use, produces auditable artifacts, and provides flexible access to computing resources.',
    inlineLink: null,
    date: 'June 30, 2026',
    category: 'Announcements',
  },
];

export const announcementCards = [
  { eyebrow: 'Announcing Fable 5', cta: 'Continue reading', href: '#', variant: 'a' },
  { eyebrow: 'Introducing Sonnet 5', cta: 'Model details', href: '#', variant: 'b' },
];

export const featuredLinks = [
  { name: 'Core views on AI safety', category: 'Announcements', href: '#' },
  { name: "Anthropic's Responsible Scaling Policy", category: 'Alignment Science', href: '#' },
  { name: 'Anthropic Academy: Build and Learn with Claude', category: 'Education', href: '#' },
  { name: "Anthropic's Economic Index", category: 'Economic Research', href: '#' },
  { name: "Claude's Constitution", category: 'Announcements', href: '#' },
];

export const ctaSection = {
  title: 'Ready to build with Claude?',
  body: 'Start with the Claude Developer Platform, or talk to our team about Claude for Enterprise.',
  primary: { label: 'Try Claude for free', href: '#' },
  secondary: { label: 'Talk to sales', href: '#' },
};

export const footerColumns = [
  {
    heading: 'Products',
    links: ['Claude', 'Claude Code', 'Claude Cowork', 'Claude Design', 'Claude Science', 'Claude Security', 'Pricing', 'Download app'],
  },
  { heading: 'Models', links: ['Mythos', 'Fable', 'Opus', 'Sonnet', 'Haiku'] },
  { heading: 'Solutions', links: ['AI agents', 'Coding', 'Customer support', 'Education', 'Financial services', 'Government', 'Healthcare'] },
  { heading: 'Claude Platform', links: ['Overview', 'Developer docs', 'Pricing', 'Ecosystem', 'Marketplace', 'Console login'] },
  { heading: 'Resources', links: ['Blog', 'Community', 'Connectors', 'Courses', 'Customer stories', 'Engineering', 'Events'] },
  { heading: 'Company', links: ['Anthropic', 'Careers', 'Policy', 'Research', 'News', 'Responsible Scaling Policy', 'Transparency'] },
];

export const footerLegal = [
  'Privacy policy',
  'Responsible disclosure policy',
  'Terms of service: Commercial',
  'Terms of service: Consumer',
  'Usage policy',
];

export const logoBanner = {
  eyebrow: 'Trusted by teams worldwide',
  logos: [
    { id: 'samsung', name: 'Samsung' },
    { id: 'dji', name: 'DJI' },
    { id: 'byd', name: 'BYD' },
    { id: 'xiaomi', name: 'Xiaomi' },
    { id: 'aima', name: 'AIMA' },
    { id: 'hyundai', name: 'Hyundai' },
  ],
};
