import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import AnnouncementCards from './components/AnnouncementCards.jsx';
import LatestReleases from './components/LatestReleases.jsx';
import Statement from './components/Statement.jsx';
import CtaSection from './components/CtaSection.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <AnnouncementCards />
        <LatestReleases />
        <Statement />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
