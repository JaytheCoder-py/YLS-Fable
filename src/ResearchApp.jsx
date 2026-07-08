import Nav from './components/Nav.jsx';
import ResearchHero from './components/ResearchHero.jsx';
import ResearchTeams from './components/ResearchTeams.jsx';
import FeaturedResearch from './components/FeaturedResearch.jsx';
import Publications from './components/Publications.jsx';
import JoinCta from './components/JoinCta.jsx';
import Footer from './components/Footer.jsx';

export default function ResearchApp() {
  return (
    <>
      <Nav />
      <main id="main">
        <ResearchHero />
        <ResearchTeams />
        <FeaturedResearch />
        <Publications />
        <JoinCta />
      </main>
      <Footer />
    </>
  );
}
