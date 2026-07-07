// Shared inline SVG icons — mono, currentColor, consistent weight.

export const ArrowRight = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Caret = (props) => (
  <svg viewBox="0 0 10 6" fill="none" aria-hidden="true" {...props}>
    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Menu = (props) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const LinkedIn = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 8.98h4v12H3v-12zM10 8.98h3.8v1.64h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1v6.32h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96v5.7H10v-12z" />
  </svg>
);

export const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.24 2h3.3l-7.2 8.23L22.5 22h-6.6l-5.17-6.76L4.8 22H1.5l7.7-8.8L1.2 2h6.77l4.67 6.18L18.24 2zm-1.16 18h1.83L7.02 3.9H5.06L17.08 20z" />
  </svg>
);

export const YouTube = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M23.5 6.2a3 3 0 00-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 00.5 6.2 31 31 0 000 12a31 31 0 00.5 5.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-5.8zM9.6 15.5v-7l6.3 3.5-6.3 3.5z" />
  </svg>
);

/* Use-cases page — toolbar and chip icons */

export const SearchIcon = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const ViewGrid = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
    <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export const ViewList = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <circle cx="2.8" cy="4" r="1" fill="currentColor" />
    <circle cx="2.8" cy="8" r="1" fill="currentColor" />
    <circle cx="2.8" cy="12" r="1" fill="currentColor" />
    <path d="M6 4h8M6 8h8M6 12h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const CheckMark = (props) => (
  <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" {...props}>
    <path d="M2 6.2l2.6 2.6L10 3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const PenNib = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <path d="M9.5 2.5l4 4L6 14H2v-4l7.5-7.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M8 4l4 4" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const GradCap = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <path d="M1.5 6L8 3l6.5 3L8 9 1.5 6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M4 7.5V11c0 .8 1.8 1.8 4 1.8s4-1 4-1.8V7.5" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const ChartBars = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <path d="M2.5 13.5v-4M6.5 13.5v-7M10.5 13.5v-5M14 13.5v-9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const HeartIcon = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <path d="M8 13.5S2 10 2 5.9C2 4 3.5 2.8 5 2.8c1.2 0 2.4.6 3 1.8.6-1.2 1.8-1.8 3-1.8 1.5 0 3 1.2 3 3.1C14 10 8 13.5 8 13.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

export const SquaresOverlap = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <rect x="2" y="2" width="8.5" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M13.8 5.8v6.2a1.8 1.8 0 01-1.8 1.8H5.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const SparkleIcon = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <path d="M8 1.8l1.5 4.3L14 8l-4.5 1.9L8 14.2 6.5 9.9 2 8l4.5-1.9L8 1.8z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

export const PersonIcon = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <circle cx="8" cy="5" r="2.8" stroke="currentColor" strokeWidth="1.2" />
    <path d="M2.8 13.8c.7-2.4 2.8-3.8 5.2-3.8s4.5 1.4 5.2 3.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const ScaleIcon = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <path d="M8 2.5v11M4 13.5h8M3.5 4.5h9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M3.5 4.5L1.8 9a1.9 1.9 0 003.4 0L3.5 4.5zM12.5 4.5L10.8 9a1.9 1.9 0 003.4 0l-1.7-4.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

export const FlaskIcon = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <path d="M6.2 2h3.6M6.8 2v4.2L2.9 12a1.6 1.6 0 001.4 2.5h7.4a1.6 1.6 0 001.4-2.5L9.2 6.2V2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.8 9.5h6.4" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const TagIcon = (props) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
    <path d="M2 2.8a.8.8 0 01.8-.8h4.4c.2 0 .4.1.6.2l6 6a.8.8 0 010 1.2l-4.4 4.4a.8.8 0 01-1.2 0l-6-6a.8.8 0 01-.2-.6V2.8z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <circle cx="5.2" cy="5.2" r="1" fill="currentColor" />
  </svg>
);
