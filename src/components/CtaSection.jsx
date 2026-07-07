import { ctaSection } from '../data.js';

export default function CtaSection() {
  return (
    <section className="cta">
      <div className="container-page">
        <h2 className="cta__title">{ctaSection.title}</h2>
        <p className="cta__sub">{ctaSection.body}</p>
        <div className="cta__actions">
          <a className="cta__btn cta__btn--primary" href={ctaSection.primary.href}>
            {ctaSection.primary.label}
          </a>
          <a className="cta__btn cta__btn--secondary" href={ctaSection.secondary.href}>
            {ctaSection.secondary.label}
          </a>
        </div>
      </div>
    </section>
  );
}
