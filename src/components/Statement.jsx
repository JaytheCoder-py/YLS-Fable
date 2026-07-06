import { featuredLinks } from '../data.js';

export default function Statement() {
  return (
    <section className="container-page section">
      <div className="statement">
        <h2 className="statement__lead">
          At Anthropic, we build AI to serve humanity&rsquo;s long-term well-being.
        </h2>
        <div className="linklist">
          {featuredLinks.map((l) => (
            <a key={l.name} className="linklist__row" href={l.href}>
              <span className="linklist__name">{l.name}</span>
              <span className="linklist__cat">{l.category}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
