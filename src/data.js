// Content data for the homepage and research page — mirrors the live anthropic.com structure.

export const WORDMARK = 'ANTHROP\\C'; // rendered as ANTHROP\C

export const navLinks = [
  { label: 'Research', href: '/research.html' },
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

// Content for the /research page — copy captured verbatim from
// anthropic.com/research (July 2026). Publications carry the 50 rows
// dated 2026 out of the live 149-item archive (deliberate cut).
export const researchPage = {
  title: 'Research',
  intro:
    'Our research teams investigate the safety, inner workings, and societal impacts of AI models—so that artificial intelligence has a positive impact as it becomes increasingly capable.',
  teamsLabel: 'Research teams:',
  teamLinks: [
    { label: 'Alignment', href: '#' },
    { label: 'Economic Research', href: '#' },
    { label: 'Interpretability', href: '#' },
    { label: 'Societal Impacts', href: '#' },
    { label: 'Frontier Red Team', href: '#' },
  ],
  teams: [
    {
      name: 'Interpretability',
      body: 'The mission of the Interpretability team is to understand how large language models work internally, as a foundation for AI safety and positive outcomes.',
    },
    {
      name: 'Alignment',
      body: 'The Alignment team works to understand the risks of AI models and develop ways to ensure that future ones remain helpful, honest, and harmless.',
    },
    {
      name: 'Societal Impacts',
      body: 'Working closely with the Anthropic Policy and Safeguards teams, Societal Impacts is a technical research team that explores how AI is used in the real world.',
    },
    {
      name: 'Frontier Red Team',
      body: 'The Frontier Red Team analyzes the implications of frontier AI models for cybersecurity, biosecurity, and autonomous systems.',
    },
  ],
  featured: {
    main: {
      category: 'Interpretability',
      date: 'Jul 6, 2026',
      title: 'A global workspace in language models',
      teaser:
        "New interpretability research reveals an emergent mental workspace in Claude that holds internal thoughts that don't appear in the model's output.",
      href: '#',
    },
    side: [
      {
        category: 'Economic Research',
        date: 'Jun 26, 2026',
        title: 'Anthropic Economic Index report: Cadences',
        teaser:
          "In our latest Economic Index report, we sample hourly for the first time to ask: When do people come to Claude? What do they produce with it? And how do they perceive AI's impact on their work?",
        href: '#',
      },
      {
        category: 'Alignment',
        date: 'May 8, 2026',
        title: 'Teaching Claude why',
        teaser: "New research on how we've reduced agentic misalignment.",
        href: '#',
      },
      {
        category: 'Research',
        date: 'Apr 24, 2026',
        title: 'Project Deal',
        teaser:
          "We created a marketplace for employees in our San Francisco office, with one big twist. We tasked Claude with buying, selling and negotiating on our colleagues' behalf.",
        href: '#',
      },
      {
        category: 'Societal Impacts',
        date: 'Mar 18, 2026',
        title: 'What 81,000 people want from AI',
        teaser:
          "We invited Claude.ai users to share how they use AI, what they dream it could make possible, and what they fear it might do. Nearly 81,000 people participated—the largest and most multilingual qualitative study of its kind. Here's what we found.",
        href: '#',
      },
    ],
  },
  publications: [
    { date: 'Jul 6, 2026', category: 'Interpretability', title: 'A global workspace in language models', href: '#' },
    { date: 'Jun 26, 2026', category: 'Economic Research', title: 'Anthropic Economic Index report: Cadences', href: '#' },
    { date: 'Jun 18, 2026', category: 'Frontier Red Team', title: 'Project Fetch: Phase two', href: '#' },
    { date: 'Jun 16, 2026', category: 'Economic Research', title: 'Agentic coding and persistent returns to expertise', href: '#' },
    { date: 'Jun 8, 2026', category: 'Science', title: 'Paving the way for agents in biology', href: '#' },
    { date: 'Jun 8, 2026', category: 'Frontier Red Team', title: "Measuring LLMs' impact on N-day exploits", href: '#' },
    { date: 'Jun 5, 2026', category: 'Science', title: 'Making Claude a chemist', href: '#' },
    { date: 'Jun 3, 2026', category: 'Frontier Red Team', title: 'Mapping AI-enabled cyber threats: Insights from the LLM ATT&CK Navigator', href: '#' },
    { date: 'Jun 3, 2026', category: 'Policy', title: "What we learned mapping a year's worth of AI-enabled cyber threats", href: '#' },
    { date: 'May 27, 2026', category: 'Economic Research', title: 'Coding agents in the social sciences', href: '#' },
    { date: 'May 22, 2026', category: 'Announcements', title: 'Project Glasswing: An initial update', href: '#' },
    { date: 'May 22, 2026', category: 'Frontier Red Team', title: "Measuring LLMs' ability to develop exploits", href: '#' },
    { date: 'May 14, 2026', category: 'Policy', title: '2028: Two scenarios for global AI leadership', href: '#' },
    { date: 'May 8, 2026', category: 'Alignment', title: 'Teaching Claude why', href: '#' },
    { date: 'May 7, 2026', category: 'Interpretability', title: "Natural Language Autoencoders: Turning Claude's thoughts into text", href: '#' },
    { date: 'May 7, 2026', category: 'Alignment', title: 'Donating our open-source alignment tool', href: '#' },
    { date: 'May 7, 2026', category: 'Policy', title: 'Focus areas for The Anthropic Institute', href: '#' },
    { date: 'Apr 30, 2026', category: 'Societal Impacts', title: 'How people ask Claude for personal guidance', href: '#' },
    { date: 'Apr 29, 2026', category: 'Science', title: "Evaluating Claude's bioinformatics research capabilities with BioMysteryBench", href: '#' },
    { date: 'Apr 22, 2026', category: 'Economic Research', title: 'Announcing the Anthropic Economic Index Survey', href: '#' },
    { date: 'Apr 22, 2026', category: 'Economic Research', title: 'What 81,000 people told us about the economics of AI', href: '#' },
    { date: 'Apr 14, 2026', category: 'Alignment', title: 'Automated Alignment Researchers: Using large language models to scale scalable oversight', href: '#' },
    { date: 'Apr 9, 2026', category: 'Policy', title: 'Trustworthy agents in practice', href: '#' },
    { date: 'Apr 7, 2026', category: 'Frontier Red Team', title: "Assessing Claude Mythos Preview's cybersecurity capabilities", href: '#' },
    { date: 'Apr 2, 2026', category: 'Interpretability', title: 'Emotion concepts and their function in a large language model', href: '#' },
    { date: 'Mar 31, 2026', category: 'Economic Research', title: 'How Australia Uses Claude: Findings from the Anthropic Economic Index', href: '#' },
    { date: 'Mar 24, 2026', category: 'Economic Research', title: 'Anthropic Economic Index report: Learning curves', href: '#' },
    { date: 'Mar 23, 2026', category: 'Science', title: 'Introducing our Science Blog', href: '#' },
    { date: 'Mar 23, 2026', category: 'Science', title: 'Long-running Claude for scientific computing', href: '#' },
    { date: 'Mar 23, 2026', category: 'Science', title: 'Vibe physics: The AI grad student', href: '#' },
    { date: 'Mar 13, 2026', category: 'Interpretability', title: 'A "diff" tool for AI: Finding behavioral differences in new models', href: '#' },
    { date: 'Mar 6, 2026', category: 'Policy', title: "Partnering with Mozilla to improve Firefox's security", href: '#' },
    { date: 'Mar 6, 2026', category: 'Frontier Red Team', title: "Reverse engineering Claude's CVE-2026-2796 exploit", href: '#' },
    { date: 'Mar 5, 2026', category: 'Economic Research', title: 'Labor market impacts of AI: A new measure and early evidence', href: '#' },
    { date: 'Feb 25, 2026', category: 'Alignment', title: 'An update on our model deprecation commitments for Claude Opus 3', href: '#' },
    { date: 'Feb 23, 2026', category: 'Alignment', title: 'The persona selection model', href: '#' },
    { date: 'Feb 23, 2026', category: 'Announcements', title: 'Anthropic Education Report: The AI Fluency Index', href: '#' },
    { date: 'Feb 18, 2026', category: 'Societal Impacts', title: 'Measuring AI agent autonomy in practice', href: '#' },
    { date: 'Feb 16, 2026', category: 'Economic Research', title: 'India Country Brief: The Anthropic Economic Index', href: '#' },
    { date: 'Feb 5, 2026', category: 'Frontier Red Team', title: 'Evaluating and mitigating the growing risk of LLM-discovered 0-days', href: '#' },
    { date: 'Jan 29, 2026', category: 'Alignment', title: 'How AI assistance impacts the formation of coding skills', href: '#' },
    { date: 'Jan 28, 2026', category: 'Alignment', title: 'Disempowerment patterns in real-world AI usage', href: '#' },
    { date: 'Jan 22, 2026', category: 'Announcements', title: "Claude's new constitution", href: '#' },
    { date: 'Jan 19, 2026', category: 'Interpretability', title: 'The assistant axis: situating and stabilizing the character of large language models', href: '#' },
    { date: 'Jan 16, 2026', category: 'Frontier Red Team', title: 'AI models are showing a greater ability to find and exploit vulnerabilities on realistic cyber ranges', href: '#' },
    { date: 'Jan 15, 2026', category: 'Economic Research', title: 'Anthropic Economic Index: New building blocks for understanding AI use', href: '#' },
    { date: 'Jan 15, 2026', category: 'Economic Research', title: 'Anthropic Economic Index report: Economic primitives', href: '#' },
    { date: 'Jan 14, 2026', category: 'Frontier Red Team', title: 'Finding bugs across the Python ecosystem with Claude and property-based testing', href: '#' },
    { date: 'Jan 9, 2026', category: 'Alignment', title: 'Next-generation Constitutional Classifiers: More efficient protection against universal jailbreaks', href: '#' },
    { date: 'Jan 8, 2026', category: 'Frontier Red Team', title: 'Experimenting with AI to defend critical infrastructure', href: '#' },
  ],
  join: {
    title: 'Join the Research team',
    cta: { label: 'See open roles', href: '#' },
  },
};
