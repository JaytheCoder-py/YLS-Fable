import { Children, cloneElement, isValidElement, useEffect, useMemo, useRef } from 'react';

// Staggered word reveal replicating the live anthropic.com hero effect
// (constants measured from the site's inline script, July 2026): each word
// starts at opacity 0 / translateY(24px) and transitions in over 800ms
// (expo-out) after a random 100-500ms delay, so words surface in random
// order rather than left-to-right. The intact sentence lives in a
// .u-sr-only copy for screen readers; the split copy is aria-hidden and
// its link clones are unfocusable, so nothing is announced or tabbed twice
// (the live site skips this and double-exposes the text).
const MIN_DELAY = 100;
const MAX_DELAY = 500;
const THRESHOLD = 0.2;

const randomDelay = () =>
  `${Math.round(Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY)}ms`;

function splitNode(node, key) {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
      .split(/(\s+)/)
      .filter(Boolean)
      .map((part, i) =>
        /\s/.test(part) ? (
          <span key={`${key}-${i}`} className="animate-space">{part}</span>
        ) : (
          <span
            key={`${key}-${i}`}
            className="animate-word"
            style={{ transitionDelay: randomDelay() }}
          >
            {part}
          </span>
        )
      );
  }
  if (isValidElement(node)) {
    const unfocus = node.type === 'a' ? { tabIndex: -1 } : {};
    return cloneElement(
      node,
      { key, ...unfocus },
      Children.map(node.props.children, (child, i) => splitNode(child, `${key}-${i}`))
    );
  }
  return node;
}

export default function WordReveal({ children }) {
  const ref = useRef(null);
  const split = useMemo(
    () => Children.map(children, (child, i) => splitNode(child, `w${i}`)),
    [children]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          requestAnimationFrame(() => el.classList.add('is-revealed'));
          observer.disconnect();
        });
      },
      { threshold: THRESHOLD }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span className="word-reveal" ref={ref}>
      <span className="u-sr-only">{children}</span>
      <span aria-hidden="true">{split}</span>
    </span>
  );
}
