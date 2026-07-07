import { logoBanner } from '../data.js';
import { LOGO_MARKS } from './LogoMarks.jsx';

function LogoSet({ hidden = false }) {
  return (
    <ul className="logos__set" aria-hidden={hidden || undefined}>
      {logoBanner.logos.map(({ id, name }) => {
        const Mark = LOGO_MARKS[id];
        return (
          <li key={id} className="logos__item">
            <span className="u-sr-only">{name}</span>
            <Mark />
          </li>
        );
      })}
    </ul>
  );
}

export default function LogoBanner() {
  return (
    <section className="logos section" aria-label={logoBanner.eyebrow}>
      <div className="container-page">
        <p className="logos__eyebrow">{logoBanner.eyebrow}</p>
      </div>
      <div className="logos__marquee">
        <div className="logos__track">
          <LogoSet />
          <LogoSet hidden />
        </div>
      </div>
    </section>
  );
}
