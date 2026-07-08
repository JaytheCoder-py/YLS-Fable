import Hero from './Hero.jsx';
import AnnouncementCards from './AnnouncementCards.jsx';
import LatestReleases from './LatestReleases.jsx';
import Statement from './Statement.jsx';
import LogoBanner from './LogoBanner.jsx';
import CtaSection from './CtaSection.jsx';

export default function HomePage() {
  return (
    <>
      <Hero />
      <AnnouncementCards />
      <LatestReleases />
      <Statement />
      <LogoBanner />
      <CtaSection />
    </>
  );
}
