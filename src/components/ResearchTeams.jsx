import { researchPage } from '../data.js';

export default function ResearchTeams() {
  return (
    <section className="teams" aria-label="Research teams">
      <div className="container-page">
        <div className="teams__inner">
          {researchPage.teams.map((t) => (
            <div className="teams__cell" key={t.name}>
              <h3 className="teams__name">{t.name}</h3>
              <p className="teams__body">{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
