import Nav from './components/Nav.jsx';
import ResearchHero from './components/ResearchHero.jsx';
import ResearchTeams from './components/ResearchTeams.jsx';
import FeaturedResearch from './components/FeaturedResearch.jsx';
import Footer from './components/Footer.jsx';

export default function ResearchApp() {
  return (
    <>
      <Nav />
      <main id="main">
        <ResearchHero />
        <ResearchTeams />
        <FeaturedResearch />
      </main>
      <Footer />
    </>
  );
}
