import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from './Icons.jsx';

gsap.registerPlugin(ScrollTrigger);

// The live site plays a Sanity-hosted video behind this card. That CDN isn't
// redistributable, so we reproduce the kraft-paper tone (#f5e3c7) with a subtle
// grain overlay (see .feature::before in index.css).
//
// Scroll behaviour: the card starts as the inset 1272px card (24px corners) and,
// as it rises toward the top of the viewport, expands to a full-bleed band
// (square corners). We drive a single --expand variable (0 -> 1) straight from
// ScrollTrigger's progress; the CSS interpolates width + radius against it.
// Using self.progress (rather than a free-running tween) means the value is
// always tied to the real scroll position, so it can never get "stuck" expanded.
export default function FeatureCard() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Respect reduced-motion: leave the card inset (its CSS default).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const setExpand = (p) => section.style.setProperty('--expand', p.toFixed(4));

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top 40%',   // contained until the card is ~40% up the viewport
      end: 'top 8%',      // full-bleed as it reaches the top
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
      <div className="feature">
        <p className="feature__eyebrow">Announcing Fable 5</p>
        <p className="feature__desc">The next generation of intelligence.</p>
        <a className="btn" href="#">Continue reading <ArrowRight /></a>
      </div>
    </section>
  );
}
