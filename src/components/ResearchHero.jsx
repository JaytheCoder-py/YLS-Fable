import WordReveal from './WordReveal.jsx';
import { researchPage } from '../data.js';

export default function ResearchHero() {
  return (
    <section className="rhero">
      <div className="container-page rhero__grid">
        <h1 className="rhero__title">
          <WordReveal>{researchPage.title}</WordReveal>
        </h1>
        <div>
          <p className="rhero__intro">{researchPage.intro}</p>
          <p className="rhero__teams">
            <span className="rhero__teams-label">{researchPage.teamsLabel}</span>
            {researchPage.teamLinks.map((t) => (
              <a key={t.label} className="rhero__team-link" href={t.href}>{t.label}</a>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
