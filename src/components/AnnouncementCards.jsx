import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { announcementCards } from '../data.js';
import { ArrowRight } from './Icons.jsx';

gsap.registerPlugin(ScrollTrigger);

// Two side-by-side announcement cards. Each card's "video" is a CSS-animated
// placeholder — layered kraft-palette gradients drifting under the grain
// overlay (see .vcard__media in index.css). Swapping in real footage later is
// dropping a <video autoplay muted loop playsinline> inside .vcard__media —
// the rule at the bottom makes it fill the card, and the grain (::after)
// keeps painting on top.
//
// Scroll behaviour: the pair starts as an inset 1272px row (24px corners) and,
// as it rises toward the top of the viewport, expands into a full-viewport
// takeover — full-bleed width AND 100svh height, square corners — completing
// exactly when the section top reaches the viewport top, i.e. before the next
// section can enter; the gap between the cards stays constant. The section
// reserves the takeover height in CSS with the cards top-aligned (slack
// below, hero gap tight), so nothing below reflows mid-scrub.
// We drive a single --expand variable (0 -> 1) straight from ScrollTrigger's
// progress; the CSS interpolates the pair's width + height and each card's
// radius against it. Using self.progress (rather than a free-running tween)
// means the value is always tied to the real scroll position, so it can never
// get "stuck" expanded.
export default function AnnouncementCards() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Respect reduced-motion: leave the cards inset (their CSS default).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const setExpand = (p) => section.style.setProperty('--expand', p.toFixed(4));

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 10%',   // expansion begins ~4 wheel notches into the page
      end: 'top top',     // full takeover exactly as the section tops out
      onUpdate: (self) => setExpand(self.progress),
      onRefresh: (self) => setExpand(self.progress),
    });
    setExpand(st.progress);

    // Web fonts change layout heights, which shifts the trigger position —
    // recompute once they're ready and after full load.
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      st.kill();
    };
  }, []);

  return (
    <section className="feature-section" ref={sectionRef}>
      <div className="feature-pair">
        {announcementCards.map((card) => (
          <article className="vcard" key={card.eyebrow}>
            <div className={`vcard__media vcard__media--${card.variant}`} />
            <div className="vcard__overlay">
              <p className="vcard__eyebrow">{card.eyebrow}</p>
              <a className="btn" href={card.href}>{card.cta} <ArrowRight /></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
