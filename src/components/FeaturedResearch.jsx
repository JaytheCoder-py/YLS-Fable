import { researchPage } from '../data.js';

function Meta({ category, date }) {
  return (
    <p className="featured__meta">
      <span className="featured__cat">{category}</span>
      <span className="featured__date">{date}</span>
    </p>
  );
}

export default function FeaturedResearch() {
  const { main, side } = researchPage.featured;
  return (
    <section className="featured" aria-label="Featured research">
      <div className="container-page">
        <div className="featured__inner">
          <a className="featured__main" href={main.href}>
            <article>
              <div className="featured__media" aria-hidden="true" />
              <div className="featured__caption">
                <h3 className="featured__title">{main.title}</h3>
                <div>
                  <Meta category={main.category} date={main.date} />
                  <p className="featured__teaser">{main.teaser}</p>
                </div>
              </div>
            </article>
          </a>
          <div className="featured__side">
            {side.map((item) => (
              <a className="featured__item" href={item.href} key={item.title}>
                <article>
                  <Meta category={item.category} date={item.date} />
                  <h3 className="featured__item-title">{item.title}</h3>
                  <p className="featured__teaser">{item.teaser}</p>
                </article>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
