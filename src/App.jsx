import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import FeatureCard from './components/FeatureCard.jsx';
import LatestReleases from './components/LatestReleases.jsx';
import Statement from './components/Statement.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <FeatureCard />
        <LatestReleases />
        <Statement />
      </main>
      <Footer />
    </>
  );
}
