import WordReveal from './WordReveal.jsx';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container-page hero__grid">
        <h1 className="hero__title">
          <WordReveal>
            AI <a href="#">research</a> and <a href="#">products</a> that put safety at the frontier
          </WordReveal>
        </h1>
        <p className="hero__sub">
          AI will have a vast impact on the world. Anthropic is a public benefit corporation
          dedicated to securing its benefits and mitigating its risks.
        </p>
      </div>
    </section>
  );
}
