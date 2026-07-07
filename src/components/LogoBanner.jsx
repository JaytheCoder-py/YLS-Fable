import { logoBanner } from '../data.js';
import { LOGO_MARKS } from './LogoMarks.jsx';

// One half of the track must outspan the widest viewport we support, or the
// strip empties from the right as it scrolls. 6 reps × ~735px ≈ 4400px per
// half — safe past 4K. See the marquee notes in index.css.
const SET_REPEATS = 6;

function LogoSet() {
  return (
    <ul className="logos__set">
      {Array.from({ length: SET_REPEATS }, (_, rep) =>
        logoBanner.logos.map(({ id }) => {
          const Mark = LOGO_MARKS[id];
          return (
            <li key={`${rep}-${id}`} className="logos__item">
              <Mark />
            </li>
          );
        })
      )}
    </ul>
  );
}

export default function LogoBanner() {
  return (
    <section className="logos section" aria-label={logoBanner.eyebrow}>
      <div className="container-page">
        <p className="logos__eyebrow">{logoBanner.eyebrow}</p>
      </div>
      <ul className="u-sr-only">
        {logoBanner.logos.map(({ id, name }) => (
          <li key={id}>{name}</li>
        ))}
      </ul>
      <div className="logos__marquee" aria-hidden="true">
        <div className="logos__track">
          <LogoSet />
          <LogoSet />
        </div>
      </div>
    </section>
  );
}
