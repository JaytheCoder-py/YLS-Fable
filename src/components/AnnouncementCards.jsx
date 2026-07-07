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
// Scroll behaviour: the pair starts as an inset 1272px row and expands into a
// full-viewport takeover — full-bleed width AND 100svh height, square corners
// — with the gap between the cards constant. The section reserves the
// takeover height in CSS with the cards top-aligned (slack below, hero gap
// tight), so nothing below reflows mid-scrub.
//
// The card copy does NOT live inside the cards: it sits in .feature-overlay,
// a sibling layer frozen at the pair's initial inset geometry, so the text
// rides normal page scroll while the cards grow underneath it.
export default function AnnouncementCards() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Respect reduced-motion: leave the cards inset (their CSS default).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // One mouse-wheel notch scrolls ~100px in desktop browsers, so the
    // takeover plays across wheel notches 3-5: scrollY 200px -> 500px.
    // Absolute offsets — font/layout shifts can't move the trigger, so no
    // refresh-after-fonts plumbing is needed. sine.inOut hands the middle
    // notch (the 4th) half of the expansion and softens both ends; scrub
    // smooths the steps between wheel events while keeping --expand pinned
    // to the real scroll position, so it can never get stuck expanded.
    const WHEEL_PX = 100;
    const tween = gsap.fromTo(
      section,
      { '--expand': 0 },
      {
        '--expand': 1,
        ease: 'sine.inOut',
        scrollTrigger: {
          start: 2 * WHEEL_PX,
          end: 5 * WHEEL_PX,
          scrub: 0.4,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section className="feature-section" ref={sectionRef}>
      <div className="feature-pair" aria-hidden="true">
        {announcementCards.map((card) => (
          <div className="vcard" key={card.eyebrow}>
            <div className={`vcard__media vcard__media--${card.variant}`} />
          </div>
        ))}
      </div>
      <div className="feature-overlay">
        {announcementCards.map((card) => (
          <article className="feature-overlay__cell" key={card.eyebrow}>
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
