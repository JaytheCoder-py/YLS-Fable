import { useCasesHero } from '../useCasesData.js';
import WordReveal from './WordReveal.jsx';
import UseCasesExplorer from './UseCasesExplorer.jsx';

export default function UseCasesPage() {
  return (
    <>
      <section className="uc-hero">
        <div className="container-page">
          <div className="uc-hero__inner">
            <h1 className="uc-hero__title">
              <WordReveal>{useCasesHero.title}</WordReveal>
            </h1>
            <p className="uc-hero__sub">{useCasesHero.sub}</p>
          </div>
        </div>
      </section>
      <UseCasesExplorer />
    </>
  );
}
