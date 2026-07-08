import { researchPage } from '../data.js';
import { ArrowRight } from './Icons.jsx';

export default function JoinCta() {
  return (
    <section className="joincta">
      <div className="container-page">
        <h2 className="joincta__title">{researchPage.join.title}</h2>
        <a className="joincta__btn" href={researchPage.join.cta.href}>
          {researchPage.join.cta.label} <ArrowRight />
        </a>
      </div>
    </section>
  );
}
