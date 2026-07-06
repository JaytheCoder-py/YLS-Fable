import { releases } from '../data.js';
import { ArrowRight } from './Icons.jsx';

function ReleaseCard({ title, body, inlineLink, date, category }) {
  return (
    <article className="rcard">
      <h3 className="rcard__title">{title}</h3>
      <p className="rcard__body">{body}</p>
      {inlineLink && (
        <a className="rcard__link" href={inlineLink.href}>
          {inlineLink.label} <ArrowRight />
        </a>
      )}
      <div className="rcard__spacer" />
      <div className="rcard__meta">
        <div className="rcard__row">
          <span className="rcard__label">Date</span>
          <span className="rcard__value">{date}</span>
        </div>
        <div className="rcard__row">
          <span className="rcard__label">Category</span>
          <span className="rcard__value">{category}</span>
        </div>
      </div>
      <a className="btn rcard__cta" href="#">Read announcement <ArrowRight /></a>
    </article>
  );
}

export default function LatestReleases() {
  return (
    <section className="container-page section">
      <h2 className="section__title">Latest releases</h2>
      <div className="releases">
        {releases.map((r) => (
          <ReleaseCard key={r.title} {...r} />
        ))}
      </div>
    </section>
  );
}
